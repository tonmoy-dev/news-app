import { Button, Form, Input, Select, Switch, Tag } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

const { Option } = Select;

const AddCategoryForm = ({ handleCancel, handleOk, onCategories, categories }) => {
    const [form] = Form.useForm();
    const [keywords, setKeywords] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [status, setStatus] = useState(false);

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

    // Handle adding keywords
    const handleAddKeyword = () => {
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

    // Handle form submission
    const onFinish = (values) => {
        const formData = {
            ...values,
            meta_keywords: keywords.join(', '),
            status
        };
        // 
        async function addCategory(formData) {
            try {
                // Axios PATCH request
                const response = await axios.post(`${process.env.AUTH_URL}/api/categories`, formData);

                if (response.status === 201) {
                    fetchCategories();
                    // toast.success('Category added successfully!');
                } else {
                    // toast.error('Category not added!');
                }
            } catch (error) {
                console.error('Error on adding:', error);
                // toast.error('Category not added!');
            } finally {
                handleOk();
            }
        }
        toast.promise(
            addCategory(formData),
            {
                loading: 'Adding category...',
                success: <b>New category added!</b>,
                error: <b>Could not add category.</b>,
            }
        );

    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
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

            {/* Parent Category */}
            {/* <Form.Item
                label="Parent Category"
                name="parent_category"
                rules={[{ required: true, message: 'Please select a parent category!' }]}
            >
                <Select placeholder="Select a parent category">
                    {parentCategories.map(category => (
                        <Option key={category.value} value={category.value}>
                            {category.label}
                        </Option>
                    ))}
                </Select>
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

            <Form.Item>
                <div className='flex justify-end gap-2'>
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button key="submit" htmlType="submit" type="primary">
                        Submit
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default AddCategoryForm;
