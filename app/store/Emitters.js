Ext.define('App.store.Emitters', {
    extend: 'Ext.data.ArrayStore',
    model: 'App.model.Emitter',
    autoLoad: true,
    autoSync: true,
    data: [
    	[1,'A-8L/h' ,2.711 , 0.477, 0.15],
    	[2,'B-4L/h' ,1.303 , 0.481, 0.15],
    	[3,'C-2L/h' ,0.688 , 0.468, 0.15]  	
    ],
    sorters: [{
		property: 'idEmitter',
		direction: 'ASC'
	}]     
});