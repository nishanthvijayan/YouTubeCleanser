// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const selectModeBtn = document.getElementById('selectModeBtn');
  const markNotRecommendedBtn = document.getElementById('markNotRecommendedBtn');
  const actionSection = document.getElementById('actionSection');
  const statusDiv = document.getElementById('status');

  selectModeBtn.addEventListener('click', () => {
    // Toggle selection mode on YouTube page
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0].url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleSelectionMode', enable: true}, (response) => {
          console.log(response.status);
          selectModeBtn.style.display = 'none';
          actionSection.style.display = 'block';
        });
      } else {
        alert('Please navigate to YouTube to use this extension.');
      }
    });
  });

  markNotRecommendedBtn.addEventListener('click', () => {
    // Get selected videos and mark them as not recommended
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'getSelectedVideos'}, (response) => {
        const videos = response.selectedVideos;
        if (videos.length === 0) {
          alert('No videos selected.');
          return;
        }
        chrome.tabs.sendMessage(tabs[0].id, {action: 'markAsNotRecommended', videos: videos}, () => {
          statusDiv.textContent = 'Marked ' + videos.length + ' videos as Not Recommended.';
          // Optionally, reset selection mode
          chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleSelectionMode', enable: false}, (resp) => {
            selectModeBtn.style.display = 'block';
            actionSection.style.display = 'none';
          });
        });
      });
    });
  });
});
