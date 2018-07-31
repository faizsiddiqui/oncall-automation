// Extension Badge Icon Switcher
var switchNotificationBadge = () => {
  if (default_options.oncall_automation_status) {
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
switchNotificationBadge();

// Reload VictorOps Tab after x minutes
chrome.storage.sync.get(default_options, options => {
  setInterval(() => {
    chrome.tabs.reload(default_options.victorops_tab_id);
  }, parseInt(options.victorops_tab_refresh_frequency, 10) * 60000);
});

// Badge Icon OnClick
chrome.browserAction.onClicked.addListener(tab => {
  // :: Play:Pause Notifications
  default_options.oncall_automation_status = !default_options.oncall_automation_status;
  switchNotificationBadge();
});

// Save VictorOps Tab ID and Update Alert Counter Badge Text
chrome.runtime.onConnect.addListener(port => {
  if (port.name === default_options.port_name) {
    port.onMessage.addListener((msg, sendingPort, sendResponse) => {
      // Init Message Received
      if (msg.data == "init") {
        default_options.victorops_tab_id = sendingPort.sender.tab.id;
      } else {
        // Set Badge
        chrome.browserAction.setBadgeText({
          text: msg.data
        });

        // Play Sound & Notification
        if (parseInt(msg.data, 10) > 0) {
          if (default_options.oncall_automation_status) {
            $.playSound(chrome.extension.getURL("/external/knock-knock.mp3")); // Play Knocknock Sound
            // Sends Notification
            chrome.notifications.create(default_options.app_name, {
              type: "basic",
              title: "Knocknock :: VictorOps Alert",
              message: 'VictorOps waiting for you to acknowledge ' + msg.data + ' Alerts',
              iconUrl: '/external/icons/icon_48.png',
              buttons: [{
                title: "Pause",
              }],
            }, () => {
              setTimeout(() => {
                chrome.notifications.clear(default_options.app_name);
              }, 5000);
            });
          }
        } // end :: Play Sound & Notification
      }
    });

    // Notification onClick :: Clear Notification
    chrome.notifications.onClicked.addListener((notificationId) => {
      chrome.tabs.update(default_options.victorops_tab_id, {
        "active": true
      });
      chrome.notifications.clear(default_options.app_name);
    });

    // Notificaiton Button onClick :: Pause Notifications
    chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
      if (buttonIndex == 0) {
        default_options.oncall_automation_status = false;
        switchNotificationBadge();
      }
    })
  }
});
