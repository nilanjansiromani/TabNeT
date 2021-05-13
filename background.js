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
        let sitename = url.hostname.split(".").slice(-2)[0];
        if (sitename === "walmart") {
          sitename = url.hostname.split(".").slice(-3)[0];
        }
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
            chrome.tabGroups.update(tabGroupId, {
              collapsed: true,
              title: tabGroup,
            });
          }
        );
      }
    });
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (tab.status === "complete") {
        const url = new URL(tab.url);
        let groupName = url.hostname.split(".").slice(-2)[0];
        // have a special case for walmart ones.
        if (groupName === "walmart") {
          groupName = url.hostname.split(".").slice(-3)[0];
        }
        chrome.tabGroups.query({ title: groupName }, (groupid) => {
          if (groupid.length) {
            chrome.tabs.group(
              {
                tabIds: tabId,
                groupId: groupid[0].id,
              },
              () => { }
            );
          } else {
            chrome.tabs.group(
              {
                tabIds: tabId,
              },
              (tabGroupId) => {
                chrome.tabGroups.update(tabGroupId, {
                  collapsed: false,
                  title: groupName,
                });
              }
            );
          }
        });
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
