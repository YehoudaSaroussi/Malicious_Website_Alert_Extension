
chrome.runtime.sendMessage({ action: "checkMaliciousSite" }, function (response) {
    try {
        if (chrome.runtime.lastError) {
            console.error('Error in sending message:', chrome.runtime.lastError);
            return;
        }

        if (response && response.isMalicious) {
            if (confirm("This website is known to be malicious. Do you want to proceed?")) {
                // User pressed "OK," continue to the website.
            } else {
                // User pressed "Cancel," send a message to background.js to close the current tab.
                chrome.runtime.sendMessage({ action: "closeCurrentTab" });
            }
        }
    } catch (error) {
        console.error('Error handling response:', error);
    }
});
