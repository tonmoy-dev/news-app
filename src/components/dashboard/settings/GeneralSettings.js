"use client"

import { Button, Card, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const GeneralSettings = () => {
    const router = useRouter();

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

    // Handlers for form submission
    const handleGeneralSubmit = (values) => {
        // 
        const formData = Object.fromEntries(
            Object.entries(values).filter(([key, value]) => value)
        )

        if (Object.keys(formData).length === 0) {
            return toast.error("Nothing to save!");
        }

        // Updating settings
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
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    className: 'text-sm',
                    success: {
                        duration: 3000,
                    },
                }}

            />
            {/* General Settings Form */}
            <Card title="General Settings" bordered>
                <Form layout="vertical" onFinish={handleGeneralSubmit}>
                    <Form.Item label="Site Name" name="site_name" rules={[{ required: false, message: 'Please enter the site name' }]}>
                        <Input placeholder="Enter site name" />
                    </Form.Item>
                    <Form.Item label="Location" name="location" rules={[{ required: false, message: 'Please enter the location' }]}>
                        <Input placeholder="Enter location" />
                    </Form.Item>
                    <Form.Item label="Phone" name="phone" rules={[{ required: false, message: 'Please enter the phone number' }]}>
                        <Input placeholder="Enter phone number" />
                    </Form.Item>
                    <Form.Item label="Telephone" name="telephone" rules={[{ required: false, message: 'Please enter the telephone number' }]}>
                        <Input placeholder="Enter telephone number" />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: false, message: 'Please enter the email' }]}>
                        <Input type="email" placeholder="Enter email" />
                    </Form.Item>
                    <Form.Item label="Google Map Embed Link" name="google_map_link" rules={[{ required: false, message: 'Please enter the Google Map embed link' }]}>
                        <TextArea rows={4} placeholder="Enter Google Map embed link" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Save General Settings</Button>
                </Form>
            </Card>
        </>
    );
};

export default GeneralSettings;
