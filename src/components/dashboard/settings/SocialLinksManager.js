"use client"

import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Space, Switch, Table } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useMediaQuery } from 'react-responsive';
import EditSocialSettings from './EditSocialSettings';
const { Option } = Select;

const SocialLinksManager = ({ socialsData }) => {
    const [socialLinks, setSocialLinks] = useState(socialsData);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedSocial, setSeletedSocial] = useState(null);
    const [formStatus, setFormStatus] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });

    const [initialValues, setInitialValues] = useState({
        name: "Facebook",
        link: "",
        counts: "",
    });
    const [form] = Form.useForm();
    const router = useRouter()


    const fetchSocials = async () => {
        try {
            const response = await axios.get(`${process.env.AUTH_URL}/api/site-settings/socials`);
            if (response.data) {
                setSocialLinks([
                    ...response.data
                ]);
                toast.success('Social Links updated successfully!');
            }
        } catch (error) {
            console.error('Error fetching socials:', error);
        }
    };


    // Handle Add Social
    const onFinish = async (values) => {
        // Check if the social media name already exists
        const exists = socialLinks.some(social => social?.name === values?.name);

        if (formStatus === "Add") {
            if (exists) {
                setIsAddModalVisible(false);
                // Reset the form fields after successful addition
                form.resetFields();
                return toast.error(`The social platform "${values?.name}" is already added.`)
            }
            const data = {
                ...values,
                status: false
            }
            async function addSocial(data) {
                try {
                    // Axios PATCH request
                    const response = await axios.post(`${process.env.AUTH_URL}/api/site-settings/socials`, data);
                    if (response.data) {
                        // 
                        // Reset the form fields after successful addition
                        form.resetFields();
                        setIsAddModalVisible(false);
                        fetchSocials();
                    } else {

                    }
                } catch (error) {
                    console.error('Error on adding:', error);
                } finally { }
            }
            toast.promise(
                addSocial(data),
                {
                    loading: 'Adding site socials...',
                    success: <b>New social added!</b>,
                    error: <b>Could not added.</b>,
                }
            );
        }
    };

    // Remove Social Link
    const handleRemoveSocial = (id) => {
        const updatedLinks = socialLinks.filter((link) => link.id !== id);
        setSocialLinks(updatedLinks);
    };

    // Toggle Status
    const toggleStatus = (value, id) => {
        async function updateSocialStatus(id, value) {
            try {
                // Axios PATCH request
                const response = await axios.patch(`${process.env.AUTH_URL}/api/site-settings/socials`, {
                    id,
                    value,
                });

                if (response.status === 200) {
                    const updatedLinks = socialLinks.map((link) =>
                        link.id === id ? { ...link, status: !link.status } : link
                    );
                    setSocialLinks(updatedLinks);
                    // 
                } else {

                }
            } catch (error) {
                console.error('Error updating status:', error);
            } finally { }
        }
        toast.promise(
            updateSocialStatus(id, value),
            {
                loading: 'Updating socials status...',
                success: <b>Social status updated!</b>,
                error: <b>Could not updated.</b>,
            }
        );
    };

    const handleEdit = (record) => {
        setSeletedSocial(record);
        setFormStatus("Edit");
        setModalOpen(true);
    }

    // Table columns
    const columns = [
        {
            title: 'SL',
            dataIndex: 'serial',
            key: 'serial',
            render: (text, record, index) => {
                // Calculate serial number based on the current page
                return (1 - 1) * 4 + index + 1;
            },
        },
        {
            title: 'Social Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <b>{text}</b>,
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
            render: (link) => (
                <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                </a>
            ),
        },
        {
            title: 'Counts',
            dataIndex: 'counts',
            key: 'counts',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Space size="middle" className="mx-2">
                        <Switch
                            checkedChildren="ON"
                            unCheckedChildren="OFF"
                            checked={record.status}
                            onChange={(value) => toggleStatus(value, record.id)}
                        />
                    </Space>
                    <Space size="middle" className="mx-2">
                        <Button
                            danger
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        >
                        </Button>
                        {/* <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveSocial(record.id)}
                        >
                        </Button> */}
                    </Space>


                </>
            ),
        },
    ];

    const handleCancel = () => {
        setIsAddModalVisible(false);
    };

    return (
        <div>
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

            {/* Add New Social Button */}
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                    form.resetFields();
                    setSeletedSocial(null);
                    setFormStatus("Add");
                    setIsAddModalVisible(true);
                }}
                className="mb-4"
            >
                Add New Social
            </Button>

            {/* Social Links Table */}
            <Table
                rowKey={'id'}
                columns={columns}
                dataSource={socialLinks}
                pagination={false}
                scroll={isSmallScreen ? { x: 'max-content' } : undefined}  // Conditionally enable scrolling
            />

            {/* Edit social modal */}
            {selectedSocial && (formStatus === "Edit") &&
                <EditSocialSettings socialLinks={socialLinks} onSocialLinks={setSocialLinks} socialData={selectedSocial} setSeletedSocial={setSeletedSocial}
                    modalOpen={modalOpen} setModalOpen={setModalOpen} />}

            {/* Add New Social Modal */}
            <Modal
                title={`${formStatus} Social`}
                open={isAddModalVisible}
                onCancel={handleCancel}
                onOk={() => setIsAddModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={initialValues}
                >
                    <Form.Item
                        label="Select your social platform"
                        name="name"
                        rules={[{ required: true, message: 'Please select an platform!' }]}
                    >
                        <Select placeholder="Select an option">
                            <Option value="Facebook">Facebook</Option>
                            <Option value="Twitter">Twitter</Option>
                            <Option value="YouTube">YouTube</Option>
                            <Option value="Instagram">Instagram</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Link" name="link" rules={[
                        {
                            required: true,
                            message: 'Please input social link!',
                        },
                    ]}>
                        <Input
                            placeholder="Enter social link"
                        />
                    </Form.Item>
                    <Form.Item label="Counts" name="counts" rules={[
                        {
                            required: true,
                            message: 'Please input social counts!',
                        },
                    ]}>
                        <Input
                            placeholder="Enter social counts"
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className="mt-4">
                        {formStatus} Social
                    </Button>
                </Form>
            </Modal>
        </div >
    );
};

export default SocialLinksManager;
