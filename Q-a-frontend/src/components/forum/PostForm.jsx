import React, { useState, useRef } from 'react';
import MarkdownPreview from './MarkdownPreview';
import Toolbar from './Toolbar';
import {
  useTextFormatting,
  useInsertList,
  useAutoList,
} from '../../hooks/editorHooks';

export default function PostForm({ onClose, onSubmit, initialData }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [hashtags, setHashtags] = useState(initialData?.hashtags || '');

  const textareaRef = useRef(null);
  const cursorPosRef = useRef(null);

  const handleContentChange = (e) => setContent(e.target.value);

  const {
    insertAtCursor,
    insertAlignAtCursor,
  } = useTextFormatting(textareaRef, setContent);

  const { insertListAtCursor } = useInsertList(textareaRef, setContent);

  const { handleContentKeyDown } = useAutoList(
    textareaRef,
    setContent,
    cursorPosRef,
    content
  );

  const imageInputRef = useRef();
  const fileInputRef = useRef();

  const handleImageUploadClick = () => imageInputRef.current.click();
  const handleFileUploadClick = () => fileInputRef.current.click();

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://api-tdminh-17.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });

      const contentType = res.headers.get('content-type');

      if (!res.ok || !contentType?.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Phản hồi không hợp lệ: ${text}`);
      }

      const data = await res.json();
      const url = data.url;

      const markdown =
        type === 'image'
          ? `![${file.name}](${url})`
          : `\n[${file.name}](${url})\n`;

      insertAtCursor(markdown, '', false);
    } catch (err) {
      console.error('❌ Lỗi upload:', err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, hashtags });
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto bg-white p-6 rounded-md shadow-md">
      <button
        onClick={onClose}
        className="absolute top-4 right-6 text-gray-600 hover:text-red-600 text-3xl font-bold"
        type="button"
        aria-label="Đóng form"
      >
        &times;
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold text-center mb-2">Tạo bài viết mới</h2>

        <div>
          <label className="block mb-2 font-medium" htmlFor="title">Chủ đề <span className="text-red-500">*</span></label>
          <textarea
            id="title"
            required
            rows={3}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-1 resize-none overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập chủ đề bài viết"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="content">Nội dung <span className="text-red-500">*</span></label>
          <Toolbar {...{ insertAtCursor, insertAlignAtCursor, insertListAtCursor, handleImageUploadClick, handleFileUploadClick }} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ minHeight: '200px' }}>
            <textarea
              id="content"
              ref={textareaRef}
              required
              rows={10}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleContentKeyDown}
              className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="Viết nội dung bài viết bằng Markdown..."
              style={{ minHeight: '200px' }}
            />
            <MarkdownPreview content={content} />
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={(e) => handleUpload(e, 'image')}
          className="hidden"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleUpload(e, 'file')}
          className="hidden"
        />

        <div>
          <label className="block mb-3 font-medium" htmlFor="hashtags">Hashtags (cách nhau bằng dấu cách)</label>
          <input
            id="hashtags"
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 leading-normal font-sans focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tag1 tag2 tag3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl transition-colors font-semibold"
        >
          Đăng bài
        </button>
      </form>
    </div>
  );
}
