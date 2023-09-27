Draw.loadPlugin(function(ui) {
	// Adds resource for action
	mxResources.parse('cryptPadImport=Import image from CryptPad...');

	// Adds action
	ui.actions.addAction('cryptPadImport', async function() {
		console.log('XXX cryptPadImport', ui);
		const result = await window.parent.APP.addImage();
		console.log('XXX result', result);
		ui.importFile(result.url, 'image/png',10,10,8,8,'face.png');  // TODO mime type
	});
	
	var menu = ui.menus.get('importFrom');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent) {
		ui.menus.addMenuItems(menu, ['cryptPadImport'], parent);
		oldFunct.apply(this, arguments);
	};
});
