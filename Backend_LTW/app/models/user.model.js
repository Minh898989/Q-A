

// models/user.model.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    avt: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.ENUM('admin', 'student', 'lecturer'), allowNull: false, defaultValue: 'student'
        
     },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'users',
    timestamps: false
  });

  User.associate = (models)=>{
    // Nhiều Group thông qua bảng group_members
User.belongsToMany(models.Group, {
  through: models.GroupMember,
  foreignKey: 'user_id',
  otherKey: 'group_id',
  as: 'joinedGroups'
});

// Một user có nhiều bản ghi trong group_members
User.hasMany(models.GroupMember, { foreignKey: 'user_id', as: 'groupMemberships' });

  }

  return User;
};
