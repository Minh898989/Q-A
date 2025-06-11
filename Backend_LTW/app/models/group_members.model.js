module.exports = (sequelize, DataTypes) => {
  const GroupMember = sequelize.define('GroupMember', {
    group_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'groups',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    role: {
      type: DataTypes.ENUM('member', 'admin'),
      defaultValue: 'member'
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'group_members',
    timestamps: false
  });

  GroupMember.associate = (models) => {
    // Quan hệ với bảng Group
    GroupMember.belongsTo(models.Group, { foreignKey: 'group_id', as: 'group' });

    // Quan hệ với bảng User
    GroupMember.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return GroupMember;
};
 