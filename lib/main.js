// Imports
const widgets = require("widget");
const tabs = require("tabs");
//const page_worker = require-("page-worker");
const data = require('self').data;

// Constants
ui_url = data.url('ui/graph.htm');

// Events
tabs.on("ready", onTabReady);
tabs.on("activate", onTabActivate);
tabs.on("deactivate", onTabDeactivate);


/*
var widget = widgets.Widget({
  id: "mozilla-link",
  label: "Mozilla website",
  contentURL: "http://www.mozilla.org/favicon.ico",
  onClick: function() {
    tabs.open("http://www.mozilla.org/");
  }
});
*/

var menuitem = require("menuitems").Menuitem({
  id: "citataion_needed",
  menuid: "menu_ToolsPopup",
  label: "Citation Needed",
  onCommand: function() {
    console.log("Clicked the ciation needed menu item.");
    tabs.open(ui_url);
  },
  insertbefore: "menu_pageInfo"
});

function onTabReady(tab) {
    console.log("Tab Ready: " + tab.url)
}

function onTabActivate(tab) {
    console.log("Tab Activated: " + tab.url)
}

function onTabDeactivate(tab) {
    console.log("Tab Dectivated: " + tab.url)
}

/*
pageWorker = page_worker.Page({
    contentURL: addon_self.data.url('ui/graph.htm')
});
*/
console.log("Citation Needed is Running");
