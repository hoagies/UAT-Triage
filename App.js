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

		this.rowSelector = Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Choose Row Field',
			id: 'rowfieldcombo',
			store: rowFieldStore,
			stateful: true,
			stateId: this.getContext().getScopedStateId('rowfieldcombo'),
			storeConfig:{
				autoLoad: true
			},
			queryMode: 'local',
			displayField: 'Field',
			valueField: 'Field',
			listeners: {
				select: this._onLoad,
				ready: this._onLoad,
				render: this._onLoad,
				scope: this
			}
		});
		this.add(this.rowSelector); 
	},
		
	_onLoad: function() {
		
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
		
		if (this.down('#features')) {
			this.down('#features').destroy();
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
						headerTpl: '{triageVerdict}'
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
					field: this._getRowField()
					// headerConfig: {
						// _getTitle: function() {
							// console.log(this.getColumns());
							// var cardsInRow = getCardsInRow(this);
							// console.log(cardsInRow);
							// var row = this.nextSibling;
							// console.log(this.columns.get('_cardsByRow'));
							// console.log('SEAN: ',getCardsInRow(row));
							// return this.getValue() + ' (myCustomTitle)';
						// }
					// }
				}
				// listeners: {
					// load: function(board) {
						// var rows = board.getRows();
						// _.each(rows, function(row) {
							// console.log(row.getValue());
							// var cardsInRow = board.getCardsInRow(row);
							// var cardCount = _.flatten(_.values(cardsInRow)).length;
							// console.log(row.headerConfig);
							// if(cardCount === 0) {
								// row.collapse();
							// }else{
								// row.expand();
							// }
						// });
					// }
				// }
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
		// console.log(this._getRowField());
		// return 'Priority';
	}

});