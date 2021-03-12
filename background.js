chrome.commands.onCommand.addListener(function(command) {
  if (command == "toggle-pin") {
    // Get the currently selected tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var currentTab = tabs[0];
      chrome.tabs.group({
        tabIds: currentTab.id
      }, (tabGroupId) => {
        console.log(tabGroupId);
        chrome.tabGroups.update(tabGroupId, {"title": currentTab.title})
      })
    });
  }
});