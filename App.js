Ext.define('CustomApp', {
    extend: 'Rally.app.App',
	requires:['Rally.ui.renderer.template.FormattedIDTemplate','Rally.ui.grid.plugin.PercentDonePopoverPlugin'],
    componentCls: 'app',
	title: 'BPO Portfolio View',
	launch: function() {
		
		this.add({
			xtype: 'rallyownerfilter',
			itemId: 'ownerComboBox',
			stateful: true,
			stateId: this.getContext().getScopedStateId('ownercombobox'),
			model: 'PortfolioItem/Initiative',
			listeners: {
				select: this._onLoad,
				ready: this._onLoad,
				scope: this
			}
		});
	},
	
	_onLoad: function(){
		
		// Radian
		// var project_oid = '/project/37192747640';
		
		var initiativestore = Ext.create('Rally.data.WsapiDataStore', {
			model: 'PortfolioItem/Initiative',
			// context: {
				// project: project_oid,
				// projectScopeDown: true,
				// projectScopeUp: false
			// },
			pageSize: 200,
			limit: 10000,
			autoLoad: true,
			storeId: 'initiativestore',
			filters: [this._getOwnerFilter()],
			fetch: [
				'FormattedID','Name','Owner'
			],
			listeners: {
				load: function(store, data, success) {
					this._onInitiativesLoaded(store, data);
				},
				scope: this
			}
		});
		
	},
	
	_onInitiativesLoaded: function(store_initiatives, data) {

		// Radian
		// var project_oid = '/project/37192747640';
	
		var themeStore = Ext.create('Rally.data.WsapiDataStore', {
			model: 'PortfolioItem/Theme',
			// context: {
				// project: project_oid,
				// projectScopeDown: true,
				// projectScopeUp: false
			// },
			pageSize: 200,
			limit: 10000,
			autoLoad: true,
			storeId: 'themestore',
			fetch: [
				'FormattedID','Name','Parent'
			],
			listeners: {
				load: function(store, data, success) {
					this._onThemesLoaded(store, data);
				},
				scope: this
			}
		});
	},
	
	_onThemesLoaded: function(store_themes) {
		
		// Radian
		// var project_oid = '/project/37192747640';
		
		var filters = Ext.create('Rally.data.QueryFilter', {
			property: 'FormattedID',
			operator: '=',
			value: 'F1'
		});
		
		var initiativeStore = Ext.StoreMgr.lookup('initiativestore');
		initiativeStore.each(function(record,id){
			filters = filters.or(Ext.create('Rally.data.QueryFilter', {
				property: 'Parent.Parent.FormattedID',
				operator: '=',
				value: record.get('FormattedID')
			}));
		});

		var featureStore = Ext.create('Rally.data.WsapiDataStore', {
			model: 'PortfolioItem/Feature',
			// context: {
				// project: project_oid,
				// projectScopeDown: true,
				// projectScopeUp: false
			// },
			autoLoad: true,
			storeId: 'featurestore',
			pageSize: 200,
			limit: 20000,
			fetch: [
				'FormattedID','Name','Parent','State','Owner','PercentDoneByStoryPlanEstimate', 'Project'
			],
			filters: filters,
			listeners: {
				load: function(store, data, success) {
					this._onFeaturesLoaded(store, data);
				},
				scope: this
			}
		});
	},
	
	_onFeaturesLoaded: function(store_features,data){
		that = this;
		that._featureList = [];
		var themeStore = Ext.StoreMgr.lookup('themestore');

		Ext.Array.each(data, function(record) {
			theme = record.get('Parent');
			themeinstore = themeStore.findRecord('FormattedID',theme.FormattedID);
			initiative = themeinstore.get('Parent');
			that._featureList.push({
				initiative: initiative,
				Name: record.get('Name'),
				State: record.get('State'),
				FormattedID: record.get('FormattedID'),
				_ref: record.get('_ref'),
				Owner: record.get('Owner'),
				Parent: record.get('Parent'),
				Project: record.get('Project'),
				PercentDoneByStoryPlanEstimate: record.get('PercentDoneByStoryPlanEstimate')
			});
		});
		
		var summaryStore = Ext.create('Rally.data.custom.Store', {
			storeId: 'featureStore',
			data: that._featureList,
			autoScroll: true,
			pageSize: 500,
			columnLines: true,
			groupField: 'initiative',
			groupDir: 'ASC',
			getGroupString: function(record) {
				var initiative = record.get('initiative');
				return (initiative.FormattedID + ' - ' + initiative.Name) || 'No Initiative';
			}
		});

		var grid2 = Ext.create('Ext.Container', {
            items: [{
				id: 'grid2',
				xtype: 'rallygrid',
				store: summaryStore,
				columnCfgs: [
					{
						text: 'FormattedID',
						dataIndex: 'FormattedID',
						flex: 1,
						xtype: 'templatecolumn',
						tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')
					},
					{ 
						text: 'Name', dataIndex: 'Name', flex: 10
					},
					{
						text: 'State',
						dataIndex: 'State',
						flex: 1,
						renderer: function(value, meta, record) {
							if(!value) { return ''; }
							return value.Name;
						}
						// doSort: function(state) {

						// }
					},
					{
						text: '% done (points)',
						flex: 2,
						dataIndex: 'PercentDoneByStoryPlanEstimate',
						xtype: 'templatecolumn',
						tpl: Ext.create('Rally.ui.renderer.template.progressbar.PercentDoneByStoryPlanEstimateTemplate')
					},
					{
						text: 'Owner',
						dataIndex: 'Owner', flex: 2,
						renderer: function(value, meta, record) {
							return value._refObjectName;
						}
					},
					{
						text: 'Project',
						dataIndex: 'Project', flex: 2,
						renderer: function(value, meta, record) {
							return value.Name;
						}
					}
				],
				// context: this.getContext(),
				features: [{
					ftype: 'groupingsummary',
					groupHeaderTpl: '{name} ({rows.length})',
					startCollapsed: true
				}],
				// plugins: ['rallypercentdonepopoverplugin'],
				showPagingToolbar: false
			}]
		});

/*		Ext.create('Ext.window.Window', {
			width: 800,
			height: 500,
			
			layout: 'fit',
			items: grid,
			
			tbar: [{
					xtype: 'button',
					text: 'Only show I46',
					enableToggle: true,
					handler: function() {
						summaryStore.clearFilter();
						if (this.pressed) {
							summaryStore.filter('FormattedID', 'I46');
						}
					}
				},{
					xtype: 'button',
					text: 'Increase count',
					handler: function() {
						// If the snapshot is undefined it means, that store.data holds all items (unfiltered)
						var data = summaryStore.snapshot || summaryStore.data;
						
						data.each(function(record) {
							record.set('Name', record.get('Name') + 'SEAN');
						});
					}
			}]
		}).hide(); */
		
		if (this.down('#grid2')) {
			this.down('#grid2').destroy();
		}
		this.add(grid2);
		
	},

	_getOwnerFilter: function() {
		combo = this.down('#ownerComboBox');
		var comboval = combo.getValue();
		if(!comboval){
			comboval = combo.stateValue;
		}
		if(String(comboval).indexOf('-1') > -1){
			comboval = null;
		}
		return {
			property: 'Owner',
			operator: '=',
			value: comboval
		};
	}
	
});