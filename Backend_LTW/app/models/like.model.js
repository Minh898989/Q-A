module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define('Like', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_like: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'likes',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'post_id'],
            },
        ],
    });

    Like.associate = (models) => {
        Like.belongsTo(models.User, { foreignKey: 'user_id' });
        Like.belongsTo(models.Post, { foreignKey: 'post_id' });
    };

    return Like;
};
