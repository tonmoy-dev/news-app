"use client"
import { Button, Input, Select, Space, Table, Tooltip } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useMediaQuery } from 'react-responsive';
import CustomModal from '../modals/CustomModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import EditPostForm from './EditPostForm';

const { Search } = Input;

const PostListTable = ({ news, categoriesNames }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState(null);   // view, edit, delete of data
    const [posts, setPosts] = useState(news)
    const [postId, setPostId] = useState(null);
    const [selectedData, setSelectedData] = useState({});
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(posts);
    const [searchText, setSearchText] = useState('');
    const pageSize = 10; // Number of rows per page
    const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' }); // max-width for small and medium devices

    // Function to handle search 
    const handleSearch = () => {
        const filtered = posts.filter((post) =>
            post.title.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredData(filtered);
        setSearchText('');
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
        setCurrentPage(pagination.current);
    };

    // post status update 
    async function updateStatus(value, id) {
        try {
            // Validate the inputs
            if (!id || !value) {

                return;
            }
            // Axios PATCH request
            const response = await axios.patch(`${process.env.AUTH_URL}/api/news`, {
                id: parseInt(id),
                data: {
                    status: value,
                },
            });

            if (response.status === 200) {

            } else {

            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            // setShowMessage(false);
        }
    }

    // handle status change
    const handleSelectChange = (value, record) => {
        toast.promise(
            updateStatus(value, record.id),
            {
                loading: 'Updating status...',
                success: <b>Post status updated!</b>,
                error: <b>Could not updated.</b>,
            }
        );
    };

    const clearAll = () => {
        setFilteredInfo({});
        setSortedInfo({});
        setSearchText('');
        setFilteredData(posts);
    };


    // delete post
    const deletePost = async (id) => {
        try {
            const response = await axios.delete(`${process.env.AUTH_URL}/api/news/${id}`);
            if (response.status === 200) {

            } else {

            }
        } catch (error) {
            console.error('Error deleting news item:', error);
        } finally {
            setPosts((prevPost) => prevPost.filter((post) => post.id !== id));
            setPostId(null);
        }
    }

    // Handle deleting post
    const handleDeletePost = (id) => {
        toast.promise(
            deletePost(id),
            {
                loading: 'Deleting post...',
                success: <b>News deleted!</b>,
                error: <b>Could not deleted.</b>,
            }
        );
    };

    const columns = [
        {
            title: 'SL',
            dataIndex: 'serial',
            key: 'serial',
            render: (text, record, index) => {
                // Calculate serial number based on the current page
                return (currentPage - 1) * pageSize + index + 1;
            },
        },
        // title
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            // Add the filter method here
            filterMultiple: false,
            onFilter: (value, record) => record.title.toLowerCase().includes(value.toLowerCase()),
            // Displaying search input in the title column header
            filterDropdown: () => (
                <Search
                    placeholder="Search By Title"
                    onChange={(e) => setSearchText(e.target.value)}
                    onSearch={handleSearch}
                    style={{
                        width: 400, right: 0, position: 'absolute', top: 10, backgroundColor: 'white',
                        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", padding: "10px", borderRadius: "5px"
                    }}
                />
            ),
            sorter: (a, b) => a.title.length - b.title.length,
            sortOrder: sortedInfo.columnKey === 'title' ? sortedInfo.order : null,
        },
        // category
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            sorter: (a, b) => a.category.length - b.category.length,
            sortOrder: sortedInfo.columnKey === 'category' ? sortedInfo.order : null,
        },
        // location
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: (text) => <span>{text}</span>,
        },
        // reporter
        {
            title: 'Reporter',
            dataIndex: 'reporter',
            key: 'reporter',
            sorter: (a, b) => a.reporter.length - b.reporter.length,
            sortOrder: sortedInfo.columnKey === 'reporter' ? sortedInfo.order : null,
        },
        // status
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <>
                    {/* edit button */}
                    <Space size="middle" className="mx-2">
                        <Select
                            defaultValue={record.status}
                            style={{
                                width: 120,
                            }}
                            onChange={(value) => handleSelectChange(value, record)}
                            options={[
                                {
                                    value: 'Pending',
                                    label: 'Pending',
                                },
                                {
                                    value: 'Blocked',
                                    label: 'Blocked',
                                },
                                {
                                    value: 'Approved',
                                    label: 'Approved',
                                },
                            ]}
                        />
                    </Space>
                </>
            ),
        },
        // action
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <div className='flex items-center gap-2'>
                        {/* view button */}
                        {/* <Tooltip title="View post">
                            <button onClick={() => {
                                setSelectedData(record);
                                setModalStatus("view");
                                setModalOpen(true);
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </button>
                        </Tooltip> */}
                        {/* edit button */}
                        <Tooltip title="Edit post">
                            <button
                                onClick={() => {
                                    setSelectedData(record)
                                    setModalStatus("edit");
                                    setModalOpen(true);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                        </Tooltip>
                        {/* delete button */}
                        <Tooltip title="Delete post">
                            <button
                                onClick={() => {
                                    setPostId(record.id);
                                    setModalStatus("delete");
                                    setModalOpen(true);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>
                </>
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
            <Space
                style={{
                    marginBottom: 16,
                }}
            >
                <Button onClick={clearAll}>Clear filters and sorters</Button>
            </Space>
            <Table
                rowKey={'id'}
                columns={columns}
                dataSource={filteredData}
                onChange={handleTableChange}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: filteredData.length,
                    onChange: (page) => setCurrentPage(page),
                }}
                scroll={isSmallScreen ? { x: 'max-content' } : undefined}  // Conditionally enable scrolling
            />
            {/* edit modal */}
            {
                ((modalStatus === "edit") && selectedData) && (
                    <CustomModal
                        modalOpen={modalOpen}
                        onModalOpen={() => {
                            setModalOpen(false);
                            setModalStatus(null);
                        }}
                        title={"Edit Post"}>
                        <EditPostForm categoriesNames={categoriesNames} post={selectedData} onPost={setSelectedData} onModalOpen={() => {
                            setModalOpen(false);
                            setModalStatus(null);
                        }} />
                    </CustomModal>
                )
            }

            {/* delete confirmation modal */}
            {
                (modalStatus === "delete") && (
                    <DeleteConfirmationModal
                        modalOpen={modalOpen}
                        onModalOpen={() => {
                            setModalOpen();
                            setModalStatus(null);
                        }}
                        title={"Do you want to delete this post?"}
                        onDelete={() => handleDeletePost(postId)}
                    />
                )
            }
            {
                // ((modalStatus === "view") && selectedData) && (
                //     <DataViewModal
                //         open={modalOpen}
                //         onClose={() => {
                //             setModalOpen(false);
                //             setSelectedData(null);
                //             setModalStatus(null);
                //         }}
                //         data={selectedData}
                //     />
                // )
            }
        </>
    );
};
export default PostListTable;