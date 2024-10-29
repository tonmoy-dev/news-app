"use client";

import React from 'react';
import { Modal, Form, Input, Button, message, Row, Col, Select } from 'antd';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const { Option } = Select;

const EditMetaInfoModal = ({ visible, onCancel, onOk, metaData }) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values) => {
    // Create a new object excluding empty values and 'page_name'
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => key !== 'page_name' && value !== '')
    );


    async function updateMetaInfo(page_name, data) {
      try {
        const response = await axios.patch('/api/site-settings/meta-info', {
          page_name, data
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          form.resetFields(); // Reset the form fields after successful submission
          router.push("/dashboard/pages-list");
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        onOk(); // Call onOk to close the modal and refresh data if necessary
      }
    }

    toast.promise(
      updateMetaInfo(values?.page_name, filteredValues),
      {
        loading: 'Adding meta info...',
        success: <b>Meta info added!</b>,
        error: <b>Could not add.</b>,
      }
    );
  };

  return (
    <Modal
      title="Edit Meta Information"
      open={visible}
      onCancel={onCancel}
      footer={null} // No default footer buttons
      width="80%" // Set modal width to full width
    >

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 1200, margin: '0 auto' }}
        initialValues={metaData}
      >
        <Row gutter={16}>
          {/* Column 1: Meta Information and Twitter Card */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="page_name"
              label="Choose Page Name"
              rules={[{ required: true, message: 'Please choose the page name!' }]}
            >
              <Input placeholder="Enter page name" disabled />
            </Form.Item>

            <Form.Item
              name="title"
              label="Page Title"
              rules={[{ required: true, message: 'Please input the title!' }]}
            >
              <Input placeholder="Enter page title" />
            </Form.Item>

            <Form.Item
              name="meta_description"
              label="Meta Description"
              rules={[{ required: true, message: 'Please input the meta description!' }]}
            >
              <Input.TextArea placeholder="Enter meta description"
              //  rows={4} 
              />
            </Form.Item>

            <Form.Item
              name="meta_author"
              label="Meta Author Content"
            >
              <Input placeholder="Enter meta author content" />
            </Form.Item>

            <Form.Item
              name="meta_keywords"
              label="Meta Keywords"
            >
              <Input placeholder="Enter meta keywords (comma-separated)" />
            </Form.Item>


            <Form.Item
              name="twitter_card"
              label="Twitter Card Type"
            >
              <Input placeholder="Enter Twitter card type" />
            </Form.Item>

            <Form.Item
              name="twitter_title"
              label="Twitter Card Title"
            >
              <Input placeholder="Enter Twitter Card title" />
            </Form.Item>



            <Form.Item
              name="twitter_site"
              label="Twitter Card Site"
            >
              <Input placeholder="Enter Twitter Card site" />
            </Form.Item>

            <Form.Item
              name="twitter_img_url"
              label="Twitter Card Image URL"
            >
              <Input placeholder="Enter Twitter Card image URL" />
            </Form.Item>

            <Form.Item
              name="twitter_img_alt"
              label="Twitter Card Image Alt"
            >
              <Input placeholder="Enter Twitter Card image alt text" />
            </Form.Item>
            <Form.Item
              name="twitter_description"
              label="Twitter Card Description"
            >
              <Input.TextArea placeholder="Enter Twitter Card description"
                rows={1}
              />
            </Form.Item>
          </Col>

          {/* Column 2: Open Graph and Additional Metadata */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="og_title"
              label="Open Graph Title"
            >
              <Input placeholder="Enter Open Graph title" />
            </Form.Item>
            <Form.Item
              name="og_site_name"
              label="Open Graph Site Name"
            >
              <Input placeholder="Enter Open Graph site name" />
            </Form.Item>
            <Form.Item
              name="og_description"
              label="Open Graph Description"
            >
              <Input.TextArea placeholder="Enter Open Graph description"
              // rows={4}
              />
            </Form.Item>

            <Form.Item
              name="og_url"
              label="Open Graph URL"
            >
              <Input placeholder="Enter Open Graph URL" />
            </Form.Item>

            <Form.Item
              name="og_type"
              label="Open Graph Type"
            >
              <Input placeholder="Enter Open Graph type" />
            </Form.Item>

            <Form.Item
              name="og_locale"
              label="Open Graph Locale"
            >
              <Input placeholder="Enter Open Graph locale" />
            </Form.Item>

            <Form.Item
              name="og_image_url"
              label="Open Graph Image URL"
            >
              <Input placeholder="Enter Open Graph image URL" />
            </Form.Item>

            <Form.Item
              name="og_image_alt"
              label="Open Graph Image Alt"
            >
              <Input placeholder="Enter Open Graph image alt text" />
            </Form.Item>

            <Form.Item
              name="icon_url"
              label="Fav Icon URL"
            >
              <Input placeholder="Enter Fav icon URL" />
            </Form.Item>

            <Form.Item
              name="shortcut_icon_url"
              label="Fav Shortcut Icon URL"
            >
              <Input placeholder="Enter Fav shortcut icon URL" />
            </Form.Item>

            <Form.Item
              name="apple_icon_url"
              label="Apple Fav Icon URL"
            >
              <Input placeholder="Enter Apple Fav icon URL" />
            </Form.Item>

          </Col>

          {/* Column 3: JSON-LD Fields */}
          <Col xs={24} sm={8}>
            <Form.Item
              name="json_ld_type"
              label="JSON-LD Type"
            >
              <Input placeholder="Enter JSON-LD type" />
            </Form.Item>

            <Form.Item
              name="json_ld_headline"
              label="JSON-LD Headline"
            >
              <Input placeholder="Enter JSON-LD headline" />
            </Form.Item>

            <Form.Item
              name="json_ld_description"
              label="JSON-LD Description"
            >
              <Input.TextArea
                placeholder="Enter JSON-LD description"
              // rows={4}
              />
            </Form.Item>

            <Form.Item
              name="json_ld_image_url"
              label="JSON-LD Image URL"
            >
              <Input placeholder="Enter JSON-LD image URL" />
            </Form.Item>

            <Form.Item
              name="json_ld_author_type"
              label="JSON-LD Author Type"
            >
              <Input placeholder="Enter JSON-LD author type" />
            </Form.Item>

            <Form.Item
              name="json_ld_author_name"
              label="JSON-LD Author Name"
            >
              <Input placeholder="Enter JSON-LD author name" />
            </Form.Item>

            <Form.Item
              name="json_ld_publisher_type"
              label="JSON-LD Publisher Type"
            >
              <Input placeholder="Enter JSON-LD publisher type" />
            </Form.Item>

            <Form.Item
              name="json_ld_publisher_name"
              label="JSON-LD Publisher Name"
            >
              <Input placeholder="Enter JSON-LD publisher name" />
            </Form.Item>

            <Form.Item
              name="json_ld_logo_img_url"
              label="JSON-LD Logo Image URL"
            >
              <Input placeholder="Enter JSON-LD logo image URL" />
            </Form.Item>
            <Form.Item
              name="application_name"
              label="Application Name"
            >
              <Input placeholder="Enter application name" />
            </Form.Item>
            <Form.Item
              name="canonical_url"
              label="Page Canonical URL"
            >
              <Input placeholder="Enter page canonical URL" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditMetaInfoModal;
