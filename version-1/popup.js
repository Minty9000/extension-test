chrome.runtime.sendMessage({ action: "checkProductPage" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error communicating with background script:", chrome.runtime.lastError.message);
      document.querySelector(".product-not-detected").style.display = "block";
      document.querySelector(".product-detected").style.display = "none";
      return;
    }
  
    if (response.isProductPage) {
      document.querySelector(".product-detected").style.display = "block";
      document.querySelector(".product-not-detected").style.display = "none";
    } else {
      document.querySelector(".product-detected").style.display = "none";
      document.querySelector(".product-not-detected").style.display = "block";
    }
  });
  document.getElementById('reload-button').addEventListener('click', () => {
    chrome.runtime.reload(); // Reloads the entire extension
  });
  document.addEventListener('DOMContentLoaded', () => {
    const imageElement = document.getElementById('product-image');
  
    // Fetch the stored image URL
    chrome.storage.local.get('productImage', (data) => {
      if (data.productImage) {
        imageElement.src = data.productImage;
      } else {
        imageElement.alt = 'No image found';
      }
    });
  });
    
  
  