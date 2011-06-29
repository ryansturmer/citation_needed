citationneeded.onFirefoxLoad = function(event) {
  document.getElementById("contentAreaContextMenu")
          .addEventListener("popupshowing", function (e){ citationneeded.showFirefoxContextMenu(e); }, false);
};

citationneeded.showFirefoxContextMenu = function(event) {
  // show or hide the menuitem based on what the context menu is on
  document.getElementById("context-citationneeded").hidden = gContextMenu.onImage;
};

window.addEventListener("load", function () { citationneeded.onFirefoxLoad(); }, false);
