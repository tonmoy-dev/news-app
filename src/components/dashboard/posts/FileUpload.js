"use client"

import React, { useState } from 'react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';

const FileUpload = ({ onImageName }) => {
    const [fileList, setFileList] = useState([]);
    // const [fileName, setFileName] = useState('')

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);

        if (newFileList[0]) {
            onFileSubmit(newFileList);
        }
    };

    const onFileSubmit = async (file) => {
        if (!file) return

        try {
            const data = new FormData()
            data.set('file', file[0].originFileObj)

            await fetch('/api/upload', {
                method: 'POST',
                body: data
            })
                .then(res => res.json())
                .then(data => onImageName(data.filename))
                .catch(err => console.error(error))

        } catch (e) {
            // Handle errors here
            console.error(e)
        }
    }
    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
    return (
        <ImgCrop rotationSlider cropShape="rect" minZoom={0}>
            <Upload
                // action={handleUpload}
                // action="/api/upload"
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                maxCount={1}
            >
                + Upload
            </Upload>
        </ImgCrop>
    );
};
export default FileUpload;