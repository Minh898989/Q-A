const db = require('../models/index');
const Group = db.Group;
const GroupMember = db.GroupMember;

exports.createGroups = async (req, res) => {
  const owner = req.user.id
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      throw new Error("Hãy nhập đủ thông tin")
    }
    const newGroups = await Group.create({
      name,
      description,
      owner_id: owner
    });
    return res.status(201).json({
      status: "success",
      data: newGroups
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi tạo người dùng'
    });
  }
}

exports.getGroups = async (req, res) => {
  const userId = req.user.id;

  try {
    const groups = await Group.findAll({
      include: [
        {
          model: GroupMember,
          as: 'GroupMembers',
          where: { user_id: userId },
          required: false,
          attributes: ['status']
        }
      ]
    });

    const formatted = groups.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      owner_id: group.owner_id,
      status: group.GroupMembers[0]?.status || null
    }));

    return res.status(200).json({
      status: "success",
      data: formatted
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      error: error.message
    });
  }
};

exports.getGroupById = async (req, res) => {
  const groupId = req.params.id;

  try {
    const group = await Group.findByPk(groupId, {
      include: [
        {
          model: db.User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'avt']
        },
        {
          model: GroupMember,
          as: 'GroupMembers',
          where: { status: 'accepted' },
          required: false,
          attributes: ['user_id']
        }
      ]
    });

    if (!group) {
      return res.status(404).json({ message: 'Không tìm thấy nhóm' });
    }

    return res.status(200).json({
      id: group.id,
      name: group.name,
      description: group.description,
      created_at: group.created_at,
      owner: group.owner,
      member_count: group.GroupMembers.length
    });

  } catch (error) {
    console.error('Lỗi khi lấy group theo ID:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Lỗi server khi lấy chi tiết nhóm'
    });
  }
};

exports.getGroupsWithLecture = async (req, res) => {
  const owner = req.user.id;
  try {
    const allGroup = await Group.findAll({
      where: { owner_id: owner }
    });

    return res.status(200).json({
      status: "success",
      data: allGroup
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message || "Lỗi khi lấy nhóm của giảng viên"
    });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const id = req.params.id;
    const currentUserId = req.user.id;

    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Không tìm thấy nhóm để xóa' });
    }

    if (group.owner_id !== currentUserId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa nhóm này' });
    }

    await group.destroy();

    return res.status(200).json({
      status: 'success',
      message: 'Xóa nhóm thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi xóa nhóm'
    });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;
    const currentUserId = req.user.id;

    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: 'Không tìm thấy nhóm' });
    }

    if (group.owner_id !== currentUserId) {
      return res.status(403).json({ message: 'Bạn không có quyền cập nhật nhóm này' });
    }

    await group.update({ name, description });

    return res.status(200).json({
      status: 'success',
      data: group
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi cập nhật nhóm'
    });
  }
};
