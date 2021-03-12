chrome.commands.onCommand.addListener(function (command) {
  if (command == "toggle-pin") {
    // Get the currently selected tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentTab = tabs[0];
      chrome.tabs.group(
        {
          tabIds: currentTab.id,
        },
        (tabGroupId) => {
          chrome.tabGroups.update(tabGroupId, { title: currentTab.title });
        }
      );
    });
  }
  if (command == "arrange-all") {
    chrome.tabs.query({}, (list) => {
      const uniqueTabHosts = {};
      list.forEach((tab) => {
        const url = new URL(tab.url);
        if (!uniqueTabHosts[url.hostname]) {
          uniqueTabHosts[url.hostname] = [];
        }
        uniqueTabHosts[url.hostname].push(tab.id);
      });
      for (const tabGroup in uniqueTabHosts) {
        chrome.tabs.group(
          {
            tabIds: uniqueTabHosts[tabGroup],
          },
          (tabGroupId) => {
            chrome.tabGroups.update(tabGroupId, { title: tabGroup });
          }
        );
      }
    });
  }
});
