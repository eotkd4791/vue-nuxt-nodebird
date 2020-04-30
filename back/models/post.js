module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {//모델명: 앞에 대문자에 단수형 //테이블명은 모두 소문자에 복수형 posts
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4',//이모티콘 
    collate: 'utf8mb4_general_ci',
  });
  Post.associate = (db) => { // 모델의 관계를 명시하는 부분.
    db.Post.belongsTo(db.User); //게시글은 사용자에 속해있다. 또 belongsTo를 붙이면 속성에 UserId도 자동으로 생성된다.
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); //하나의 칸에 여러 값을 저장할 수 없는 db의 특성 때문에 Post와 Hashtag에서 필요한 정보를 모아서 PostHashtag라는 새로운 테이블을 생성한다.
  };
  return Post;
};