const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/'); 

router.post('/', isNotLoggedIn, async (req, res, next) => { // get, post도 하나의 미들웨어이다. 여기 안에서 body를 쓸수 있는 것은 위에서 아래로 순차적으로 코드가 실행될떄 위의 미들웨어를 거치면서 오게된다. 따라서 req.body가 존재한다.
  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    const exUser = await db.User.findOne({
      where: {
        email: req.body.email,
      },
    });  //중복확인
    if(exUser) {
      console.log(exUser);
      return res.status(403).json({
        errorCode: 1,
        message: '이미 존재하는 아이디입니다.',
      });
    }
    await db.User.create({  //db내의 User에 넣어준다. promise이기 때문에 async/await 붙여준다.
      email: req.body.email,
      password: hash,
      nickname: req.body.nickname,
    });
    // return res.status(201).json(newUser); //send는 문자열이나 버퍼로 응답할때 사용 // json으로 응답할때는 json으로 명시한다. -> 응답 바디에 넣어줌.
    passport.authenticate('local', (err, user, info) => { //두번쨰 인자는 done인자와 같은 콜백. 순서대로 에러, 성공, 실패
      if(err) {
        console.error(err);
        return next(err);
      }
      if(info) {
        return res.status(401).send(info.reason); // 프론트에서 잘못된 요청을 보냈을 때, ( 틀린 아디나 비번 )
      }
      return req.login(user, (err) => { //에러가 날일이 없지만 여기서 만약에 혹시나 에러가 나면 서버가 멈춰버리기 때문에 에러 처리 확실해 해주어야 한다. 어떻게 저장할 지는 serialize, deserialize를 보자. 프론트에 쿠키다시 보내주는 것도 이 부분이 담당한다.
        if(err) {
          console.error(err);
          return next(err);
        }
        return res.json(user); //프론트로 사용자정보 넘겨주기 쿠키도 포함되어있다.
      }); //passport.initialize에서 넣어준 login/logout에서 가져온거. 세션에 사용자 정보를 넣어주는 역할을 한다.
    })(req, res, next);
  } catch(err) {
    console.error(err); 
    return next(err);
  }
});



router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => { //두번쨰 인자는 done인자와 같은 콜백. 순서대로 에러, 성공, 실패
    if(err) {
      console.error(err);
      return next(err);
    }
    if(info) {
      return res.status(401).send(info.reason); // 프론트에서 잘못된 요청을 보냈을 때, ( 틀린 아디나 비번 )
    }
    return req.login(user, (err) => { // 세션에 사용자 정보를 넣어주는 역할을 한다. 에러가 날일이 없지만 여기서 만약에 혹시나 에러가 나면 서버가 멈춰버리기 때문에 에러 처리 확실해 해주어야 한다. 어떻게 저장할 지는 serialize, deserialize를 보자. 프론트에 쿠키다시 보내주는 것도 이 부분이 담당한다.
      if(err) {
        console.error(err);
        return next(err);
      }
      return res.json(user); //프론트로 사용자정보 넘겨주기 쿠키도 포함되어있다.
    }); //passport.initialize에서 넣어준 login/logout에서 가져온거. 
  })(req, res, next);
});

router.post('/logout', isLoggedIn, (req, res) => {
  if(req.isAuthenticated()) {
    req.logout();
    req.session.destroy(); //세션에 다른 정보도 들어있을수도있기 때문에 세션 삭제(해도대고 안해도대고)
    return res.status(200).send('로그아웃 되었습니다.');
  }
});

module.exports = router;