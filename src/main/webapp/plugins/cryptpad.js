Draw.loadPlugin(function(ui) {
	// Adds resource for action
	mxResources.parse('cryptPadImport=Import image from CryptPad...');

	// Adds action
	ui.actions.addAction('cryptPadImport', async function() {
		const result = await window.parent.APP.addImage();
		ui.importFile(result.url, result.fileType,10,10,8,8, result.name);
	});
	
	var menu = ui.menus.get('importFrom');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent) {
		ui.menus.addMenuItems(menu, ['cryptPadImport'], parent);
		oldFunct.apply(this, arguments);
	};
});
