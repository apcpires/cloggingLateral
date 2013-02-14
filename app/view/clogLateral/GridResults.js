Ext.define('App.view.clogLateral.GridResults', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridresults',
    title: 'Spreadsheet of results',

    initComponent: function() {

        this.store = 'GridResults';

        this.columns = [
            {
                dataIndex: 'i',
                text: 'i',
                width: 40
            },{
                xtype: 'numbercolumn',
                dataIndex: 'L',
                text: 'Length (m)',
                format: '0.0',
                width: 70
            },{
                dataIndex: 'emitter',
                text: 'Emitter',
                width: 70
            },{
                xtype: 'numbercolumn',
                dataIndex: 'h',
                text: 'Pressure (m)',
                format: '0.000',
                width: 100
            },{
                xtype: 'numbercolumn',
                dataIndex: 'q',
                text: 'q (L/h)',
                format: '0.000',
                width: 100            
            },{
                xtype: 'numbercolumn',
                dataIndex: 'V',
                text: 'Velocity (m/s)',
                format: '0.000',
                width: 100
            },{
                xtype: 'numbercolumn',
                dataIndex: 'R',
                text: 'Reynolds',
                format: '0.0',
                width: 100
            },{
                xtype: 'numbercolumn',
                dataIndex: 'f',
                text: 'Friction factor',
                format: '0.0000',
                width: 100
            },{
                xtype: 'numbercolumn',
                dataIndex: 'hfD',
                text: 'Continuous hf (m)',
                format: '0.0000',
                width: 100
            },{
                xtype: 'numbercolumn',
                dataIndex: 'hfL',
                text: 'Local hf (m)',
                format: '0.0000',
                width: 100
            },{
                xtype: 'numbercolumn',
                dataIndex: 'hf',
                text: 'Total hf (m)',
                format: '0.0000',
                flex: 1
            }
        ];

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            //width: 60,
            items: ['-',{
                xtype: 'numberfield',
                name: 'Hf',
                fieldLabel: 'Total head loss (m)',
                readOnly: true,
                decimalPrecision: 3,
                width: 180
            },'-',{
                xtype: 'numberfield',
                name: 'Q',
                fieldLabel: 'Total flow rate (L/h)',
                labelWidth: 110,
                readOnly: true,
                decimalPrecision: 1,
                width: 180
            },'-',{
                xtype: 'numberfield',
                name: 'Havg',
                fieldLabel: 'Average pressure (m)',
                labelWidth: 120,
                readOnly: true,
                decimalPrecision: 3,
                width: 190
            },'-',{
                action: 'export',
                text: 'Export results',
                width: 120,
                iconCls: 'excel',
                scale: 'large',
                iconAlign: 'left',
                disabled: true
            },'-']
        }];

        this.callParent(arguments);
    }
});
