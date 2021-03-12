chrome.commands.onCommand.addListener(function (command) {
  if (command == "addtogroup") {
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
        const sitename = url.hostname.split(".").slice(-2)[0];
        if (!uniqueTabHosts[sitename]) {
          uniqueTabHosts[sitename] = [];
        }
        uniqueTabHosts[sitename].push(tab.id);
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
  if (command == "pintab") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var current = tabs[0];
      chrome.tabs.update(current.id, { pinned: !current.pinned });
    });
  }
  if (command == "discard") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var current = tabs[0];
      chrome.tabs.discard(current.id, () => console.log("Tab discarded"));
      alert("Page has been hibernated");
    });
  }
});
