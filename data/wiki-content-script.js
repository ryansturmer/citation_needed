console.log("Executing the content script and emitting load event " + [document.referrer, document.location.href]);
self.port.emit("load", [document.referrer, document.location.href]);
