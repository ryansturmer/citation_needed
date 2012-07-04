// Imports
const widgets       = require("widget");
const tabs          = require("tabs");
const data          = require('self').data;
const menuitems     = require('menuitems')
const pagemod       = require('page-mod')

// Constants
ui_url = data.url('ui/graph.htm');
wiki_new_cs_url = data.url('wiki-new-content-script.js');
//TODO fix ailiasing
wiki_exs_cs_url = data.url('wiki-content-script.js');
wiki_cs_url = wiki_exs_cs_url;

// Events
//tabs.on("open", onTabOpen);
//tabs.on("ready", onTabReady);
//tabs.on("activate", onTabActivate);
//tabs.on("deactivate", onTabDeactivate);

// Global Data
topic_index = {}

// Create Menu Item
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

pagemod.PageMod({
    include             : "http://en.wikipedia.org/*",
    contentScriptFile   : wiki_cs_url,
    onAttach            : function(worker) {
                            console.log("Attaching the load event to the worker " + worker);
                            worker.on("load", onPageLoad);}
});

function onPageLoad(data) {
    console.log("Add-on recv'd 'load' event: " + data);
}

/*
function onNewTabReady(tab) {
    url = tab.url;
    topic = parseURL(url);

    // Content script gets loaded if this is a wiki page
    if(topic != null) {
        console.log("New wikipedia tab:" + topic);
        tab.attach({"contentScriptFile":wiki_new_cs_url});

    } else {
        console.log("New Non-wikipedia tab:" + url);
    }
    
    // Re-register the ready handler
    tab.on("ready", onTabReady);
}

function onTabReady(tab) {
    url = tab.url;
    topic = parseURL(url);

    if(topic != null) {
        console.log("Existing wikipedia tab:" + topic);
        tab.on("newPage", function(data) { console.log("EVENT: " + data); } );
        tab.attach({"contentScriptFile":wiki_exs_cs_url});
        
    } else {
        console.log("Existing tab ejecting from Wikipedia:" + url);
    }
}

function onTabOpen(tab) {
    tab.on("ready", onNewTabReady);
}

function onTabActivate(tab) {
    console.log("Tab Activated: " + tab.url);
}

function onTabDeactivate(tab) {
    console.log("Tab Dectivated: " + tab.url);
}

function parseURL(url) {
    var pattern = /^(http|https):\/\/\w+\.wikipedia\.org\/?wiki\/([\w\:\%\(\)\-\.\!\,\'\`\+]+)(\#(\w+))?\/?/i;
    if(pattern.test(url)) {
    match = pattern.exec(url);
    console.log("THIS IS A WIKI URL: " + url);
    var topic = match[2].replace(/\_/g," ");
    var subtopic = "";
    try {
        match[3].replace("_"," ");
    } catch(err) {}
        return new Array(topic, subtopic);
    } else {
        console.log(url + " THIS IS NOT A WIKI URL");
        return null;
    }
}
*/
console.log("Citation Needed is Running");
