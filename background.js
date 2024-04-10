
// List of malicious websites
const maliciousWebsites = ['https://he.wikipedia.org/wiki/78', 'https://en.wikipedia.org/wiki/78_(number)','https://www.google.com/search?q=dsj&rlz=1C1CHZN_iwIL973IL973&oq=dsj&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIPCAEQLhgKGMcBGNEDGIAEMgkIAhAAGAoYgAQyDwgDEC4YChivARjHARiABDIJCAQQABgKGIAEMgkIBRAAGAoYgAQyBwgGEAAYgAQyDQgHEC4YxwEY0QMYgAQyCQgIEAAYChiABNIBCDEyNjRqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8'];

// import { isMaliciousWebsite } from './maliciousWebsitesList';
// import maliciousWebsites from './maliciousWebsitesList';
// const maliciousWebsites = require('./maliciousWebsitesList').default;
// importScripts('./maliciousWebsitesList.js');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "checkMaliciousSite") {
      const urlToCheck = sender.tab.url;
      checkMaliciousSite(urlToCheck, function (isMalicious) {
        sendResponse({ isMalicious: isMalicious });
      });
      return true;  // Indicates that sendResponse will be called asynchronously.
    } else if (request.action === "closeCurrentTab") {
      // Close the current tab.
      chrome.tabs.remove(sender.tab.id);
      sendResponse();  // Sending an empty response as the operation is synchronous.
    }
  });
  
  function checkMaliciousSite(url, callback) {

    // Check against the list of malicious websites
    const isMaliciousFromList = maliciousWebsites.includes(url);

    // Replace 'YOUR_VIRUSTOTAL_API_KEY' with your actual VirusTotal API key
    const apiKey = '2c6c079ac22ecf0e389234d96f72d891cb4c8afd538fb3a0635934b196d64b52';
  
    const apiUrl = 'https://www.virustotal.com/api/v3/urls';
  
    const options = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-apikey': apiKey,
      },
      body: JSON.stringify({
        "url": url
      }),
    };
  
    fetch(apiUrl, options)
      .then(response => response.json())
      .then(data => {
        // console.log('Data from VirusTotal API:', data);
        const isMalicious = data && data.data && data.data.attributes.last_analysis_stats.malicious > 0;
        // console.log('Is malicious:', isMalicious);
        callback(isMalicious || isMaliciousFromList);
      })
      .catch(error => {
        console.error('Error checking against VirusTotal API:', error);
        // Handle the error gracefully, as the tab might be closed.
        if (error.name === 'AbortError') {
          console.log('Request aborted (likely due to tab closure).');
        } else {
          // Assume not malicious in case of an error.
          callback(false);
        }
      });
  }
