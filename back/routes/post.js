 const express = require('express');
 const multer = require('multer'); //멀터의 역할은 폼데이터 해석해서 알아서 uploads폴더에 저장해주고, req.files로 요청온 파일들의 정보가 배열로 들어있는데 
 const path = require('path');
 const db = require('../models');

 
 const { isLoggedIn } = require('./middlewares');

 const router = express.Router();

 const upload = multer({
  storage: multer.diskStorage({ //백엔드서버에 임시로 이미지 저장하기위해서  diskStorage
    destination(req, file, done) { //어디에 저장할지,, passport와 구조가 같다. 에러 성공 실패
      done(null, 'uploads');
    },
    filename(req, file, done) { //업로드한 시간을 파일에 붙여서 중복된 이름의 파일이 덮어씌워지는 경우를 방지한다.
      const ext = path.extname(file.originalname); //파일 확장자
      const basename = path.basename(file.originalname, ext); //파일이름과 확장자 사이에 시간 초넣어준다.
      done(null, basename + Date.now() + ext);
    }
  }),
  limit: { fileSize: 20 * 1024 * 1024 }  //업로드 크기 제한
 });
 
 
 router.post('/images', isLoggedIn, upload.array('image'), (req, res) => { //로그인 검사가 먼저니까 인자 순서상 앞에 위치해야한다. 파일을 하나만 업로드 하려면 single, 여러개 업로드하려면 array를 넣어준다. array의 인자로 이미지의 키값을 넣어준다.
  res.json(req.files.map(v => v.filename));
 });

 router.post('/', isLoggedIn, async (req, res) => { // POST /post 게시물 작성
   try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const newPost = await db.Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if(hashtags) { //해쉬태그가 있으면 
      const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({ //db에 있으면 찾고 없으면 등록해라. findOrCreate의 반환값이 프로미스로 나오니까 map으로 순회하는 모든 콜백들에서 각 하나의 프로미스가 반환됨. 여기서 반환되는 모든 프로미스들을 실행해야하니까 Promise.all 붙여주고 그 앞에 await을 붙여서 비동기 처리를 해준다.
        where: { name: tag.slice(1).toLowerCase() }, //저장할때는 #떼고 소문자로 저장한다.
      })));
      await newPost.addHashtags(result.map(r => r[0])); //해쉬태그 이름을 찾아서 포스트에 붙여주는것이다. addHashtags는 시퀄라이즈에서 온 함수이다.
    }
    const fullPost = await db.Post.findOne({ //위의 newPost에서 만든 id로는 사용자의 모든 정보를 알 수 없다 따라서 여기서 부가 정보를 채워 보내준다.
      where: { id: newPost.id },
      include: [{ // 게시글-해시태그, 사용자-게시글 등의 관계들을 자동으로 포함시켜주는 기능이다.
        model: db.User, 
        attributes: ['id','nickname'] //가져올 속성을 제한한다. 이 속성을 생략하면 모든 정보를 가져오기 때문.
      }],
    });
    return res.json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
 });

 module.exports = router;