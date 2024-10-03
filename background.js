// background.js

chrome.action.onClicked.addListener((tab) => {
  // When the toolbar icon is clicked, toggle selection mode
  chrome.tabs.sendMessage(tab.id, {action: 'toggleSelectionMode', enable: true});
});
