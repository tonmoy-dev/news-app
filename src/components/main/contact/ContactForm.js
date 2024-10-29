'use client';

import { SmileOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const today = new Date();
const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        subject: '',
        phoneNumber: '',
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [api, contextHolder] = notification.useNotification();
    const openNotification = () => {
        api.open({
            message: 'Sending Mail',
            description:
                'Your email has been sent successfully and our team will contact you soon. Stay tuned!',
            icon: (
                <SmileOutlined
                    style={{
                        color: '#108ee9',
                    }}
                />
            ),
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // mail data send to database server
    const mailSendToServer = async (data) => {
        try {
            const response = await axios.post(`${process.env.AUTH_URL}/api/inbox`, data);
            if (response.data) {
                // 
                setFormData({ name: '', email: '', message: '', subject: '', phoneNumber: '' });
                openNotification();
                // router.push('/dashboard/mailbox')
            }
        } catch (err) {
            console.error('Error:', err);
        } finally { }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false);
        setError('');

        toast.promise(
            sendMail(formData),
            {
                loading: 'Sending Message...',
                success: <b>Email is sent!</b>,
                error: <b>Could not send.</b>,
            }
        );
        async function sendMail(formData) {
            try {
                const response = await axios.post('/api/send-email', formData);
                if (!response.data) {
                    throw new Error('An error occurred while sending your message')
                }

                if (response.data.success) {
                    setSuccess(true);
                    // mail sending to server
                    const data = { ...formData, phone: formData.phoneNumber, isRead: false, mailDate: formattedDate };
                    mailSendToServer(data);
                    // 
                } else {
                    throw new Error('An error occurred.')
                    setError(response.data.error || 'An error occurred. Please try again.');
                }
            } catch (err) {
                console.error('Error sending email:', err);
                setError('An error occurred while sending your message. Please try again.');
            }
        }


    };

    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    className: 'text-sm',
                    success: {
                        duration: 2000,
                    },
                }}

            />
            {contextHolder}
            <form className="md:pr-5" onSubmit={handleSubmit}>
                <h3 className="title">
                    Lets work together! <br /> Fill out the form.
                </h3>
                <div className="grid grid-cols-12">
                    <div className="col-span-12 md:col-span-6">
                        <div className="input-box md:mr-2.5">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Full name"
                                className="text-dark"
                            />
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                        <div className="input-box">
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="Subject"
                            />
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                        <div className="input-box md:mr-2.5">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Email address"
                            />
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                        <div className="input-box">
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="Whatsapp Number"
                            />
                        </div>
                    </div>
                    <div className="col-span-12">
                        <div className="input-box">
                            <textarea
                                name="message"
                                cols={30}
                                rows={10}
                                placeholder="Tell us about your message…"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit" className="main-btn">SEND MESSAGE</button>
                        </div>
                    </div>
                </div>
            </form>
        </>

    );
}
