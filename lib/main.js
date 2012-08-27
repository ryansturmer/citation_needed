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
cn_worker = null
cn_tab = null

// Graph data
current_topic = null

function debug(text) { if(DEBUG) { console.log(text); } }


function graphHandler(worker) {
    debug("Loaded up the graph page and got its worker " + worker);
    cn_worker = worker
    cn_tab = worker.tab
}

// Open the graph page if there isn't one
// Give the graph page focus if there is
function openGraph() {
    if(cn_tab != null) {
        graph_tab.activate()
    } else {
        tabs.open({
            url     : ui_url,
            onReady : function(tab) {
                worker = tab.attach({
                    "contentScriptFile"   : [data.url('d3.v2.min.js'), page_cs_url]
                });
                graphHandler(worker)
            },
            onOpen : function(tab) { cn_tab = tab; },
            onClose : function(tab) { cn_tab = null; }
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
    src_topic = parseURL(data[0]);
    dst_topic = parseURL(data[1]);
    
    if((src_topic != null) && (dst_topic != null)) {
        cn_worker.port.emit('load', [src_topic[0], dst_topic[0]]);
        debug('WIKI VISIT');
        debug(src_topic);
        debug(dst_topic);
    } else {
        debug('NONWIKIVISIT');
    }
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
    if(previous_tab != null && current_tab != null) {
        src_topic = parseURL(previous_tab.url);
        dst_topic = parseURL(current_tab.url);
        if((src_topic != null) && (dst_topic != null)) {
            cn_worker.port.emit('focus', [src_topic[0], dst_topic[0]]);
            debug('WIKI FOCUS');
            debug(src_topic);
            debug(dst_topic);
        } else {
            debug('NONWIKIFOCUST');
        }
    }
}

function onTabDeactivate(tab) {
    debug("Tab Dectivated: " + tab.url);
}

function parseURL(url) {
    var pattern = /^(http|https):\/\/\w+\.wikipedia\.org\/?wiki\/([\w\:\%\(\)\-\.\!\,\'\`\+]+)(\#(\w+))?\/?/i;
    if(url == null) {
        return null
    }
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

function focus(topic) {

}

openGraph();
debug("Citation Needed is Running");
