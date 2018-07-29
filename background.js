// Extension Badge Icon Switcher
var setBadge = status => {
  if (status) {
    chrome.browserAction.setBadgeBackgroundColor({
      color: [112, 196, 188, 255]
    }); // Light Blue
    chrome.browserAction.setBadgeText({
      text: "0"
    });
  } else {
    chrome.browserAction.setBadgeText({
      text: "\u00D7"
    }); //Letter X
    chrome.browserAction.setBadgeBackgroundColor({
      color: [255, 0, 0, 100]
    }); //Red
  }
}

// Set Alert Counter Badge Color (Initialization)
setBadge(true);

// Badge Icon OnClick
chrome.browserAction.onClicked.addListener(tab => {
  chrome.storage.sync.get(default_options, options => {
    // :: Pause Extension
    if (options.oncall_automation_status) {
      chrome.storage.sync.set({
        oncall_automation_status: false
      });
      setBadge(false);
    }
    // :: Play Extension
    else {
      chrome.storage.sync.set({
        oncall_automation_status: true
      });
      setBadge(true);
    }
    chrome.tabs.reload(options.victorops_tab_id);
  });
});

// Save VictorOps Tab ID and Update Alert Counter Badge Text
chrome.runtime.onConnect.addListener(port => {
  if (port.name === "OnCallKnocknock") {
    port.onMessage.addListener((msg, sendingPort, sendResponse) => {
      if (msg.data == "init") {
        chrome.storage.sync.set({
          victorops_tab_id: sendingPort.sender.tab.id
        });
      } else {
        chrome.browserAction.setBadgeText({
          text: msg.data
        });
      }
    });
  }
});
