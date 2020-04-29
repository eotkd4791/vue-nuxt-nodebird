const passport = require('passport');
const bcrypt = require('bcrypt');
const { Strategy: LocalStrategy } = require('passport-local');
const db = require('../models');


module.exports = () => {
  passport.use(new LocalStrategy({ //id/pw검사가 이 안에서 이루어진다.
    usernameField: 'email',   //req.body.email
    passwordField: 'password',//req.body.password
  }, async (email, password, done) => {
    try { 
      const exUser = await db.User.findOne({ where: { email } }); //검색 조건은 where 안에 정의. db sql문,,
      if(!exUser) {
        return done(null, false, { reason: '존재하지 않는 사용자입니다.' }); //각 인자가 의미가 있다. 순서대로 에러, 성공, 실패이다.
      }
      //사용자가 있다. => 비밀번호 비교
      const result = await bcrypt.compare(password, exUser.password); //사용자가 입력한 비밀번호와 디비에 저장된 암호화된 비밀번호를 비교한다.
      if (result) {
        return done(null, exUser); //성공하면 두번째 인자에 사용자 정보를 입력한다.
      } else {
        return done(null, false, { reason: '비밀번호가 틀립니다.' });
      }
    } catch (err) {
      console.error(error);
      return done(err); //에러 자리인 첫번째 인자에 err를 쓴다.
    }
  }));
};
