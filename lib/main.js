// Imports
const widgets       = require("widget");
const tabs          = require("tabs");
const data          = require('self').data;
const menuitems     = require('menuitems')
const pagemod       = require('page-mod')

// Constants
DEBUG = false; 
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
        emit_entry(d);
    });
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
        entry = make_entry(data[0], data[1], '');
        if((entry.src_topic != null) || (entry.dst_topic != null)) {
            if(tab == current_tab) {
                entry.type='focus';
            } else {
                entry.type='load';
            }
            emit_entry(entry);
            debug('WIKI VISIT: ' + entry.src_topic + ' -> ' + entry.dst_topic);
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
        entry = make_entry(current_topic, current_tab.url, 'focus')
        entry.src_topic = current_topic; // TODO FIX THIS HACK
        if((entry.src_topic != null) || (entry.dst_topic != null)) {
            emit_entry(entry);
            debug('WIKI FOCUS: ' + entry.src_topic + ' -> ' + entry.dst_topic);
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

function make_entry(src_url, dst_url, type) {
    var date = new Date();
    retval = new Object();
    src = parseURL(src_url);
    dst = parseURL(dst_url);
    retval.src_url = src_url;
    retval.dst_url = dst_url;
    if(src != null) {
        retval.src_topic = src[0];
        retval.src_subtopic = src[1];
    }   else {
        retval.src_topic = null;
        retval.src_subtopic = null;
    }

    if(dst != null) {
        retval.dst_topic = dst[0];
        retval.dst_subtopic = dst[1];
    } else {
        retval.dst_topic = null;
        retval.dst_subtopic = null;
    }
    retval.timestamp = date.getTime();
    retval.type = type;
    return retval
}

function emit_entry(entry) {
    visit_log.push(entry);
    if(entry.type == 'focus') {
        if(entry.src_topic != null) {
            previous_topic = entry.src_topic;
        }
        if(entry.dst_topic != null) {
            current_topic = entry.dst_topic;
        }
    } else if(entry.type == 'load') {
        
    }
    if(cn_worker != null) {
        cn_worker.port.emit('entry', entry)
    } else {
        debug("cn_worker is null");
    }
}

if(DEBUG) {
    openGraph();
    tabs.open("http://en.wikipedia.org");
}
debug("Citation Needed is Running");
