exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next(); //인자가 없으면 다음으로 넘어가고, 인수가 있으면 에러처리로 넘어감.
  }
  return res.status(401).send('로그인이 필요합니다.'); //로그인이 안되있을때는 401로 주로 보냄
};

exports.isNotLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send('로그인한 사람은 이용할 수 없습니다.');
};