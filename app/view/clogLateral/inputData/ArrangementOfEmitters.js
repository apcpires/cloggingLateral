Ext.define('App.view.clogLateral.inputData.ArrangementOfEmitters', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.arrangementofemitters',
    title: 'Arrangement of emitters',
    frame: true,
    bodyPadding: 5,
    height: 170,
    resizable: true,
    scroll: 'vertical',
    selType: 'cellmodel',
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ],

    initComponent: function() {
       
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            margin  : '2 2 2 2',
            width: 60,
            items: [{
                action: 'add',
                text: 'Add',
                iconCls: 'add16x16',
                scale: 'small',
                iconAlign: 'left'
            },{
                action: 'delete',
                text: 'Remove',
                iconCls: 'remove16x16',
                scale: 'small',
                iconAlign: 'left'
            }]
        }];

        this.store = 'ArrangementOfEmitters';

        this.columns = [{
            dataIndex: 'idArrangement',
            text: 'id',
            width: 40        
        },{
            dataIndex: 'idEmitter',
            text: 'Emitter',
            width: 100,
            renderer: function(value, metaData, record, row, col, store, gridView){
                var store = Ext.getStore('Emitters');
                var rec = store.findRecord('idEmitter',value,0,false,true,true); 
                if (rec) 
                    return rec.get('nmeEmitter');
                else
                    return null;
            },
            editor: {
                xtype: 'combo',
                store: 'Emitters',
                queryMode: 'local',
                displayField: 'nmeEmitter',
                valueField: 'idEmitter',
                editable: false,
                allowBlank: false,
                menuDisabled: true
            } 
        },{    
            dataIndex: 'initialPos',
            text: 'Initial position',
            width: 100,
            editor: {
                xtype: 'numberfield',
                minValue: 1,
                allowDecimals: true,
                allowBlank: false,
                decimalPrecision: 1
            }
        },{
            dataIndex: 'finalPos',
            text: 'Final position',
            width: 100,
            editor: {
                xtype: 'numberfield',
                minValue: 2,
                allowDecimals: true,
                allowBlank: false,
                decimalPrecision: 1
            }
         }];

        this.callParent(arguments);
    }

});
