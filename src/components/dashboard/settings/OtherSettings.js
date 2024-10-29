"use client"
// https://picsum.photos/200/300

import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Upload } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';


const OtherSettings = () => {
    const router = useRouter();
    const [fileLists, setFileLists] = useState({
        header_logo_img: [],
        footer_logo_img: [],
        favicon_img: [],
        banner_ads_img: [],
        site_loader_img: [],
    });
    const [imagesPath, setImagesPath] = useState({
        headerLogoPath: "",
        footerLogoPath: "",
        faviconImgPath: "",
        bannerAdsImgPath: "",
        siteLoaderImgPath: ""
    })

    // Update reporter status 
    async function updateSiteSettings(data) {
        try {
            // Axios PATCH request
            const response = await axios.patch(`${process.env.AUTH_URL}/api/site-settings`, data);

            if (response.status === 200) {

                router.push('/');
            } else {

            }
        } catch (error) {
            console.error('Error updating in site settings:', error);
        } finally { }
    }

    // image upload to local 
    const uploadImg = async (file, fieldName) => {
        if (!file) {
            return toast.error("Upload image file again!");
        }
        try {
            const data = new FormData()
            data.set('file', file.originFileObj)

            await fetch('/api/upload', {
                method: 'POST',
                body: data
            })
                .then(res => res.json())
                .then(data => {
                    fieldName === "header_logo_img" && setImagesPath({
                        ...imagesPath,
                        headerLogoPath: data.filename
                    });
                    fieldName === "footer_logo_img" && setImagesPath({
                        ...imagesPath,
                        footerLogoPath: data.filename
                    });
                    fieldName === "favicon_img" && setImagesPath({
                        ...imagesPath,
                        faviconImgPath: data.filename
                    });
                    fieldName === "banner_ads_img" && setImagesPath({
                        ...imagesPath,
                        bannerAdsImgPath: data.filename
                    });
                    fieldName === "site_loader_img" && setImagesPath({
                        ...imagesPath,
                        siteLoaderImgPath: data.filename
                    });
                })
                .catch(err => console.error(err))

        } catch (err) {
            // Handle errors here
            console.error(err)
        }
    };

    // upload props for Image upload
    const uploadProps = {
        beforeUpload: (file, fileList, fieldName, imgWidth, imgHeight) => {


            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                toast.error("You can only upload image files!");
                return Upload.LIST_IGNORE; // Reject file upload if it's not an image
            }

            // Check if there is already a file in the fileList
            if (fileLists[fieldName].length !== 0) {
                toast.error(`You can only upload one image file`);
                return Upload.LIST_IGNORE; // Reject if there is already a file
            }

            // return new Promise((resolve, reject) => {
            //     const img = new Image();
            //     const reader = new FileReader();

            //     // Load image to check dimensions
            //     reader.onload = (e) => {
            //         img.src = e.target.result;
            //     };

            //     img.onload = () => {
            //         const { width, height } = img;

            //         // Check for specific dimensions 
            //         if (width !== imgWidth || height !== imgHeight) {
            //             toast.error(`Image must be ${imgWidth}x${imgHeight} pixels! Current size: ${width}x${height}  pixels!`);
            //             return Upload.LIST_IGNORE;
            //             reject(); // Reject the upload if dimensions don't match
            //         } else {
            //             toast.success('Image dimensions are correct!');
            //             resolve(); // Allow the upload if the dimensions are correct
            //         }
            //     };
            //     // Read the file as a data URL
            //     reader.readAsDataURL(file);
            //     return false; // Return false to handle file upload manually
            // });
        },
        // Limit the upload to only one image
        maxCount: 1,
        // Handle file change event
        onChange: (info, fieldName) => {

            // Update the state dynamically based on the fieldName
            setFileLists((prev) => ({
                ...prev,
                [fieldName]: info.fileList.slice(-1), // Keep only the latest file
            }));

            if (info.file.status === 'done') {
                // 
                // uploadImg(info.file, fieldName)
                toast.success(`${info.file.name} file uploaded successfully.`);

            } else if (info.file.status === 'error') {
                toast.error(`${info.file.name} file upload failed.`);
            }
            // 
        },

    };

    // Handlers for form submission
    const handleLogoSubmit = (values) => {
        let formData = Object.fromEntries(
            Object.entries(values).filter(([key, value]) => value)
        )
        formData = {
            ...formData,
            ...(imagesPath.headerLogoPath !== "" && { header_logo_img: imagesPath.headerLogoPath }),
            ...(imagesPath.footerLogoPath !== "" && { footer_logo_img: imagesPath.footerLogoPath }),
            ...(imagesPath.faviconImgPath !== "" && { favicon_img: imagesPath.faviconImgPath }),
            ...(imagesPath.bannerAdsImgPath !== "" && { banner_ads_img: imagesPath.bannerAdsImgPath }),
            ...(imagesPath.siteLoaderImgPath !== "" && { site_loader_img: imagesPath.siteLoaderImgPath }),
        }

        if (Object.keys(formData).length === 0) {
            return toast.error("Nothing to save!");
        }

        // data sending to server
        toast.promise(
            updateSiteSettings(formData),
            {
                loading: 'Updating site settings...',
                success: <b>Site settings is updated!</b>,
                error: <b>Could not updated.</b>,
            }
        );
    };

    return (
        <>
            {/* Logo Settings Form */}
            <Card title="Logo & Other Settings" bordered>
                <Form layout="vertical" onFinish={handleLogoSubmit}>
                    {/* Header logo */}
                    <Form.Item label="Header Logo (400x70px)">
                        <Upload
                            fileList={fileLists.header_logo_img}
                            beforeUpload={(file, fileList) => uploadProps.beforeUpload(file, fileList, 'header_logo_img', 400, 70)}
                            onChange={(info) => uploadProps.onChange(info, 'header_logo_img')}

                            listType="picture"
                            multiple={false}
                        >
                            <Button icon={<UploadOutlined />}>Upload Header Logo</Button>
                        </Upload>
                    </Form.Item>
                    {/* Footer logo */}
                    <Form.Item label="Footer Logo (300x50px)">
                        <Upload
                            fileList={fileLists.footer_logo_img}
                            beforeUpload={(file, fileList) => uploadProps.beforeUpload(file, fileList, 'footer_logo_img', 300, 50)}
                            onChange={(info) => uploadProps.onChange(info, 'footer_logo_img')}

                            listType="picture"
                            multiple={false}
                        >
                            <Button icon={<UploadOutlined />}>Upload Footer Logo</Button>
                        </Upload>
                    </Form.Item>
                    {/* Logo alt text */}
                    <Form.Item label="Logo Alt Text" name="logo_alt" rules={[{ required: false, message: 'Please enter the alt text for the logo' }]}>
                        <Input placeholder="Enter logo alt text" />
                    </Form.Item>
                    {/* Favicon image */}
                    <Form.Item label="Favicon Image (50x50px)">
                        <Upload
                            fileList={fileLists.favicon_img}
                            beforeUpload={(file, fileList) => uploadProps.beforeUpload(file, fileList, 'favicon_img', 50, 50)}
                            onChange={(info) => uploadProps.onChange(info, 'favicon_img')}
                            listType="picture"
                            multiple={false}
                        >
                            <Button icon={<UploadOutlined />}>Upload Favicon Image</Button>
                        </Upload>
                    </Form.Item>
                    {/* Favicon image alt text */}
                    <Form.Item label="Favicon Alt Text" name="favicon_alt" rules={[{ required: false, message: 'Please enter the alt text for the favicon' }]}>
                        <Input placeholder="Enter favicon alt text" />
                    </Form.Item>
                    {/* Ads banner image */}
                    <Form.Item label="Banner (Ads 970x120px Area!)">
                        <Upload
                            fileList={fileLists.banner_ads_img}
                            beforeUpload={(file, fileList) => uploadProps.beforeUpload(file, fileList, 'banner_ads_img', 970, 120)}
                            onChange={(info) => uploadProps.onChange(info, 'banner_ads_img')}
                            listType="picture"
                            multiple={false}
                        >
                            <Button icon={<UploadOutlined />}>Upload Ads Banner</Button>
                        </Upload>
                    </Form.Item>
                    {/* Site loader */}
                    <Form.Item label="Site Loader (100x50px Area)">
                        <Upload
                            fileList={fileLists.site_loader_img}
                            beforeUpload={(file, fileList) => uploadProps.beforeUpload(file, fileList, 'site_loader_img', 100, 50)}
                            onChange={(info) => uploadProps.onChange(info, 'site_loader_img')}
                            listType="picture"
                            multiple={false} >
                            <Button icon={<UploadOutlined />}>Upload Site Loader</Button>
                        </Upload>
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

export default OtherSettings;
