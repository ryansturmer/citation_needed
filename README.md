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

* Menuitems by erikvold: https://github.com/voldsoftware/menuitems-jplib
* Vold-Utils also by erikvold, needed by menuitems): https://github.com/voldsoftware/vold-utils-jplib

A python script, `get_sdk.py` has been included to make it easier to install and use the SDK for new developers. The following will download, unpack, and activate addon-sdk-1.9. 

```bash
python get_sdk.py
cd sdk/addon-sdk-1.9/
# If you're running windows, you'll want to run bin/activate.bat instead of the line below:
source bin/activate
cd ../..
```

Or to download and activate the Add-on sdk yourself, just unzip it to a convenient directory and do the following:
```bash
cd /path/to/add-on-sdk-x.x
source bin/activate
cd /path/to/citation-needed
```

You're now ready to build the add-on.  To build:
```bash
cfx xpi
```

Or to run from source:

```bash
cfx run
```

Running the Add-on
------------------
Once the add on is installed (or you've launched firefox from source using `cfx run` The add-on will automatically track your traversal of wikipedia, displaying a graph in the "Citation Needed" tab which was opened when you launched firefox or installed the add-on.  Don't close this tab!  Your graph will be lost! There's currently no way to save the graph, nor is there a way to bring the graph back up once you've closed it.  These are functions I intend to add in a future release.   


Support
-------
There's a lot I haven't documented here.  If you have questions, just email me directly at <ryansturmer@gmail.com>
