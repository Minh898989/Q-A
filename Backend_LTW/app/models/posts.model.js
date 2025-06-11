module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'groups',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    like_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dislike_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'posts',
    timestamps: false
  });
  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'user_id' });
    Post.belongsTo(models.Group, { foreignKey: 'group_id' });
    Post.hasMany(models.Comment, { foreignKey: 'post_id' });
    Post.belongsToMany(models.Tag, {
      through: 'post_tags',
      foreignKey: 'post_id',
      otherKey: 'tag_id',
      onDelete: 'CASCADE',
      as: 'tags'
    });
    Post.belongsToMany(models.Tag, {
      through: 'post_tags',
      foreignKey: 'post_id',
      otherKey: 'tag_id',
      onDelete: 'CASCADE',
      as: 'filterTags'
    });

  };
  return Post;
};
