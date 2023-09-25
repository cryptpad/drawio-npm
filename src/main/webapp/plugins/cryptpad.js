console.log('XXX cryptpad 1');
Draw.loadPlugin(function(ui) {
    const img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kTtIw1AUhv+mSlUqDnYQcQhSnSyIijhqFYpQIdQKrTqY3PQFTRqSFBdHwbXg4GOx6uDirKuDqyAIPkBcXZwUXaTEc5NCixgPHO7Hf89/OPdcQKiXmWZ1jAOabpupRFzMZFfF0Cu6EaEMYFhmljEnSUn4xtc91VHcxXgv/7o/o1fNWQwIiMSzzDBt4g3i6U3b4LxPHGFFWSU+Jx4zaUDiR64rHr9xLrgs8J4RM52aJ44Qi4U2VtqYFU2NeIo4qmo69RcyHquctzhr5SprzslfGM7pK8tcpxxCAotYggQRCqoooQwbMTp1Uiyk6D7u4x90/RK5FHKVwMixgAo0yK4f/A9+79bKT054ncJxoPPFcT5GgNAu0Kg5zvex4zROgOAzcKW3/JU6MPNJeq2lRY+Avm3g4rqlKXvA5Q4w8GTIpuxKQUohnwfez+ibskD/LdCz5u2teY/TByBNu0reAAeHwGiBeq/7vLurfW//1jT39wMoP3KJ0fwekQAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+cJFAkDEsK7OicAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAJElEQVQI12P8//8/AzbAxIADQCUYGRnRGQSMwqcDIoTgkuwqAOKDDw0zjEG/AAAAAElFTkSuQmCC';

	console.log('XXX cryptpad 2');

	// Adds resource for action
	mxResources.parse('cryptPadImport=Import image from CryptPad...');

	// Adds action
	ui.actions.addAction('cryptPadImport', function() {
		console.log('XXX cryptPadImport', ui);
		ui.importFile(img, 'image/png',10,10,8,8,'face.png');
	});
	
	var menu = ui.menus.get('importFrom');
	var oldFunct = menu.funct;
	
	menu.funct = function(menu, parent) {
		ui.menus.addMenuItems(menu, ['cryptPadImport'], parent);
		oldFunct.apply(this, arguments);
	};
});
