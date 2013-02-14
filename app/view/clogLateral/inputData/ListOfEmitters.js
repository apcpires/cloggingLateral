Ext.define('App.view.clogLateral.inputData.ListOfEmitters', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.listofemitters',
    title: 'List of emitters',
    frame: true,
    bodyPadding: 5,
    height: 170,
    scroll: 'vertical',
    collapsible: true,
    resizable: true,
    selType: 'cellmodel',
    sortableColumns: false,
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ],

    initComponent: function() {
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
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

        this.store = 'Emitters';

        this.columns = {
            defaults: {
                menuDisabled: true
            },
            items: [{
                dataIndex: 'idEmitter',
                text: 'id',
                width: 40             
            },{
                dataIndex: 'nmeEmitter',
                text: 'Emitter',
                flex: 1,
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                } 
            },{
                dataIndex: 'k',
                text: 'k',
                width: 60,
                editor: {
                    xtype: 'numberfield',
                    minValue: 0,
                    allowDecimals: true,
                    allowBlank: false,
                    decimalPrecision: 5
                } 
            },{
                dataIndex: 'x',
                text: 'x',
                width: 60,
                editor: {
                    xtype: 'numberfield',
                    minValue: 0,
                    allowDecimals: true,
                    allowBlank: false,
                    decimalPrecision: 5
                }
            },{
                dataIndex: 'units',
                text: 'Units (q, h)',
                width: 70
            },{
                dataIndex: 'Kl',
                text: 'Kl',
                width: 60,
                editor: {
                    xtype: 'numberfield',
                    minValue: 0,
                    allowDecimals: true,
                    allowBlank: false,
                    decimalPrecision: 5
                }
            }]
        };       

        this.callParent(arguments);
    }
});
