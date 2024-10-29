"use client"

import VerticallyCenteredModal from '@/components/dashboard/modals/VerticallyCenteredModal';
import { PlusCircleFilled } from '@ant-design/icons';
import { Button, Space, Table, Tooltip } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';


const CategoryListTable = ({ categoriesData }) => {
    const [categories, setCategories] = useState(categoriesData);
    const [modalMode, setModalMode] = useState('');
    const [open, setOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const searchInput = useRef(null);
    const [categoryId, setCategoryId] = useState(null);
    const router = useRouter();
    const [selectedCategory, setSeletedCategory] = useState(null);

    const showModal = (mode) => {
        setModalMode(mode);
        setOpen(true);
    };

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
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['descend', 'ascend'],
        },
        // {
        //     title: 'Total news',
        //     dataIndex: 'total_news',
        //     key: 'total_news',
        //     render: (key) => <span>{key}</span>,
        // },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <span>{status === 1 ? "Active" : "Inactive"}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Space size="middle" className="mx-2">
                        <Tooltip title={"Edit this category"}>
                            <button onClick={() => {
                                setSeletedCategory(record)
                                showModal("edit")
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </button>
                        </Tooltip>

                    </Space>
                    <Space size="middle">
                        <Tooltip title={"Remove this category"}>
                            <button onClick={() => {
                                setModalOpen(true);
                                setCategoryId(record.id);
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </button>
                        </Tooltip>

                    </Space>
                </>
            ),
        },
    ];

    const handleRemoveCategory = (id) => {
        const deleteCategory = async (id) => {
            try {
                const response = await axios.delete(`${process.env.AUTH_URL}/api/categories/${id}`);
                if (response.data) {
                    setCategoryId(null)
                    setCategories(categories.filter(category => category.id !== id));
                } else {

                }
            } catch (error) {
                console.error('Error deleting category:', error);
            } finally { }
        }

        toast.promise(
            deleteCategory(id),
            {
                loading: 'Deleting category...',
                success: <b>Category deleted!</b>,
                error: <b>Could not deleted.</b>,
            }
        );
    }

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
                <Button type="primary" onClick={() => showModal("add")} icon={<PlusCircleFilled />}>
                    Add New Category
                </Button>
            </Space>
            <Table
                rowKey={'id'}
                style={{ maxWidth: "800px" }}
                columns={columns}
                dataSource={categories}
                pagination={false}
                scroll={{ x: 'max-content' }} // enable horizontal scrolling
            />
            {
                modalMode === "add" && (
                    <AddCategoryModal categories={categories} onCategories={setCategories} showModal={showModal} open={open} setOpen={() => {
                        setOpen();
                        setModalMode("")
                    }} />
                )
            }
            {
                modalMode === "edit" && (
                    <EditCategoryModal categories={categories} onCategories={setCategories} categoryData={selectedCategory} showModal={showModal} open={open} setOpen={() => {
                        setOpen();
                        setModalMode("")
                    }} />
                )

            }
            <VerticallyCenteredModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
            {/* delete confirmation modal */}
            <DeleteConfirmationModal
                modalOpen={modalOpen} onModalOpen={setModalOpen} title={"Do you want to remove this category?"}
                onDelete={() => handleRemoveCategory(categoryId)}
            />
        </>
    );
};
export default CategoryListTable;