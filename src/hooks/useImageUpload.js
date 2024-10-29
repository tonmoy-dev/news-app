import { useState } from 'react';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImages = async (files, configs) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();

      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
          formData.append(`${key}_config`, JSON.stringify(configs[key]));
        }
      });

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Upload failed');
      }

      return result;
    } catch (err) {
      const message = err.message || 'Upload failed';
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImages, isUploading, error };
};