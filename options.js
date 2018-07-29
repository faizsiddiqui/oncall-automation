// Initialize Material Design lib
mdc.autoInit();

// Restore options
$(() => {
  chrome.storage.sync.get(default_options, options => {
    $("#victorops_notification_frequency").val(options.victorops_notification_frequency);
  });
});

// Save options
$("#save").on("click", () => {
  var victoropsNotificationFrequency = $("#victorops_notification_frequency").val();
  chrome.storage.sync.set({
    victorops_notification_frequency: victoropsNotificationFrequency
  }, () => {
    // Reload matching tab
    var status = $("#save-status");
    status.text("Options saved.");
    setTimeout(() => {
      status.text("");
      chrome.storage.sync.get(default_options, options => {
        chrome.tabs.reload(options.victorops_tab_id);
      });
    }, 750);
  });

});
