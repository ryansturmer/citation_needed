console.log("Executing page-script.js");

// When a tab is focused
self.port.on("focus", function(msg) {


});

// When a page is loaded
self.port.on("load", function(msg) {


});

self.port.on("activate", function(msg) {
    console.log("activate rec'vd")
    var list = d3.select('#events').data([msg])
    list.enter().append('li').text(function(msg)) {return msg})
});
