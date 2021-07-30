chrome.commands.onCommand.addListener(function (command) {
  if (command == "toggle-pin") {
    // Get the currently selected tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let current = tabs[0]
      chrome.tabs.update(current.id, {'pinned': !current.pinned});
    });
  }
  if (command == "discard") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var current = tabs[0];
      chrome.tabs.discard(current.id, () => console.log("Tab discarded"));
      alert("Page has been hibernated");
    });
  }
  if (command == "addtogroup") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.group(
        {
          tabIds: tabs[0].id,
        },
        (tabGroupId) => {
          chrome.tabGroups.update(tabGroupId, {
            collapsed: false,
            title: tabs[0].title.split(" ")[0],
          });
        }
      );
    });
  }
});
