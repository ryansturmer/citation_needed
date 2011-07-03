var DEBUG_ON = true
var cn_recording = false;
var entries = new Array();

debug = function(s) { if(DEBUG_ON) {dump(s + "\n");} }

clear_entries = function() {
	entries = new Array();
}

parse_url = function(url) {
	var pattern = /^(http|https):\/\/\w+\.wikipedia\.org\/?wiki\/([\w\:\%\(\)\-\.\!]+)(\#(\w+))?\/?/i;
	if(pattern.test(url)) {
		match = pattern.exec(url);
		debug("THIS IS A WIKI URL:  " + url);
		var topic = match[2].replace("_"," ");
		var subtopic = "";
		try {
			match[3].replace("_"," ");
		} catch(err) {}
		return new Array(topic, subtopic);
	} else {
		debug(url + "  THIS IS NOT A WIKI URL");
		return null;
	}
}

add_entry = function(src_url, target_url) {
	var date = new Date()
	var source = parse_url(src_url);
	var target = parse_url(target_url);
	if((source != null) || (target != null)) {
		var new_entry = new Array(date.getTime(), "","","","");
		if(source != null) {
			new_entry[1] = source[0];
			new_entry[2] = source[1];
		}
		if(target != null) {
			new_entry[3] = target[0];
			new_entry[4] = target[1];
		}
		debug("Adding an entry: " + new_entry);
		entries.push(new_entry);
	}
}

write_entries = function(path) {
	debug("Writing the entries file");
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, "Select a File", nsIFilePicker.modeSave);
	fp.appendFilter("CSV Files", "*.csv");
	fp.defaultString = "output.csv";
	var res = fp.show();
	if (res == nsIFilePicker.returnOK) {
		var path = fp.path;
		var lines = new Array()
		for (var i=0; i<entries.length; i++) {
			debug(entries[i]);
			lines.push(entries[i].join(","));
		}
		fh = FileIO.open(path);
		FileIO.write(fh, lines.join("\n"));
	}
}
on_page_load = function(event) {
	debug("on_page_load()");
	var doc = event.originalTarget;
	var target = doc.defaultView.location.href;
	var source = doc.referrer;

	if(cn_recording) {
		add_entry(source, target);
	} else {
		debug("Not recording, so ignoring: " + target)
	}

}

toggle_recording = function(event) {
	debug(event.originalTarget.id)
	event.stopPropagation();
	if(cn_recording) {
		cn_recording = false;
		debug("Stopping recording now");
		document.getElementById("menuitem_startstop").setAttribute("label", "Start Recording");
		document.getElementById("cn_button").style.listStyleImage = "url(chrome://citationneeded/content/blank_piece.png)";
	}
	else {
		cn_recording = true;
		debug("Starting recording now");
		document.getElementById("menuitem_startstop").setAttribute("label", "Stop Recording");
		document.getElementById("cn_button").style.listStyleImage = "url(chrome://citationneeded/content/blank_piece_green.png)";
	}
}

on_tab_select = function(event) {
	debug("on_tab_select()\n");
	var doc = gBrowser.contentDocument;
	debug(doc.defaultView.location.href);
	debug("\n");
}
onload_function = function() {
	//onFirefoxLoad();
	debug("executing the load listener... binding events") 
	gBrowser.addEventListener("load", on_page_load, true);
	gBrowser.tabContainer.addEventListener("TabSelect", on_tab_select, false);
}

// Bind events once everything is loaded
window.addEventListener("load", onload_function, false);


/*
citationneeded.onFirefoxLoad = function(event) {
  document.getElementById("contentAreaContextMenu")
          .addEventListener("popupshowing", function (e){ citationneeded.showFirefoxContextMenu(e); }, false);
};

citationneeded.showFirefoxContextMenu = function(event) {
  // show or hide the menuitem based on what the context menu is on
  document.getElementById("context-citationneeded").hidden = gContextMenu.onImage;
};
*/


