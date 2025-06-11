// models/PostTag.js
module.exports = (sequelize, DataTypes) => {
  const PostTag = sequelize.define('PostTag', {
    post_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'posts',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    tag_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'tags',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'post_tags',
    timestamps: false
  });

  return PostTag;
};
