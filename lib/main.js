const widgets = require("widget");
const tabs = require("tabs");
const page_worker = require("page-worker");
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

pageWorker = page_worker.Page({
      contentScript: "console.log(document.body.innerHTML);",
             contentURL: "http://en.wikipedia.org/wiki/Internet"
});]

console.log("The add-on is running.");
