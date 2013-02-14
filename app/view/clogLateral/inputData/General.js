Ext.define('App.view.clogLateral.inputData.General', {
    extend: 'Ext.grid.property.Grid',
    alias: 'widget.general',
    title: 'General setup',
    frame: true,
    bodyPadding: 5,
    scroll: 'vertical',
    nameColumnWidth: 200,
    height: 180,
    collapsible: true,
    resizable: false,
    sortableColumns: false,
   
    // Custom editors for certain property names
    customEditors: {
        diameter: Ext.create('Ext.form.field.Number', {
            decimalPrecision: 4,
            allowBlank: false,
            minValue: 0
        }),
        distEmitters: Ext.create('Ext.form.field.Number', {
            decimalPrecision: 3,
            allowBlank: false,
            minValue: 0
        }),
        numberOfEmitters: Ext.create('Ext.form.field.Number', {
            allowDecimals: false,
            allowBlank: false,
            minValue: 1
        }),
        /*Kl: Ext.create('Ext.form.field.Number', {
            decimalPrecision: 3,
            allowBlank: false,
            minValue: 0
        }),*/
        roughness: Ext.create('Ext.form.field.Number', {
            decimalPrecision: 8,
            allowBlank: false,
            minValue: 0
        }),
        inletPressure: Ext.create('Ext.form.field.Number', {
            decimalPrecision: 3,
            allowBlank: false,
            minValue: 5,
            maxValue: 50
        }),
        viscosity: Ext.create('Ext.form.field.Number', {
            decimalPrecision: 9,
            allowBlank: false,
            minValue: 0
        })        
    },

    // Displayed name for property names in the source
    propertyNames: {
        diameter: 'Internal diameter of the lateral (m)',
        distEmitters: 'Distance between emitters (m)',
        numberOfEmitters: 'Number of emitters',
        /*Kl: 'Coefficient of local head loss - Kl',*/
        roughness: 'Roughness of the pipe (m)',
        inletPressure: 'Pressure head at the lateral inlet (m)',
        viscosity: 'Kinematic viscosity (m2/s)'                
    },

    //Data object containing properties to edit
    //Sample/default data is defined here 
    source: {
        diameter: 0.0167,
        distEmitters: 0.3,
        numberOfEmitters: 120,
        /*Kl: 0.15,*/
        roughness: 0.0000021,
        inletPressure: 13.256,
        viscosity: 0.000001011          
    }
});