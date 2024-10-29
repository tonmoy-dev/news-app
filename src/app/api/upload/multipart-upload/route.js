import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  const data = await request.formData();

  const originalFile = data.get('watermarked');
  const largeFile = data.get('large');
  const mediumFile = data.get('medium');
  const smallFile = data.get('small');

  if (!originalFile || !largeFile || !mediumFile || !smallFile) {
    return NextResponse.json({ success: false, message: 'Some files are missing' });
  }

  try {
    // Save all images with custom names
    const originalFilename = await saveFile(originalFile, 'watermarked');
    const largeFilename = await saveFile(largeFile, 'large');
    const mediumFilename = await saveFile(mediumFile, 'medium');
    const smallFilename = await saveFile(smallFile, 'small');

    // Return an object with all filenames
    return NextResponse.json({
      success: true,
      filenames: {
        original: originalFilename,
        large: largeFilename,
        medium: mediumFilename,
        small: smallFilename,
      },
    });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ success: false, message: 'Image upload failed', error });
  }
}

// Helper function to save an image to the filesystem
const saveFile = async (file, label) => {
  if (!file) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${label}_${file.name.replaceAll(" ", "_")}`;
  // const filename = `${prefix}_${file.name}`;

  await writeFile(
    path.join(process.cwd(), 'public/assets/images', filename),
    buffer
  );
  return filename;
};
