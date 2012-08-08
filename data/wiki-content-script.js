payload = [document.referrer, document.location.href]
self.port.emit("loaded", payload);

