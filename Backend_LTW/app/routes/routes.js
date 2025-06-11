const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route')
const userRoutes = require('./user.route')
const groupRoutes = require('./group.route')
const groupMemberRoutes = require('./group_member.route')
const postRoutes = require('./post.route')
const commentRoutes = require('./comment.route')
const likeRoutes = require('./like.route');
const tagRoutes = require('./tag.route')

router.use('/api/auth', authRoutes)
router.use('/api/users', userRoutes)
router.use('/api/groups', groupRoutes)
router.use('/api/group_member', groupMemberRoutes)
router.use('/api/post', postRoutes)
router.use('/api/comment', commentRoutes)
router.use('/api/likes', likeRoutes)
router.use('/api/tags', tagRoutes)

module.exports = router