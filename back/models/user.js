module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { //User라는 테이블을 만든다 (모델명: User) 디비에서는 테이블, 시퀄라이즈에서는 모델이라고 한다. 간단하게 말하면,, 엄밀히 말하면 같은 걸 말하는 것은 아니다.
      email: {
        type: DataTypes.STRING(30), //30자 이내
        allowNull: false, //Null 허용 x
        // 여기서 unique라는 값을 true로 설정하면 중복을 막을 수 있지만 스키마가 재정의 되는 것이기 떄문에 기존의 데이터를 지키기 위해서는 migration을 해준다 . 기존의 데이터를 지킬 필요가 없는 경우에는 db실행문 sequelize.sync의 인자 값으로 { force: true }를 세팅하고 서버를 재시작하면 된다.
      },
      nickname: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      }, //시퀄라이즈가 createdAt, updatedAt, id도 자동으로 추가해준다.
    }, {//세번째 인수는 테이블에 대한 설정.
      charset: 'utf8', //
      collate: 'utf8_general_ci',//한글
  });
  User.associate = (db) => {
    
  };
  return User;
};