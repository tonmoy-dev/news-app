"use client"

import { axiosDataFetcher } from '@/utils/fetcher/axiosDataFetcher';
import { Button, Input, Select, Space, Table, Tooltip } from 'antd';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useMediaQuery } from 'react-responsive';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import ConfirmModal from '../shared/ConfirmModal';

const { Option } = Select;
const { Search } = Input;

const UsersListTable = ({ allUsers }) => {
    const [users, setUsers] = useState(allUsers);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState(null);   // view, edit, delete, update of data
    const [selectedData, setSelectedData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // Number of rows per page
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(users);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' }); // max-width for small and medium devices

    // Function to handle search 
    const handleSearch = () => {
        const filtered = users.filter((user) =>
            user.full_name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredData(filtered);
        setSearchText('');
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setCurrentPage(pagination.current);
    };

    const clearAll = () => {
        setSearchText('');
        setFilteredData(users);
    };

    // Handle deleting user
    const handleRemoveUser = (id) => {
        async function deleteUser(id) {
            try {
                const deleteResponse = await axiosDataFetcher('/users', { id: id }, {
                    method: 'DELETE',
                });
                // Check if the response indicates failure and throw an error
                if (!deleteResponse) {
                    throw new Error('Failed to delete the user');
                }
                // If the delete operation is successful, update the state
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
                return deleteResponse;  // Return success response
            } catch (error) {
                // console.error('Error deleting user:', error.message);
                throw error;
            }
        }
        toast.promise(
            deleteUser(id),
            {
                loading: 'Removing user...',
                success: <b>User is removed!</b>,
                error: <b>Failed to remove user.</b>,
            }
        )
    };

    const handleDataChange = (data) => {
        // 
        async function updateUserData(data) {
            try {
                const patchResponse = await axiosDataFetcher('/users', {}, {
                    method: 'PATCH',
                    body: {
                        id: data.id,
                        data: {
                            [data.fieldName]: data.fieldValue
                        },
                    },
                });
                if (!patchResponse) {
                    throw new Error('Failed to update the user data');
                }
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === data.id ? { ...user, [data.fieldName]: data.fieldValue } : user
                    )
                );
                return patchResponse;  // Return success response
            } catch (error) {
                // console.error('Error updating user:', error.message);
                throw error;
            }
        }
        toast.promise(
            updateUserData(data),
            {
                loading: 'Updating user data...',
                success: <b>User data is updated!</b>,
                error: <b>Failed to update data.</b>,
            }
        )
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
            sortDirections: ['descend', 'ascend'],
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
        {
            title: 'Address',
            dataIndex: 'street_address',
            key: 'street_address',
            render: (street_address) => <span>{street_address}</span>,
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            render: (street_address) => <span>{street_address}</span>,
        },
        // action
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    {/* role update */}
                    <Tooltip title="Change user role?">
                        <Select
                            value={record?.role}
                            onChange={(value) => {
                                setSelectedData({
                                    id: record?.id,
                                    fieldName: "role",
                                    fieldValue: value
                                })
                                setModalStatus("update");
                                setModalOpen(true);
                            }}
                            className="w-24"
                        >
                            <Option value="user">User</Option>
                            <Option value="admin">Admin</Option>
                            <Option value="reporter">Reporter</Option>
                            <Option value="editor">Editor</Option>
                        </Select>
                    </Tooltip>
                    {/* status update */}
                    <Tooltip title="Change user status?">
                        <Select
                            value={record?.status}
                            onChange={(value) => {
                                setSelectedData({
                                    id: record?.id,
                                    fieldName: "status",
                                    fieldValue: value
                                })
                                setModalStatus("update");
                                setModalOpen(true);
                            }}
                            className="w-24"
                        >
                            <Option value="active">Active</Option>
                            <Option value="blocked">Blocked</Option>
                            <Option value="suspended">Suspended</Option>
                        </Select>
                    </Tooltip>
                    {/* view button */}
                    {/* <Tooltip title="View user details">
                        <button
                            onClick={() => {
                                setSelectedData(record);
                                setModalStatus("view");
                                setModalOpen(true);
                            }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                            </svg>
                        </button>
                    </Tooltip> */}
                    {/* delete button */}
                    <Tooltip title="Remove user">
                        <button
                            onClick={() => {
                                setSelectedData(record.id);
                                setModalOpen(true);
                                setModalStatus("delete")
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </Tooltip>
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
                rowKey={"id"}
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

            {/* delete confirmation modal */}
            {
                (modalStatus === "delete") && (
                    <DeleteConfirmationModal
                        modalOpen={modalOpen}
                        onModalOpen={() => {
                            setModalOpen();
                            setModalStatus(null);
                        }}
                        title={"Do you want to remove?"}
                        onDelete={() => {
                            handleRemoveUser(selectedData);
                            setSelectedData(null);
                        }}
                    />
                )
            }
            {/* data view modal */}
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
            {/* confirmation modal for data update */}
            {
                (modalStatus === "update") && selectedData && (
                    <ConfirmModal
                        modalOpen={modalOpen}
                        onClose={() => {
                            setModalOpen(false);
                            setModalStatus(null);
                            setSelectedData(null);
                        }}
                        title={"Do you want to update?"}
                        onConfirm={() => {
                            handleDataChange({ ...selectedData });
                            setSelectedData(null);
                        }} />
                )
            }
        </>
    );
};
export default UsersListTable;