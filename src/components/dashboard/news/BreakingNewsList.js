"use client"

import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Button, Space, Switch, Table, Tooltip } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useMediaQuery } from 'react-responsive';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import AddBreakingNewsModal from './AddBreakingNewsModal';

// Log the start and end times in a readable format
const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true // Set to false for 24-hour format
};

function calculateRemainingTime(end_time) {
    const currentTime = new Date();
    const endTime = new Date(end_time); // Convert end_time string to Date object

    const remainingTimeMillis = endTime - currentTime; // Calculate difference in milliseconds
    // Check if the end time has passed
    if (remainingTimeMillis < 0) {
        return "00:00"; // Event has already ended
    } else {
        // Calculate remaining hours and minutes
        const remainingHours = Math.floor(remainingTimeMillis / (1000 * 60 * 60));
        const remainingMinutes = Math.floor((remainingTimeMillis % (1000 * 60 * 60)) / (1000 * 60));

        return `${remainingHours} hours ${remainingMinutes} min`;
    }
}

const BreakingNewsList = ({ data, user }) => {
    const [news, setNews] = useState(data);
    const [newsId, setNewsId] = useState(null);
    const [open, setOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const searchInput = useRef(null);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });
    const router = useRouter();

    const deleteBreakingNews = async (id) => {
        try {
            const response = await axios.delete(`${process.env.AUTH_URL}/api/news/breaking-news/${id}`);
            if (response.data) {
                // 
                const filteredNews = news.filter(item => item.id !== id);
                setNews(filteredNews);
            } else {

            }
        } catch (error) {
            console.error('Error deleting news item:', error);
        } finally {
            setNewsId(null);
        }
    }

    // Handle deleting news
    const handleRemoveNews = (id) => {
        toast.promise(
            deleteBreakingNews(id),
            {
                loading: 'Deleting breaking news...',
                success: <b>News deleted!</b>,
                error: <b>Could not deleted.</b>,
            }
        );
    };

    async function updateStatus(id, value) {
        let startTime;
        let endTime;

        const status = value === true ? "activated" : "deactivated";

        if (status === "activated") {

            // Get the current date and time in the local time zone
            const now = new Date();
            // Get the date and time after 24 hours
            const after24hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            // convert to local date time
            startTime = now.toLocaleString('en-US', options);
            endTime = after24hours.toLocaleString('en-US', options);
        } else {
            startTime = null;
            endTime = null;
        }
        try {
            // Axios PATCH request
            const response = await axios.patch(`${process.env.AUTH_URL}/api/news/breaking-news/${id}`, {
                status: status,
                start_time: startTime,
                end_time: endTime
            });

            if (response.status === 200) {
                // 
                setNews(news.map(item => item.id === id ? { ...item, status: status, start_time: startTime, end_time: endTime } : item));
            } else {

            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            // setShowMessage(false);
        }
    }

    // Handle status toggle
    const handleStatusToggle = (value, id) => {
        toast.promise(
            updateStatus(id, value),
            {
                loading: 'Updating breaking news status...',
                success: <b>Status updated!</b>,
                error: <b>Could not updated.</b>,
            }
        );
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };


    const columns = [
        {
            title: 'SL',
            dataIndex: 'serial',
            key: 'serial',
            render: (text, record, index) => {
                // Calculate serial number based on the current page
                return (1 - 1) * 5 + index + 1;
            },
        },
        // title
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.length - b.title.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Start Time',
            dataIndex: 'start_time',
            key: 'start_time',
            width: "18%",
            render: (_, record) => <span>
                {!record.start_time ? "00:00" : (record.start_time)}
            </span>,
        },
        {
            title: 'End Time',
            dataIndex: 'end_time',
            key: 'end_time',
            width: "18%",
            render: (_, record) => <span>
                {!record.end_time ? "00:00" : (record.end_time)}
            </span>,
        },

        {
            title: 'Remaining Time',
            dataIndex: 'remaining',
            key: 'remaining',
            render: (_, record) => <span> {
                !record.end_time ? "00:00" : (calculateRemainingTime(record.end_time.toLocaleString('en-US', options)))
            } </span>,
        },

        // actions
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <Space size="middle">
                        <Switch
                            defaultChecked={record.status === "activated"}
                            // onChange={onChange}
                            onChange={(value) => handleStatusToggle(value, record.id)}
                            checkedChildren="Activated"
                            unCheckedChildren="Deactivated"
                        />
                    </Space>

                    <Space size="middle">
                        <Tooltip title={"Remove this news"}>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    setModalOpen(true);
                                    setNewsId(record.id);
                                }}>
                            </Button>
                        </Tooltip>
                    </Space>
                </div>
            ),
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
            <Space size="middle" style={{ marginBottom: "12px" }}>
                <Button type="primary" onClick={() => setOpen(true)} icon={<PlusCircleFilled />}>
                    Add Breaking News
                </Button>
            </Space>
            <Table
                rowKey={'id'}
                columns={columns}
                dataSource={news}
                pagination={false}
                scroll={isSmallScreen ? { x: 'max-content' } : undefined}  // Conditionally enable scrolling
            />
            {/* add modal */}
            <AddBreakingNewsModal user={user} open={open} setOpen={setOpen} news={news} onNews={setNews} />
            {/* delete confirmation modal */}
            <DeleteConfirmationModal
                modalOpen={modalOpen} onModalOpen={setModalOpen} title={"Do you want to remove this breaking news?"}
                onDelete={() => handleRemoveNews(newsId)}
            />
        </>
    );
};
export default BreakingNewsList;