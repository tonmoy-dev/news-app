import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

/**
 * Sanitizes a filename to be URL and filesystem friendly
 */
const sanitizeFileName = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-.]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

/**
 * Gets file extension from File object
 */
const getFileExtension = (file) => {
  return path.extname(file.name);
};

/**
 * Validates file type and size
 */
const validateFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload an image file.');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB.');
  }
};

/**
 * Saves a single image to the filesystem
 */
const saveImage = async ({
  file,
  fileName,
  prefix,
  savePath = 'public/assets/uploads'
}) => {
  try {
    // console.log(file, fileName, prefix, savePath);

    // Validate file
    validateFile(file);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate final filename
    const fileExtension = getFileExtension(file);
    const sanitizedName = sanitizeFileName(fileName);
    const finalFileName = prefix
      ? `${sanitizeFileName(prefix)}_${sanitizedName}${fileExtension}`
      : `${sanitizedName}${fileExtension}`;

    const fullPath = path.join(process.cwd(), savePath);

    // Save the file
    await writeFile(path.join(fullPath, finalFileName), buffer);

    // Return the relative path and filename]

    return {
      fileName: finalFileName,
      path: path.join(savePath, finalFileName).replace('public', '') // Remove 'public' for client-side usage
    };

  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const results = {};

    // Process each file in the formData
    for (const [key, value] of formData.entries()) {
      // Skip if it's not a file or if it's a config
      if (!(value instanceof File) || key.endsWith('_config')) continue;

      try {
        const configKey = `${key}_config`;
        const configString = formData.get(configKey);

        if (!configString) {
          throw new Error(`Configuration not found for ${key}`);
        }

        const config = JSON.parse(configString);
        const result = await saveImage({
          file: value,
          fileName: config.fileName,
          prefix: config.prefix,
          savePath: config.savePath
        });

        results[key] = {
          success: true,
          ...result
        };
      } catch (error) {
        results[key] = {
          success: false,
          error: error.message || 'Unknown error occurred'
        };
      }
    }

    return NextResponse.json({
      success: true,
      results
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Image upload failed',
      error: error.message || 'Unknown error occurred'
    });
  }
}