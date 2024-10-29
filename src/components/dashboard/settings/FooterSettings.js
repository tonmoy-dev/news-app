"use client"

import { Button, Card, Form, Input } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import TextEditor from '../shared/TextEditor';

const FooterSettings = () => {
    const [form] = Form.useForm(); // create a form instance
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
    const handleSubmit = (values) => {
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
            {/* Footer Settings Form */}
            <Card title="Footer Settings" bordered>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item label="Footer Text" name="footer_text" rules={[{ required: false, message: 'Please enter the footer text' }]}>
                        <Input placeholder="Enter footer text" />
                    </Form.Item>
                    <Form.Item label="Footer Copyright Text" name="copyright_text" rules={[{ required: false, message: 'Please enter the footer copyright' }]}>
                        <Input placeholder="Enter footer copyright" />
                    </Form.Item>
                    <Form.Item label="Google Play Store Link" name="google_play_app_link" rules={[{ required: false, message: 'Please enter the Google Play store link' }]}>
                        <Input placeholder="Enter Google Play store link" />
                    </Form.Item>
                    <Form.Item label="Apple Play Store Link" name="apple_play_app_link" rules={[{ required: false, message: 'Please enter the Apple Play store link' }]}>
                        <Input placeholder="Enter Apple Play store link" />
                    </Form.Item>
                    <Form.Item label="Terms and Condition" name="terms_condition"
                    // rules={[{ required: false, message: 'Please enter the terms and condition link' }]}
                    >
                        <TextEditor onChange={(content) => form.setFieldsValue({ terms_condition: content })} />
                    </Form.Item>
                    <Form.Item label="Privacy Policy" name="privacy_policy"
                    // rules={[{ required: false, message: 'Please enter the privacy policy link' }]}
                    >
                        <TextEditor onChange={(content) => form.setFieldsValue({ privacy_policy: content })} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Save Footer Settings</Button>
                </Form>
            </Card>
        </>
    );
};

export default FooterSettings;
