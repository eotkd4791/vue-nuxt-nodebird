const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan');

const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

const db = require('./models'); //model/index.js의 db를 불러온것임
const passportConfig = require('./passport');
const app = express();



db.sequelize.sync(); //서버 시작할때 db실행시킨다. // db.sequelize/sync({ force: true }); 서버 재시작할때마다 테이블지우고 다시만듦.
passportConfig(); //내가 만든거 구분하기 위해서 Config를 뭍여준다.


app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:3000',//해당 주소에서 오는 요청만 허용한다. !
  credentials: true, // 다른 포트 또는 서버에 쿠키를 심어주는 ,,,
})); 


app.use('/', express.static('uploads')); //파일(정적파일)을 제공하기 위해서 이 미들웨어로 해결한다. 보안 문제로 앞의 프론트주소(/)와 백엔드 주소(upload)를 다르게 주는것이 좋다.
app.use(express.json()); // express 자체적으로 json형식 데이터를 못받음. 따라서 이 미들웨어를 추가해준다. 이 부분과 아래줄의 코드가 req.body를 만들어준다.
app.use(express.urlencoded({ extended: false })); // form에서 바로 전송할때 req.body애 넣어준다.
app.use(cookie('cookiesecret'));//쿠키의 한 종류,, 아래의 세션과 연결해준다 . 
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'cookiesecret',
  cookie: {
    httpOnly: true,
    secure: false,
  }
}));
app.use(passport.initialize()); //요청에 로그인, 로그아웃 기능 만들어준다.
app.use(passport.session());    //세션 만들어준다.이걸 쓰려면 express-session설치해야함


app.get('/', (req, res) => { //   /앞에 localhost:3085 생략
  res.send('서버'); // res.status(200).send()의 축약형이다. 응답은 200이고 send는 할랄 서버찡이라는 문자열을 바디에 넣어 데이터 전송하는 메소드.
});

app.use('/user', userRouter); //첫번째 인자의 주소와 userRouter의 주소가 합쳐진다.
app.use('/post', postRouter);

app.post('/post', (req, res) => {
  if(req.isAuthenticated()) { //로그인 여부 확인, 라우터 실행전에는 디씨리얼라이즈 로직이 실행된다. 사용자 정보 찾아내서 post한다.

  }
});



app.listen(3085, () => { //3085는 포트번호. http는 80 https는 443으로 설정해서 배포한다.
  console.log(`${3085}번 포트를 사용하고 있습니다.`);
})  