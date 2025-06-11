"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import {
    Card,
    Button,
    Table,
    Modal,
    Popconfirm,
    message,
    Avatar,
    Tag,
    Space,
    Typography,
    Form,
    Input,
} from "antd"
import {
    UserOutlined,
    TeamOutlined,
    CalendarOutlined,
    MailOutlined,
    CrownOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckOutlined,
    CloseOutlined,
} from "@ant-design/icons"

import {
    getGroupById,
    getAcceptedMembers,
    getPendingMembers,
    updateMemberStatus,
    deleteMember,
    updateGroup,
    deleteGroup,
} from "../../services/groupService"
import { getCurrentUser } from "../../services/authService"
import GroupPostPage from './GroupPostPage';

const { Title, Text, Paragraph } = Typography

const GroupDetail = () => {
    const { id: groupId } = useParams()
    const [groupInfo, setGroupInfo] = useState(null)
    const [acceptedMembers, setAcceptedMembers] = useState([])
    const [pendingMembers, setPendingMembers] = useState([])
    const [isAcceptedModalOpen, setAcceptedModalOpen] = useState(false)
    const [isPendingModalOpen, setPendingModalOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const { TextArea } = Input;
    const [form] = Form.useForm();
    const getAvatarUrl = (user) => {
        if (!user) return '/default-avatar.png'
        const avt = user.avt
        if (!avt) return '/default-avatar.png'
        const url = avt.startsWith('http') ? avt : `https://api-tdminh-17.onrender.com${avt}`
        return url
    }

    const openEditModal = () => {
        form.setFieldsValue({
            name: groupInfo?.name || '',
            description: groupInfo?.description || '',
        });
        setEditModalOpen(true);
    };

    const handleEditOk = () => {
        form
            .validateFields()
            .then(async (values) => {
                try {
                    await updateGroup(groupId, values);
                    message.success("Cập nhật nhóm thành công");
                    fetchGroupInfo();
                    setEditModalOpen(false);
                    form.resetFields();
                } catch (error) {
                    message.error("Cập nhật nhóm thất bại");
                }
            })
            .catch(() => { });
    };

    const handleEditCancel = () => {
        setEditModalOpen(false);
        form.resetFields();
    };

    const openDeleteModal = () => setDeleteModalOpen(true);

    const handleDeleteOk = async () => {
        try {
            await deleteGroup(groupId);
            message.success("Xóa nhóm thành công");
            setDeleteModalOpen(false);
            window.location.href = "/forum/group";
        } catch (error) {
            message.error("Xóa nhóm thất bại");
        }
    };

    const handleDeleteCancel = () => setDeleteModalOpen(false);

    const fetchGroupInfo = useCallback(async () => {
        try {
            const res = await getGroupById(groupId)
            setGroupInfo(res.data)
        } catch (err) {
            message.error("Lấy thông tin nhóm thất bại")
        } finally {
            setLoading(false)
        }
    }, [groupId])

    const fetchCurrentUser = async () => {
        try {
            const res = await getCurrentUser()
            setCurrentUser(res.data.data)
        } catch (err) { }
    }

    const fetchAcceptedMembers = async () => {
        try {
            const res = await getAcceptedMembers(groupId)
            setAcceptedMembers(res.data || [])
        } catch (err) {
            message.error("Lỗi lấy thành viên đã duyệt")
        }
    }

    const fetchPendingMembers = useCallback(async () => {
        try {
            const res = await getPendingMembers(groupId)
            setPendingMembers(res.data || [])
        } catch (err) {
            message.error("Lỗi lấy thành viên chờ duyệt")
        }
    }, [groupId])

    useEffect(() => {
        fetchGroupInfo()
        fetchCurrentUser()
        fetchPendingMembers()
    }, [fetchGroupInfo, fetchPendingMembers])

    const handleAccept = async (userId) => {
        try {
            await updateMemberStatus(groupId, userId, "accepted")
            message.success("Đã duyệt thành viên")
            await fetchPendingMembers()
            await fetchAcceptedMembers()
            await fetchGroupInfo()
        } catch (err) {
            message.error("Lỗi duyệt thành viên")
        }
    }

    const handleReject = async (userId) => {
        try {
            await updateMemberStatus(groupId, userId, "rejected")
            message.success("Đã từ chối thành viên")
            await fetchPendingMembers()
            await fetchGroupInfo()
        } catch (err) {
            message.error("Lỗi từ chối thành viên")
        }
    }

    const handleDelete = async (userId) => {
        try {
            await deleteMember(groupId, userId)
            message.success("Đã xóa thành viên")
            await fetchAcceptedMembers()
            await fetchGroupInfo()
        } catch (err) {
            message.error("Lỗi xóa thành viên")
        }
    }

    const isOwner = currentUser && groupInfo && currentUser.id === groupInfo.owner?.id

    const acceptedColumns = [
        {
            title: "STT",
            render: (_, __, index) => index + 1,
            width: 60,
        },
        {
            title: "Thành viên",
            render: (_, record) => (
                <Space>
                    <Avatar
                        src={getAvatarUrl(record.user)}
                        alt={record.user?.name || 'No name'}
                        onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = '/default-avatar.png'
                        }}
                    />
                    <div>
                        <div>{record.user?.name}</div>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            <MailOutlined /> {record.user?.email}
                        </Text>
                    </div>
                </Space>
            ),
        },
    ]

    if (isOwner) {
        acceptedColumns.push({
            title: "Hành động",
            render: (_, record) => (
                <Popconfirm
                    title="Xóa thành viên này?"
                    onConfirm={() => handleDelete(record.user_id)}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                        Xóa
                    </Button>
                </Popconfirm>
            ),
            width: 100,
        })
    }

    const pendingColumns = [
        {
            title: "Thành viên",
            render: (_, record) => (
                <Space>
                    <Avatar
                        src={getAvatarUrl(record.user)}
                        alt={record.user?.name || 'No name'}
                        onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = '/default-avatar.png'
                        }}
                    />
                    <div>
                        <div>{record.user?.name}</div>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            <MailOutlined /> {record.user?.email}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Space>
                    <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleAccept(record.user_id)}>
                        Duyệt
                    </Button>
                    <Button danger size="small" icon={<CloseOutlined />} onClick={() => handleReject(record.user_id)}>
                        Từ chối
                    </Button>
                </Space>
            ),
            width: 150,
        },
    ]

    if (loading) {
        return (
            <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
                <Card loading={loading} />
            </div>
        )
    }

    if (!groupInfo) {
        return (
            <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
                <Card>
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <Text type="secondary">Không tìm thấy thông tin nhóm</Text>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div style={{ minHeight: "100vh", padding: "36px 0", marginTop: "-32px" }}>
            <div style={{ maxWidth: 1050, margin: "0 auto", marginBottom: "-20px" }}>
                <Card
                    style={{
                        borderRadius: 18,
                        boxShadow: "0 4px 32px rgba(56, 100, 255, 0.08)",
                        background: "#fff",
                        padding: 0,
                        marginBottom: 36
                    }}
                    bodyStyle={{ padding: "32px 44px" }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 24,
                            marginBottom: 10,
                        }}
                    >
                        <Title level={2} style={{ margin: 0, letterSpacing: 0.5 }}>{groupInfo.name}</Title>
                        <Space>
                            {isOwner && (
                                <>
                                    <Button type="primary" icon={<EditOutlined />} onClick={openEditModal} style={{ borderRadius: 8 }}>
                                        Sửa
                                    </Button>
                                    <Button danger icon={<DeleteOutlined />} onClick={openDeleteModal} style={{ borderRadius: 8 }}>
                                        Xóa
                                    </Button>
                                </>
                            )}
                            {isOwner && (
                                <Button
                                    type="primary"
                                    icon={<UserOutlined />}
                                    onClick={() => {
                                        fetchPendingMembers()
                                        setPendingModalOpen(true)
                                    }}
                                    style={{ borderRadius: 8 }}
                                >
                                    Yêu cầu ({pendingMembers.length})
                                </Button>
                            )}
                        </Space>
                    </div>

                    {groupInfo.description && (
                        <Paragraph style={{ color: "#444", marginBottom: 24, fontSize: 16, lineHeight: 1.7 }}>
                            {groupInfo.description}
                        </Paragraph>
                    )}

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        marginBottom: 24,
                    }}>
                        <Avatar
                            src={getAvatarUrl(groupInfo.owner)}
                            size={40}
                            style={{ border: "1.5px solid #a5b4fc", background: "#fff" }}
                        />
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontWeight: 500, fontSize: 15 }}>{groupInfo.owner?.name}</span>
                                <Tag color="gold" icon={<CrownOutlined />} style={{ fontWeight: 500, borderRadius: 8, padding: "2px 10px", margin: 0 }}>
                                    Chủ nhóm
                                </Tag>
                            </div>
                            <Text type="secondary" style={{ fontSize: 13 }}>
                                <MailOutlined /> {groupInfo.owner?.email}
                            </Text>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 36,
                            flexWrap: "wrap",
                            margin: "0 0 24px 0",
                        }}
                    >
                        <Space>
                            <TeamOutlined style={{ color: "#1677ff", fontSize: 18 }} />
                            <Text strong style={{ fontSize: 16 }}>{groupInfo.member_count}</Text>
                            <Text style={{ color: "#888", fontSize: 15 }}>thành viên</Text>
                        </Space>
                        <Space>
                            <CalendarOutlined style={{ color: "#1677ff", fontSize: 18 }} />
                            <Text style={{ color: "#888", fontSize: 15 }}>
                                {new Date(groupInfo.created_at).toLocaleDateString("vi-VN")}
                            </Text>
                        </Space>
                        <Button
                            type="default"
                            icon={<TeamOutlined />}
                            onClick={() => {
                                fetchAcceptedMembers()
                                setAcceptedModalOpen(true)
                            }}
                            style={{ borderRadius: 8, marginLeft: 12 }}
                        >
                            Xem thành viên
                        </Button>
                    </div>

                    <Modal
                        title={`Thành viên nhóm`}
                        open={isAcceptedModalOpen}
                        onCancel={() => setAcceptedModalOpen(false)}
                        footer={null}
                        width={800}
                        bodyStyle={{ borderRadius: 16, padding: 0 }}
                    >
                        <Table
                            dataSource={acceptedMembers}
                            columns={acceptedColumns}
                            rowKey="id"
                            pagination={false}
                            size="middle"
                            bordered
                            style={{ borderRadius: 12, overflow: "hidden" }}
                        />
                    </Modal>

                    <Modal
                        title={`Yêu cầu tham gia (${pendingMembers.length})`}
                        open={isPendingModalOpen}
                        onCancel={() => setPendingModalOpen(false)}
                        footer={null}
                        width={800}
                        bodyStyle={{ borderRadius: 16, padding: 0 }}
                    >
                        <Table
                            dataSource={pendingMembers}
                            columns={pendingColumns}
                            rowKey="id"
                            pagination={false}
                            size="middle"
                            bordered
                            style={{ borderRadius: 12, overflow: "hidden" }}
                        />
                    </Modal>

                    <Modal
                        title="Sửa thông tin nhóm"
                        open={isEditModalOpen}
                        onOk={handleEditOk}
                        onCancel={handleEditCancel}
                        okText="Lưu"
                        cancelText="Hủy"
                        width={420}
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="name"
                                label="Tên nhóm"
                                rules={[{ required: true, message: "Vui lòng nhập tên nhóm" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label="Mô tả"
                                rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                        </Form>
                    </Modal>

                    <Modal
                        title="Xóa nhóm"
                        open={isDeleteModalOpen}
                        onOk={handleDeleteOk}
                        onCancel={handleDeleteCancel}
                        okText="Xóa"
                        okButtonProps={{ danger: true }}
                        cancelText="Hủy"
                        width={320}
                    >
                        <Text>Bạn chắc chắn muốn xóa nhóm này? Hành động này không thể hoàn tác.</Text>
                    </Modal>
                </Card>
            </div>

            <GroupPostPage groupId={groupId} />
        </div>
    )
}

export default GroupDetail