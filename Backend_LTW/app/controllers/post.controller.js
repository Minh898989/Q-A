const { where, literal, Op } = require('sequelize');
const db = require('../models/index');
const Post = db.Post;
const Tag = db.Tag;
const User = db.User;

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content, tags } = req.body;

    if (!title) {
      throw new Error('Thiếu dữ liệu bắt buộc');
    }

    const newPost = await Post.create({
      title,
      content,
      user_id: userId
    });

    if (Array.isArray(tags) && tags.length > 0) {
      const tagInstances = [];
      for (const tagName of tags) {
        const normalizedTag = tagName.trim().toLowerCase().replace(/^#/, '');
        const [tag] = await Tag.findOrCreate({
          where: { name: normalizedTag }
        });
        tagInstances.push(tag);
      }

      await newPost.addTags(tagInstances);
    }

    const postWithTagsAndUser = await Post.findByPk(newPost.id, {
      include: [
        {
          model: User,
          attributes: ['name', 'avt', 'role']
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['name'],
          through: { attributes: [] }
        }
      ]
    });

    return res.status(201).json({
      status: 'success',
      data: postWithTagsAndUser
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi tạo bài viết'
    });
  }
};

exports.createPostInGroup = async (req, res) => {
  try {
    const { group_id } = req.params;
    const userId = req.user.id;
    const { title, content, tags } = req.body;

    if (!title || !group_id) {
      throw new Error('Thiếu dữ liệu bắt buộc');
    }

    const newPost = await Post.create({
      title,
      content,
      group_id,
      user_id: userId
    });

    if (Array.isArray(tags) && tags.length > 0) {
      const tagInstances = [];
      for (const tagName of tags) {
        const normalizedTag = tagName.trim().toLowerCase().replace(/^#/, '');
        const [tag] = await Tag.findOrCreate({
          where: { name: normalizedTag }
        });
        tagInstances.push(tag);
      }

      await newPost.addTags(tagInstances);
    }

    const postWithTagsAndUser = await Post.findByPk(newPost.id, {
      include: [
        { model: User, attributes: ['name', 'avt', 'role'] },
        { model: Tag, as: 'tags', attributes: ['name'], through: { attributes: [] } }
      ]
    });

    return res.status(201).json({
      status: 'success',
      data: postWithTagsAndUser
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi tạo bài viết'
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const allPosts = await Post.findAll({
      where: { group_id: null },
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*)
              FROM comments AS comment
              WHERE comment.post_id = Post.id
            )`),
            'comment_count'
          ],
          'like_count',
          'dislike_count'
        ]
      },
      include: [
        {
          model: User,
          attributes: ['name', 'avt', 'role']
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['name'],
          through: { attributes: [] }
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      data: allPosts
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi lấy bài viết'
    });
  }
};

exports.getPostInGroup = async (req, res) => {
  const { group_id } = req.params;
  try {
    const allPosts = await Post.findAll({
      where: {
        group_id: group_id
      },
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*)
              FROM comments AS comment
              WHERE comment.post_id = Post.id
            )`),
            'comment_count'
          ],
          'like_count',
          'dislike_count'
        ]
      },
      include: [
        {
          model: User,
          attributes: ['name', 'avt', 'role']
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['name'],
          through: { attributes: [] }
        }
      ],
      order: [['created_at', 'DESC']]
    })
    res.status(200).json({
      status: 'success',
      data: allPosts
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi lấy bài viết'
    });
  }
}

exports.getPostById = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const { in_group } = req.query;

    const whereCondition = {
      user_id: user_id
    };

    if (in_group === 'true') {
      whereCondition.group_id = { [Op.ne]: null };
    } else if (in_group === 'false') {
      whereCondition.group_id = null;
    }

    const posts = await Post.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          attributes: ['name', 'avt', 'role']
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['name'],
          through: { attributes: [] }
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      data: posts,
      userid: user_id
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi lấy bài viết'
    });
  }
};

exports.getPostByIdDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, {
      include: [
        { model: User, attributes: ['name', 'avt', 'role'] },
        { model: Tag, as: 'tags', attributes: ['name'], through: { attributes: [] } }
      ]
    });

    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Bài viết không tồn tại' });
    }

    return res.status(200).json({
      status: 'success',
      data: post
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Lỗi khi lấy bài viết'
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Thiếu ID bài viết cần cập nhật',
      });
    }

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Bài viết không tồn tại',
      });
    }

    if (post.user_id !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn không có quyền sửa bài viết này',
      });
    }

    await post.update({ title, content });

    if (Array.isArray(tags)) {
      const tagInstances = [];
      for (const tagName of tags) {
        const normalizedTag = tagName.trim().toLowerCase();
        const [tag] = await Tag.findOrCreate({
          where: { name: normalizedTag },
        });
        tagInstances.push(tag);
      }
      await post.setTags(tagInstances);
    }

    const updatedPost = await Post.findByPk(id, {
      include: [{
        model: Tag,
        as: 'tags',
        attributes: ['name'],
        through: { attributes: [] },
      }]
    });

    return res.status(200).json({
      status: 'success',
      message: 'Cập nhật bài viết thành công',
      data: updatedPost,
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Đã xảy ra lỗi khi sửa bài viết',
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Bài viết không tồn tại'
      });
    }

    if (post.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn không có quyền xóa bài viết này'
      });
    }

    await post.destroy();
    return res.status(200).json({
      status: 'success',
      message: 'Xóa bài viết thành công'
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Lỗi khi xóa bài viết'
    });
  }
};

exports.filterPosts = async (req, res) => {
  try {
    const { q, tags, from_date, to_date, user_name } = req.query;
    const sort = req.query.sort === 'asc' ? 'ASC' : 'DESC';

    const whereClause = {};
    if (q) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { content: { [Op.like]: `%${q}%` } }
      ];
    }

    if (from_date && to_date) {
      whereClause.created_at = {
        [Op.between]: [new Date(from_date), new Date(to_date)]
      };
    }

    if (req.query.group_id) {
      whereClause.group_id = req.query.group_id;
    } else {
      whereClause.group_id = null;
    }

    const include = [
      {
        model: User,
        attributes: ['name', 'avt', 'role'],
        ...(user_name ? { where: { name: { [Op.like]: `%${user_name}%` } } } : {})
      },
      {
        model: Tag,
        as: 'tags',
        attributes: ['name'],
        through: { attributes: [] }
      }
    ];

    if (tags) {
      const tagList = tags.split(',').map(t => t.trim().toLowerCase());
      include.push({
        model: Tag,
        as: 'filterTags',
        attributes: [],
        through: { attributes: [] },
        where: { name: { [Op.in]: tagList } }
      });
    }

    const posts = await Post.findAll({
      where: whereClause,
      include,
      attributes: {
        include: [
          [literal(`(
        SELECT COUNT(*)
        FROM comments AS comment
        WHERE comment.post_id = Post.id
      )`), 'comment_count']
        ]
      },
      distinct: true,
      order: [['created_at', sort]]
    });

    return res.status(200).json({
      status: 'success',
      data: posts
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Lỗi khi lọc bài viết'
    });
  }
};
