var settings = {
    access: false,
    options: {
        positioning: 'relative',
        behavior: 'smooth',
        inverted: false,
        length: 300
    }
}

// Save it using the Chrome extension storage API.
chrome.storage.sync.set(settings, function() {
    console.log('WR: Settings saved', settings);
});

// Read it using the storage API
// chrome.storage.sync.get(['access', 'options'], function(items) {
//     console.log('Settings retrieved', items);
// });