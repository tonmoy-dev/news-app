import imageCompression from 'browser-image-compression';

/**
 * Check if the file size exceeds the specified limit.
 * @param {File} file - The file to check.
 * @param {number} maxSize - The maximum allowed size in MB.
 * @returns {boolean} - True if file size is within limit, false otherwise.
 */
export const isFileSizeValid = (file, maxSize) => {
  return file.size <= maxSize * 1024 * 1024; // Convert MB to bytes
};

/**
 * Compress the image file.
 * @param {File} file - The image file to compress.
 * @param {number} maxSize - The maximum size in MB after compression.
 * @returns {Promise<File>} - The compressed image file.
 */
export const compressImage = async (file, maxSize) => {
  const options = {
    maxSizeMB: maxSize,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error; // Re-throw error for handling in the calling function
  }
};
