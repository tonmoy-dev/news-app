"use client"

import { countriesNames } from '@/assets/data/countries';
import { axiosDataFetcher } from '@/utils/fetcher/axiosDataFetcher';
import { compressImage, isFileSizeValid } from '@/utils/image-utils/compressImage';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Col, Form, Image, Input, InputNumber, Row, Select } from 'antd';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ImageCropper from '../shared/ImageCropper';

const { TextArea } = Input;
const { Option } = Select;

const AccountSettingsForm = ({ user }) => {
    const [form] = Form.useForm();
    const [formStatus, setFormStatus] = useState(null);  // uploading, done
    // const user = useAuthStore(state => state.user);
    const router = useRouter();
    const [fileLists, setFileLists] = useState({
        profile_image_url: []
    });
    const [imagePath, setImagePath] = useState("");
    const [originalImage, setOriginalImage] = useState(null);
    const [fileName, setFileName] = useState("");
    const [croppedImage, setCroppedImage] = useState(null);
    const [fileSizes, setFileSizes] = useState({
        originalFileSize: "",
        croppedFileSize: "",
        compressedFileSize: ""
    });
    const [passwordVisible, setPasswordVisible] = useState(false);

    const { full_name, email, phone_number, profile_image_url, street_address, city, state, postal_code, country, designation, experience_years, social_media_links, bio, role } = user;

    async function updateUserInfo(data) {
        try {
            const patchResponse = await axiosDataFetcher('/users', {}, {
                method: 'PATCH',
                body: {
                    id: user.id,
                    data: {
                        ...data
                    },
                },
            });
            if (!patchResponse) {
                throw new Error('Failed to update the user');
            }
            // setFormStatus("done");
            router.push("/dashboard");
            return patchResponse;  // Return success response
        } catch (error) {
            // console.error('Error updating user:', error.message);
            throw error;
        }
    }

    const onFinish = async (values) => {
        // setFormStatus("uploading");
        let hashedPassword;
        let formData = {
            ...values,
            hashed_password: user?.hashed_password
        }

        if (values.hashed_password !== '********') {
            const saltRounds = 10; // Default salt rounds
            const salt = await bcrypt.genSalt(saltRounds);
            hashedPassword = await bcrypt.hash(values.hashed_password, salt);
            formData.hashed_password = hashedPassword;
        }
        if (fileName && croppedImage) {
            uploadImg(fileName, croppedImage, formData);
        } else {
            toast.promise(
                updateUserInfo(formData),
                {
                    loading: 'Update user information...',
                    success: <b>User informations updated!</b>,
                    error: <b>Could not updated.</b>,
                }
            );
        }

    };

    // image upload to local 
    const uploadImg = async (fileName, file, values) => {
        if (!file) {
            return toast.error("Upload image file again!");
        }
        try {
            const formData = new FormData();
            formData.append('file', file); // Append original image
            formData.append('fileName', `${values?.full_name}_${fileName}`);

            const response = await axios.post(`${process.env.AUTH_URL}/api/upload/user-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                console.log(response.data);

                setImagePath(response.data.filename);
                toast.success('Images uploaded to server successfully!');

                const data = {
                    ...values,
                    profile_image_url: response.data.filename
                }
                toast.promise(
                    updateUserInfo(data),
                    {
                        loading: 'Update user information...',
                        success: <b>User informations updated!</b>,
                        error: <b>Could not updated.</b>,
                    }
                );
            } else {
                toast.error('Failed to upload images to server');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Image upload handler
    const handleImageUpload = async (originalFile, croppedFile) => {
        // Calculate the original file size
        const originalFileSize = `${(originalFile.size / 1024 / 1024).toFixed(2)} MB`;
        setFileName(originalFile.name)

        // Set the original image file and update the file sizes state
        setOriginalImage(originalFile);
        setFileSizes((prevSizes) => ({
            ...prevSizes,
            originalFileSize
        }));

        // Check if the cropped image file is not null
        if (croppedFile) {
            // Calculate the cropped file size
            const croppedFileSize = `${(croppedFile.size / 1024 / 1024).toFixed(2)} MB`;
            setFileSizes((prevSizes) => ({
                ...prevSizes,
                croppedFileSize
            }));

            // Check if the cropped image file size is larger than 2MB
            if (!isFileSizeValid(croppedFile, 2)) {


                // Compress the cropped image if it exceeds 2MB
                const compressedFile = await compressImage(croppedFile, 1); // Compress to max size of 1MB

                // Set the compressed image and log its size
                const compressedFileSize = `${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`;
                setCroppedImage(compressedFile);
                setFileSizes((prevSizes) => ({
                    ...prevSizes,
                    compressedFileSize
                }));

            } else {
                setCroppedImage(croppedFile);
            }
        } else {
            setCroppedImage(null); // Clear cropped image if it's null
        }
    };

    const userProfileImg = user?.profile_image_url?.startsWith('https://') ? user?.profile_image_url : `/assets/images/${user?.profile_image_url}`;

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    className: 'text-sm',
                    success: {
                        duration: 3000,
                    },
                }}
            />
            <Form
                form={form}
                name="user_form"
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    full_name, email, phone_number, profile_image_url, street_address, city, state, postal_code, country, designation, experience_years, bio, role,
                    social_media_links, hashed_password: `${user?.hashed_password ? '********' : ''}`,
                }}
            >
                <Row gutter={24}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        {/* Full Name */}
                        <Form.Item
                            label="Full Name"
                            name="full_name"
                            rules={[{ required: true, message: 'Please input your full name!' }]}
                        >
                            <Input placeholder="Enter full name" />
                        </Form.Item>

                        {/* Phone Number */}
                        <Form.Item
                            label="Phone Number"
                            name="phone_number"
                            rules={[{ required: true, message: 'Please input your phone number!' }]}
                        >
                            <Input placeholder="Enter phone number" />
                        </Form.Item>

                        {/* Street Address */}
                        <Form.Item
                            label="Street Address"
                            name="street_address"
                            rules={[{ required: true, message: 'Please input your street address!' }]}
                        >
                            <Input placeholder="Enter street address" />
                        </Form.Item>

                        {/* City */}
                        <Form.Item
                            label="City"
                            name="city"
                            rules={[{ required: true, message: 'Please input your city!' }]}
                        >
                            <Input placeholder="Enter city" />
                        </Form.Item>

                        {/* State */}
                        <Form.Item
                            label="State"
                            name="state"
                            rules={[{ required: true, message: 'Please input your state!' }]}
                        >
                            <Input placeholder="Enter state" />
                        </Form.Item>

                        {/* Postal Code */}
                        <Form.Item
                            label="Postal Code"
                            name="postal_code"
                            rules={[{ required: true, message: 'Please input your postal code!' }]}
                        >
                            <Input placeholder="Enter postal code" />
                        </Form.Item>

                        {/* Country */}
                        <Form.Item
                            label="Country"
                            name="country"
                            rules={[{ required: true, message: 'Please select a country!' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select a country"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {countriesNames.map((country) => (
                                    <Option key={country} value={country}>
                                        {country}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Designation */}
                        <Form.Item
                            label="Designation"
                            name="designation"
                            rules={[{ required: true, message: 'Please input your designation!' }]}
                        >
                            <Input placeholder="Enter designation" />
                        </Form.Item>

                        {/* Experience Years */}
                        {
                            (user?.role === 'reporter' || user?.role === 'editor') && (
                                <Form.Item
                                    label="Experience Years"
                                    name="experience_years"
                                    rules={[{ required: true, message: 'Please input your experience years!' }]}
                                >
                                    <InputNumber min={0} style={{ width: '100%' }} placeholder="Years of experience" />
                                </Form.Item>
                            )
                        }
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>

                        {/* Email */}
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: false, message: 'Please input your email!' },
                                { type: 'email', message: 'Please enter a valid email!' },
                            ]}
                        >
                            <Input placeholder="Enter email" disabled />
                        </Form.Item>

                        {/* Role */}
                        <Form.Item
                            label="Role"
                            name="role"
                        >
                            <Input placeholder="Enter role" disabled />
                        </Form.Item>

                        {/* Password */}
                        <Form.Item
                            label="Password"
                            name="hashed_password"
                            rules={[
                                { required: true, message: 'Please input your password!' },
                                { type: 'password', message: 'Please enter a valid password!' },
                                { min: 6, message: 'Password must be at least 6 characters long!' },
                                { max: 10, message: 'Password cannot be more than 10 characters long!' },
                            ]}
                        >
                            <Input.Password
                                placeholder={user?.hashed_password ? '********' : 'Enter password'}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        {/* Profile Image URL */}
                        <Form.Item label="Profile Picture"
                            name="profile_image_url">
                            <div className='grid grid-cols-3 gap-5 justify-items-start'>
                                <div>
                                    <ImageCropper maxImgHeight={100} fieldName="profileImg" maxImgWidth={100} onImageUpload={handleImageUpload} />
                                    <p className='mt-1'>Image (100x100 pixels)</p>
                                </div>
                                {
                                    !originalImage && (
                                        <Image
                                            src={userProfileImg}
                                            alt='thumbnail'
                                            width={100}
                                            height={100}
                                            style={{ objectFit: 'contain' }}
                                            className='border border-1 rounded-lg' />
                                    )
                                }
                                {originalImage && (
                                    <div >
                                        <Image
                                            src={URL.createObjectURL(originalImage)}
                                            alt="Original"
                                            width={100} // Set width for Ant Design Image
                                            height={100} // Adjust height based on your needs
                                            style={{ objectFit: 'contain' }}
                                            className='border border-1 rounded-lg'
                                        />
                                        <p>Original Image ({fileSizes.originalFileSize})</p>
                                    </div>
                                )}
                                {croppedImage && (
                                    <div>
                                        <Image
                                            src={URL.createObjectURL(croppedImage)}
                                            alt="Cropped"
                                            width={100} // Set width for Ant Design Image
                                            height={100} // Adjust height based on your needs
                                            style={{ objectFit: 'contain' }}
                                            className='border border-1 rounded-lg'
                                        />
                                        <p>Cropped Image ({fileSizes.croppedFileSize})</p>
                                        {/* <p>Compressed File Size: {fileSizes.compressedFileSize}</p> */}
                                    </div>
                                )}
                            </div>
                        </Form.Item>

                        {/* Bio */}
                        <Form.Item label="Bio" name="bio"
                            rules={[
                                { required: true, message: 'Write your bio!' },
                            ]}
                        >
                            <TextArea rows={4} placeholder="Write your bio shortly" />
                        </Form.Item>

                        {/* Social Media Links */}
                        <Form.Item
                            label="Social Media Links"
                            name="social_media_links"
                            rules={[
                                { required: true, message: 'Please input your social media links!' },
                                {
                                    validator: (_, value) =>
                                        value && value.split(',').every(link => /^[\w\s]+:\s*https?:\/\/\S+/.test(link.trim()))
                                            ? Promise.resolve()
                                            : Promise.reject(new Error('Invalid format! Use "platform: url" e.g., "facebook: https://www.facebook.com"')),
                                },
                            ]}
                        >
                            <TextArea rows={3} placeholder='e.g., facebook: https://facebook.com/user, twitter: https://twitter.com/user' />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Submit Button */}
                <Row>
                    <Col span={24}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={formStatus === "uploading"}>
                                {formStatus === "uploading" ? "Saving Changes..." : "Save Changes"}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default AccountSettingsForm;
