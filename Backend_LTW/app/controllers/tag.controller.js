const db = require('../models/index');
const Tag = db.Tag;

exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.findAll({ attributes: ['name'] });
        res.status(200).json({ status: 'success', data: tags });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Lỗi khi lấy tags' });
    }
};
