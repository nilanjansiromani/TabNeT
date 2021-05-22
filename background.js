const uniqueTabHosts = {};

const getDomainName = (url) => {
  url = new URL(url);
  let domainName = url.hostname.split(".").slice(-2)[0];
  if (domainName === "walmart") {
    domainName = url.hostname.split(".").slice(-3)[0];
  }
  return domainName;
};

const arranger = (list) => {
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
        chrome.tabGroups.update(
          tabGroupId,
          {
            collapsed: true,
            title: tabGroup,
          },
          (data) => console.log(data)
        );
      }
    );
  }
};

chrome.commands.onCommand.addListener(function (command) {
  if (command == "autoArrangeTabs") {
    chrome.tabs.query({}, (list) => {
      arranger(list);
    });
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (tab.status === "complete") {
        const newDomain = getDomainName(tab.url);
        if (uniqueTabHosts[newDomain]) {
          console.log("there is a tab of this domain open and grouped");
        } else {
          console.log("This is a new domain tht you have opened just now");
        }
      }
    });
  }
});
