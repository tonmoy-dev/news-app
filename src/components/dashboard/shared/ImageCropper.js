'use client';

import React, { useState } from 'react';
import { Upload, Button, Modal, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Cropper from 'react-easy-crop';
import { croppedImage } from '@/utils/image-utils/croppedImage';

const ImageCropper = ({ onImageUpload, maxImgWidth, maxImgHeight, fieldName }) => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null); // To store the actual file
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropArea, setCropArea] = useState(null);
  const [showCropperModal, setShowCropperModal] = useState(false);
  const [showCropConfirmation, setShowCropConfirmation] = useState(false);

  const handleChange = (info) => {
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setFile(info.file.originFileObj); // Save the actual file
        setShowCropConfirmation(true);
      };
      reader.readAsDataURL(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error('Image upload failed.');
    }
  };

  const handleCropComplete = async (croppedArea, croppedAreaPixels) => {
    setCropArea(croppedAreaPixels);
  };

  const cropImage = async () => {
    if (image && cropArea) {
      const croppedImageFile = await croppedImage(image, cropArea);
      onImageUpload(file, croppedImageFile, fieldName);
      setShowCropperModal(false);
    } else {
      message.error('Please select a crop area before cropping.');
    }
  };

  const handleConfirmation = (shouldCrop) => {
    setShowCropConfirmation(false);
    if (shouldCrop) {
      setShowCropperModal(true);
    } else {
      onImageUpload(file, null, fieldName); // Send only the actual image file to the parent
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <Upload
        // action="/api/upload" // Replace with your upload endpoint
        listType="picture-card"
        onChange={handleChange}
        showUploadList={false}
        accept="image/*"
      >
        + Upload
        {/* {image ? (
          <img src={image} alt="Uploaded" style={{ width: '100%', height: 'auto' }} />
        ) : (
          '+ Upload'
        )} */}
      </Upload>
      <Modal
        title="Image Cropper!"
        centered
        open={showCropConfirmation}
        onCancel={() => setShowCropConfirmation(false)}
        footer={[
          <Button key="no" onClick={() => handleConfirmation(false)}>
            No
          </Button>,
          <Button key="yes" type="primary" onClick={() => handleConfirmation(true)}>
            Yes
          </Button>,
        ]}
      >
        <p>Do you want to crop this image?</p>
      </Modal>

      <Modal
        title="Crop Image"
        centered
        open={showCropperModal}
        onCancel={() => setShowCropperModal(false)}
        footer={[
          <Button key="crop" type="primary" onClick={cropImage}>
            OK
          </Button>,
        ]}
      >
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
          {/* // Update the Cropper component to enforce a fixed aspect ratio */}
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={maxImgWidth / maxImgHeight} // Set fixed aspect ratio of 500:300
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            cropShape="rect"
            objectFit="horizontal-cover"
            style={{ background: 'white' }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ImageCropper;