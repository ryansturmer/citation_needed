// Imports
const widgets       = require("widget");
const tabs          = require("tabs");
const data          = require('self').data;
const menuitems     = require('menuitems')
const pagemod       = require('page-mod')

// Constants
DEBUG = true; 
ui_url = data.url('ui/graph.htm');
wiki_cs_url = data.url('wiki-content-script.js');
page_cs_url = data.url('page-script.js');

// Events
//tabs.on("open", onTabOpen);
tabs.on("ready", onTabReady);
tabs.on("activate", onTabActivate);
tabs.on("deactivate", onTabDeactivate);

// Global Data
visit_log = []
topic_index = {}
tab_index = {}
previous_tab = null
current_tab = null
previous_topic = null
current_topic = null
graph_tab = null
cn_worker = null
cn_tab = null

// Graph data
current_topic = null

function debug(text) { if(DEBUG) { console.log(text); } }

function htmlEncode(s)
{
/*
  var el = document.createElement("div");
  el.innerText = el.textContent = s;
  s = el.innerHTML;
*/
  return s;
}


function graphHandler(worker) {
    debug("Loaded up the graph page and got its worker " + worker);
    worker.on('detach', function(worker) { cn_worker = null; });
    cn_worker = worker
    cn_tab = worker.tab
    visit_log.map(function update(d) {
        cn_worker.port.emit("load", d);
    })
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
            onOpen : function(tab) { cn_tab = tab; debug('opening the graph tab'); },
            onClose : function(tab) { cn_tab = null; debug('closing the graph tab'); }
        });
   }
}


// Menu item that launches the graph view
var menuitem = require("menuitems").Menuitem({
  id: "citataion_needed",
  menuid: "menu_ToolsPopup",
  label: "Citation Needed...",
  onCommand: openGraph, 
  insertbefore: "menu_pageInfo"
});

// Curry in the tab so it's available for the page load events
function curr_onPageLoad(tab) {
    // Called whenever the content script for a wiki page loads 
    return function onPageLoad(data) {
        //previous_tab = current_tab;
        //current_tab = tab;
        src_topic = parseURL(data[0])[0];
        dst_topic = parseURL(data[1])[0];
        
        if((src_topic != null) || (dst_topic != null)) {
            if(tab == current_tab) {
                focus(src_topic, dst_topic);
            } else {
                load(src_topic, dst_topic);
            }
            debug('WIKI VISIT: ' + src_topic + ' -> ' + dst_topic);
        } else {
            debug('NONWIKIVISIT');
        }
    }
}

// Called when any page loads (Wiki or no)
function onTabReady(tab) {
    url = tab.url;
    topic = parseURL(url);
    worker = tab.attach({"contentScriptFile":wiki_cs_url});
    worker.port.on('load', curr_onPageLoad(tab))
}

// Called when focus changes from one tab to the next
function onTabActivate(tab) {
    previous_tab = current_tab
    current_tab = tab
    if(previous_tab != null && current_tab != null) {
        //src_topic = parseURL(previous_tab.url)[0];
        //dst_topic = parseURL(current_tab.url)[0];
        src_topic = current_topic;
        dst_topic = parseURL(current_tab.url)[0];
        if((src_topic != null) || (dst_topic != null)) {
            focus(src_topic, dst_topic)
            visit_log.push([src_topic, dst_topic]);
            debug('WIKI FOCUS: ' + src_topic + ' -> ' + dst_topic);
        } else {
            debug('NONWIKIFOCUST');
        }
    }
}

function onTabDeactivate(tab) {
    debug("Tab Dectivated: " + tab.url);
}

// input: URL
// output: 2-tuple of topic:subtopic, or 2-tuple of nulls if not a wikipedia link
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
            return new Array(htmlEncode(decodeURIComponent(topic)), htmlEncode(decodeURIComponent(subtopic)));
    } else {
        // Not a wiki URL
        return [null, null];
    }
}

function load(src_topic, dst_topic) {
    visit_log.push([src_topic, dst_topic])
    if(cn_worker != null) {
        cn_worker.port.emit("load", [src_topic, dst_topic])
     } else {
        debug("cn_worker is null");
     }
}

function focus(src_topic, dst_topic) {
    visit_log.push([src_topic, dst_topic]);
    if(src_topic != null) {
        previous_topic = src_topic;
    }
    if(dst_topic != null) {
        current_topic = dst_topic;
    }
    if(cn_worker != null) {
        cn_worker.port.emit("focus", [src_topic, dst_topic])
    } else {
        debug("cn_worker is null");
    }
}

//openGraph();
debug("Citation Needed is Running");
