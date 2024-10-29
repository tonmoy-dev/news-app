"use client"

import { Button, Form, Input, Modal, Select } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
const { Option } = Select;

const EditSocialSettings = ({ onSocialLinks, socialLinks, selectedSocial, setSeletedSocial, socialData, modalOpen, setModalOpen }) => {
  const [formStatus, setFormStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: socialData.name,
    link: socialData.link,
    counts: socialData.counts,
  });
  const [form] = Form.useForm();

  const fetchSocials = async () => {
    try {
      const response = await axios.get(`${process.env.AUTH_URL}/api/site-settings/socials`);
      if (response.data) {
        onSocialLinks([
          ...response.data
        ]);
        toast.success('Social Links updated successfully!');
      }
    } catch (error) {
      console.error('Error fetching socials:', error);
    }
  };

  // Handle Add Social
  const onFinish = async (values) => {

    // edit mode
    const data = {
      id: socialData?.id,
      name: values?.name,
      link: values?.link,
      counts: values?.counts,
      status: socialData?.status
    }

    async function updateSocial(data) {
      try {
        // Axios PATCH request
        const response = await axios.put(`${process.env.AUTH_URL}/api/site-settings/socials`, data);
        if (response.data) {

          // Reset the form fields after successful addition
          form.resetFields();
          // 
          setModalOpen(false);
          fetchSocials();
        } else {

        }
      } catch (error) {
        console.error('Error on adding:', error);
      } finally { };
    }
    toast.promise(
      updateSocial(data),
      {
        loading: 'Updating social info...',
        success: <b>Social info updated!</b>,
        error: <b>Could not updated.</b>,
      }
    );

  };


  const handleCancel = () => {
    setSeletedSocial(null);
    setModalOpen(false);
  };

  return (
    <div>
      <Modal
        title={`Edit Social`}
        open={modalOpen}
        onCancel={handleCancel}
        onOk={() => setModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={initialValues}
        >
          <Form.Item
            label="Select your social platform"
            name="name"
            rules={[{ required: true, message: 'Please select an platform!' }]}
          >
            <Select placeholder="Select an option">
              <Option value="Facebook">Facebook</Option>
              <Option value="Twitter">Twitter</Option>
              <Option value="YouTube">YouTube</Option>
              <Option value="Instagram">Instagram</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Link" name="link" rules={[
            {
              required: true,
              message: 'Please input social link!',
            },
          ]}>
            <Input
              placeholder="Enter social link"
            />
          </Form.Item>
          <Form.Item label="Counts" name="counts" rules={[
            {
              required: true,
              message: 'Please input social counts!',
            },
          ]}>
            <Input
              placeholder="Enter social counts"
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="mt-4">
            Edit Social
          </Button>
        </Form>
      </Modal>
    </div >
  );
};

export default EditSocialSettings;
