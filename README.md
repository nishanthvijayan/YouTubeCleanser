# YouTube Cleanser ✨

Ever watched a clip from "The Office" and suddenly your entire YouTube feed is nothing but Michale Scott? Or maybe you clicked on one conspiracy theory video out of curiosity, and now YouTube thinks you're ready to believe that Birds Are Not Real but a CIA surveillance mechanism? We've all been there, and it's annoying as hell.

Introducing YouTube Cleanser. It's a browser extension that helps you clean up your YouTube recommendations by easily marking multiple videos as "Not Interested". Think of it as spring cleaning for your YouTube feed, but you can do it anytime you want.

![CleanShot 2024-10-05 at 01 22 40@2x](https://github.com/user-attachments/assets/7372b9c8-2659-4335-a017-86c769d16453)

Warning: 99% of the code for this extension was written using Cursor, an AI-powered code editor. So if you plan on going through the code to understand or modify it manually, may God be with you.

## Features

- Adds a "Cleanse ✨" button to the YouTube navigation bar
- Allows you to select multiple videos in one shot
- Automatically marks selected videos as "Not Interested" with a single click

## How to Use

1. Install the extension in your browser
2. Navigate to YouTube
3. Click the "Cleanse ✨" button in the navigation bar to enter selection mode
4. Click on the checkboxes that appear on video thumbnails to select videos you're not interested in
5. Click "Remove 🗑️" to mark all selected videos as "Not Interested"

## Installation

1. Clone this repository or download the source code
2. Open your browser's extension management page:
   - Chrome: chrome://extensions
   - Firefox: about:addons
   - Edge: edge://extensions
3. Enable "Developer mode"
4. Click "Load unpacked" and select the directory containing the extension files

## Development

This extension is built using vanilla JavaScript, HTML, and CSS. The main files are:

- `manifest.json`: Extension configuration
- `content.js`: Main script that runs on YouTube pages
- `styles.css`: Styles for the extension UI elements

To modify the extension, edit these files and reload the extension in your browser.

## Browser Compatibility

Please note that this extension has only been tested in Google Chrome. While it may work in other browsers, its functionality is not guaranteed.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License
