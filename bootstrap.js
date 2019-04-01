const {Services} = ChromeUtils.import("resource://gre/modules/Services.jsm");

var allInOneObserver = {
    observe: function(aSubject, aTopic, aData) {
        aSubject.addEventListener("load", this, true);
    },
    handleEvent: function(aEvent) {
        var document = aEvent.originalTarget;
        if (!document.location || document.location.protocol != "chrome:") {
            return;
        }
        var file = Services.dirsvc.get("UChrm", Components.interfaces.nsIFile);
        file.append("userChrome.js");
        if (! file.exists()) {
            return;
        }
        var url = Services.io.getProtocolHandler("file").
            QueryInterface(Components.interfaces.nsIFileProtocolHandler).
            getURLSpecFromFile(file);
        Services.scriptloader.loadSubScriptWithOptions(url, {
            target: document.defaultView,
            charset: "UTF-8",
            ignoreCache: true
        });
    }
}

function startup() {
    Cc["@mozilla.org/embedcomp/window-watcher;1"].
        getService(Ci.nsIWindowWatcher).registerNotification(
            allInOneObserver);
}

function shutdown() {
    Cc["@mozilla.org/embedcomp/window-watcher;1"].
        getService(Ci.nsIWindowWatcher).unregisterNotification(
            allInOneObserver);
}

function install() {
}

function uninstall() {
}
