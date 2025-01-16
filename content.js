(() => {
    // Send a message to the background script to check the product page
document.addEventListener('DOMContentLoaded', () => {
chrome.runtime.sendMessage({ action: "checkProductPage" }, (response) => {
    if (response && response.isProductPage) {
        document.querySelector('.product-detected').style.display = 'block';
        document.querySelector('.product-not-detected').style.display = 'none';
        scrapeLargestRenderedImage();
    } else {
        document.querySelector('.product-detected').style.display = 'none';
        document.querySelector('.product-not-detected').style.display = 'block';
    }
});
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'scrape') {
      scrapeLargestRenderedImage();
      sendResponse({ status: 'Scraping completed.' });
    }
  });
})();
  // Function to scrape the biggest image within the product wrapper
  function scrapeLargestRenderedImage() {
    console.log('Starting to scrape the largest rendered image...');
    const images = document.querySelectorAll('img'); // Select all images on the page

    if (images.length === 0) {
        console.error('No images found on the page.');
        chrome.runtime.sendMessage({ action: 'updateImage', imageUrl: null });
        return;
    }

    console.log('Total images found:', images);

    let largestImage = null;
    let maxArea = 0;

    images.forEach((img) => {
        const width = img.offsetWidth; // Rendered width of the image
        const height = img.offsetHeight; // Rendered height of the image
        const area = width * height;

        if (area > maxArea) {
            maxArea = area;
            largestImage = img;
        }
    });

    if (largestImage && largestImage.src) {
        console.log('Largest rendered image found:', largestImage.src, `Area: ${maxArea}`);
        chrome.runtime.sendMessage({ action: 'updateImage', imageUrl: largestImage.src });
    } else {
        console.error('No valid rendered image found.');
        chrome.runtime.sendMessage({ action: 'updateImage', imageUrl: null });
    }

    console.log('Scrape completed.');
}