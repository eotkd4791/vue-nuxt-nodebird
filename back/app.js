const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan');

const db = require('./models'); //model/index.js의 db를 불러온것임
const passportConfig = require('./passport');
const app = express();

db.sequelize.sync(); //서버 시작할때 db실행시킨다. // db.sequelize/sync({ force: true }); 서버 재시작할때마다 테이블지우고 다시만듦.
passportConfig(); //내가 만든거 구분하기 위해서 Config를 뭍여준다.

app.use(morgan('dev'));
app.use(cors('http://localhost:3000')); //해당 주소에서 오는 요청만 허용한다. !
app.use(express.json()); // express 자체적으로 json형식 데이터를 못받음. 따라서 이 미들웨어를 추가해준다.
app.use(express.urlencoded({ extended: false })); // form에서 바로 전송할때 req.body애 넣어준다.
app.use(cookie('cookiesecret'));//쿠키의 한 종류,, 아래의 세션과 연결해준다 . 
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'cookiesecret',
}));
app.use(passport.initialize()); //요청에 로그인, 로그아웃 기능 만들어준다.
app.use(passport.session());    //세션 만들어준다.이걸 쓰려면 express-session설치해야함

app.get('/', (req, res) => { //   /앞에 localhost:3085 생략
  res.send('할랄 fnfnfnf~'); // res.status(200).send()의 축약형이다. 응답은 200이고 send는 할랄 서버찡이라는 문자열을 바디에 넣어 데이터 전송하는 메소드.
});

app.post('/user', async (req, res, next) => { // get, post도 하나의 미들웨어이다. 여기 안에서 body를 쓸수 있는 것은 위에서 아래로 순차적으로 코드가 실행될떄 위의 미들웨어를 거치면서 오게된다. 따라서 req.body가 존재한다.
  try {
    const exUser = db.User.findOne({
      email: req.body.email,
    });  //중복확인
    if(exUser) { //존재하는 아이디이면
      return res.status(403).json({ //요청한번에 응답한번 보내야하므로 반드시 리턴해줘야함.안그러면 can't set headers after they are sent라는 유명한 에러가 난다.
        errorCode: 1, //에러코드는 내마음대로 할수있다. 단 res.status의 인자(http 상태코드)는 반드시 약속대로 해야한다.
        message: '이미 존재하는 아이디입니다.'
      });
    }
    const hash = await bcrypt.hash(req.body.passowrd, 12);
    const newUser = await db.User.create({  //db내의 User에 넣어준다. promise이기 때문에 async/await 붙여준다.
      email: req.body.email,
      password: hash,
      nickname: req.body.nickname,
    });
    return res.status(201).json(newUser); //send는 문자열이나 버퍼로 응답할때 사용 // json으로 응답할때는 json으로 명시한다. -> 응답 바디에 넣어줌.
  } catch(err) {
    console.error(err);
    return next(err);
  }
});



app.post('/user/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => { //두번쨰 인자는 done인자와 같은 콜백. 순서대로 에러, 성공, 실패
    if(err) {
      console.error(err);
      return next(err);
    }
    if(info) {
      return res.status(401).send(info.reason); // 프론트에서 잘못된 요청을 보냈을 때, ( 틀린 아디나 비번 )
    }
    return req.login(user, (err) => { //에러가 날일이 없지만 여기서 만약에 혹시나 에러가 나면 서버가 멈춰버리기 때문에 에러 처리 확실해 해주어야 한다. 어떻게 저장할 지는 serialize, deserialize를 보자.
    if(err) {
      console.error(err);
      return next(err);
    }
    return res.json(user); //프론트로 사용자정보 넘겨주기.
    }); //passport.initialize에서 넣어준 login/logout에서 가져온거. 세션에 사용자 정보를 넣어주는 역할을 한다.
  })(req, res, next);
});



app.listen(3085, () => { //3085는 포트번호. http는 80 https는 443으로 설정해서 배포한다.
  console.log('할랄 노드!');
})  