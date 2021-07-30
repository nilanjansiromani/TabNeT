chrome.commands.onCommand.addListener(function (command) {
  if (command == "toggle-pin") {
    // Get the currently selected tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let current = tabs[0]
      chrome.tabs.update(current.id, {'pinned': !current.pinned});
    });
  }
});
