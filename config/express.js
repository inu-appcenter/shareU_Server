module.exports = () => {
    const express = require('express');//express 모듈
    const timeout = require('connect-timeout');//connect-timeout 미들웨어
    const path = require('path');
    const bodyParser = require('body-parser');//body parser 미들웨어를 통해 POST요청을 처리할 때 사용자가 보낸 데이터를 추출할수 있음
    var passport = require('passport')
    var LocalStrategy = require('passport-local').Strategy
   

    passport.deserializeUser(function(department, done) {
      console.log('deserializeUser',department)
      var sql='SELECT * FROM users WHERE username=?';
      pool.getConnection((err,connection) =>{
        if(err) throw err;
        else{
          connection.query(sql,[department],function(err,results){
            if(err){
              console.log(err);
              done('There is no user des');
            } else{
              done(null,results[0]);
            }
            connection.destroy();
          })
    
        }
      });
    
    });
    
    const db = require('./db'); //db.js 파일 모듈화
    
  
    const app = express();//express()메소드로 앱의 객체를 생성
  
    const key = require('./key.json');//보안
    app.set('key', key);// 
  
    process.on('uncaughtException', (err) => {
      console.log(`Caught exception: ${err}`);
    });
  //잡히지 않은 예외를 몽땅 처리하는 부분을 만듬. 이로인해 프로세스가 절대 죽지 않게함
    app.use(timeout('5s'));//connect-timeout 미들웨어 객체 생성
    app.use(bodyParser.urlencoded({ extended: false }));//application/x=www-form-wrlencoded 파싱
    app.use(bodyParser.json());//application/json 파싱
  
  
    db.connect(key, (err) => { //db.js파일을 연결해 db와 연결
      if (err) { //연결 에러시
        console.log('Unable to connect to DB.');
        process.exit(1);
      }
    });
  
    app.set('db', db.get()); //앱에서 db를 설정
  
   
 
    return app;
  };