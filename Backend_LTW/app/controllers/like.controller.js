const db = require('../models');
const Like = db.Like;
const Post = db.Post;

exports.likeOrDislike = async (req, res) => {
    const user_id = req.user.id;
    const { post_id, is_like } = req.body;

    if (typeof is_like !== 'boolean') {
        return res.status(400).json({ success: false, message: "is_like phải là true hoặc false" });
    }

    try {
        const [like, created] = await Like.findOrCreate({
            where: { user_id, post_id },
            defaults: { is_like }
        });

        if (!created) {
            if (like.is_like !== is_like) {
                await like.update({ is_like });

                if (is_like) {
                    await Post.increment({ like_count: 1, dislike_count: -1 }, { where: { id: post_id } });
                } else {
                    await Post.increment({ like_count: -1, dislike_count: 1 }, { where: { id: post_id } });
                }
            }
        } else {
            if (is_like) {
                await Post.increment('like_count', { by: 1, where: { id: post_id } });
            } else {
                await Post.increment('dislike_count', { by: 1, where: { id: post_id } });
            }
        }

        res.status(200).json({ success: true, data: like });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.removeLike = async (req, res) => {
    const user_id = req.user.id;
    const { post_id } = req.body;

    try {
        const like = await Like.findOne({ where: { user_id, post_id } });

        if (!like) {
            return res.status(404).json({ success: false, message: "Không tìm thấy lượt vote" });
        }

        const is_like = like.is_like;

        await like.destroy();

        if (is_like) {
            await Post.decrement('like_count', { by: 1, where: { id: post_id } });
        } else {
            await Post.decrement('dislike_count', { by: 1, where: { id: post_id } });
        }

        res.status(200).json({ success: true, message: "Đã gỡ vote" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPostLikeStats = async (req, res) => {
    const post_id = req.params.post_id;

    try {
        const post = await Post.findByPk(post_id, {
            attributes: ['like_count', 'dislike_count']
        });

        if (!post) {
            return res.status(404).json({ success: false, message: 'Bài viết không tồn tại' });
        }

        res.status(200).json({
            success: true,
            likes: post.like_count,
            dislikes: post.dislike_count
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUserVoteStatus = async (req, res) => {
    const user_id = req.user.id;
    const post_id = req.params.post_id;

    try {
        const like = await Like.findOne({ where: { user_id, post_id } });

        if (!like) {
            return res.status(200).json({ success: true, vote: null });
        }

        res.status(200).json({
            success: true,
            vote: like.is_like ? 'like' : 'dislike'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
