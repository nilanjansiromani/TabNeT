const getDomainName = (url) => {
  url = new URL(tab.url);
  let sitename = url.hostname.split(".").slice(-2)[0];
  if (sitename === "walmart") {
    sitename = url.hostname.split(".").slice(-3)[0];
  }
  return sitename;
};

chrome.commands.onCommand.addListener(function (command) {
  if (command == "autoArrangeTabs") {
    chrome.tabs.query({}, (list) => {
      const uniqueTabHosts = {};
      list.forEach((tab) => {
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
        console.log("The tab has been loaded");
      }
    });
  }
});
