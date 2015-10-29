Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
	launch: function() {

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
			}
		];
			
		var project_oid = '/project/37192747640';
		
		this.add({			
			xtype: 'rallygridboard',
			modelNames: ['Defect'],
			toggleState: 'board',
			context: this.getContext(),
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
					showIconsAndHighlightBorder: true,
					editable: true,
					fields: ['CreationDate','c_TestingType','TestCase'],
					showAge: true
				},
				rowConfig: {
					field: 'Severity'
				}
			},
			plugins: [
				{
					ptype: 'rallygridboardfieldpicker',
					modelNames: ['Defect'],
					headerPosition: 'left'
				}, {
                    ptype: 'rallygridboardcustomfiltercontrol',
					headerPosition: 'left',
                    filterControlConfig: {
						modelNames: ['Defect']
					}
                }
			]
		});
	}
});