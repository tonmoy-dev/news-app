"use client"

import { useImageUpload } from '@/hooks/useImageUpload';
import { newsImageConfigs } from '@/lib/imageConfigs';
import { compressImage, isFileSizeValid } from '@/utils/image-utils/compressImage';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Image, Input, message, Row, Select, Switch, Tag, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ImageCropper from '../shared/ImageCropper';
import TextEditor from '../shared/TextEditor';

const { Option } = Select;
const { Dragger } = Upload;

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    }
};

const EditPostForm = ({ categoriesNames, post, onPost, onModalOpen }) => {
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [resizedImages, setResizedImages] = useState({
        large: null,
        medium: null,
        small: null,
    });
    const [imgFilesNames, setImgFilesNames] = useState({
        originalFileName: null,
        largeFileName: null,
        mediumFileName: null,
        smallFileName: null
    })
    const [images, setImages] = useState({
        watermarkImg: { name: "", originalFile: null, originalFileSize: "", croppedFile: null, croppedFileSize: "", filePath: "" }
    });
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([post?.tags?.split(/\s*,\s*/)]);
    const [inputValue, setInputValue] = useState('');
    const [dateString, setDateString] = useState(null);
    const router = useRouter()
    const [switchValues, setSwitchValues] = useState({
        featured_news: false,
        trending_news: false,
    });
    const { uploadImages, isUploading, error: uploadError } = useImageUpload();

    const initialValues = {
        ...post,
        published_date: moment(post.published_date, 'YYYY-MM-DD'),
    };

    function isValidData(data) {
        return Object.values(data).every(value => value !== undefined && value !== null && value !== "");
    }

    async function sendData(data) {
        // 
        // const isValid = isValidData(data);
        // if (!isValid) {
        //     message.error('Please fill all the fields!');
        //     return;
        // }

        try {
            setLoading(true);
            const response = await axios.put(`/api/news`, { id: post.id, data });
            // 
            if (response.data) {
                onModalOpen();
            }

        } catch (err) {
            // setError('Error submitting form');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }

    const onFinish = async (values) => {
        const changedValues = {};
        for (const key in values) {
            if (values[key] !== initialValues[key]) {
                // Skip 'published_date' property
                if (key !== "published_date") {
                    changedValues[key] = values[key];
                }
            }
        }
        let data = { ...changedValues };
        if (values.tags !== initialValues.tags) data.tags = `${tags}`;
        if (dateString && (dateString !== post.published_date.split("T")[0])) data.published_date = dateString;

        if (resizedImages?.large) {
            const { large, medium, small } = resizedImages;
            // Image upload to server
            const isUploaded = await imageUploadToServer(values?.title, { file, large, medium, small });
            if (isUploaded?.success === true) {
                setLoading(true);
                const { file, large, medium, small } = isUploaded?.results;
                data = {
                    ...data,
                    thumbnail_img_original: file?.fileName || large?.fileName,
                    thumbnail_img_large: large?.fileName,
                    thumbnail_img_medium: medium?.fileName,
                    thumbnail_img_small: small?.fileName,
                }
            } else {
                message.error('Error uploading images');
            }
        }
        if (Object.keys(data).length === 0) return message.error("Nothing to update!");
        sendData(data);
    };

    const onChange = (date, dateString) => {
        setDateString(dateString);

    };
    const onSwitchChangeTrending = (checked) => {
        // 
        setSwitchValues({
            ...switchValues,
            trending_news: checked,
        })
    };
    const onSwitchChangeFeatured = (checked) => {
        // 
        setSwitchValues({
            ...switchValues,
            featured_news: checked,
        })
    };
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && !tags.includes(inputValue)) {
            setTags([...tags, inputValue]); // Add new tag
        }
        setInputValue(''); // Clear input after adding the tag
    };

    const handleTagClose = (removedTag) => {
        const filteredTags = tags.filter(tag => tag !== removedTag);
        setTags(filteredTags); // Remove the closed tag
    };

    // Handle file upload
    const handleImgChange = async (info, imgWidth, imgHeight) => {
        const { status, originFileObj, type } = info.file;

        setPreviewImage(null);
        setResizedImages({
            large: null,
            medium: null,
            small: null,
        });
        if (status === 'done' || status === 'error') {
            if (!(info.file.type.startsWith('image/'))) {
                message.error("You can only upload image files!");
                return;
            } else {
                imageProcess();

            }
        }
        async function imageProcess() {
            // start the resizing and uploading to server process
            if (status === 'done') {
                const file = originFileObj;
                const previewURL = URL.createObjectURL(file);
                setPreviewImage(previewURL); // Set preview for the original image

                // Resize the images and convert to File objects
                const large = await resizeImage(file, { width: 700, height: 500 }, 'large');
                const medium = await resizeImage(file, { width: 255, height: 320 }, 'medium');
                const small = await resizeImage(file, { width: 100, height: 77 }, 'small');

                setResizedImages({ large, medium, small });
                message.success(`${name} uploaded successfully.`);
                // Now that resizing is done, upload the images to the server
                // await uploadToServer(file, { large, medium, small });
            } else if (status === 'error') {
                message.error(`${name} upload failed.`);
            }
        }
    };

    // Resize image using imageCompression and convert Blob to File
    const resizeImage = async (file, { width, height }, sizeLabel) => {
        const options = {
            maxWidthOrHeight: Math.max(width, height),
            useWebWorker: true,
        };

        try {
            const compressedBlob = await imageCompression(file, options);
            // Convert Blob to File for upload
            return new File([compressedBlob], `${file.name}`, { type: file.type });
        } catch (error) {
            console.error("Error during image compression:", error);
            return null;
        }
    };

    // Function to upload the original and resized images to the server
    const uploadToServer = async (originalFile, resizedImages) => {
        const formData = new FormData();
        formData.append('watermarked', originalFile); // Append original image
        formData.append('large', resizedImages.large); // Append large resized image
        formData.append('medium', resizedImages.medium); // Append medium resized image
        formData.append('small', resizedImages.small); // Append small resized image

        try {
            // // Perform the HTTP request(POST to the backend API)
            const response = await axios.post('/api/upload/multipart-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // 
            if (response.data) {
                const { filenames } = response.data; // Destructure filenames from the response
                // 
                setImgFilesNames({
                    originalFileName: filenames.original,
                    largeFileName: filenames.large,
                    mediumFileName: filenames.medium,
                    smallFileName: filenames.small
                })
                message.success('Images uploaded to server successfully!');
                return true;
            } else {
                message.error('Failed to upload images to server');
            }
            // 
        } catch (error) {
            message.error('Failed to upload images to server');
            console.error('Upload error:', error);
        }
    };

    const handleAddWatermarkToThumbnail = async (thumbnail, watermark) => {
        if (!thumbnail || !watermark) {
            message.error('Please upload both a thumbnail and a watermark image.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('thumbnail', thumbnail);
            formData.append('watermark', watermark);
            formData.append('bottom', 20);
            formData.append('right', 20);
            formData.append('watermarkWidth', 200);

            const response = await fetch('/api/upload/add-watermark', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const originalFilename = thumbnail.name.split('.')[0]; // Get name without extension
                const imageFile = new File([blob], `${originalFilename}.jpg`, { type: 'image/jpeg' });
                setFile(imageFile);
                // console.log('Image File:', imageFile);
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to process images.');
            }
        } catch (error) {
            console.error('Error processing images:', error);
        }
    };

    const handleImageUpload = async (originalFile, croppedFile, fieldName) => {
        if (!resizedImages?.large) {
            message.error('Failed to upload watermark image, Upload thumbnail image first!');
            return;
        }

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

            // send for adding watermark to thumbnail
            handleAddWatermarkToThumbnail(resizedImages?.large, croppedFile);
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

            // send for adding watermark to thumbnail
            handleAddWatermarkToThumbnail(resizedImages?.large, originalFile);
        }
    };

    // Upload images to server
    const imageUploadToServer = async (newsTitle, files) => {
        try {
            // Filter out null files and create upload payload
            const uploadFiles = {};
            Object.entries(files).forEach(([key, file]) => {
                if (file) uploadFiles[key] = file;
            });

            if (Object.keys(uploadFiles).length === 0) {
                return; // No files to upload
            }

            const result = await uploadImages(uploadFiles, newsImageConfigs(newsTitle));
            if (result?.success === true) {
                message.success('Images uploaded to server successfully!');
                return result;
            } else {
                message.error('Failed to upload images to server');
            }
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };

    return (
        <>
            <Form
                // {...formItemLayout}
                form={form}
                layout='vertical'
                name="register"
                onFinish={onFinish}
                initialValues={initialValues}
                style={{
                    maxWidth: 1200,
                    backgroundColor: "white",
                    padding: "30px",
                    height: "auto",
                    borderRadius: "8px"
                }}
                scrollToFirstError
            >
                <Row gutter={[30]}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        {/* headline */}
                        <Form.Item
                            name="title"
                            label="Title"
                            // tooltip="What do you want others to call you?"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input news title!',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input placeholder="Enter news title (meta title)" />
                        </Form.Item>
                        {/* sub title */}
                        <Form.Item
                            name="sub_title"
                            label="Sub Title"
                            // tooltip="What do you want others to call you?"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input news subtitle!',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input placeholder="Enter news subtitle" />
                        </Form.Item>
                        {/* category */}
                        <Form.Item
                            name="category"
                            label="Category"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select news category!',
                                },
                            ]}
                        >
                            <Select placeholder="select news category">
                                {
                                    categoriesNames.map(name => (
                                        <Option key={name} value={name}>{name}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        {/* location */}
                        <Form.Item
                            name="location"
                            label="Location"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input news location!',
                                },
                            ]}
                        >
                            <Input placeholder="Enter news location" />
                        </Form.Item>
                        {/* reporter */}
                        <Form.Item
                            name="reporter"
                            label="Reporter"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter news reporter!',
                                },
                            ]}
                        >
                            <Input placeholder="Enter news reporter" />
                            {/* <Select placeholder="select news reporter">
                        <Option value="MD Rahman">MD Rahman</Option>
                        <Option value="SM Mahmud">SM Mahmud</Option>
                    </Select> */}
                        </Form.Item>
                        {/* youtube video url */}
                        <Form.Item
                            name="youtube_video_url"
                            label="Youtube Video URL"
                            // tooltip="What do you want others to call you?"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input news youtube video url!',
                                },
                            ]}
                        >
                            <Input placeholder="Enter news youtube video url" />
                        </Form.Item>
                        {/* content */}
                        <Form.Item
                            label="Content"
                            name="content"
                            rules={[{ required: true, message: 'Please input short content of news!' }]}
                        >
                            <TextArea
                                maxLength={300}
                                showCount // Optional, shows the count of characters
                                placeholder="Enter news content shorly (meta description)"
                                rows={5}
                            />
                        </Form.Item>
                        {/* tags */}
                        <Form.Item label="Tags" name="tags">
                            <div>
                                <Input
                                    type="text"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onPressEnter={handleInputConfirm} // Add tag on Enter key
                                    placeholder="Add a tag (meta keywords)"
                                    style={{ width: '50%' }}
                                />
                                <Button
                                    icon={<PlusOutlined />}
                                    type="dashed"
                                    onClick={handleInputConfirm}
                                    style={{ marginLeft: 8 }}
                                >
                                </Button>
                                <div className='mt-3'>

                                    {post?.tags?.split(/\s*,\s*/).map((tag, index) => (
                                        <Tag
                                            key={index}
                                            closable
                                            onClose={() => handleTagClose(tag)}
                                        >
                                            {tag}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        </Form.Item>
                        {/* publish date */}
                        <Form.Item
                            name="published_date"
                            label="Publish Date"
                            // tooltip="What do you want others to call you?"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a date!',
                                    // whitespace: true,
                                },
                            ]}
                        >
                            <DatePicker onChange={onChange} style={{ width: '50%' }} />
                        </Form.Item>
                        <div className='flex gap-5'>
                            {/* breaking news */}
                            <Form.Item
                                name="trending_news"
                                label="Trending News"
                            // tooltip="What do you want others to call you?"
                            // rules={[
                            //     {
                            //         required: false,
                            //         message: 'Please select breaking news or not!',
                            //         whitespace: true,
                            //     },
                            // ]}
                            >
                                <Switch
                                    onChange={onSwitchChangeTrending}
                                    checkedChildren="ON"
                                    unCheckedChildren="OFF" />
                            </Form.Item>
                            {/* featured news */}
                            <Form.Item
                                name="featured_news"
                                label="Featured News"
                            // tooltip="What do you want others to call you?"
                            // rules={[
                            //     {
                            //         required: false,
                            //         message: 'Please select breaking news or not!',
                            //         whitespace: true,
                            //     },
                            // ]}
                            >
                                <Switch
                                    onChange={onSwitchChangeFeatured}
                                    checkedChildren="ON"
                                    unCheckedChildren="OFF" />
                            </Form.Item>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>

                        {/* thumbnail image */}
                        <Form.Item label="Thumbnail images (1460x1000 pixels)">
                            <div className='grid grid-cols-4 gap-4 justify-items-start'>
                                <div className='mb-3'>
                                    <Upload
                                        listType="picture-card"
                                        onChange={(info) => handleImgChange(info, 1460, 1000)}
                                        showUploadList={false}
                                        accept="image/*"
                                    >
                                        + Upload
                                    </Upload>
                                </div>
                                {/* Original Image Preview */}
                                {!resizedImages.large && (
                                    <Image
                                        src={`/assets/images/${post?.thumbnail_img_original}`}
                                        alt='thumbnail'
                                        width={100}
                                        height={100}
                                        style={{ objectFit: 'contain' }}
                                        className='border border-1 rounded-lg' />
                                )}
                                {/* Resized Images Preview */}
                                {resizedImages.large && (
                                    <>
                                        <div>
                                            <Image
                                                src={URL.createObjectURL(resizedImages.large)}
                                                alt="Large"
                                                width={100}
                                                height={100}
                                                style={{ objectFit: 'contain' }}
                                                className='border border-1 rounded-lg' />

                                            {/* (700x500 pixels) */}
                                            <p className='text-sm text-center'>Large</p>
                                            {/* Aspect ratio = width / height = 700 / 500 = 1.4 */}
                                        </div>
                                        <div>
                                            <Image
                                                src={URL.createObjectURL(resizedImages.medium)}
                                                alt="Medium"
                                                width={100}
                                                height={100}
                                                style={{ objectFit: 'contain' }}
                                                className='border border-1 rounded-lg' />
                                            {/* (255x320 pixels) */}
                                            <p className='text-sm text-center'>Medium</p>
                                        </div>
                                        <div>
                                            <Image
                                                src={URL.createObjectURL(resizedImages.small)}
                                                alt="Small"
                                                width={100}
                                                height={100}
                                                style={{ objectFit: 'contain' }}
                                                className='border border-1 rounded-lg' />
                                            {/* (100x77 pixels) */}
                                            <p className='text-sm text-center'>Small</p>
                                        </div>
                                    </>
                                )}
                            </div>
                            {
                                !previewImage && (
                                    <span>Upload an image to change thumbnail images</span>
                                )
                            }
                        </Form.Item>
                        {/* watermark image for posts */}
                        <Form.Item label="Watermark Image (200x50 pixels)">
                            <div className='grid grid-cols-4 gap-5 justify-items-start'>
                                <div>
                                    <ImageCropper
                                        maxImgWidth={200}
                                        maxImgHeight={50}
                                        onImageUpload={handleImageUpload}
                                        fieldName={"watermarkImg"} />
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
                                        <p className='text-sm text-center'>Original</p>
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
                                        <p className='text-sm text-center'>Cropped</p>
                                    </div>
                                )}
                                {file && (
                                    <div>
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt="Watermarked"
                                            width={100} // Set width for Ant Design Image
                                            height={100} // Adjust height based on your needs
                                            style={{ objectFit: 'contain' }}
                                            className='border border-1 rounded-lg'
                                        />
                                        <p className='text-sm text-center'>Watermarked</p>
                                    </div>
                                )}
                            </div>
                        </Form.Item>
                        {/* description */}
                        <Form.Item name="description"
                            label="Description"
                        // rules={[{ required: false, message: 'Please enter news full description' }]}
                        >
                            <TextEditor initialValue={post?.description} onChange={(content) => form.setFieldsValue({ description: content })} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item style={{ display: "flex", justifyContent: "center", margin: "0" }}>
                    <Button htmlType="submit" type="primary" loading={loading}>
                        {
                            loading ? "Adding Post..." : "Add Post"
                        }
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};
export default EditPostForm;
