"use client"

import { useState, useEffect } from "react"
import { Button, Modal, Form, Input, message, Typography, Space, Tag, Avatar, Empty, Tooltip } from "antd"
import { PlusOutlined, UserOutlined, TeamOutlined, EyeOutlined, ClockCircleOutlined } from "@ant-design/icons"
import { getAllGroups, getGroupsWithLecturer, createGroup } from "../../services/groupService"
import { joinGroup } from "../../services/groupMemberService"
import { useNavigate } from "react-router-dom"

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const Group = () => {
  const [groups, setGroups] = useState([])
  const [myGroups, setMyGroups] = useState([])
  const [, setLoading] = useState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const userRole = typeof window !== "undefined" ? localStorage.getItem("role") : null

  useEffect(() => {
    if (userRole === "lecturer") fetchMyGroups()
    fetchGroups()
  }, [userRole])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const response = await getAllGroups()
      setGroups(response.data.data || [])
    } catch {
      message.error("Không thể tải danh sách nhóm")
    } finally {
      setLoading(false)
    }
  }

  const fetchMyGroups = async () => {
    try {
      const response = await getGroupsWithLecturer()
      setMyGroups(response.data.data || [])
    } catch { }
  }

  const handleCreateGroup = async (values) => {
    try {
      await createGroup(values)
      message.success("Tạo nhóm thành công!")
      setCreateModalVisible(false)
      form.resetFields()
      fetchGroups()
      fetchMyGroups()
    } catch {
      message.error("Không thể tạo nhóm")
    }
  }

  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId)
      message.success("Đã gửi yêu cầu tham gia nhóm!")
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, status: "pending" } : g))
    } catch (error) {
      if (error.response?.status === 400) {
        message.warning("Bạn đã gửi yêu cầu hoặc là thành viên trong nhóm")
      } else {
        message.error("Không thể gửi yêu cầu tham gia")
      }
    }
  }

  const handleViewGroup = (group) => {
    const isStudent = userRole === "student"
    if (isStudent && group.status !== "accepted") {
      message.warning("Bạn chưa được duyệt vào nhóm này!")
      return
    }
    navigate(`/forum/group/${group.id}`)
  }

  const isGroupOwnedByLecturer = (groupId) => myGroups.some(g => g.id === groupId)

  const joinedGroups = groups.filter(g => g.status === "accepted")
  const pendingGroups = groups.filter(g => g.status === "pending")
  const otherGroups = groups.filter(g => !["accepted", "pending"].includes(g.status))

  const GroupCard = ({ group }) => {
    const isOwner = isGroupOwnedByLecturer(group.id)
    return (
      <div className="kanban-card">
        <Avatar
          size={48}
          icon={<TeamOutlined />}
          style={{ background: "#fff", color: "#1677ff", border: "2px solid #1677ff" }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Tooltip title={group.name}>
            <Title level={5} style={{ margin: "8px 0 4px 0", color: "#222", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {group.name}
            </Title>
          </Tooltip>
          <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, color: "#666", fontSize: 13 }}>
            {group.description}
          </Paragraph>
          <Space size="small" style={{ marginTop: 4 }}>
            {isOwner && (
              <Tag color="gold" icon={<UserOutlined />}>
                Quản trị viên
              </Tag>
            )}
          </Space>
        </div>
        <div>
          <Button
            shape="circle"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewGroup(group)}
            style={{ marginRight: 4, borderColor: "#e6e6e6" }}
          />
          {userRole === "student" && !isOwner && (
            group.status === "accepted" ? (
              <Tooltip title="Đã tham gia">
                <Button shape="circle" icon={<TeamOutlined />} size="small" disabled />
              </Tooltip>
            ) : group.status === "pending" ? (
              <Tooltip title="Đã gửi yêu cầu">
                <Button shape="circle" icon={<ClockCircleOutlined />} size="small" disabled />
              </Tooltip>
            ) : (
              <Tooltip title="Tham gia nhóm">
                <Button shape="circle" icon={<TeamOutlined />} size="small" type="primary" onClick={() => handleJoinGroup(group.id)} />
              </Tooltip>
            )
          )}
        </div>
      </div>
    )
  }

  const KanbanColumn = ({ title, color, groups }) => (
    <div className="kanban-column">
      <div className="kanban-column-header" style={{ borderBottom: `2px solid ${color}` }}>
        <Title level={4} style={{ color, margin: 0, fontWeight: 700 }}>{title}</Title>
      </div>
      <div className="kanban-column-body">
        {groups.length > 0 ? (
          groups.map(group => <GroupCard group={group} key={group.id} />)
        ) : (
          <Empty description="Không có nhóm" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  )

  return (
    <div className="kanban-root">
      <div className="kanban-header">
        <div>
          <Title level={2} style={{ margin: 0, color: "#1677ff", fontWeight: 800, letterSpacing: 1 }}>
            Nhóm học tập
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Quản lý, tham gia và tạo nhóm học tập theo cách hiện đại nhất!
          </Text>
        </div>
        {userRole === "lecturer" && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setCreateModalVisible(true)}
            style={{ borderRadius: 24, fontWeight: 700, boxShadow: "0 2px 8px #1677ff33" }}
          >
            Tạo nhóm mới
          </Button>
        )}
      </div>
      <div className="kanban-board">
        <KanbanColumn title="Đã tham gia" color="#52c41a" groups={joinedGroups} />
        <KanbanColumn title="Đang chờ duyệt" color="#faad14" groups={pendingGroups} />
        <KanbanColumn title="Nhóm khác" color="#1677ff" groups={otherGroups} />
      </div>
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TeamOutlined style={{ color: "#1677ff" }} />
            <span style={{ fontWeight: 700 }}>Tạo nhóm mới</span>
          </div>
        }
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width={480}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleCreateGroup} style={{ marginTop: 8 }}>
          <Form.Item name="name" label="Tên nhóm" rules={[{ required: true, message: "Vui lòng nhập tên nhóm!" }]}>
            <Input placeholder="Nhập tên nhóm..." size="large" style={{ borderRadius: 12 }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả nhóm"
            rules={[{ required: true, message: "Vui lòng nhập mô tả nhóm!" }]}
          >
            <TextArea rows={3} placeholder="Mô tả về mục đích và hoạt động của nhóm..." style={{ borderRadius: 12 }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button
                onClick={() => {
                  setCreateModalVisible(false)
                  form.resetFields()
                }}
                style={{ borderRadius: 12 }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" style={{ borderRadius: 12, fontWeight: 600 }}>
                Tạo nhóm
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .kanban-root {
          min-height: 100vh;
          padding: 32px 0 0 0;
        }
        .kanban-header {
          max-width: 1200px;
          margin: 0 auto 32px auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          margin-top: -32px
        }
        .kanban-board {
          display: flex;
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
          overflow-x: auto;
          padding: 16px 32px 64px 32px;
        }
        .kanban-column {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 24px #1677ff11;
          flex: 1 1 320px;
          min-width: 320px;
          display: flex;
          flex-direction: column;
          max-height: 80vh;
        }
        .kanban-column-header {
          padding: 20px 24px 12px 24px;
          background: transparent;
        }
        .kanban-column-body {
          padding: 0 24px 24px 24px;
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .kanban-card {
          background: #f5faff;
          border-radius: 14px;
          box-shadow: 0 2px 8px #1677ff11;
          padding: 18px 16px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .kanban-card:hover {
          box-shadow: 0 8px 32px #1677ff33;
          transform: translateY(-2px) scale(1.02);
        }
      `}</style>
    </div>
  )
}

export default Group
