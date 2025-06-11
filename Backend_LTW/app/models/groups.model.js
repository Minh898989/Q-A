// models/user.model.js
// models/group.model.js
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'groups',
    timestamps: false
  });

  // Associations
  Group.associate = (models) => {
    // Group thuộc về 1 User (owner)
    Group.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });

    // Group có nhiều bài Post
    // Group.hasMany(models.Post, { foreignKey: 'group_id', as: 'posts' });

    // Group có nhiều User qua bảng trung gian group_members
    Group.belongsToMany(models.User, {
      through: models.GroupMember,
      foreignKey: 'group_id',
      otherKey: 'user_id',
      as: 'members'
    });

    Group.hasMany(models.GroupMember, { foreignKey: 'group_id', as: 'GroupMembers' });
  };

  return Group;
};
