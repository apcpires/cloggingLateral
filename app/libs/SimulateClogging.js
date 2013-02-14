Ext.define('App.libs.SimulateClogging', {
	lateralLength: '',
	config: {		
		diameter: 0.0167,
		roughness: 0.0000021,
		inletPressure: 13.256,
		distEmitters: 0.3,
		nOfEmitters: 120,
		viscosity: 0.000001011,
		save: true		
	},
	constructor : function(options) {		
		Ext.apply(this, options || {});
		this.lateralLength = this.nOfEmitters * this.distEmitters;
		this.main();
		return ({'H': parseFloat(this.inletPressure), 'Q': this.Q, 'Hf': this.Hf, 'Havg': this.Havg});
	},
	createBaseRecordSet: function(){
		var resultSt = Ext.getStore('GridResults');
		
		if (resultSt.getCount()>0)
			resultSt.removeAll();

		var recordSet = new Array();
		for (var i=1; i<((this.nOfEmitters)+1); i++){			
			var newRec = Ext.create('App.model.GridResults',{
	            'i': i,
				'L': (this.distEmitters * i), 
				'emitter': '',
				'h': 0,
				'q': 0,
				'V': 0,
				'R': 0,
				'f': 0,
				'hfD': 0, 
				'hfL': 0, 
				'hf': 0
	        });
	        recordSet.push(newRec);
		}
		resultSt.add(recordSet);
	},
	main: function(){		
		var me = this; 

		//Define a base recordset where the main data of the simulation will be saved
		var log = this.save;
		if (log){
			this.createBaseRecordSet();	
		}
		var resultSt = Ext.getStore('GridResults');

		//Create an array with the arrangement of emitters along the lateral and data used 
		//during the iterations
		var arrangOfEmitters = new Array();
		
		var arrangSt = Ext.getStore('ArrangementOfEmitters');		
		arrangSt.each(function(rec){
			var iPos = rec.get('initialPos');
            var fPos = rec.get('finalPos');
			for (var i=iPos; i<fPos+1; i++){
				arrangOfEmitters.push({'position': i, 'idEmitter': rec.get('idEmitter'), 'h': me.inletPressure, 'q':0, 'hf':0});
			}
		});	
		var nEmitters = this.nOfEmitters;

		var nIter = 5; //number of iterations

		//Run iterations
		for (var iter=0; iter<nIter; iter++){
			var Qaux=0;
			var HfAccum = 0;
			var hAcum = 0;
			
			//First step - Calculate emitters flow rate to determine Q
			for (var i=0; i<nEmitters; i++){ //i = emitter position
				var step = arrangOfEmitters[i];				
				if (iter>0){
					HfAccum+=step.hf;					
					step.h = this.inletPressure - HfAccum;
					hAcum += step.h;
				}
				var emitterInfo = this.getEmittersInfo(step.idEmitter);
				step.q = this.calcEmitterFlowRate(emitterInfo.k,step.h,emitterInfo.x);			
				
				Qaux+=step.q;
				
				if ((log) && (iter == nIter-1)) { //Last iteration -> save data
					var recToChange = resultSt.getAt(i);
					recToChange.set('emitter', emitterInfo.nme);
					recToChange.set('h', step.h);
					recToChange.set('q', step.q);					
				}
			}
			var hAvg = hAcum/nEmitters;
			
			//Second step - Calculate all the other parameters
			var qAccum = 0;
			var hfTotal = 0;

			for (var i=0; i<nEmitters; i++){
				var step = arrangOfEmitters[i];	
				var emitterInfo = this.getEmittersInfo(step.idEmitter);	

				var V = this.calcVelocity(Qaux-qAccum);
				var R = this.calcReynolds(V);						
				var f = this.calcFrictionFactor(R);
				var hfD = this.calchfD(V, f);
				var hfL = this.calchfL(V, emitterInfo.Kl);
				step.hf = hfD + hfL;
				qAccum += step.q;
				hfTotal += step.hf;

				if ((log) && (iter == nIter-1)) { //Last iteration -> save data
					var recToChange = resultSt.getAt(i);
					recToChange.set('V', V);
					recToChange.set('R', R);
					recToChange.set('f', f);
					recToChange.set('hfD', hfD);
					recToChange.set('hfL', hfL);
					recToChange.set('hf', step.hf);	
				}
			}
		}
		this.Q = qAccum;
		this.Hf = hfTotal;
		this.Havg = hAvg;	
		resultSt.sync();			
	},
	getEmittersInfo: function(id){		
		var emitterStore = Ext.getStore('Emitters');
		var record = emitterStore.findRecord('idEmitter',id,0,false,true,true); 
		var nme = record.get('nmeEmitter');
		var k = record.get('k');
		var x = record.get('x');
		var Kl = record.get('Kl');
		var obj = {'id': id, 'nme': nme, 'k': k, 'x': x, 'Kl': Kl};
		return obj;
	},
	calcVelocity: function (_Q){
		return ((4*(_Q/3600000))/(Math.PI * Math.pow(this.diameter,2)));
	},
	calcEmitterFlowRate: function(k,h,x){
		return (k*Math.pow(h,x));
	},
	calcReynolds: function(V){
		return ((V*this.diameter)/this.viscosity);
	},
	//Churchill equation
	calcFrictionFactor: function(R){
		if (R==0){
			return 0;
		}
		else {
			var D = this.diameter;
			var rug = this.roughness; 
			var A = Math.pow(
					(-2.457*Math.log(
						(Math.pow((7/R),0.9)+0.27*rug/D)
					))
				,16);
			var B = Math.pow((37530/R),16);
			var f = 8*Math.pow((Math.pow((8/R),12)+1/Math.pow((A+B),1.5)),(1/12));
			return f;
		}
	},
	calchfD: function(V,f){
		if ((V==0)||(f==0))
			return 0;
		else {
			var s = this.distEmitters;
			var D = this.diameter;
			return (f*(s/D)*Math.pow(V,2)/(2*9.81));
		}
	},
	calchfL: function(V, Kl){
		if (V==0)
			return 0;
		else
			return Kl*V*V/(2*9.81);
	}
});