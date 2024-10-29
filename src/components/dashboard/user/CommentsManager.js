"use client"

import {
    CheckOutlined,
    CommentOutlined,
    DeleteOutlined,
    EyeOutlined,
    LinkOutlined
} from '@ant-design/icons';
import { Button, Input, Modal, Space, Table, Tag } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useMediaQuery } from 'react-responsive';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

const { TextArea } = Input;

const CommentsManager = ({ comments }) => {
    const [commentsData, setCommentsData] = useState(comments);
    const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [openApprovalModal, setOpenApprovalModal] = useState(false);
    const [selectedComment, setSeletedComment] = useState(null);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' }); // max-width for small and medium devices

    async function updateComment(postComment, fieldName, value) {
        try {
            // Axios PATCH request
            const response = await axios.patch(`${process.env.AUTH_URL}/api/post-comments/${postComment?.id}`, {
                fieldName, value
            });

            if (response.status === 200) {

                if (fieldName === "status") {
                    const updatedComments = commentsData.map((comment) =>
                        comment.id === postComment.id ? { ...comment, status: true } : comment
                    );
                    setCommentsData(updatedComments);
                    setSeletedComment(null);
                } else {    // fieldName === "comment_reply" 
                    const updatedComments = commentsData.map((comment) => {
                        if (comment.id === postComment.id) {
                            return {
                                ...comment,
                                comment_reply: value,
                            };
                        }
                        return comment;
                    });
                    setCommentsData(updatedComments);
                    setReplyContent('');
                }
            } else {

            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {

        }
    }
    // Approve comment
    const handleApprove = (comment) => {
        toast.promise(
            updateComment(comment, "status", !comment.status),
            {
                loading: 'Updating comment status...',
                success: <b>Status updated!</b>,
                error: <b>Could not updated.</b>,
            }
        );
    };

    const deleteComment = async (id) => {
        try {
            const response = await axios.delete(`${process.env.AUTH_URL}/api/post-comments/${id}`);
            if (response.data) {
                const filteredComments = commentsData.filter((comment) => comment.id !== id);
                setCommentsData(filteredComments);
                setSeletedComment(null);
                router.push('/dashboard/comments');
            } else {

            }
        } catch (error) {
            console.error('Error deleting news item:', error);
        } finally { }
    }


    // Remove comment
    const handleRemove = (id) => {
        toast.promise(
            deleteComment(id),
            {
                loading: 'Deleting news comment...',
                success: <b>Comment deleted!</b>,
                error: <b>Could not deleted.</b>,
            }
        );

    };

    // Show Reply Modal
    const showReplyModal = (comment) => {
        setCurrentComment(comment);
        setIsReplyModalVisible(true);
    };

    // Handle Reply Submit
    const handleReplySubmit = () => {

        toast.promise(
            updateComment(currentComment, "comment_reply", replyContent),
            {
                loading: 'Adding comment reply...',
                success: <b>Comment reply added!</b>,
                error: <b>Could not updated.</b>,
            }
        );


    };

    // Show View Modal for full comment
    const showViewModal = (comment) => {
        setCurrentComment(comment);
        setIsViewModalVisible(true);
    };

    // Show In Response Comment Modal
    const showResponseModal = (comment) => {
        setCurrentComment(comment);
        setIsResponseModalVisible(true);
    };

    // Table columns
    const columns = [
        {
            title: 'SL',
            dataIndex: 'serial',
            key: 'serial',
            render: (text, record, index) => {
                // Calculate serial number based on the current page
                return (1 - 1) * 10 + index + 1;
            },
        },
        // post title
        {
            title: 'Post Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div className="flex justify-between">
                    <div>
                        <span>{text} </span>
                        {/* <Badge
                            count={`Total Comments: ${1 + record.replies.length}`}
                            showZero
                            style={{ backgroundColor: '#52c41a', marginLeft: '8px' }}
                        /> */}
                    </div>
                    <Button
                        type="link"
                        icon={<LinkOutlined />}
                        href={`/${record?.news_post_link}`}
                        target="_blank"
                        className="bg-gray-200 p-1 rounded"
                    >
                        View Post
                    </Button>
                </div>
            ),
        },
        // user
        {
            title: 'Commenter',
            dataIndex: 'user_name',
            key: 'user_name',
            width: "12%",
            render: (text) => <span>{text}</span>
        },
        // comment
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            render: (_, record) => (
                <>
                    <p className="mb-2">{record?.comment_message?.slice(0, 40)}...</p>
                    <Space>
                        <Button
                            icon={<CheckOutlined />}
                            disabled={record?.status}
                            onClick={() => {
                                setOpenApprovalModal(true);
                                setSeletedComment(record);
                                // handleApprove(record?.id)
                            }}
                        >
                            {record?.status ? 'Approved' : 'Approve'}
                        </Button>
                        <Button
                            icon={<CommentOutlined />}
                            disabled={!record?.status}
                            onClick={() => showReplyModal(record)}
                        >
                            Reply
                        </Button>
                        <Button icon={<EyeOutlined />} onClick={() => showViewModal(record)}>
                        </Button>
                        <Button danger icon={<DeleteOutlined />} onClick={() => {
                            setSeletedComment(record);
                            setModalOpen(true);
                        }}>
                        </Button>

                    </Space>
                    {/* Show replies below the comment */}
                    {/* {record.replies.length > 0 && (
                        <div className="mt-4 flex">
                            <b>Replies:</b>
                            {record.replies.map((reply, index) => (
                                <div key={index} className="ml-4 mt-1">
                                    <Tag color="blue">Admin Reply:</Tag> {reply}
                                </div>
                            ))}
                            {record.replySubmitted && (
                                <Button className="ms-4" danger icon={<DeleteOutlined />} onClick={() => handleRemoveReply(record.key)}>
                                    Remove
                                </Button>

                            )}
                        </div>
                    )} */}
                </>
            ),
        },
        // submmission date time
        {
            title: 'Submitted On',
            dataIndex: 'submitted_date_time',
            key: 'submitted_date_time',
            width: "15%"
        },
    ];

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
            {/* Comment Table */}
            <Table
                columns={columns}
                dataSource={commentsData}
                pagination={{ pageSize: 10, total: commentsData.length }}
                rowKey="id"
                scroll={isSmallScreen ? { x: 'max-content' } : undefined}  // Conditionally enable scrolling
            />

            {/* Reply Comment Modal */}
            <Modal
                centered
                title="Reply to Comment"
                open={isReplyModalVisible}
                onCancel={() => setIsReplyModalVisible(false)}
                onOk={() => {
                    setIsReplyModalVisible(false);
                    handleReplySubmit();
                }}
                okText="Submit Reply"
            >
                <TextArea
                    rows={4}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply here..."
                />
            </Modal>

            {/* View Comment Modal */}
            <Modal
                centered
                title="View Comment"
                open={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={null}
            >
                {currentComment && (
                    <div className="space-y-1 mt-4">
                        <p><b>User:</b> {currentComment.user_name}</p>
                        <p><b>Email:</b> {currentComment.user_email}</p>
                        <p><b>Submitted On:</b> {currentComment.submitted_date_time}</p>
                        <p><b>Comment:</b> {currentComment.comment_message}</p>
                        {/* Safeguard for replies */}
                        {currentComment.comment_reply && (
                            <div className="mt-2">
                                <b>Replies:</b>
                                <div className="ml-4">
                                    <Tag color="blue">Admin Reply:</Tag> {currentComment.comment_reply}
                                </div>
                                {/* {currentComment.replies.map((reply, index) => (
                                    <div key={index} className="ml-4">
                                        <Tag color="blue">Admin Reply:</Tag> {reply}
                                    </div>
                                ))} */}
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* View In Response Comment Modal */}
            {/* <Modal
                title="View Response Comment"
                open={isResponseModalVisible}
                onCancel={() => setIsResponseModalVisible(false)}
                footer={null}
            >
                <p>{currentComment}</p>
            </Modal> */}
            {/* Approval modal */}
            <Modal
                centered
                title="Do you want to approve this comment?"
                open={openApprovalModal}
                onOk={() => {
                    handleApprove(selectedComment);
                    setOpenApprovalModal(false);
                }}
                onCancel={() => setOpenApprovalModal(false)}
            >
            </Modal>

            {/* delete confirmation modal */}
            <DeleteConfirmationModal
                modalOpen={modalOpen} onModalOpen={setModalOpen} title={"Do you want to remove this comment?"}
                onDelete={() => {
                    handleRemove(selectedComment?.id)
                    setModalOpen(false);
                }}
            />
        </>
    );
};

export default CommentsManager;
