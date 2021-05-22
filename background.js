const getDomainName = (url) => {
  url = new URL(url);
  let domainName = url.hostname.split(".").slice(-2)[0];
  if (domainName === "walmart") {
    domainName = url.hostname.split(".").slice(-3)[0];
  }
  return domainName;
};

const uniqueTabHosts = {};

const autoArrangeTabsByDomain = (list) => {
  list.forEach((tab) => {
    const domainName = getDomainName(tab.url);
    if (!uniqueTabHosts[domainName]) {
      uniqueTabHosts[domainName] = [];
    }
    uniqueTabHosts[domainName].push(tab.id);
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
};

chrome.commands.onCommand.addListener(function (command) {
  if (command == "autoArrangeTabs") {
    chrome.tabs.query({}, (list) => {
      autoArrangeTabsByDomain(list);
    });
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      console.log(tabId);
      console.log(changeInfo);
      console.log;
      if (tab.status === "complete") {
        console.table(uniqueTabHosts);
      }
    });
  }
});
