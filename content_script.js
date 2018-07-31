// Check and Send alert to background.js
$(function() {
  chrome.storage.sync.get(default_options, options => {
    // Opening port to communicate victorops tab and our extension (background.js)
    var port = chrome.runtime.connect({
      name: default_options.port_name
    });

    // Sends Init Message to background.js :: to get victorops_tab_id
    port.postMessage({
      data: "init"
    });

    // Sends Alert Count to background.js
    var unacked_count = 0;
    setInterval(() => {
      // Filtering the Triggered
      unacked_count = $(".incident-filter--unacked").html().split("/")[0].replace("Triggered (", "");
      // Alert Counter to background.js
      port.postMessage({
        data: unacked_count
      });
    }, parseInt(options.victorops_notification_frequency, 10) * 1000);

  });
});
