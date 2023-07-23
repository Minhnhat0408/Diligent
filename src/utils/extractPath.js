export function extractFilePathFromURL(url) {
    // Find the start and end index of the file path
    const startIndex = url.indexOf('/o/') + 3; // Add 3 to skip the "/o/" part
    const endIndex = url.indexOf('?alt=media&token=');
  
    // Extract the file path substring
    const filePath = url.substring(startIndex, endIndex);
  
    // Decode the URL-encoded string
    const decodedFilePath = decodeURIComponent(filePath);
  
    return decodedFilePath;
  }
  