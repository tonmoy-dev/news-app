"use client"

import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import EditCategoryForm from './EditCategoryForm';

const EditCategoryModal = ({ open, setOpen, categoryData, onCategories, categories }) => {
    const handleOk = () => {
        setOpen(false);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    return (
        <>
            <Modal
                open={open}
                title="Edit Category"
                centered
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[]}
            >
                <EditCategoryForm categoryData={categoryData} handleOk={handleOk} onCategories={onCategories} categories={categories} />
            </Modal>
        </>
    );
};
export default EditCategoryModal;