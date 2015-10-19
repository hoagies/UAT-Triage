Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
	launch: function() {
		
		// Radian
		var project_oid = '/project/37192747640';
		// AIT Sandbox
		// var project_oid = '/project/28269494803';
		// console.log('project_oid: ',project_oid);

		this.add({
			xtype: 'rallycombobox',
			width: 600,
			fieldLabel: 'Select Initiative:',
			// Display Template
			displayTpl: Ext.create('Ext.XTemplate','<tpl for=".">','{FormattedID} - {Name}','</tpl>'),
			// List Template
			tpl: Ext.create('Ext.XTemplate','<tpl for=".">','<div class="x-boundlist-item">{FormattedID} - {Name}</div>','</tpl>'),
			storeConfig: {
				autoLoad: true,
				model: 'PortfolioItem/Initiative',
				fetch: ['FormattedID', 'Name'],
				sorters: [
					{
						property: 'ObjectID',
						direction: 'ASC'
					}
				],
				remoteGroup: false,
				remoteSort: false,
				remoteFilter: false,
				limit: Infinity,
				context: {
					project: project_oid,
					projectScopeDown: true,
					projectScopeUp: false
				}
			},
			// stateful: false,
			listeners: {
				select: this._onSelect,
				ready: this._onLoad,
				scope: this
			}
		});
	},
		
	_onLoad: function() {
		var project_oid = '/project/37192747640';
		
		this.add({
			xtype: 'rallycardboard',
			types: ['PortfolioItem/Feature'],
			attribute: 'State',
			storeConfig: {
				context: {
					project: project_oid,
					projectScopeDown: true,
					projectScopeUp: false
				},
				filters: [this._getFilter()]
			},
			columnConfig: {
				plugins: [
					{ptype: 'rallycolumncardcounter'}
				]
			},
			cardConfig: {
				showIconsAndHighlightBorder: false,
				editable: false,
				fields: ['PercentDoneByStoryCount'],
				showAge: true
			}
			// rowConfig: {
				// field: 'Owner'
			// }
		});
	},
	
	_onSelect: function() {
		var board = this.down('rallycardboard');
		board.refresh({
			storeConfig: {
				filters: [this._getFilter()]
			}
		});
	},
		
	_getFilter: function() {
		var combo = this.down('rallycombobox');
		return {
			property: 'Parent.Parent',
			operator: '=',
			value: combo.getValue()
		};
	}

});