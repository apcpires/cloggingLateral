Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    requires: [
        'Ext.container.Viewport',
        'App.libs.SimulateClogging'
    ],
    name: 'App',
    appFolder: 'app',

    controllers: [      //Listar todos os controladores da aplicação aqui
        'ClogLateral'
    ],

    launch: function(){
        Ext.tip.QuickTipManager.init();

        Ext.create('Ext.container.Viewport', {

            overflowY: 'scroll', //Barra de rolagem vertical ativa
            layout: 'border',
            items: [{
                xtype: 'box',
                id: 'header',
                region: 'north',
                html: '<h1> Clogging simulations along a single lateral line</h1>',
                height: 30
            },{                
                xtype: 'forminput'                               
            },{                
                xtype: 'gridresults',
                region: 'center', 
                frame: true    
            }]  
        });
    }
});

