Draw.loadPlugin(function(ui) {

	const getImageSize = function(url) {
		return new Promise((resolve) => {
			var img = document.createElement("img");
			img.src = url;
			img.onload = function() {
				img.style.visibility = 'hidden';
				document.body.appendChild(img);
				resolve({width: img.clientWidth, height: img.clientHeight});
				document.body.removeChild(img);
			}
		});
	}

	// Adds resource for action
	mxResources.parse('cryptPadImport=Import image from CryptPad...');

	// Adds action
	ui.actions.addAction('cryptPadImport', async function() {
		const result = await window.parent.APP.addImage();
		const size = await getImageSize(result.url);
		ui.importFile(result.url, result.fileType, 0, 0, size.width, size.height, result.name);
	});
	
	var menu = ui.menus.get('importFrom');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent) {
		ui.menus.addMenuItems(menu, ['cryptPadImport'], parent);
		oldFunct.apply(this, arguments);
	};
});
