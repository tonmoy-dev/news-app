"use client"

import { Button, Form, Input, Modal, Select } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
const { Option } = Select;
const { TextArea } = Input;

const AddBreakingNewsModal = ({ open, setOpen, news, onNews, user }) => {
  const router = useRouter()
  const [form] = Form.useForm();

  const handleCancel = () => {
    setOpen(false);
  };

  const fetchBreakingNews = async () => {
    try {
      const response = await axios.get(`${process.env.AUTH_URL}/api/news/breaking-news`);
      if (response.data) {
        onNews([
          ...response.data
        ]);
      }
    } catch (error) {
      console.error('Error fetching breaking news:', error);
    }
  };



  // send breaking news data 
  async function sendData(data) {
    try {
      const response = await axios.post(`${process.env.AUTH_URL}/api/news/breaking-news`, data);
      if (response.data) {
        fetchBreakingNews();
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setOpen(false);
    }
  }

  // Handle form submission
  const onFinish = (values) => {
    const formData = {
      ...values,
      start_time: null,
      end_time: null,
      reporter_email: user.email,
      status: 'deactivated'
    };

    toast.promise(
      sendData(formData),
      {
        loading: 'Adding breaking news...',
        success: <b>New news added!</b>,
        error: <b>Could not added.</b>,
      }
    );
    // 
  };

  return (
    <>
      <Modal
        open={open}
        title="Add Breaking News"
        centered
        // onOk={handleOk}
        onCancel={handleCancel}
        footer={[
        ]}
      >
        {/* add breaking news form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: '600px', margin: '0 auto' }}
        >
          {/* news title */}
          <Form.Item
            label="News Title"
            name="title"
            rules={[{ required: true, message: 'Enter the breaking news!' }]}
          >
            <TextArea
              maxLength={100} // Limit characters to 100
              showCount // Optional, shows the count of characters
              placeholder="Enter breaking news"
              rows={4}
            />
          </Form.Item>

          {/* Status (Activate / Deactivate) */}
          {/* <Form.Item label="Status" name="status">
            <Switch
              checked={status}
              onChange={(checked) => setStatus(checked)}
              checkedChildren="ON"
              unCheckedChildren="OFF"
            />
          </Form.Item> */}

          <div className='flex items-center justify-end gap-2'>
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>
            {/* Submit Button */}
            <Form.Item style={{ marginBottom: "0" }}>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal >
    </>
  );
};
export default AddBreakingNewsModal;