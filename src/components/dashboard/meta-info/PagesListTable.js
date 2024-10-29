"use client"
import { Space, Table } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useMediaQuery } from 'react-responsive';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import EditMetaInfoModal from './EditMetaInfoModal';

const getLink = (name) => {
    switch (name) {
        case "PrivacyPolicy":
            return "/privacy-policy";
        case "TermsAndConditions":
            return "/terms-conditions";
        // case "DistrictNews":
        //     return "/district-news";
        case "Login":
            return "/login";
        case "Home":
            return "/";
        case "Contact":
            return "/contact";
        default:
            return "/";
    }
}

const PagesListTable = ({ pagesData }) => {
    const [pages, setPages] = useState(pagesData);
    const [pageId, setPageId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentMetaData, setCurrentMetaData] = useState(null);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });


    // Handle deleting page
    const handleDeletePage = (key) => {
        setPages((prevPage) => prevPage.filter((page) => page.key !== key));
        setPageId(null);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
        setCurrentMetaData(null)
        // Optionally, refresh your data here or perform any actions after form submission
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setCurrentMetaData(null)
    };

    const columns = [
        {
            title: 'SL',
            dataIndex: 'serial',
            key: 'serial',
            render: (text, record, index) => {
                // Calculate serial number based on the current page
                return (1 - 1) * 6 + index + 1;
            },
        },
        // Page Name 
        {
            title: 'Page Name',
            dataIndex: 'page_name',
            key: 'page_name',
            render: (key) => <span>{key.replace(/([a-z])([A-Z])/g, '$1 $2')}</span>
        },
        // Page Link
        {
            title: 'Page Link',
            dataIndex: 'page_link',
            key: 'page_link',
            render: (_, record) => (
                <>
                    <Space size="middle" className="mx-2">
                        <Link
                            href={`${process.env.NEXT_PUBLIC_APP_URL}${getLink(record.page_name)}`}
                            target="_blank"
                            style={{ color: "#000000", display: "flex", alignItems: "center", gap: "6px" }}>
                            <span>Open Link</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                            </svg>

                        </Link>
                    </Space>
                </>
            ),
            // ellipsis: true,
        },
        // title
        {
            title: 'Page Title',
            dataIndex: 'title',
            key: 'title',
            render: (key) => <span>{key}</span>
            // ellipsis: true,
        },
        // meta description
        {
            title: 'Meta Description',
            dataIndex: 'meta_description',
            key: 'meta_description',
            render: (key) => <span>{key.slice(0, 30)}...</span>
            // ellipsis: true,
        },
        // meta keywords
        {
            title: 'Meta Keywords',
            dataIndex: 'meta_keywords',
            key: 'meta_keywords',
            render: (key) => <span>{key.slice(0, 30)}...</span>
            // ellipsis: true,
        },
        // action
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    {/* add/edit button */}
                    <Space size="middle" className="mx-2">
                        <button onClick={() => {
                            setCurrentMetaData(record);
                            showModal();
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </button>
                    </Space>
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
            <Table
                rowKey={"id"}
                columns={columns}
                dataSource={pages}
                pagination={false}
                scroll={isSmallScreen ? { x: 'max-content' } : undefined}  // Conditionally enable scrolling
            />

            {/* Edit Modal */}

            {
                currentMetaData && (
                    <EditMetaInfoModal
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        onOk={handleOk}
                        metaData={currentMetaData}
                    />
                )
            }


            {/* delete confirmation modal */}
            <DeleteConfirmationModal
                modalOpen={modalOpen} onModalOpen={setModalOpen} title={"Do you want to delete this page?"}
                onDelete={() => handleDeletePage(pageId)}
            />
        </>
    );
};
export default PagesListTable;