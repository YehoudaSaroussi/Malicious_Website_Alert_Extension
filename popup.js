
document.addEventListener('DOMContentLoaded', function () {

    const proceedBtn = document.getElementById('proceedBtn');
  
    if (proceedBtn) {
      proceedBtn.addEventListener('click', function () {
        // User pressed "Proceed," continue to the website.
        window.close();
      });
    } else {
      console.error('Element with ID "proceedBtn" not found.');
    }


  document.getElementById('cancelBtn').addEventListener('click', function () {
    // User pressed "Cancel," close the current tab.
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.remove(tabs[0].id);
    });
  });
  
});
