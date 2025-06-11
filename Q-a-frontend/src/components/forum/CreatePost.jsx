import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function CreatePost({ onCreate }) {
  return (
    <Button
      type="primary"
      block
      icon={<PlusOutlined />}
      onClick={onCreate}
      className="!bg-indigo-600 !text-white !border-indigo-700 hover:!bg-indigo-700 hover:!shadow-lg transition duration-300 transform hover:-translate-y-1 rounded-xl py-4 font-semibold shadow-md border"
    >
      Thêm bài viết
    </Button>
  );
}
