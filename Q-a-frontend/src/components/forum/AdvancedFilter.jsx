import React, { useState, useEffect } from 'react';
import { Modal, Button, DatePicker, Input, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;

export default function AdvancedFilter({ onFilter }) {
    const [visible, setVisible] = useState(false);
    const [tags, setTags] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [sort, setSort] = useState('desc');
    const [availableTags, setAvailableTags] = useState([]);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch('https://api-phu-6.onrender.com/api/tags', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token'),
                    }
                });

                const data = await res.json();
                console.log('TAG FETCH RESULT:', data);

                if (data.status === 'success' && Array.isArray(data.data)) {
                    setAvailableTags(data.data.map(tag => tag.name));
                } else {
                    console.warn('Unexpected tag response:', data);
                    setAvailableTags([]);
                }

            } catch (err) {
                console.error('Lỗi khi tải tags:', err);
            }
        };

        fetchTags();
    }, []);

    const handleSubmit = () => {
        const filterValues = {
            tags,
            user_name: userName || null,
            from_date: dateRange?.[0]?.format('YYYY-MM-DD') || null,
            to_date: dateRange?.[1]?.format('YYYY-MM-DD') || null,
            sort,
        };
        onFilter(filterValues);
        setVisible(false);
    };

    return (
        <>
            <Button
                block
                icon={<FilterOutlined />}
                onClick={() => setVisible(true)}
                className="!bg-white !text-gray-800 !border-gray-300 hover:!bg-gray-200 hover:!shadow-lg transition duration-300 transform hover:-translate-y-1 rounded-xl py-4 font-semibold shadow-md border"
            >
                Lọc
            </Button>

            <Modal
                title="Lọc bài viết"
                open={visible}
                onCancel={() => setVisible(false)}
                onOk={handleSubmit}
                okText="Lọc"
                cancelText="Hủy"
            >
                <div className="space-y-4">
                    <Input
                        placeholder="Tên người dùng"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        allowClear
                    />

                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Chọn tag"
                        value={tags}
                        onChange={(value) => setTags(value)}
                        options={availableTags.map(tag => ({ value: tag, label: tag }))}
                        allowClear
                    />

                    <RangePicker
                        style={{ width: '100%' }}
                        onChange={(dates) => setDateRange(dates)}
                    />

                    <Select
                        style={{ width: '100%' }}
                        value={sort}
                        onChange={value => setSort(value)}
                    >
                        <Select.Option value="desc">Mới nhất</Select.Option>
                        <Select.Option value="asc">Cũ nhất</Select.Option>
                    </Select>
                </div>
            </Modal>
        </>
    );
}
