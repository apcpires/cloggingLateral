Ext.define('App.controller.ClogLateral', {
    extend: 'Ext.app.Controller',

    models: [
        'Emitter',
        'ArrangementOfEmitter',
        'GridResults'
    ],
    stores: [
        'Emitters',
        'ArrangementOfEmitters',
        'GridResults'
    ],
    views: [
        'clogLateral.inputData.General',
        'clogLateral.inputData.ListOfEmitters',
        'clogLateral.inputData.ArrangementOfEmitters',
        'clogLateral.inputData.LogOfErrorsWin',
        'clogLateral.FormInput',
        'clogLateral.GridResults'        
    ],

    refs: [{ 
        ref: 'general', 
        selector: 'general'
    },{
        ref: 'listOfEmitters', 
        selector: 'listofemitters'
    },{
        ref: 'arrangementOfEmitters', 
        selector: 'arrangementofemitters'
    },{
        ref: 'logOfErrorsWin', 
        selector: 'logoferrorswin'
    },{
        ref: 'gridResults', 
        selector: 'gridresults'
    }],

    init: function() {
        this.control({
            'listofemitters button[action=add]': {
                click: this.addEmitter   
            },
            'listofemitters button[action=delete]': {
                click: this.delEmitter   
            },
             'arrangementofemitters':{
                select: this.controlButtonDelArrang                
            },
            'arrangementofemitters button[action=add]': {
                click: this.addArrangementOfEmitter
            },
            'arrangementofemitters button[action=delete]': {
                click: this.delArrangementOfEmitter
            },
            'forminput button[action=run]': {
                click: this.simulate
            },
            'gridresults button[action=export]': {
                click: this.exportToCsv
            }
        });
    },
    //Add emitter into List of Emitters
    addEmitter: function(){
        var store = this.getEmittersStore();
        var primaryKeyField = 'idEmitter';

        //Find the highest value in the store
        var newId = (store.max(primaryKeyField))+1;
        if (!newId)
            newId = 1;
        //Create record following the model
        var newRec = Ext.create('App.model.Emitter',{
            'idEmitter': newId,
            'nmeEmitter': 'define...',
            'k': 1,
            'x': 0.5,
            'Kl': 0.15
        });
        store.addSorted(newRec);
    },
    //Remove emitter from List of Emitters
    delEmitter: function(){
        var selected = this.getListOfEmitters().getSelectionModel().getSelection();
        var store = this.getEmittersStore();
        if (selected.length)
            store.remove(selected);      
    },    
    //Add arrangement in Arrangement of Emitters 
    addArrangementOfEmitter: function(){        
        //Get any emitter just to avoid creating record with null values
        var idEmitter = this.getEmittersStore().first().get('idEmitter');

        var store = this.getArrangementOfEmittersStore();
        var primaryKeyField = 'idArrangement';

        //Find the highest value in the store
        var newId = (store.max(primaryKeyField))+1;
        if (!newId)
            newId = 1;
       //Create record following the model
        var newRec = Ext.create('App.model.ArrangementOfEmitter',{
            'idArrangement': newId,
            'idEmitter': idEmitter,
            'initialPos': 1,
            'finalPos': 2
        });
        store.addSorted(newRec);
    },
    //Remove arrangement in Arrangement of Emitters 
    delArrangementOfEmitter: function(){
        var selected = this.getArrangementOfEmitters().getSelectionModel().getSelection();
        var store = this.getArrangementOfEmittersStore();
        if (selected.length)
            store.remove(selected);    
    },
    //Run simulation
    simulate: function(){
        var me = this;
        //If input data is valid go ahead and do the simulation
        if (this.validateSetup()){
            var s = me.getGeneral().getSource();
            
            var diameter = s['diameter'];
            var distEmitters = s['distEmitters'];
            var numberOfEmitters = s['numberOfEmitters'];
            var Kl = s['Kl'];
            var roughness = s['roughness'];
            var inletPressure = s['inletPressure'];
            var viscosity = s['viscosity'];

            var sim = Ext.create('App.libs.SimulateClogging',{
                'diameter': diameter,
                'distEmitters': distEmitters,
                'nOfEmitters': numberOfEmitters,
                'Kl': Kl,
                'roughness': roughness,
                'inletPressure': inletPressure,
                'viscosity': viscosity    
            });

            var grid = this.getGridResults();
            grid.down('toolbar numberfield[name=Q]').setValue(sim.Q);     
            grid.down('toolbar numberfield[name=Hf]').setValue(sim.Hf);     
            grid.down('toolbar numberfield[name=Havg]').setValue(sim.Havg);
            grid.down('toolbar button[action=export]').enable();
        }
    },
    //Performs a routine of validation before running the simulation
    validateSetup: function(){
        var me = this;
        
        var arrangSt = this.getArrangementOfEmittersStore();
        //Analyzing each record on the store looking for errors
        var listOfErrors = new Array();
        arrangSt.each(function(rec){
            var id = rec.get('idArrangement');
            var idEmitter = rec.get('idEmitter');
            var initialPos = rec.get('initialPos');
            var finalPos = rec.get('finalPos');

            //Record not defined properly
            if ((initialPos == 0)||(finalPos == 0)){
                listOfErrors.push('[Error 01] [Arrangement of emitters] id:'+id+' -> Fields with value equal to 0 are not allowed.<br>');
            }
            //initialPos>=finalPos
            if (initialPos>=finalPos){
                listOfErrors.push('[Error 02] [Arrangement of emitters] id:'+id+' -> The initial position cannot be neither equal nor higher than the final position.<br>');     
            }
            //Emitter exists?
            var emitterSt = me.getEmittersStore();
            if (!emitterSt.findRecord('idEmitter',idEmitter,0,false,true,true)){
                listOfErrors.push('[Error 03] [Arrangement of emitters] id:'+id+' -> The emitter specified does not exist.<br>');                     
            }
        });        
        //Verifing number of emitters defined and arranged
        //Just execute this test if the previous were successfull
        if (listOfErrors.length == 0){
            var nOfEmittersExpected = me.getGeneral().getSource()['numberOfEmitters'];
            var arrExpectedOfEmitters = new Array();
            for (i=1;i<nOfEmittersExpected+1;i++){
                arrExpectedOfEmitters.push(i);
            }
            
            var arrTempArrangOfEmitters = new Array();
            var arrTempModelsOfEmitters = new Array();
            arrangSt.each(function(r){
                var iPos = r.get('initialPos');
                var fPos = r.get('finalPos');
                for (var i=(iPos); i<fPos+1; i++){
                    //List containing the arranged positions
                    arrTempArrangOfEmitters.push(i); 
                }                    
                //Insert if it doesn't exist inside the array
                if(arrTempModelsOfEmitters.indexOf(r.get('idEmitter')) == -1) { 
                    //List with unique values on each position 
                    arrTempModelsOfEmitters.push(r.get('idEmitter')); 
                }
            });
            
            //Comparing the number of emitters defined and assigned
            var arrDiff1 = Ext.Array.difference(arrExpectedOfEmitters,arrTempArrangOfEmitters);
            var test1 = (arrDiff1.length>0) ? false: true;
            
            var arrDiff2 = Ext.Array.difference(arrTempArrangOfEmitters,arrExpectedOfEmitters);
            var test2 = (arrDiff2.length>0) ? false: true;

            if ((!test1) || (!test2))
                listOfErrors.push('[Error 04] -> The number of emitters arranged along this lateral does not match with the predefined values.<br>');
           
            //Verify if a same model of emitter was not used in more than one definition of the lateral
            var nOfModelsExpected = arrangSt.getCount();
            var nOfModelsDefined = arrTempModelsOfEmitters.length;
            if (nOfModelsDefined != nOfModelsExpected){
                listOfErrors.push('[Error 05] -> A same model of emitter was used in more than one arrangement of this lateral.<br>');    
            }
        }        

        if (listOfErrors.length>0){
            //Show log of errors and return false
            var msgBegin = '<b>Inconsistent values were found!</b><br>'+
                           '&emsp;&emsp;Correct the following errors and try again.<br><br>'+
                           '<i><u>Number of errors found: '+listOfErrors.length+'</i></u><br><br>';
            Ext.Array.insert(listOfErrors, 0, msgBegin);
            var win = this.getLogOfErrorsWin(); 
            if (!win){
                win = Ext.create('App.view.clogLateral.inputData.LogOfErrorsWin',{
                    html: listOfErrors
                });
            }
            win.show();
            return false;
        }
        else {
            return true;
        } 
    },
    //Export results to a CSV file
    exportToCsv: function(){
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        var st = this.getGridResultsStore(); 
        
        var filename = 'Simulation.csv';
        var header = [' ', 'i','L (m)', 'emitter', 'h (m)', 'q (L/h)','V (m/s)', 'Reynolds number', 'f', 'hfD (m)', 'hfL (m)', 'hf (m)','\n'];
        header = header.join(";");
        var arrExport = new Array();
        arrExport.push(header);
        
        st.each(function(rec){
            var r = new Array();
            var s = rec.getData();
            r.push(' ');
            r.push(s.i.toString());
            r.push(s.L.toString().replace(".",","));
            r.push(s.emitter);
            r.push(s.h.toString().replace(".",","));
            r.push(s.q.toString().replace(".",","));
            r.push(s.V.toString().replace(".",","));
            r.push(s.R.toString().replace(".",","));
            r.push(s.f.toString().replace(".",","));
            r.push(s.hfD.toString().replace(".",","));
            r.push(s.hfL.toString().replace(".",","));
            r.push(s.hf.toString().replace(".",","));
            r.push('\n');
            r = r.join(";");
            
            arrExport.push(r);
        });

        var blob = new BlobBuilder();
        blob.append(arrExport);
        var fileSaver = window.saveAs(blob.getBlob(), filename); 
    }
});