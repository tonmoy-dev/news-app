'use client';

import { ImageUploadField } from '@/components/ImageUploadField';
import { useImageUpload } from '@/hooks/useImageUpload';
import { siteSettingsImageConfigs } from '@/lib/imageConfigs';
import { useState } from 'react';

export default function SiteSettings() {
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [updateStatus, setUpdateStatus] = useState(null);

  const { uploadImages, isUploading, error: uploadError } = useImageUpload();

  const handleImageChange = (fieldName, file) => {
    setFiles(prev => ({ ...prev, [fieldName]: file }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, [fieldName]: previewUrl }));
    } else {
      setPreviews(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[fieldName];
        return newPreviews;
      });
    }
  };

  // console.log(files);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateStatus(null);

    try {
      // Filter out null files and create upload payload
      const uploadFiles = {};
      Object.entries(files).forEach(([key, file]) => {
        if (file) uploadFiles[key] = file;
      });

      if (Object.keys(uploadFiles).length === 0) {
        return; // No files to upload
      }
      console.log(uploadFiles);

      const result = await uploadImages(files, siteSettingsImageConfigs);
      // const result = await uploadImages(uploadFiles, siteSettingsImageConfigs);
      console.log(result);
      setUpdateStatus(result);

      // Clean up previews
      Object.values(previews).forEach(URL.revokeObjectURL);
      setPreviews({});
      setFiles({});
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Site Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ImageUploadField
          label="Header Image"
          fieldName="headerImage"
          previewUrl={previews.headerImage}
          currentImage="/current-header.jpg"
          onChange={handleImageChange}
        />

        <ImageUploadField
          label="Footer Image"
          fieldName="footerImage"
          previewUrl={previews.footerImage}
          currentImage="/current-footer.jpg"
          onChange={handleImageChange}
        />

        <ImageUploadField
          label="Favicon"
          fieldName="favicon"
          previewUrl={previews.favicon}
          currentImage="/favicon.ico"
          onChange={handleImageChange}
        />

        <ImageUploadField
          label="Watermark"
          fieldName="watermark"
          previewUrl={previews.watermark}
          currentImage="/current-watermark.png"
          onChange={handleImageChange}
        />

        <ImageUploadField
          label="Site Loader"
          fieldName="siteLoader"
          previewUrl={previews.siteLoader}
          currentImage="/current-loader.gif"
          onChange={handleImageChange}
        />

        <ImageUploadField
          label="Ads Banner"
          fieldName="adsBanner"
          previewUrl={previews.adsBanner}
          currentImage="/current-banner.jpg"
          onChange={handleImageChange}
        />

        {uploadError && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md">
            {uploadError}
          </div>
        )}

        {updateStatus?.success && (
          <div className="bg-green-50 text-green-500 p-4 rounded-md">
            Images updated successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading || Object.keys(files).length === 0}
          className={`px-4 py-2 rounded-md text-white
            ${isUploading || Object.keys(files).length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
            }`}
        >
          {isUploading ? 'Uploading...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}