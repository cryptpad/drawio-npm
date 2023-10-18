Draw.loadPlugin(function(ui) {
	const isCryptPadIntegrated = function() {
		const params = new URLSearchParams(document.location.search);
		return params.get('integrated') == 'true';
	}

	// Adds resource for action
	if (isCryptPadIntegrated()) {
		mxResources.parse('cryptPadImport=Nextcloud...');
	} else {
		mxResources.parse('cryptPadImport=CryptPad...');
	}

	// Adds action
	ui.actions.addAction('cryptPadImport', async function() {
		const result = await window.parent.APP.addImage();

		ui.importFiles([result.blob]);
	});
	
	const menu = ui.menus.get('importFrom');
	const oldFunct = menu.funct;
	
	menu.funct = function(menu, parent) {
		ui.menus.addMenuItems(menu, ['cryptPadImport'], parent);
		oldFunct.apply(this, arguments);
	};
});
