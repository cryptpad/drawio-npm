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
	};

	class ImageCache {
		constructor(handleGet) {
			this.loading = {};
			this.images = {};
			this.handleGet = handleGet;
		}

		get(url) {
			if (!url.startsWith('cryptpad')) {
				return {url};
			}
			if (this.images[url]) {
				return this.images[url];
			}
			this.load(url);
			return {url};
		}

		async load(url) {
			const loader = async (url) => {
				const imageBlob = await window.parent.APP.loadImage(url);
				const blobUrl = URL.createObjectURL(imageBlob);
				const imageData = { url: blobUrl, type: imageBlob.type };
				this.images[url] = imageData;
				this.handleGet(url, imageData);
				return imageData;
			};

			if (!this.loading[url]) {
				this.loading[url] = loader(url);
			}

			return await this.loading[url];
		}
	}

	const handleGet = function(cryptPadUrl, blobUrl) {
		const images = document.getElementsByTagName('image');

		for(let image of images) {
			const href = image.getAttribute('xlink:href');
			if (href === cryptPadUrl) {
				image.setAttribute('xlink:href', blobUrl.url);
			}
		}
	};
	
	const imageCache = new ImageCache(handleGet);
	
	const isCryptPadIntegrated = function() {
		const params = new URLSearchParams(document.location.search);
		return params.get('integrated') == 'true';
	};

	const patchCanvasImage = function() {
		const orgImage = mxSvgCanvas2D.prototype.image;
		mxSvgCanvas2D.prototype.image = function(a,b,c,d,url,f,g,k,l) {
			const blobUrl = imageCache.get(url).url;
			orgImage.apply(this, [a,b,c,d,blobUrl,f,g,k,l]);
		}

		const orgIsRelativeUrl = mxUrlConverter.prototype.isRelativeUrl;
		mxUrlConverter.prototype.isRelativeUrl = function(url) {
			if (url.startsWith('blob:') || url.startsWith('cryptpad:')) {
				return false;
			}
			return orgIsRelativeUrl.apply(this, [url]);
		}
	};

	// Adds resource for action
	if (isCryptPadIntegrated()) {
		mxResources.parse('cryptPadImport=Nextcloud...');
	} else {
		mxResources.parse('cryptPadImport=CryptPad...');
	}

	// Adds action
	ui.actions.addAction('cryptPadImport', async function() {
		const selected = await window.parent.APP.addImage();
		if (typeof selected === "string") {
			if (selected.startsWith('cryptpad://')) {
				// This is a cryptpad: url send by a new version of CryptPad
				const imageData = await imageCache.load(selected);
				const imageSize = await getImageSize(imageData.url);

				ui.importFile(selected, imageData.type, 0, 0, imageSize.width, imageSize.height);
			} else {
				// This is a url send by a new version of Nextcloud
				const imageSize = await getImageSize(selected);

				const graph = ui.editor.graph;
				graph.insertVertex(null, null, '', 0, 0, imageSize.width, imageSize.height,
					'shape=image;verticalLabelPosition=bottom;labelBackgroundColor=default;' +
					'verticalAlign=top;aspect=fixed;imageAspect=0;image=' + selected + ';');
			}
		} else {
			// This is a blob send by a old version of CryptPad or Nextcloud
			ui.importFiles([selected]);
		}
	});
	
	const menu = ui.menus.get('importFrom');
	const oldFunct = menu.funct;
	
	menu.funct = function(menu, parent) {
		ui.menus.menus.exportAs.enabled = false;
		ui.menus.addMenuItems(menu, ['cryptPadImport'], parent);
		oldFunct.apply(this, arguments);
	};

	patchCanvasImage();
});
