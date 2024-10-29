"use client"

import { Button, Form, Input, Select, Steps } from 'antd';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const { Option } = Select;
const { Step } = Steps;
const pageNames = ['PrivacyPolicy', 'TermsAndConditions', 'Login', 'Home', 'Contact'];  //  'DistrictNews',

function getFormattedDateTime() {
  const now = new Date();
  const formattedDateTime = now.toISOString().slice(0, 19).replace('T', ' '); // ISO format to the desired format
  return formattedDateTime;
}


const AddMetaInfoForm = ({ metaData }) => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({}); // Store all form values
  const router = useRouter();
  const formContainerRef = useRef(null);

  const pageNamesData = metaData?.map(item => item?.page_name);
  const filteredPageNames = pageNames.filter(page => !pageNamesData.includes(page));

  const steps = [
    {
      title: 'Page Info',
      content: (
        <>
          <Form.Item
            name="page_name"
            label="Choose Page Name"
            rules={[{ required: true, message: 'Please choose the page name!' }]}
          >
            <Select placeholder="Page Name">
              {/* Replace with your filteredPageNames */}
              {
                filteredPageNames.map(name => (
                  <Option key={name} value={name}>{name.replace(/([a-z])([A-Z])/g, '$1 $2')}</Option>
                ))
              }
            </Select>
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
            <Input.TextArea placeholder="Enter meta description" />
          </Form.Item>
          <Form.Item name="meta_author" label="Meta Author Content">
            <Input placeholder="Enter meta author content" />
          </Form.Item>
          <Form.Item name="meta_keywords" label="Meta Keywords">
            <Input placeholder="Enter meta keywords (comma-separated)" />
          </Form.Item>
          <Form.Item name="application_name" label="Application Name">
            <Input placeholder="Enter application name" />
          </Form.Item>
          <Form.Item name="canonical_url" label="Page Canonical URL">
            <Input placeholder="Enter page canonical URL" />
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
        </>
      ),
    },
    {
      title: 'Twitter Card Info',
      content: (
        <>
          <Form.Item name="twitter_card" label="Twitter Card Type">
            <Input placeholder="Enter Twitter card type" />
          </Form.Item>
          <Form.Item name="twitter_title" label="Twitter Card Title">
            <Input placeholder="Enter Twitter Card title" />
          </Form.Item>
          <Form.Item name="twitter_site" label="Twitter Card Site">
            <Input placeholder="Enter Twitter Card site" />
          </Form.Item>
          <Form.Item name="twitter_img_url" label="Twitter Card Image URL">
            <Input placeholder="Enter Twitter Card image URL" />
          </Form.Item>
          <Form.Item name="twitter_img_alt" label="Twitter Card Image Alt">
            <Input placeholder="Enter Twitter Card image alt text" />
          </Form.Item>
          <Form.Item name="twitter_description" label="Twitter Card Description">
            <Input.TextArea placeholder="Enter Twitter Card description" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Open Graph Info',
      content: (
        <>
          <Form.Item name="og_title" label="Open Graph Title">
            <Input placeholder="Enter Open Graph title" />
          </Form.Item>
          <Form.Item name="og_site_name" label="Open Graph Site Name">
            <Input placeholder="Enter Open Graph site name" />
          </Form.Item>
          <Form.Item name="og_description" label="Open Graph Description">
            <Input.TextArea placeholder="Enter Open Graph description" />
          </Form.Item>
          <Form.Item name="og_url" label="Open Graph URL">
            <Input placeholder="Enter Open Graph URL" />
          </Form.Item>
          <Form.Item name="og_type" label="Open Graph Type">
            <Input placeholder="Enter Open Graph type" />
          </Form.Item>
          <Form.Item name="og_locale" label="Open Graph Locale">
            <Input placeholder="Enter Open Graph locale" />
          </Form.Item>
          <Form.Item name="og_image_url" label="Open Graph Image URL">
            <Input placeholder="Enter Open Graph image URL" />
          </Form.Item>
          <Form.Item name="og_image_alt" label="Open Graph Image Alt">
            <Input placeholder="Enter Open Graph image alt text" />
          </Form.Item>
        </>
      ),
    },
    {
      title: 'JSON-LD Info',
      content: (
        <>
          <Form.Item name="json_ld_type" label="JSON-LD Type">
            <Input placeholder="Enter JSON-LD type" />
          </Form.Item>
          <Form.Item name="json_ld_headline" label="JSON-LD Headline">
            <Input placeholder="Enter JSON-LD headline" />
          </Form.Item>
          <Form.Item name="json_ld_description" label="JSON-LD Description">
            <Input.TextArea placeholder="Enter JSON-LD description" />
          </Form.Item>
          <Form.Item name="json_ld_image_url" label="JSON-LD Image URL">
            <Input placeholder="Enter JSON-LD image URL" />
          </Form.Item>
          <Form.Item name="json_ld_author_type" label="JSON-LD Author Type">
            <Input placeholder="Enter JSON-LD author type" />
          </Form.Item>
          <Form.Item name="json_ld_author_name" label="JSON-LD Author Name">
            <Input placeholder="Enter JSON-LD author name" />
          </Form.Item>
          <Form.Item name="json_ld_publisher_type" label="JSON-LD Publisher Type">
            <Input placeholder="Enter JSON-LD publisher type" />
          </Form.Item>
          <Form.Item name="json_ld_publisher_name" label="JSON-LD Publisher Name">
            <Input placeholder="Enter JSON-LD publisher name" />
          </Form.Item>
          <Form.Item name="json_ld_logo_img_url" label="JSON-LD Logo Image URL">
            <Input placeholder="Enter JSON-LD logo image URL" />
          </Form.Item>
        </>
      ),
    },
  ];

  const next = async () => {
    try {
      // Validate the current step
      const values = await form.validateFields();
      setFormData({ ...formData, ...values }); // Save current step values

      // Scroll to the top of the form container
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

      setCurrent(current + 1);
      form.resetFields(); // Reset fields for next step
    } catch (error) {
      // console.error('Validation Failed:', error);
      toast.error('Fill all the required fields');
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinish = async (values) => {
    let finalFormData;

    try {
      const values = await form.validateFields();
      finalFormData = { ...formData, ...values }; // Merge all form data
      // 
    } catch (error) {
      // console.error('Validation Failed:', error);
      toast.error('Fill all the required fields');
    }

    // Loop through all the fields in initialValues and set default values where the form provides undefined
    // const finalValues = {};
    // for (const key in initialValues) {
    //   finalValues[key] = values[key] !== undefined && values[key] !== null ? values[key] : initialValues[key];
    // }

    const data = {
      ...finalFormData,
      json_ld_date_published: getFormattedDateTime(),
      json_ld_date_modified: getFormattedDateTime(),
    }
    // const finalValues = {};
    // for (const key in values) {
    //   finalValues[key] = values[key] !== undefined && values[key] !== null ? values[key] : "";
    // }

    async function addMetaInfo(data) {
      try {
        const response = await axios.post('/api/site-settings/meta-info', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 201) {
          form.resetFields(); // Reset the form fields after successful submission
          router.push("/dashboard/pages-list")
        } else {
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    toast.promise(
      addMetaInfo(data),
      {
        loading: 'Adding meta info...',
        success: <b>Meta info added!</b>,
        error: <b>Could not added.</b>,
      }
    );

  };



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

      <div style={{ maxWidth: 800, background: '#fff', padding: 30, borderRadius: 10 }} ref={formContainerRef}>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={initialValues}
          style={{ maxWidth: 800, marginTop: 20 }}
        >
          <div>{steps[current].content}</div>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" onClick={next} disabled={current === steps.length - 1}>
              Next
            </Button>
            <Button style={{ margin: '0 8px' }} onClick={prev} disabled={current === 0}>
              Previous
            </Button>
            {current === steps.length - 1 && (
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AddMetaInfoForm;




export const initialValues = {
  page_name: "Home",
  title: "News Portal - Latest Updates",
  meta_description: "Get the latest and trending news from around the globe.",
  meta_author: "News Team",
  meta_keywords: "news, latest updates, breaking news, world news",

  application_name: "NewsPortal",
  canonical_url: "https://www.newswebsite.com",
  icon_url: "https://www.newswebsite.com/favicon.ico",
  shortcut_icon_url: "https://www.newswebsite.com/favicon.ico",
  apple_icon_url: "https://www.newswebsite.com/apple-touch-icon.png",

  og_title: "News Portal - Latest Updates",
  og_description: "Get the latest and trending news from around the globe.",
  og_url: "https://www.newswebsite.com",
  og_site_name: "News Portal",
  og_type: "website",
  og_locale: "en_US",
  og_image_url: "https://www.newswebsite.com/og-image.jpg",
  og_image_alt: "News Website Banner",

  twitter_card: "summary_large_image",
  twitter_title: "News Portal - Breaking News",
  twitter_description: "Stay informed with real-time news updates.",
  twitter_site: "@newsportal",
  twitter_img_url: "https://www.newswebsite.com/twitter-image.jpg",
  twitter_img_alt: "News Website Twitter Image",

  json_ld_type: "Article",
  json_ld_headline: "Breaking News: Global Updates",
  json_ld_image_url: "https://www.newswebsite.com/jsonld-image.jpg",
  json_ld_description: "Comprehensive coverage of the latest news.",
  json_ld_author_type: "Organization",
  json_ld_author_name: "News Portal",
  json_ld_publisher_type: "Organization",
  json_ld_publisher_name: "News Portal",
  json_ld_logo_img_url: "https://www.newswebsite.com/logo.png",
};