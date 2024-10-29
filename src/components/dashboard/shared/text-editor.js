"use client"
// u0tu9tsod6p0m24d8snasre686b12d42n57ygcbqm6b9r9lm

import { Editor } from '@tinymce/tinymce-react';
import { Spin } from 'antd';
import { useRef, useState } from 'react';

export default function TextEditor({ onText }) {
    const [loading, setLoading] = useState(false);
    const editorRef = useRef(null);

    const handleTextOnBlur = () => {
        if (editorRef.current) {
            const content = editorRef.current.getContent();
            // 
            onText(content); // Pass content to the parent using the onText callback
        }
    };

    return (
        <>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <Spin size="large" />  {/* Ant Design spinner */}
                    <p>Loading Editor...</p>
                </div>
            ) : (
                <Editor
                    apiKey='u0tu9tsod6p0m24d8snasre686b12d42n57ygcbqm6b9r9lm'
                    onInit={(_evt, editor) => {
                        setLoading(false);
                        editorRef.current = editor;
                    }}
                    initialValue="<p>Enter your text here</p>"
                    init={{
                        height: 500,
                        plugins: [
                            // Core editing features
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                        // tinycomments_mode: 'embedded',
                    }}
                    onBlur={handleTextOnBlur} // Capture content on blur
                />
            )}
        </>

    );
}
