Ext.define('App.view.clogLateral.FormInput', {
    extend: 'Ext.form.Panel',
    alias: 'widget.forminput',
    title: 'Input data',
    frame: true,
    region: 'west',
    autoScroll: true,
    width: 400,
    collapsible: true,

    initComponent: function() {
        
        this.items = [{
            xtype: 'general'
        },{
            xtype: 'listofemitters'
        },{
            xtype: 'arrangementofemitters'
        }];  
        
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            margin  : '2 2 2 2',
            width: 60,
            items: [{
                xtype: 'tbfill' 
            },'-',{
                action: 'run',
                text: '<font size="2"><b>Simulate</b></font>',
                width: 120,
                iconCls: 'excel',
                scale: 'large',
                iconAlign: 'left'
            },'-']
        }];     

        this.callParent(arguments);
    }

});
