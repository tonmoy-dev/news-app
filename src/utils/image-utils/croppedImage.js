
export function croppedImage(imageSrc, pixelCrop) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const scaleX = image.width / image.naturalWidth;
      const scaleY = image.height / image.naturalHeight;

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // Convert the canvas to a Blob
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' });
          resolve(croppedFile);
        } else {
          reject(new Error('Could not create cropped image file.'));
        }
      }, 'image/jpeg');
    };

    image.onerror = (error) => {
      reject(error);
    };
  });
};
