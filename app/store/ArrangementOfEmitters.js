Ext.define('App.store.ArrangementOfEmitters', {
    extend: 'Ext.data.ArrayStore',
    model: 'App.model.ArrangementOfEmitter',
    autoLoad: true,
    autoSync: true,
    data: [
    	[1,1,   1,  98],
    	[2,2,  99, 116],
    	[3,3, 117, 120]
    ],
    sorters: [{
        property: 'idArrangement',
        direction: 'ASC'
    }]        
});