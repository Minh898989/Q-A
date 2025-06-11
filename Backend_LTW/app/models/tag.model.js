// models/Tag.js
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'tags',
    timestamps: false
  });

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Post, {
      through: 'post_tags',
      foreignKey: 'tag_id',
      otherKey: 'post_id',
      onDelete: 'CASCADE',
      as: 'posts'
    });
  };

  return Tag;
};
