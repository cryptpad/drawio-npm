# Changes made by CryptPad

We are trying hard, to use monkey patching ti adjust the behaviour of draw.io, when needed. However sometimes it is necessary to modify the (minified) code of draw.io:

1. src/main/webapp/plugins/cryptpad.js - The CryptPad plugin. We try to do as much as possible here.

2. src/main/webapp/index.js - Add our plugin to the registry:
```
    App.pluginRegistry.cryptpad = 'plugins/cryptpad.js';
```

3. src/main/webapp/js/app.min.js - Remove `this.addMenuItems(p,["-","exportHtml","exportXml","exportUrl"],u);` to disable exports, that are broken inside CryptPad.

