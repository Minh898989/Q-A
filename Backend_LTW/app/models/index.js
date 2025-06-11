const { Sequelize } = require('sequelize');
const dbConfig = require('../../config/db.config');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    port:dbConfig.port,
    logging: false, // Tắt log SQL,
    define: {
      timestamps: false  // Tắt timestamps global, model nào cần bật thì bật riêng
    }
  }
);

const connection=async()=>{
    try{
        await sequelize.authenticate();
        console.log('success connection db')
    }catch(error){
        console.log("loi" , error)
    }
}

// Import models
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user.model')(sequelize, Sequelize);
db.Group= require('./groups.model')(sequelize, Sequelize);
db.GroupMember = require('./group_members.model')(sequelize,Sequelize);
db.Post= require('./posts.model')(sequelize,Sequelize);
db.Comment = require('./comment.model')(sequelize, Sequelize);
db.Tag = require('./tag.model')(sequelize, Sequelize);
db.PostTag = require('./post_tag.model')(sequelize, Sequelize);
db.Like = require('./like.model')(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
connection()
module.exports = db;
