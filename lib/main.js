// Imports
const widgets       = require("widget");
const tabs          = require("tabs");
const data          = require('self').data;
const menuitems     = require('menuitems')
const pagemod       = require('page-mod')

// Constants
DEBUG = true
ui_url = data.url('ui/graph.htm');
wiki_cs_url = data.url('wiki-content-script.js');
page_cs_url = data.url('page-script.js');

// Events
//tabs.on("open", onTabOpen);
tabs.on("ready", onTabReady);
tabs.on("activate", onTabActivate);
tabs.on("deactivate", onTabDeactivate);

// Global Data
topic_index = {}
tab_index = {}
previous_tab = null
current_tab = null
graph_tab = null

function debug(text) { if(DEBUG) { console.log(text); } }


function graphHandler(worker) {
    //debug("Loaded up the graph page and got its worker " + worker);
    cn_worker = worker
    cn_tab = worker.tab
}

// Open the graph page if there isn't one
// Give the graph page focus if there is
function openGraph() {
    if(graph_tab != null) {
        graph_tab.activate()
    } else {
        tabs.open({
            url     : ui_url,
            onReady : function(tab) {
                worker = tab.attach({
                    contentScriptFile   : page_cs_url,
                });
                graphHandler(worker)
            },
            onOpen : function(tab) { graph_tab = tab; },
            onClose : function(tab) { graph_tab = null; }
        });
   }
}


// Menu item that launches the graph view
var menuitem = require("menuitems").Menuitem({
  id: "citataion_needed",
  menuid: "menu_ToolsPopup",
  label: "Citation Needed",
  onCommand: openGraph, 
  insertbefore: "menu_pageInfo"
});


// Called whenever the content script for a wiki page loads 
function onPageLoad(data) {
    referrer = data[0];
    url = data[1];
    debug("Content script loaded:");
    debug("  REFERRER: " + referrer);
    debug("       URL: " + url);
}

function onTabReady(tab) {
    url = tab.url;
    topic = parseURL(url);
    worker = tab.attach({"contentScriptFile":wiki_cs_url});
    worker.port.on('load', onPageLoad)
}

function onTabActivate(tab) {
    previous_tab = current_tab
    current_tab = tab
    debug("Tab Activated: " + tab.url);
}

function onTabDeactivate(tab) {
    debug("Tab Dectivated: " + tab.url);
}

function parseURL(url) {
    var pattern = /^(http|https):\/\/\w+\.wikipedia\.org\/?wiki\/([\w\:\%\(\)\-\.\!\,\'\`\+]+)(\#(\w+))?\/?/i;
    if(pattern.test(url)) {
        // Wiki URL
        match = pattern.exec(url);
        var topic = match[2].replace(/\_/g," ");
        var subtopic = "";
        try {
            match[3].replace("_"," ");
        } catch(err) {}
            return new Array(topic, subtopic);
    } else {
        // Not a wiki URL
        return null;
    }
}

debug("Citation Needed is Running");
