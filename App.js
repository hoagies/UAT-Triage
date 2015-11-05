Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
	launch: function() {
		
		var rowFieldStore = Ext.create('Ext.data.Store', {
			fields: ['Field'],
			data : [
				{'Field': 'Priority'},
				{'Field': 'Severity'}
			]
		});

		allFields = Ext.create('Ext.data.Store', {
			id: 'defectrows',
			fields: ['Name','Count']
		});

		this.rowSelector = Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Choose Row Field',
			id: 'rowfieldcombo',
			store: rowFieldStore,
			value: 'Priority',
			stateful: true,
			stateId: this.getContext().getScopedStateId('rowfieldcombo'),
			storeConfig:{
				autoLoad: true
			},
			queryMode: 'local',
			displayField: 'Field',
			valueField: 'Field',
			listeners: {
				select: this._proceed,
				ready: this._proceed,
				render: this._proceed,
				scope: this
			}
		});
		this.add(this.rowSelector); 
	},
	
	_proceed: function(){

		that = this;
		that._storestotal = [];
		var rowField = this._getRowField();
		var attribute = Rally.data.ModelFactory.getModel({
			type: 'Defect',
			success: function(model) {
				model.getField(rowField).getAllowedValueStore().load({
					callback: function(records, operation, success) {
						Ext.Array.each(records, function(allowedValue) {
							var stringValue = allowedValue.get('StringValue');
							// Build Store for each Allowed Value
							var defectStore = Ext.create('Rally.data.WsapiDataStore', {
								model: 'Defect',
								pageSize: 200,
								limit: 10000,
								autoLoad: true,
								storeId: 'defectstore_' + allowedValue.get('StringValue'),
								fetch: [
									'FormattedID','c_TriageVerdict'
								],
								filters: [
									{
										property: 'c_TriageVerdict',
										operator: '!=',
										value: null
									},
									{
										property: rowField,
										operator: '=',
										value: stringValue
									}
								],
								listeners: {
									load: function(store, data, success) {
										var a = that._storestotal.length;
										var b = records.length;
										if(stringValue===''){
											stringValue = 'None';
										}
										that._storestotal.push({
											Name: stringValue,
											Count: store.getCount()
										});
										if(a+1>=b){
											var initiativeStore = Ext.StoreMgr.lookup('defectrows');
											initiativeStore.loadData(that._storestotal);
											that._onLoad();
										}
									},
									scope: that
								}
							});
						});
					}
				});
			}
		});
	},
	
	_onLoad: function(){
		
		// that = this;
		
		var columns = [
			{
				value: 'CAT 0: Triage',
				columnHeaderConfig: {
					headerData: {triageVerdict: 'CAT 0: Triage'}
				}
			},
			{
				value: 'CAT 1: OAF Defect',
				columnHeaderConfig: {
					headerData: {triageVerdict: 'CAT 1: OAF Defect'}
				} 
			},
			{
				value: 'CAT 2: OAF Requirement',
				columnHeaderConfig: {
					headerData: {triageVerdict: 'CAT 2: OAF Requirement'}
				} 
			},
			{
				value: 'CAT 3: OAF Training',
				columnHeaderConfig: {
					headerData: {triageVerdict: 'CAT 3: OAF Training'}
				} 
			},
			{
				value: 'CAT 4: Non-OAF',
				columnHeaderConfig: {
					headerData: {triageVerdict: 'CAT 4: Non-OAF'}
				} 
			},
			{
				value: 'CAT 5: Non-Issue',
				columnHeaderConfig: {
					headerData: {triageVerdict: 'CAT 5: Non-Issue'}
				} 
			},
			{
				value: 'CAT 6: Known Defect/Requirement',
				columnHeaderConfig: {
					headerData: {triageVerdict: 'CAT 6: Known Defect/Requirement'}
				} 
			}
		];
		
		var project_oid = '/project/37192747640';

		var myGrid = Ext.getCmp('rallygridboard');
		if (myGrid) {
			myGrid.destroy();
		}

		var context = this.getContext();
		var modelNames = ['defect'];
		this.add({
			xtype: 'rallygridboard',
			context: context,
			stateful: false,
			id: 'features',
			modelNames: modelNames,
			toggleState: 'board',
			storeConfig: {
				context: {
					project: project_oid,
					projectScopeDown: true,
					projectScopeUp: false
				}
			},
			cardBoardConfig: {
				columns: columns,
				columnConfig: {
					columnHeaderConfig: {
						headerTpl: '{triageVerdict}',
						fixed: true
					},
					plugins: [
						{ptype: 'rallycolumncardcounter'}
					]
				},
				attribute: 'c_TriageVerdict',
				cardConfig: {
					xtype: 'rallycard',
					showIconsAndHighlightBorder: true,
					editable: true,
					fields: ['CreationDate','c_TestingType','TestCase',this._getOppositeRowField()],
					showAge: true
				},
				rowConfig: {
					field: this._getRowField(),
					headerConfig: {
						_getTitle: function(){
							var initiativeStore = Ext.StoreMgr.lookup('defectrows');
							var rowval = this.getValue();
							var record = initiativeStore.findRecord('Name',rowval);
							var cardCount = record.get('Count');
							return this.getValue() + ' (' + cardCount + ')';
						}
					}
				}
			},
			plugins: [
				{
					ptype: 'rallygridboardfieldpicker',
					modelNames: modelNames,
					headerPosition: 'left',
					stateful: true,
					stateId: context.getScopedStateId('picker')
				}, {
                    ptype: 'rallygridboardcustomfiltercontrol',
					headerPosition: 'left',
                    filterControlConfig: {
						modelNames: modelNames,
						stateful: true,
						stateId: context.getScopedStateId('filter')
					}
                }
			],
			margin: '10px 0 0 0',
			height: this.getHeight()
		});
	},

	_getRowField: function() {
		combo = this.down('#rowfieldcombo');
		var comboval = combo.getValue();
		return comboval;
	},
	
	_getOppositeRowField: function(){
		if(this._getRowField()==='Severity'){
			return 'Priority';
		}else{
			return 'Severity';
		}
	}
	
	
});