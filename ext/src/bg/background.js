// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

// Open welcome/options on install
chrome.runtime.onInstalled.addListener((details) => {
  debugger;
  if (details.reason.search(/install/g) === -1) {
      return
  }
  chrome.tabs.create({
      url: chrome.runtime.getURL("src/options/options.html"),
      active: true
  })
})