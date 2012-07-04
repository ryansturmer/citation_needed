Citation Needed
===============

Introduction
------------
Citation needed is a firefox extension that records the traversal of wikipedia, rendering the output as a set of graphs.  Technically, it could be used to process general browsing habits (with a little modification) but is specifically optimized for processing wikipedia URLs.

Build/Install
-------------
Citation Needed is built using mozilla's new restartless Add-on SDK.  To build citation needed, you'll need to get the SDK and install some dependencies.

* Add-on SDK is here: http://addons.mozilla.org/en-US/developers/builder
* Additional modules for the SDK are here: https://github.com/mozilla/addon-sdk/wiki/Community-developed-modules

The dependencies that must be installed from above to build citation needed are as follows:

* Menuitems by erikvold: https://github.com/voldsoftware/menuitems-jplibhttps://github.com/voldsoftware/menuitems-jplib
* Vold-Utils also by erikvold, needed by menuitems): https://github.com/voldsoftware/vold-utils-jplib

To install Add-on sdk, just unzip it to a convenient directory and do the following:
```bash
cd /path/to/add-on-sdk-x.x
source bin/activate
cd /path/to/citation-needed
```

You're now ready to build citation needed.  To build:
```bash
cfx xpi
```

Or to run from source:

```bash
cfx run
```

Support
-------
There's a lot I haven't documented here.  If you have questions, just email me directly at <ryansturmer@gmail.com>
