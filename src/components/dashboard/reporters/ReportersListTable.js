"use client"

import { axiosDataFetcher } from '@/utils/fetcher/axiosDataFetcher';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Input, Space, Switch, Table, Tooltip } from 'antd';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useMediaQuery } from 'react-responsive';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

const { Search } = Input;

const ReportersListTable = ({ reportersData }) => {
    const [reporters, setReporters] = useState(reportersData);
    const [reporterId, setReporterId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(reporters);
    const pageSize = 10; // Number of rows per page

    // Function to handle search 
    const handleSearch = () => {
        if (!searchText) return setFilteredData(reporters);
        const filteredData = reporters.filter((reporter) =>
            reporter.full_name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredData(filteredData);
        setSearchText('');
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
        setCurrentPage(pagination.current);
    };

    const clearAll = () => {
        setSearchText('');
        setFilteredData(reporters);
        setFilteredInfo({});
        setSortedInfo({});
    };


    // Update reporter status 
    async function updateReporterData(id, fieldName, value) {
        try {
            const patchResponse = await axiosDataFetcher('/users', {}, {
                method: 'PATCH',
                body: {
                    id: id,
                    data: {
                        [fieldName]: value
                    },
                },
            });
            if (!patchResponse) {
                throw new Error('Failed to update the user data');
            }
            setReporters((prevReporters) =>
                prevReporters.map((reporter) =>
                    reporter.id === id ? { ...reporter, [fieldName]: value } : reporter
                )
            );

            return patchResponse;  // Return success response
        } catch (error) {
            // console.error('Error updating user:', error.message);
            throw error;
        }
    }

    // Handle block/unblock & editor/not editor toggle
    const handleToggle = (id, fieldName, value) => {
        let fieldValue;

        if (fieldName === "status") {
            fieldValue = value ? "blocked" : "active"
        } else {
            fieldValue = value ? "editor" : "repoter"
        }

        toast.promise(
            updateReporterData(id, fieldName, fieldValue),
            {
                loading: 'Updating reporter data...',
                success: <b>Reporter data is updated!</b>,
                error: <b>Failed to update data.</b>,
            }
        )
    };

    // Delete reporter
    async function deleteReporter(id) {
        try {
            const deleteResponse = await axiosDataFetcher('/users', { id: id }, {
                method: 'DELETE'
            });

            if (deleteResponse) {

                setReporters((prevReporters) => prevReporters.filter((reporter) => reporter.id !== id));
                setReporterId(null);
            }
        } catch (error) {
            console.error('Error deleting reporter:', error.message);
        }
    }
    // Handle deleting reporter
    const handleRemoveReporter = (id) => {
        toast.promise(
            deleteReporter(id),
            {
                loading: 'Removing reporter...',
                success: <b>Reporter is removed!</b>,
                error: <b>Could not removed.</b>,
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
        {
            title: 'ID',
            dataIndex: 'reporter_code',
            key: 'reporter_code',
            render: (reporter_code) => <span>{reporter_code}</span>,
        },
        {
            title: 'Name',
            dataIndex: 'full_name',
            key: 'full_name',
            // Add the filter method here
            filterMultiple: false,
            onFilter: (value, record) => record.full_name.toLowerCase().includes(value.toLowerCase()),
            // Displaying search input in the title column header
            filterDropdown: () => (
                <Search
                    placeholder="Search Name"
                    onChange={(e) => setSearchText(e.target.value)}
                    onSearch={handleSearch}
                    style={{
                        width: 300, left: 0, position: 'absolute', top: 10,
                        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", padding: "10px", borderRadius: "5px"
                    }}
                />
            ),
            sorter: (a, b) => a.full_name.length - b.full_name.length,
            sortOrder: sortedInfo.columnKey === 'full_name' ? sortedInfo.order : null,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => <span>{email}</span>,
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone_number',
            key: 'phone_number',
            render: (phone_number) => <span>{phone_number}</span>,
        },
        // designation
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            render: (designation) => <span>{designation}</span>,
        },
        // address
        // {
        //     title: 'Address',
        //     key: 'address',
        //     render: (_, record) => <span>{record.city}, {record.state}, {record.country}</span>,
        // },
        // total news
        {
            title: 'Total News',
            dataIndex: 'articles_published',
            key: 'articles_published',
            render: (articles_published) => <span>{articles_published}</span>,
        },
        // action
        {
            title: 'Action',
            key: 'action',
            // width: '10%',
            render: (_, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    {/* add to editor */}
                    <Space size="middle">
                        <Tooltip title={record?.role === "editor" ? 'Remove from editor' : 'Add as editor'}>
                            <Switch
                                checked={record?.role === "editor"}
                                onChange={(value) => handleToggle(record.id, 'role', value)}
                                checkedChildren="Editor"
                                unCheckedChildren="Not Editor"
                            />
                        </Tooltip>
                    </Space>
                    {/* block unblock reporter */}
                    <Space size="middle">
                        <Tooltip title={record?.status === "blocked" ? 'Unblock Reporter' : 'Block Reporter'}>
                            <Switch
                                checked={record?.status === "blocked"}
                                onChange={(value) => handleToggle(record.id, 'status', value)}
                                checkedChildren="Blocked"
                                unCheckedChildren="Not Blocked"
                            />
                        </Tooltip>
                    </Space>
                    {/* remove reporter */}
                    <Space size="middle">
                        <Tooltip title={"Remove this reporter"}>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    setModalOpen(true);
                                    setReporterId(record.id);
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
                    total: reporters.length,
                    onChange: (page) => setCurrentPage(page),
                }}
                scroll={isSmallScreen ? { x: 'max-content' } : undefined}  // Conditionally enable scrolling
            />

            {/* delete confirmation modal */}
            <DeleteConfirmationModal
                modalOpen={modalOpen} onModalOpen={setModalOpen} title={"Do you want to remove this reporter?"}
                onDelete={() => handleRemoveReporter(reporterId)}
            />
        </>
    );
};

export default ReportersListTable;