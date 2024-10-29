// components/ImageUploadField.js
import Image from 'next/image';
import { useCallback } from 'react';

export const ImageUploadField = ({
  label,
  fieldName,
  currentImage,
  previewUrl,
  onChange,
  error
}) => {
  const handleChange = useCallback((e) => {
    const file = e.target.files?.[0] || null;
    onChange(fieldName, file);
  }, [fieldName, onChange]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center space-x-4">
        {(previewUrl || currentImage) && (
          <div className="relative h-20 w-20">
            <Image
              src={previewUrl || currentImage || '/placeholder.png'}
              alt={label}
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        <input
          type="file"
          onChange={handleChange}
          accept="image/*"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
