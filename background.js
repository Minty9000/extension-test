chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkProductPage") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.url) {
        const url = tab.url;

        // Example: More specific URL checks
        const isProductPage =
          url.includes("product") || // Generic check
          url.includes("/dp/") || // Amazon product page
          url.includes("/itm/") || // eBay product page
          url.includes("/products/") ||
          url.includes("/p/"); // Shopify-based product page
        console.log('URL:', url, 'Is Product Page:', isProductPage);
        chrome.tabs.onActivated.addListener((activeInfo) => {
          chrome.tabs.sendMessage(activeInfo.tabId, { action: 'scrape' }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error sending message to content script:', chrome.runtime.lastError.message);
            } else {
              console.log('Response from content script:', response);
            }
          });
        });
        
        // Listen for tab updates
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
          if (changeInfo.status === 'complete') {
            chrome.tabs.sendMessage(tabId, { action: 'scrape' }, (response) => {
              if (chrome.runtime.lastError) {
                console.error('Error sending message to content script:', chrome.runtime.lastError.message);
              } else {
                console.log('Response from content script:', response);
              }
            });
          }
        });
        sendResponse({ isProductPage });
        return true;
      } 
      else {
        console.log("No active tab or URL found:",url);
        sendResponse({ isProductPage: false });
      }
    });
    return true;
  }
  if (message.action === "updateImage" && message.imageUrl) {
    // Store the image URL in local storage
    chrome.storage.local.set({ productImage: message.imageUrl }, () => {
      console.log("Image URL stored:", message.imageUrl);
    });
  }
});
// background.js

// Listen for tab switching
