Ext.define('App.model.ArrangementOfEmitter', {
    extend: 'Ext.data.Model',
    fields: [
	    {name: 'idArrangement', type: 'int'},
		{name: 'idEmitter', type: 'int'},
		{name: 'initialPos', type: 'int'},
		{name: 'finalPos', type: 'int'}
	]	
});