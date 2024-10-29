"use client"

import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import AddCategoryForm from './AddCategoryForm';
const AddCategoryModal = ({ open, setOpen, onCategories, categories }) => {

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
                title="Add Category"
                centered
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[]}
            >
                <AddCategoryForm handleCancel={handleCancel} handleOk={handleOk} onCategories={onCategories} categories={categories} />
            </Modal>
        </>
    );
};
export default AddCategoryModal;