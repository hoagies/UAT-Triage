Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
	launch: function() {
			
		// -----------------------
		// FILTER BY TESTING TYPE?
		// -----------------------
		
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
			}
		];

		this.add({
			xtype: 'rallycardboard',
			types: ['Defect'],
			attribute: 'c_TriageVerdict',
			context: this.getContext(),
			readOnly: true,
			columnConfig: {
				columnHeaderConfig: {
					headerTpl: '{triageVerdict} TEST'
				},
				plugins: [
					{ptype: 'rallycolumncardcounter'}
				]
			},
			columns: columns,
			cardConfig: {
				showIconsAndHighlightBorder: false,
				editable: false,
				fields: ['CreationDate'],
				showAge: true
			},
			rowConfig: {
				field: 'c_TestingType'
			}
		});
	}
});