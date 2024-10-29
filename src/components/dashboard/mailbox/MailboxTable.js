"use client"
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Switch, Table, Tag, Tooltip } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMediaQuery } from 'react-responsive';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

const MailboxTable = ({ messages }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [mailId, setMailId] = useState(null);
    const [mails, setMails] = useState(messages);
    const [selectedMail, setSelectedMail] = useState(null);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // Number of rows per page
    const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });


    async function updateInboxMailStatus(id, value) {
        try {
            // Axios PATCH request
            const response = await axios.patch(`${process.env.AUTH_URL}/api/inbox`, {
                id,
                value
            });

            if (response.status === 200) {

                setMails((prevMails) =>
                    prevMails.map((mail) =>
                        mail.id === id ? { ...mail, isRead: !mail.isRead } : mail
                    )
                );
            } else {

            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally { }
    }

    async function deleteInboxMail(id) {
        try {
            const response = await axios.delete(`${process.env.AUTH_URL}/api/inbox/${id}`);
            if (response.data) {
                setMails((prevMails) => prevMails.filter((mail) => mail.id !== id));
                setMailId(null);
                router.push('/dashboard/mailbox');
            } else {

            }
        } catch (error) {
            console.error('Error deleting news item:', error);
        } finally { }
    }
    // Handle Read/Unread toggle
    const handleReadToggle = (value, id) => {
        // 
        toast.promise(
            updateInboxMailStatus(id, value),
            {
                loading: 'Updating mail status...',
                success: <b>Status updated!</b>,
                error: <b>Could not updated.</b>,
            }
        );

    };

    // Handle viewing mail
    const handleViewMail = (mail) => {
        setSelectedMail(mail);
        setIsViewModalVisible(true);
    };

    // Handle deleting mail
    const handleDeleteMail = (id) => {
        toast.promise(
            deleteInboxMail(id),
            {
                loading: 'Deleting inbox mail...',
                success: <b>Mail deleted!</b>,
                error: <b>Could not deleted.</b>,
            }
        );

    };

    // Close view modal
    const handleCloseViewModal = () => {
        setIsViewModalVisible(false);
        setSelectedMail(null);
    };

    // Define columns for the table
    const columns = [
        {
            title: 'SL',
            dataIndex: 'serial',
            key: 'serial',
            width: '5%',
            render: (text, record, index) => {
                // Calculate serial number based on the current page
                return (currentPage - 1) * pageSize + index + 1;
            },
        },
        {
            title: 'Date',
            dataIndex: 'mailDate',
            key: 'mailDate',
            width: '15%',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '10%',
        },
        {
            title: 'Whatsapp',
            dataIndex: 'phone',
            key: 'phone',
            width: '10%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '15%',
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            ellipsis: true,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={record.isRead ? 'Mark as Unread' : 'Mark as Read'}>
                        <Switch
                            checked={record.isRead}
                            onChange={(value) => handleReadToggle(value, record.id)}
                            checkedChildren="Read"
                            unCheckedChildren="Unread"
                        />
                    </Tooltip>
                    <Button
                        type="default"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewMail(record)}
                    >
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            setModalOpen(!modalOpen);
                            setMailId(record.id);
                        }}
                    >
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table
                rowKey={'id'}
                style={{ maxWidth: "100%" }}
                columns={columns}
                dataSource={mails}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: mails.length,
                    onChange: (page) => setCurrentPage(page),
                }}
                scroll={isSmallScreen ? { x: 'max-content' } : undefined}  // Conditionally enable scrolling

            />

            {/* View Mail Modal */}
            <Modal
                title={`Message from ${selectedMail?.name}`}
                centered
                open={isViewModalVisible}
                onCancel={handleCloseViewModal}
                footer={[
                    <Button key="close" onClick={handleCloseViewModal}>
                        Close
                    </Button>
                ]}
            >
                {selectedMail && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
                        <p>
                            <strong>Email:</strong> {selectedMail.email}
                        </p>
                        <p>
                            <strong>Whatsapp:</strong> {selectedMail.phone}
                        </p>
                        <p>
                            <strong>Date:</strong> {selectedMail.mailDate}
                        </p>
                        <p>
                            <strong>Subject:</strong> {selectedMail.subject}
                        </p>
                        <p>
                            <strong>Message:</strong> {selectedMail.message}
                        </p>
                        <Tag color={selectedMail.isRead ? 'green' : 'volcano'}>
                            {selectedMail.isRead ? 'Read' : 'Unread'}
                        </Tag>
                    </div>
                )}
            </Modal>

            {/* delete confirmation modal */}
            <DeleteConfirmationModal
                modalOpen={modalOpen} onModalOpen={setModalOpen} title={"Do you want to delete this mail?"}
                onDelete={() => handleDeleteMail(mailId)}
            />
        </>
    );
};

export default MailboxTable;
