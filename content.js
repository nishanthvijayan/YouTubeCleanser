// content.js

let selectionMode = false;
let selectedVideos = new Set();
let markedVideos = new Set();

// Function to toggle selection mode
function toggleSelectionMode(enable) {
  selectionMode = enable;
  if (enable) {
    document.body.classList.add('selection-mode');
    // Inject selection buttons into existing videos
    injectSelectionButtons();
    // Observe for new videos added to the DOM
    observeNewVideos();
  } else {
    document.body.classList.remove('selection-mode');
    // Remove selection buttons
    removeSelectionButtons();
    // Disconnect the observer
    if (observer) observer.disconnect();
    selectedVideos.clear();
    updateSelectionVisuals();
  }
}

// Function to inject selection buttons into video thumbnails
function injectSelectionButtons() {
  const videoThumbnails = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer');
  videoThumbnails.forEach(thumbnail => {
    const videoId = getVideoId(thumbnail);
    // Avoid injecting buttons for already marked videos
    if (!thumbnail.querySelector('.selection-button') && !markedVideos.has(videoId)) {
      const button = document.createElement('button');
      button.className = 'selection-button';
      button.title = 'Select this video for removal';
      button.innerHTML = '&times;'; // Cross symbol for delete icon
      // Style the button (additional styles are in styles.css)
      thumbnail.style.position = 'relative'; // Ensure positioning context
      button.style.position = 'absolute';
      button.style.bottom = '10px';
      button.style.right = '10px';
      button.style.zIndex = '10';
      button.style.background = 'rgba(255, 0, 0, 0.8)'; // Red background
      button.style.color = 'white'; // White color for the cross
      button.style.border = 'none';
      button.style.borderRadius = '50%';
      button.style.width = '32px';
      button.style.height = '32px';
      button.style.cursor = 'pointer';
      button.style.display = 'none'; // Hidden by default
      button.style.fontSize = '24px';

      // Show the button only in selection mode
      if (selectionMode) {
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
      }

      // Attach click event listener
      button.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent triggering other click events
        toggleVideoSelection(thumbnail);
      });

      thumbnail.appendChild(button);
    }
  });
}

// Function to toggle video selection
function toggleVideoSelection(thumbnail) {
  const videoId = getVideoId(thumbnail);
  if (!videoId) return;

  if (selectedVideos.has(videoId)) {
    selectedVideos.delete(videoId);
    thumbnail.classList.remove('selected');
    thumbnail.querySelector('.selection-button').style.background = 'rgba(255, 0, 0, 0.8)';
  } else {
    selectedVideos.add(videoId);
    thumbnail.classList.add('selected');
    thumbnail.querySelector('.selection-button').style.background = 'rgba(0, 255, 0, 0.8)'; // Change to green when selected
  }
}

// Function to mark videos as "Not Recommended"
async function markAsNotRecommended(videos) {
  for (const videoId of videos) {
    const videoThumbnail = findVideoThumbnailById(videoId);
    if (videoThumbnail) {
      // Simulate opening the options menu
      await simulateClickEvent(videoThumbnail);
      // Simulate clicking "Not interested"
      await simulateClickNotInterested();
      // Remove the selection button and add to markedVideos set
      const button = videoThumbnail.querySelector('.selection-button');
      if (button) button.remove();
      markedVideos.add(videoId);
      selectedVideos.delete(videoId);
      videoThumbnail.classList.remove('selected');
      // Optionally, wait a bit to avoid overwhelming the browser
      await delay(500);
    }
  }
  updateSelectionVisuals();
}

// Update visuals based on selection
function updateSelectionVisuals() {
  const videoThumbnails = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer');
  videoThumbnails.forEach(thumbnail => {
    const videoId = getVideoId(thumbnail);
    if (videoId) {
      if (markedVideos.has(videoId)) {
        const button = thumbnail.querySelector('.selection-button');
        if (button) button.remove();
        thumbnail.classList.remove('selected');
      } else if (selectedVideos.has(videoId)) {
        thumbnail.classList.add('selected');
        const button = thumbnail.querySelector('.selection-button');
        if (button) button.style.background = 'rgba(0, 255, 0, 0.8)';
      } else {
        thumbnail.classList.remove('selected');
        const button = thumbnail.querySelector('.selection-button');
        if (button) button.style.background = 'rgba(255, 0, 0, 0.8)';
      }
    }
  });
}

// Function to get video ID or unique identifier
function getVideoId(thumbnail) {
  // Attempt to extract video ID from the thumbnail link
  const link = thumbnail.querySelector('a#thumbnail');
  if (link && link.href) {
    const url = new URL(link.href);
    return url.searchParams.get('v') || link.href;
  }
  return null;
}

// Observe dynamically added videos
let observer;
function observeNewVideos() {
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        injectSelectionButtons();
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}



// Helper function to find video thumbnail by ID
function findVideoThumbnailById(videoId) {
  const videoThumbnails = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer');
  for (const thumbnail of videoThumbnails) {
    if (getVideoId(thumbnail) === videoId) {
      return thumbnail;
    }
  }
  return null;
}

// Simulate the first click event (options menu)
function simulateClickEvent(videoThumbnail) {
  return new Promise((resolve) => {
    // Define possible aria-labels for the Options button
    const possibleAriaLabels = [
      'Action menu',
      'Options',
      'More actions',
      'More options',
      'Action Menu', // Case variations
      'Options Menu'
      // Add more as needed based on inspection
    ];

    // Attempt to find the Options button using the possible aria-labels
    let optionsButton = null;
    for (const label of possibleAriaLabels) {
      optionsButton = videoThumbnail.querySelector(`button[aria-label="${label}"]`);
      if (optionsButton) break;
    }

    if (!optionsButton) {
      // Try a more flexible approach: find any button with an aria-label containing "action" or "options"
      optionsButton = Array.from(videoThumbnail.querySelectorAll('button'))
        .find(btn => {
          const ariaLabel = btn.getAttribute('aria-label');
          return ariaLabel && (
            ariaLabel.toLowerCase().includes('action') ||
            ariaLabel.toLowerCase().includes('option')
          );
        });
    }

    if (optionsButton) {
      optionsButton.click();
      resolve(true);
    } else {
      // Attempt to retrieve the video title for better logging
      const videoTitleElement = videoThumbnail.querySelector('#video-title');
      const videoTitle = videoTitleElement ? videoTitleElement.textContent.trim() : 'Unknown Title';
      console.warn(`Options button not found for video: "${videoTitle}"`);
      resolve(false);
    }
  });
}

// Simulate clicking "Not interested"
function simulateClickNotInterested() {
  return new Promise((resolve) => {
    // Wait for the menu to appear
    setTimeout(() => {
      const notInterestedButton = Array.from(document.querySelectorAll('yt-formatted-string'))
        .find(el => el.textContent.trim() === 'Not interested');
      if (notInterestedButton) {
        notInterestedButton.click();
      } else {
        console.warn('"Not interested" button not found.');
      }
      resolve();
    }, 1000); // Adjust timeout as necessary
  });
}

// Utility delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleSelectionMode') {
    toggleSelectionMode(request.enable);
    sendResponse({status: 'Selection mode ' + (request.enable ? 'enabled' : 'disabled')});
  } else if (request.action === 'getSelectedVideos') {
    sendResponse({selectedVideos: Array.from(selectedVideos)});
  } else if (request.action === 'markAsNotRecommended') {
    markAsNotRecommended(request.videos).then(() => {
      sendResponse({status: 'Marked as Not Recommended'});
    });
    return true; // Indicates that the response is asynchronous
  }
});
