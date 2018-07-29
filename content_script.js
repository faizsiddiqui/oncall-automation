// Checks the alert and sends count to background
$(function() {
  chrome.storage.sync.get(default_options, options => {
    var port = chrome.runtime.connect({
      name: "OnCallKnocknock"
    });
    port.postMessage({
      data: "init"
    }); // Send Init Message to background :: to get victorops_tab_id
    var unacked_count = 0;
    setInterval(() => {
      unacked_count = $(".incident-filter--unacked").html().split("/")[0].replace("Triggered (", "");
      port.postMessage({
        data: unacked_count
      }); // Alert Counter to background.js
      if (parseInt(unacked_count, 10) > 0) {
        if (options.oncall_automation_status) {
          $.playSound(chrome.extension.getURL("/external/knock-knock.mp3"));
        }
      }
    }, parseInt(options.victorops_notification_frequency, 10) * 1000);
  });
});
