const db = require('../models');
const sendEmail = require('../../utils/sendEmail');
const Comment = db.Comment;
const Post = db.Post;
const User = db.User;

exports.createComment = async (req, res) => {
  try {
    const { post_id, content, parent_id } = req.body;
    const user_id = req.user.id;

    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(400).json({ status: "error", message: 'Invalid post_id' });
    }

    if (parent_id) {
      const comment_parent = await Comment.findByPk(parent_id);
      if (!comment_parent) {
        return res.status(400).json({
          status: "error",
          message: "Không trả lời được comment"
        });
      }
    }

    const comment = await Comment.create({
      post_id,
      user_id,
      parent_id: parent_id || null,
      content
    });

    if (parent_id) {
      const parentComment = await Comment.findByPk(parent_id, {
        include: [{ model: User, attributes: ['email', 'name'] }]
      });

      if (parentComment && parentComment.user_id !== user_id) {
        const replyUser = await User.findByPk(user_id);
        const emailContent = `
      <p>Chào ${parentComment.User.name},</p>
      <p><strong>${replyUser.name}</strong> vừa trả lời bình luận của bạn:</p>
      <blockquote>${content}</blockquote>
    `;
        await sendEmail(parentComment.User.email, 'Bạn có phản hồi mới', emailContent);
      }
    }

    if (!parent_id) {
      const postAuthor = await User.findByPk(post.user_id);
      const commenter = await User.findByPk(user_id);

      if (postAuthor && postAuthor.email && postAuthor.id !== user_id) {
        const emailContent = `
      <p>Chào ${postAuthor.name},</p>
      <p><strong>${commenter.name}</strong> vừa bình luận vào bài viết của bạn:</p>
      <blockquote>${content}</blockquote>
    `;
        await sendEmail(postAuthor.email, 'Bình luận mới trên bài viết của bạn', emailContent);
      }
    }

    res.status(201).json({
      status: "success",
      comment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ status: "error", message: 'Error creating comment', error: error.message });
  }
};

const getNestedReplies = async (comment, postAuthorId) => {
  const replies = await Comment.findAll({
    where: { parent_id: comment.id },
    include: [{ model: db.User, attributes: ['id', 'name', 'avt', 'role'] }],
    order: [['created_at', 'ASC']]
  });

  for (const reply of replies) {
    reply.dataValues.isAuthor = reply.user_id === postAuthorId;
    reply.dataValues.Replies = await getNestedReplies(reply, postAuthorId);
  }

  return replies;
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const { post_id } = req.params;

    const post = await Post.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ status: "error", message: "Post not found" });
    }

    const rootComments = await Comment.findAll({
      where: { post_id: post_id, parent_id: null },
      include: [{ model: db.User, attributes: ['id', 'name', 'avt', 'role'] }],
      order: [['created_at', 'ASC']]
    });

    for (const comment of rootComments) {
      comment.dataValues.isAuthor = comment.user_id === post.user_id;
      comment.dataValues.Replies = await getNestedReplies(comment, post.user_id);
    }

    res.json({ status: "success", comments: rootComments });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: 'Error fetching comments',
      error: error.message
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user_id !== user_id) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa comment này' });
    }

    await comment.destroy();

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user_id = req.user.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Nội dung không được để trống' });
    }

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user_id !== user_id) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa comment này' });
    }

    comment.content = content;
    await comment.save();

    res.json({ message: 'Comment updated', comment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
};