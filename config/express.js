module.exports = () => {
    const express = require('express');//express 모듈
    const timeout = require('connect-timeout');//connect-timeout 미들웨어
    const path = require('path');
    const bodyParser = require('body-parser');//body parser 미들웨어를 통해 POST요청을 처리할 때 사용자가 보낸 데이터를 추출할수 있음
   

    
    const db = require('./db'); //db.js 파일 모듈화
    
  
    const app = express();//express()메소드로 앱의 객체를 생성
  
    const key = require('./key.json');//보안
    app.set('key', key);// 
  
    process.on('uncaughtException', (err) => {  //잡히지 않은 예외를 몽땅 처리하는 부분을 만듬. 이로인해 프로세스가 절대 죽지 않게함
      console.log(`Caught exception: ${err}`);
    });

    app.use(express.static(path.join('public')))
    app.use('/document/send/documentFile',express.static(path.join('uploads')))
    
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    app.use(bodyParser.urlencoded({ extended: true }));//application/x=www-form-urlencoded 파싱
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