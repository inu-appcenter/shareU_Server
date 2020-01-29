const mysql = require('mysql');//mysql 모듈 사용
let pool; //pool객체 사용

exports.connect = (key, done) => { //mysql 모듈화
  pool = mysql.createPool({ //db 생성
    connectionLimit: 20, 
    host: key.host,
    user: key.user,
    password: key.password,
    database: key.database
  });
};
//여기서 key가 무엇인가?
exports.get = () => {
  return pool;
};
