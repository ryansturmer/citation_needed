Citation Needed
===============

Introduction
------------
Citation needed is a firefox extension that records the traversal of wikipedia, rendering the output as a set of graphs.  Technically, it could be used to process general browsing habits (with a little modification) but is specifically optimized for processing wikipedia URLs.

Build/Install
-------------
To build citation needed, simply:

    make

The output of the build process is an .xpi file, which lives in the *extension* directory.  You can open this file with Firefox to install it.  If you run the *firefox.sh* script found in the main directory, Firefox will be launched in developer mode, so you can sandbox the extension while developing.

Scripts
-------
The python directory contains some scripts that turn the output CSV files into useful graphs.  *podcast.py* is the front end script (used for generating graphs for my podcast) and *citationneeded.py* contains the internals.  Use *podcast.py* as an example for how to use the *citationneeded* module.

Support
-------
There's a lot I haven't documented here.  If you have questions, just email me directly at <ryansturmer@gmail.com>


