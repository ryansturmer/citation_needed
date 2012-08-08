// Imports
const widgets       = require("widget");
const tabs          = require("tabs");
const data          = require('self').data;
const menuitems     = require('menuitems')
const pagemod       = require('page-mod')

// Constants
ui_url = data.url('ui/graph.htm');
wiki_pattern = /^(http|https):\/\/\w+\.wikipedia\.org\/?wiki\/([\w\:\%\(\)\-\.\!\,\'\`\+]+)(\#(\w+))?\/?/i;

// Events
//tabs.on("open", onTabOpen);
//tabs.on("ready", onTabReady);
//tabs.on("activate", onTabActivate);
//tabs.on("deactivate", onTabDeactivate);

// Global Data
var entries = [],
    workers = [];

// Create Menu Item
var menuitem = require("menuitems").Menuitem({
  id: "menu_citataion_needed",
  menuid: "menu_ToolsPopup",
  label: "Citation Needed",
  onCommand: function() {
    console.log("Clicked the ciation needed menu item.");
    showUI();
  },
  insertbefore: "menu_pageInfo"
});

console.log(menuitem);
pagemod.PageMod({
    include             : "http://en.wikipedia.org/*",
    contentScriptFile   : data.url('wiki-content-script.js'),
    onAttach            : function(worker) {
                            worker.port.on("loaded", onWikiPageLoaded);
                            }
});

/*
 * Expects an array [src url, dest url]
 * Returns parsed visit record
 */
function makeRecord(src_url, dst_url) {
    src = parseWikipediaURL(src_url)
    dst = parseWikipediaURL(dst_url);
   
    date = new Date()
    timestamp = date.getTime();

    entry =     [timestamp,
                 decodeURI(src_url),
                 decodeURI(dst_url),
                 src[0],    //topic
                 src[1],    //subtopic
                 dst[0],    //topic
                 dst[1]     //subtopic
                ];
    return entry;
}
function onWikiPageLoaded(data) {
    console.log("Workers: " + workers)
    src_url = data[0];
    dst_url = data[1];
    entry = makeRecord(src_url, dst_url);
    console.log(entry)
    entries.push(entry);
    workers.forEach(function(worker) {
                        worker.port.emit("visit_page", [entry[3], entry[5]]); 
    });
}

function onUIReady(tab) {
    console.log("UI Tab is ready.");
    console.log(tab);
    var worker = tab.attach({contentScriptFile: [data.url("d3.v2.js"), data.url('ui-content-script.js')]});
    workers.push(worker);
}

function showUI() {
    tabs.open({ url: ui_url,
                inBackground: false,
                onReady: onUIReady
    });
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
*/

function isWikipediaArticle(url) {
    return wiki_pattern.test(url);
}

function parseWikipediaURL(url) {
    if(isWikipediaArticle(url)) {
        url = decodeURI(url);
        match = wiki_pattern.exec(url);
        topic = match[2].replace(/\_/g," ");
        subtopic = "";
        try {
            match[3].replace("_"," ");
        } catch(err) {}
        return [topic, subtopic];
    } else {
        return ['','']
    }
}

console.log("Citation Needed is Running");
tabs.open("http://en.wikipedia.org");
