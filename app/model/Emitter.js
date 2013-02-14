Ext.define('App.model.Emitter', {
    extend: 'Ext.data.Model',
    fields: [
		{name: 'idEmitter', type: 'int'},
		{name: 'nmeEmitter', type: 'string'},
		{name: 'k', type: 'float'},
		{name: 'x', type: 'float'},
		{name: 'Kl', type: 'float'},
		{name: 'units', type: 'string', defaultValue: 'L/h, m'}
    ]
});