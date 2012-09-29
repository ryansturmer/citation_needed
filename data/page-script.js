//console.log("Executing page-script.js");

function dispatch_event(event_name, data) {
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(event_name, true, true, data);
    document.documentElement.dispatchEvent(event);
}

// When a tab is focused
self.port.on("focus", function(msg) {
    dispatch_event('page-focus', msg);
});


// When a page is loaded
self.port.on("load", function(msg) {
    dispatch_event('page-visit', msg); 
});

self.port.on("activate", function(msg) {

});

