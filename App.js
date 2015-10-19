Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
	launch: function() {
			

		// -----------------------
		// FILTER BY TESTING TYPE?
		// -----------------------
		
		var columns = [
			{
				value: 'Submitted',
				columnHeaderConfig: {
					headerData: {state: 'Submitted'}
				}
			},
			{
				value: 'Open',
				columnHeaderConfig: {
					headerData: {state: 'Open'}
				} 
			},
			{
				value: 'Open',
				columnHeaderConfig: {
					headerData: {state: 'Requirement Defect'}
				} 
			},
			{
				value: 'Open',
				columnHeaderConfig: {
					headerData: {state: 'Training Update'}
				} 
			},
			{
				value: 'Deferred',
				columnHeaderConfig: {
					headerData: {state: 'Deferred'}
				} 
			}
		];

		this.add({
			xtype: 'rallycardboard',
			types: ['Defect'],
			attribute: 'State',
			context: this.getContext(),
			readOnly: true,
			columnConfig: {
				columnHeaderConfig: {
					headerTpl: '{state}'
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