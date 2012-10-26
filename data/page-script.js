/*
 * This is the page script, which runs for index.htm
 * Events dispatched from here land in the index.htm universe
 * Events caught here (port.on) came from the main.js universe
 */
function dispatch_event(event_name, data) {
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(event_name, true, true, data);
    document.documentElement.dispatchEvent(event);
}

self.port.on("entry", function(msg) {
    dispatch_event('page-entry', msg);
});
// When a tab is focused
self.port.on("focus", function(msg) {
    dispatch_event('page-focus', msg);
});

// When a page is loaded
self.port.on("load", function(msg) {
    dispatch_event('page-visit', msg); 
});

self.port.on("activate", function(msg) {
    self.port.on
});

document.documentElement.addEventListener("clear", function(event) {
    self.port.emit("clear", event.detail);
}, false);
