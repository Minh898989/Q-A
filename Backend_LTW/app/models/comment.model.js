module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'comments',
    timestamps: false
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Post, { foreignKey: 'post_id', onDelete: 'CASCADE' });
    Comment.belongsTo(models.User, { foreignKey: 'user_id' });
    
    Comment.belongsTo(models.Comment, { as: 'Parent', foreignKey: 'parent_id', onDelete: 'CASCADE' });
    Comment.hasMany(models.Comment, { as: 'Replies', foreignKey: 'parent_id', onDelete: 'CASCADE' });
  };

  return Comment;
};
