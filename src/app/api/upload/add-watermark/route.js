import { NextResponse } from 'next/server';
import sharp from 'sharp';

export const POST = async (req) => {
  try {
    // Parse the form data
    const formData = await req.formData();
    const thumbnailFile = formData.get('thumbnail');
    const watermarkFile = formData.get('watermark');
    const bottom = parseInt(formData.get('bottom') || 10);
    const right = parseInt(formData.get('right') || 10);
    const watermarkWidth = parseInt(formData.get('watermarkWidth') || 100);

    // Get the original filename of the thumbnail
    const originalFilename = thumbnailFile.name; // Extract the original filename

    // Convert the uploaded files to Buffer
    const thumbnailBuffer = await thumbnailFile.arrayBuffer().then(buffer => Buffer.from(buffer));
    const watermarkBuffer = await watermarkFile.arrayBuffer().then(buffer => Buffer.from(buffer));

    // Resize the watermark to the fixed width (keeping aspect ratio)
    const resizedWatermarkBuffer = await sharp(watermarkBuffer)
      .resize({ width: watermarkWidth })
      .toBuffer();

    // Get metadata (dimensions) of the images
    const thumbnailMetadata = await sharp(thumbnailBuffer).metadata();
    const watermarkMetadata = await sharp(resizedWatermarkBuffer).metadata();

    // Calculate left and top based on thumbnail dimensions and watermark dimensions
    const left = thumbnailMetadata.width - watermarkMetadata.width - right;
    const top = thumbnailMetadata.height - watermarkMetadata.height - bottom;

    const safeLeft = Math.max(0, left);
    const safeTop = Math.max(0, top);

    // Create the watermarked image
    const watermarkedImageBuffer = await sharp(thumbnailBuffer)
      .composite([
        {
          input: resizedWatermarkBuffer,
          left: safeLeft,
          top: safeTop,
        },
      ])
      .toBuffer();

    // Send the image buffer back as binary response
    return new NextResponse(watermarkedImageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="${originalFilename}.jpg"`,
      },
    });
  } catch (error) {
    console.error('Error processing the images:', error);
    return NextResponse.json({ error: 'Failed to process images' }, { status: 500 });
  }
};
