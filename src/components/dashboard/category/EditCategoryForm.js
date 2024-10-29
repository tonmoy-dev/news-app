import { Button, Form, Input, Switch, Tag } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

const EditCategoryForm = ({ categoryData, handleOk, onCategories, categories }) => {
    const [form] = Form.useForm();
    const [keywords, setKeywords] = useState(categoryData?.meta_keywords?.split(",").map(item => item.trim()));
    const [inputValue, setInputValue] = useState('');
    const [status, setStatus] = useState(categoryData.status);
    const router = useRouter();

    const initialValues = {
        name: categoryData.name,
        meta_title: categoryData.meta_title,
        meta_description: categoryData.meta_description
    }

    // Handle adding keywords
    const handleAddKeyword = (e) => {
        e.preventDefault();

        if (inputValue && !keywords.includes(inputValue)) {
            setKeywords([...keywords, inputValue]);
            setInputValue('');
        }
    };

    // Handle removing a keyword
    const handleRemoveKeyword = (removedKeyword) => {
        const newKeywords = keywords.filter(keyword => keyword !== removedKeyword);
        setKeywords(newKeywords);
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.AUTH_URL}/api/categories`);

            if (response.data) {
                onCategories([
                    ...response.data
                ]);
                toast.success('Category List updated successfully!');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Handle form submission
    const onFinish = (values) => {
        const formData = {
            ...values,
            meta_keywords: keywords.join(', '),
            status
        };
        // 
        async function editCategory(formData) {
            try {
                // Axios PATCH request
                const response = await axios.patch(`${process.env.AUTH_URL}/api/categories/${categoryData?.id}`, formData);
                if (response.data) {
                    fetchCategories();
                } else {

                }
            } catch (error) {
                console.error('Error on adding:', error);
            } finally {
                handleOk();
            }
        }
        toast.promise(
            editCategory(formData),
            {
                loading: 'Updating category info...',
                success: <b>Category info updated!</b>,
                error: <b>Could not updated.</b>,
            }
        );
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={initialValues}
            style={{ maxWidth: '600px', margin: '0 auto' }}
        >
            {/* Category Name */}
            <Form.Item
                label="Category Name"
                name="name"
                style={{ marginTop: "20px" }}
                rules={[{ required: true, message: 'Please enter the category name!' }]}
            >
                <Input placeholder="Enter category name" />
            </Form.Item>

            {/* Name Slug */}
            {/* <Form.Item
                label="Name Slug"
                name="name_slug"
                rules={[{ required: true, message: 'Please enter the name slug!' }]}
            >
                <Input placeholder="Enter name slug (e.g., category-name)" />
            </Form.Item> */}

            {/* Meta Title */}
            <Form.Item
                label="Meta Title"
                name="meta_title"
                rules={[{ required: true, message: 'Please enter the meta title!' }]}
            >
                <Input placeholder="Enter meta title" />
            </Form.Item>

            {/* Meta Keywords */}
            <Form.Item
                label="Meta Keywords"
                name="meta_keywords"
            >
                <div>
                    <Input
                        placeholder="Enter a keyword and press Enter"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onPressEnter={handleAddKeyword}
                    />
                    <div style={{ marginTop: 10 }}>
                        {keywords.map((keyword) => (
                            <Tag
                                key={keyword}
                                closable
                                onClose={() => handleRemoveKeyword(keyword)}
                            >
                                {keyword}
                            </Tag>
                        ))}
                    </div>
                </div>
            </Form.Item>

            {/* Meta Description */}
            <Form.Item
                label="Meta Description"
                name="meta_description"
                rules={[{ required: true, message: 'Please enter the meta description!' }]}
            >
                <Input.TextArea rows={3} placeholder="Enter meta description" />
            </Form.Item>

            {/* Status (Activate / Deactivate) */}
            <Form.Item label="Status" name="status">
                <Switch
                    checked={status}
                    onChange={(checked) => setStatus(checked)}
                    checkedChildren="Activate"
                    unCheckedChildren="Deactivate"
                />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Save Changes
                </Button>
            </Form.Item>
        </Form>
    );
};

export default EditCategoryForm;
