"use client"
// https://picsum.photos/200/300

import { compressImage, isFileSizeValid } from '@/utils/image-utils/compressImage';
import { Button, Card, Form, Image, Input } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ImageCropper from '../shared/ImageCropper';

const AllSettings = () => {
  const router = useRouter();
  const [images, setImages] = useState({
    headerLogoImg: { name: "", originalFile: null, originalFileSize: "", croppedFile: null, croppedFileSize: "", filePath: "" },
    footerLogoImg: { name: "", originalFile: null, originalFileSize: "", croppedFile: null, croppedFileSize: "", filePath: "" },
    faviconImg: { name: "", originalFile: null, originalFileSize: "", croppedFile: null, croppedFileSize: "", filePath: "" },
    bannerAdsImg: { name: "", originalFle: null, foriginalFleSize: "", croppedFile: null, croppedFileSize: "", filePath: "" },
    siteLoaderImg: { name: "", originalFile: null, originalFileSize: "", croppedFile: null, croppedFileSize: "", filePath: "" },
    watermarkImg: { name: "", originalFile: null, originalFileSize: "", croppedFile: null, croppedFileSize: "", filePath: "" }
  });
  const [fileName, setFileName] = useState("");
  const [isImagesExists, setIsImagesExists] = useState(false);

  // Update reporter status 
  async function updateSiteSettings(data) {
    try {
      // Axios PATCH request
      const response = await axios.patch(`${process.env.AUTH_URL}/api/site-settings`, data);

      if (response.status === 200) {

        // router.push('/');
      } else {

      }
    } catch (error) {
      console.error('Error updating in site settings:', error);
    } finally { }
  }

  const handleImageUpload = async (originalFile, croppedFile, fieldName) => {
    setIsImagesExists(true);

    // Calculate the original file size
    const originalFileSize = `${(originalFile.size / 1024 / 1024).toFixed(2)} MB`;

    // Check if the cropped image file is not null
    if (croppedFile) {
      // Calculate the cropped file size
      const croppedFileSize = `${(croppedFile.size / 1024 / 1024).toFixed(2)} MB`;

      // Check if the cropped image file size is larger than 2MB
      if (!isFileSizeValid(croppedFile, 2)) {


        // Compress the cropped image if it exceeds 2MB
        const compressedFile = await compressImage(croppedFile, 1); // Compress to max size of 1MB

        // Set the compressed image and log its size
        const compressedFileSize = `${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`;

        setImages((prevImages) => ({
          ...prevImages,
          [fieldName]: {
            ...prevImages[fieldName],
            name: originalFile.name,
            originalFile: originalFile,
            originalFileSize: originalFileSize,
            croppedFile: compressedFile,
            croppedFileSize: compressedFileSize
          },
        }));
        // 
      } else {
        setImages((prevImages) => ({
          ...prevImages,
          [fieldName]: {
            ...prevImages[fieldName],
            name: originalFile.name,
            originalFile: originalFile,
            originalFileSize: originalFileSize,
            croppedFile: croppedFile,
            croppedFileSize: croppedFileSize
          },
        }));
      }
    } else {
      setImages((prevImages) => ({
        ...prevImages,
        [fieldName]: {
          ...prevImages[fieldName],
          name: originalFile.name,
          originalFile: originalFile,
          originalFileSize: originalFileSize,
          croppedFile: null,
          croppedFileSize: ""
        },
      }));
    }
  };

  // image upload to local 
  const uploadImgToServer = async (values) => {
    const formData = new FormData();
    let filesExist = false; // Track if any file exists

    // Loop through each image field and append its file and fileName to the form data
    for (const [fieldName, data] of Object.entries(images)) {
      const fileToUpload = data.croppedFile || data.originalFile; // Choose croppedFile if it exists, otherwise originalFile

      if (fileToUpload) {  // Only append if the file is not null
        formData.append(fieldName, fileToUpload); // Append the chosen file
        formData.append(`${fieldName}_fileName`, data.name); // Append the corresponding file name
        filesExist = true; // At least one file exists
      }
    }
    // If no files are selected, return without making a request
    if (!filesExist) {

      return;
    }

    try {
      const response = await axios.post('/api/upload/multiple-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        const { uploadedFiles } = response.data;
        // 

        const updatedImages = { ...images };

        // Loop through the uploadedFiles array and update only filePath
        uploadedFiles.forEach(({ fieldName, fileName }) => {
          if (updatedImages[fieldName]) {
            updatedImages[fieldName] = {
              ...updatedImages[fieldName], // Spread the existing properties
              filePath: fileName // Update only filePath
            };
          }
        });
        setImages(updatedImages);

        toast.success('Images uploaded to server successfully!');
        // data sending to server
        const formData = {
          ...values,
          ...(uploadedFiles.some(file => file.fieldName === "headerLogoImg") && { header_logo_img: images.headerLogoImg.filePath }),
          ...(uploadedFiles.some(file => file.fieldName === "footerLogoImg") && { footer_logo_img: images.footerLogoImg.filePath }),
          ...(uploadedFiles.some(file => file.fieldName === "faviconImg") && { favicon_img: images.faviconImg.filePath }),
          ...(uploadedFiles.some(file => file.fieldName === "bannerImg") && { banner_ads_img: images.bannerImg.filePath }),
          ...(uploadedFiles.some(file => file.fieldName === "siteLoaderImg") && { site_loader_img: images.siteLoaderImg.filePath }),
          ...(uploadedFiles.some(file => file.fieldName === "watermarkImg") && { watermark_img: images.watermarkImg.filePath }),
        };

        toast.promise(
          updateSiteSettings(formData),
          {
            loading: 'Updating site settings...',
            success: <b>Site settings is updated!</b>,
            error: <b>Could not updated.</b>,
          }
        );

      }
    } catch (err) {
      toast.error('Failed to upload images to server');
      console.error(err);
    }
  };

  // Handlers for form submission
  const handleFormSubmit = (values) => {
    if (isImagesExists) {


      uploadImgToServer(values);
    } else {

      // data sending to server
      toast.promise(
        updateSiteSettings(values),
        {
          loading: 'Updating site settings...',
          success: <b>Site settings is updated!</b>,
          error: <b>Could not updated.</b>,
        }
      );
    }
  };

  return (
    <>
      {/* Logo Settings Form */}
      <Card title="Logo & Other Settings" bordered>
        <Form layout="vertical" onFinish={handleFormSubmit}>
          {/* Header logo */}
          <Form.Item label="Header Logo" name="header_logo_img">
            <div className='grid grid-cols-3 gap-5 justify-items-start'>
              <div>
                <ImageCropper maxImgHeight={70} maxImgWidth={200} onImageUpload={handleImageUpload} fieldName={"headerLogoImg"} />
                <p className='mt-1'>Image (400x70 pixels)</p>
              </div>
              {images?.headerLogoImg?.originalFile && (
                <div >
                  <Image
                    src={URL.createObjectURL(images?.headerLogoImg?.originalFile)}
                    alt="Original"
                    width={100} // Set width for Ant Design Image
                    height={100} // Adjust height based on your needs
                    style={{ objectFit: 'contain' }}
                    className='border border-1 rounded-lg'
                  />
                  <p>Original Image ({images?.headerLogoImg?.originalFileSize})</p>
                </div>
              )}

              {images?.headerLogoImg?.croppedFile && (
                <div>
                  <Image
                    src={URL.createObjectURL(images?.headerLogoImg?.croppedFile)}
                    alt="Cropped"
                    width={100} // Set width for Ant Design Image
                    height={100} // Adjust height based on your needs
                    style={{ objectFit: 'contain' }}
                    className='border border-1 rounded-lg'
                  />
                  <p>Cropped Image ({images?.headerLogoImg?.croppedFileSize})</p>
                </div>
              )}
            </div>
          </Form.Item>
          {/* Footer logo */}
          <Form.Item label="Footer Logo" name="footer_logo_img">
            <div className='grid grid-cols-3 gap-5 justify-items-start'>
              <div>
                <ImageCropper maxImgHeight={50} maxImgWidth={200} onImageUpload={handleImageUpload} fieldName={"footerLogoImg"} />
                <p className='mt-1'>Image (300x50 pixels)</p>
              </div>
              {images?.footerLogoImg?.originalFile && (
                <div >
                  <Image
                    src={URL.createObjectURL(images?.footerLogoImg?.originalFile)}
                    alt="Original"
                    width={100} // Set width for Ant Design Image
                    height={100} // Adjust height based on your needs
                    style={{ objectFit: 'contain' }}
                    className='border border-1 rounded-lg'
                  />
                  <p>Original Image ({images?.footerLogoImg?.originalFileSize})</p>
                </div>
              )}

              {images?.footerLogoImg?.croppedFile && (
                <div>
                  <Image
                    src={URL.createObjectURL(images?.footerLogoImg?.croppedFile)}
                    alt="Cropped"
                    width={100} // Set width for Ant Design Image
                    height={100} // Adjust height based on your needs
                    style={{ objectFit: 'contain' }}
                    className='border border-1 rounded-lg'
                  />
                  <p>Cropped Image ({images?.footerLogoImg?.croppedFileSize})</p>
                </div>
              )}
            </div>
          </Form.Item>
          {/* Logo alt text */}
          <Form.Item label="Logo Alt Text" name="logo_alt" rules={[{ required: false, message: 'Please enter the alt text for the logo' }]}>
            <Input placeholder="Enter logo alt text" />
          </Form.Item>
          {/* Favicon image */}
          <Form.Item label="Favicon Image " name="favicon_img">
            <div className='grid grid-cols-3 gap-5 justify-items-start'>
              <div>
                <ImageCropper maxImgHeight={50} maxImgWidth={50} onImageUpload={handleImageUpload} fieldName={"faviconImg"} />
                <p className='mt-1'>Image (50x50 pixels)</p>
              </div>
              {images?.faviconImg?.originalFile && (
                <div >
                  <Image
                    src={URL.createObjectURL(images?.faviconImg?.originalFile)}
                    alt="Original"
                    width={100} // Set width for Ant Design Image
                    height={100} // Adjust height based on your needs
                    style={{ objectFit: 'contain' }}
                    className='border border-1 rounded-lg'
                  />
                  <p>Original Image ({images?.faviconImg?.originalFileSize})</p>
                </div>
              )}

              {images?.faviconImg?.croppedFile && (
                <div>
                  <Image
                    src={URL.createObjectURL(images?.faviconImg?.croppedFile)}
                    alt="Cropped"
                    width={100} // Set width for Ant Design Image
                    height={100} // Adjust height based on your needs
                    style={{ objectFit: 'contain' }}
                    className='border border-1 rounded-lg'
                  />
                  <p>Cropped Image ({images?.faviconImg?.croppedFileSize})</p>
                </div>
              )}
            </div>
          </Form.Item>
          {/* Favicon image alt text */}
          <Form.Item label="Favicon Alt Text" name="favicon_alt" rules={[{ required: false, message: 'Please enter the alt text for the favicon' }]}>
            <Input placeholder="Enter favicon alt text" />
          </Form.Item>
          {/* watermark image for posts */}
          <Form.Item label="Watermark Image" name="watermark_img">
            <div className='grid grid-cols-3 gap-5 justify-items-start'>
              <div>
                <ImageCropper maxImgHeight={50} maxImgWidth={200} onImageUpload={handleImageUpload} fieldName={"watermarkImg"} />
                <p className='mt-1'>Image (200x50 pixels)</p>
              </div>
              {images?.watermarkImg?.originalFile && (
                <div >
                  <Image
                    src={URL.createObjectURL(images?.watermarkImg?.originalFile)}
                    alt="Original"
                    width={100} // Set width for Ant Design Image
                    height={100} // Adjust height based on your needs
                    style={{ objectFit: 'contain' }}
                    className='border border-1 rounded-lg'
                  />
                  <p>Original Image ({images?.watermarkImg?.originalFileSize})</p>
                </div>
              )}

              {images?.watermarkImg?.croppedFile && (
                <div>
                  <Image
                    src={URL.createObjectURL(images?.watermarkImg?.croppedFile)}
                    alt="Cropped"
                    width={100} // Set width for Ant Design Image
                    height={100} // Adjust height based on your needs
                    style={{ objectFit: 'contain' }}
                    className='border border-1 rounded-lg'
                  />
                  <p>Cropped Image ({images?.watermarkImg?.croppedFileSize})</p>
                </div>
              )}
            </div>
          </Form.Item>
          {/* Site loader */}
          <Form.Item label="Site Loader" name="site_loader_img">
            <div className='grid grid-cols-3 gap-5 justify-items-start'>
              <div>
                <ImageCropper maxImgHeight={50} maxImgWidth={100} onImageUpload={handleImageUpload} fieldName={"siteLoaderImg"} />
                <p className='mt-1'>Image (100x50 pixels)</p>
              </div>
              {images?.siteLoaderImg?.originalFile && (
                <div >
                  <Image
                    src={URL.createObjectURL(images?.siteLoaderImg?.originalFile)}
                    alt="Original"
                    width={100} // Set width for Ant Design Image
                    height={100} // Adjust height based on your needs
                    style={{ objectFit: 'contain' }}
                    className='border border-1 rounded-lg'
                  />
                  <p>Original Image ({images?.siteLoaderImg?.originalFileSize})</p>
                </div>
              )}

              {images?.siteLoaderImg?.croppedFile && (
                <div>
                  <Image
                    src={URL.createObjectURL(images?.siteLoaderImg?.croppedFile)}
                    alt="Cropped"
                    width={100} // Set width for Ant Design Image
                    height={100} // Adjust height based on your needs
                    style={{ objectFit: 'contain' }}
                    className='border border-1 rounded-lg'
                  />
                  <p>Cropped Image ({images?.siteLoaderImg?.croppedFileSize})</p>
                </div>
              )}
            </div>
          </Form.Item>
          {/* Ads banner image */}
          <Form.Item label="Ads Banner Image" name="banner_ads_img">
            <div className='grid grid-cols-3 gap-5 justify-items-start'>
              <div>
                <ImageCropper maxImgHeight={120} maxImgWidth={970} onImageUpload={handleImageUpload} fieldName={"bannerAdsImg"} />
                <p className='mt-1'>Image (970x120 pixels)</p>
              </div>
              {images?.bannerAdsImg?.originalFile && (
                <div >
                  <Image
                    src={URL.createObjectURL(images?.bannerAdsImg?.originalFile)}
                    alt="Original"
                    width={100} // Set width for Ant Design Image
                    height={100} // Adjust height based on your needs
                    style={{ objectFit: 'contain' }}
                    className='border border-1 rounded-lg'
                  />
                  <p>Original Image ({images?.bannerAdsImg?.originalFileSize})</p>
                </div>
              )}

              {images?.bannerAdsImg?.croppedFile && (
                <div>
                  <Image
                    src={URL.createObjectURL(images?.bannerAdsImg?.croppedFile)}
                    alt="Cropped"
                    width={100} // Set width for Ant Design Image
                    height={100} // Adjust height based on your needs
                    style={{ objectFit: 'contain' }}
                    className='border border-1 rounded-lg'
                  />
                  <p>Cropped Image ({images?.bannerAdsImg?.croppedFileSize})</p>
                </div>
              )}
            </div>
          </Form.Item>
          {/* Live news show link */}
          <Form.Item label="Live News Show Link" name="live_show_link" rules={[{ required: false, message: 'Please enter the live news show link' }]}>
            <Input placeholder="Enter the live news show link" />
          </Form.Item>
          <Button type="primary" htmlType="submit">Save Settings</Button>
        </Form>
      </Card>
    </>
  );
};

export default AllSettings;
