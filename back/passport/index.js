const passport = require('passport');
const local = require('./local'); //local strategy가 인식이 안되는 경우 여기에 require를 해주고 아래에서 호출해준다.
const db = require('../models');

module.exports = () => {
  passport.serializeUser((user, done) => { //사용자 정보를 서버에 저장할 많은 정보를 서버에 저장하면 메모리가 부족할 수 있기 때문에 id만 저장해서 메모리 효율을 높임
    return done(null, user.id); // 세션에 id만 저장하여 서버의 메모리 부담을 줄인다. //req.login할때 딱 한번만 실행된다.
  });
  passport.deserializeUser(async (id, done) => { // 위에서 씨리얼라이즈해서 세션에 id만을 저장했다면 쿠키에 들어있는 그 아이디로 다시 사용자의 정보를 찾는 과정이다.
    try {
      const user = await db.User.findOne({ where: { id } }); //이부분 캐싱을 통해 극복한ㄷ. 백엔드의 숙제는 디비 접근 최소화니까
      return done(null, user);  //사용자 정보를 복구하여 req.user에 넣어주고, req.isAuthenticated()를 true로 바꿔준다.
    } catch (err) {
      console.error(err);
      return done(err);
    }
  });
  local();
};