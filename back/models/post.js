module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4',//이모티콘 
    collate: 'utf8mb4_general_ci',
  });
  Post.associate = (db) => { // 모델의 관계를 명시하는 부분.
    
  }
};