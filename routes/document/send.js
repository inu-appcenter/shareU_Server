const express = require('express')
const router = require('express').Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload()); // Don't forget this line!

const authMiddleware = require('../account/auth')
const utf8 = require('utf8');
var moment =require('moment'); 
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 


const storage = multer.diskStorage({ 
    destination: function(req, file ,cb){
        cb(null, "uploads/")
    }, 
    filename : (req,file,cb)=>{ 
      if (fs.existsSync(path.join("uploads/",file.originalname))) {
        cb(null,  Date.now()+'_'+file.originalname)
      }else{
        cb(null, file.originalname)
      }

               
    } 
}) 

const upload = multer({storage: storage}) 


router.get('/score',(req,res)=>{ // 자료 평균 별점 전송
    const db = req.app.get('db');
    let documentK=req.query.documentKey
    let sql = 'select avg(score) from review where documentKey=? ';  
    db.query(sql,documentK, (err, rows) => { 
    if (err) {
    console.log("게시물 평균 별점 전송 실패");
    console.log(err)
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})


router.get('/reviewList',(req,res)=>{ // 리뷰 리스트 전송
    const db = req.app.get('db');
    let documentK=req.query.documentKey
    let sql = 'SELECT DATE_FORMAT(uploadDate, "%Y-%m-%d") AS uploadDate,uploadId,review,score,reviewKey FROM review WHERE documentKey=? ORDER BY uploadDate';  
    db.query(sql,documentK, (err, rows) => { 
    if (err) {
    console.log("리뷰 리스트 전송 실패");
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})


router.get('/more' , (req,res) =>{ //자료 검색 결과에서 최신순으로 나열된 5개 옆에 더보기를 눌렀을때 뜨는 페이지의 자료 리스트 전송
    const db = req.app.get('db');
    let subject=req.query.subjectName
    let prof=req.query.profName
    let title=req.query.title

    let sql_sub = 'SELECT doc.documentKey, doc.subjectName, doc.title, doc.profName, fi.extension, DATE_FORMAT(doc.uploadDate, "%Y-%m-%d") AS uploadDate, avg(re.score) FROM document doc LEFT JOIN file fi ON doc.documentKey = fi.documentKey LEFT JOIN review  re ON doc.documentKey = re.documentKey WHERE doc.title LIKE ? GROUP BY doc.documentKey,fi.extension ORDER BY doc.uploadDate'
    let sql_all = 'SELECT doc.documentKey,doc.subjectName,doc.title, doc.profName, fi.extension, DATE_FORMAT(doc.uploadDate, "%Y-%m-%d") AS uploadDate, avg(re.score) FROM document doc LEFT JOIN file fi ON doc.documentKey = fi.documentKey LEFT JOIN review re ON doc.documentKey = re.documentKey WHERE doc.subjectName =? AND doc.profName =? GROUP BY doc.documentKey,fi.extension ORDER BY doc.uploadDate'
    if(title){
    db.query(sql_sub,['%'+title+'%'], (err,rows)=>{ //검색바에 과목이름 검색
        if(err){
            throw err
        }else{
            console.log('Searching all info is success! ' + rows)
            res.status(200).json(rows);
        }
    })

    }else{
        db.query(sql_all,[subject,prof],(err,answer) =>{ //카테고리 타고 들어갔을 시 더보기
            if(err){
                console.log(err)
                res.sendStatus(400)
            }else{
                console.log('Searching all info is success! ' + answer)
                res.status(200).json(answer);
            }
        })
    }
})


router.get('/documentTop5ScoreList',(req,res)=>{ // 자료 리스트 별점순으로 5개 전송 
    const db = req.app.get('db');
    let title=req.query.title
    let subjectN=req.query.subjectName
    let profN=req.query.profName
    let sql='SELECT d.documentKey,d.title,DATE_FORMAT(d.uploadDate, "%Y-%m-%d") AS uploadDate,f.extension,avg(r.score) FROM document d INNER JOIN file f on d.documentKey = f.documentKey INNER JOIN review r ON d.documentKey=r.documentKey WHERE d.subjectName=? AND d.profName=? GROUP BY d.documentKey, f.extension ORDER BY avg(score) DESC LIMIT 5'
    let sqlBar = 'SELECT d.documentKey,d.title,DATE_FORMAT(d.uploadDate, "%Y-%m-%d") AS uploadDate,f.extension,avg(r.score) FROM document d INNER JOIN file f on d.documentKey = f.documentKey INNER JOIN review r ON d.documentKey=r.documentKey WHERE title LIKE ? GROUP BY d.documentKey ORDER BY avg(score) DESC LIMIT 5';  
    if((subjectN=== null || subjectN == undefined || subjectN == "")&&(profN=== null || profN == undefined || profN == "")){
        db.query(sqlBar,['%'+title+'%'], (err, rows) => { 
            if (err) {
            console.log("자료 리스트 최신순으로 5개 전송 (검색바에서 검색했을 시) 실패");
            console.log(err)
            return res.sendStatus(400);
            }
            
            res.status(200).json(rows);
            
            });  
            
    }
    else{  
    db.query(sql,[subjectN,profN], (err, rows) => { 
    if (err) {
    console.log("자료 리스트 별점순으로 5개 전송 (카테고리 선택했을시) 실패");
    console.log(err)
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
 
    });  
}
})


router.get('/documentTop5DateList',(req,res)=>{ // 자료 리스트 최신순으로 5개 전송
    const db = req.app.get('db'); 
    let title=req.query.title
    let subjectN=req.query.subjectName
    let profN=req.query.profName
    let sql='SELECT documentKey,title,DATE_FORMAT(uploadDate, "%Y-%m-%d") AS uploadDate FROM document WHERE subjectName=? AND profName=? ORDER BY uploadDate DESC LIMIT 5'
    let sqlBar = 'SELECT documentKey,title,DATE_FORMAT(uploadDate, "%Y-%m-%d") AS uploadDate FROM document WHERE title LIKE ? ORDER BY uploadDate DESC LIMIT 5';  
    if((subjectN=== null || subjectN == undefined || subjectN == "")&&(profN=== null || profN == undefined || profN == "")){
        db.query(sqlBar,['%'+title+'%'], (err, rows) => { 
            if (err) {
            console.log("자료 리스트 최신순으로 5개 전송 (검색바에서 검색했을 시) 실패");
            return res.sendStatus(400);
            }
            
            res.status(200).json(rows);
            
            });  
            
    }
    else{  
    db.query(sql,[subjectN,profN], (err, rows) => { 
    if (err) {
    console.log("자료 리스트 최신순으로 5개 전송 (카테고리에서 선택했을 시) 실패");
    console.log(err)
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
 
    });  
}
})


router.post('/documentPage',authMiddleware,(req,res)=>{ // 자료 상세 페이지 -> 파일을 다운로드 받기전 뜨는 상세페이지 전송
    const db = req.app.get('db');
    let documentKey=req.body.documentKey;
    let uploadId = req.decoded.id;
    let sql = 'SELECT d.title,d.subjectName,d.profName,d.content,DATE_FORMAT(d.uploadDate, "%Y-%m-%d") AS uploadDate,d.uploadId,f.extension,s.majorName FROM document d,file f,subjectlist s WHERE d.documentKey=f.documentKey AND d.subjectName = s.subjectName AND d.profName = s.profName AND d.documentKey=? ';  
    let sqlCheck='SELECT pointKey FROM point WHERE documentKey=? AND point=-3 AND uploadId=?'

    db.query(sql,[documentKey],async (err, rows) => { 
        if (err) {
        console.log("자료상세 페이지 전송 실패");
        console.log(err)
        return res.sendStatus(400);
        }
        else{
        db.query(sqlCheck,[documentKey,uploadId], function(err,result){ //자료 상세페이지에서 과거 파일 다운 유/무 판단
            if(err){
                console.log(err)
                return res.sendStatus(400)
            }else if(result[0] === undefined || result[0] === null || result[0] === ""){ // 사용자가 이전에 받은 적이 없음
                return res.status(200).json({ans:true,rows: rows}) //이전에 받은적 없는 사용자
            }else{
                return res.status(200).json({ans:false,rows: rows}) // 이전에 받은적 있는 사용자
            }
                })
            }
        })
    })

    router.get('/documentPagenone',(req,res)=>{ // 비로그인자를 위한 자료 상세 페이지 -> 파일을 다운로드 받기전 뜨는 상세페이지 전송
        const db = req.app.get('db');
        
        let documentKey=req.query.documentKey;
        let sql = 'SELECT d.title,d.subjectName,d.profName,d.content,DATE_FORMAT(d.uploadDate, "%Y-%m-%d") AS uploadDate,d.uploadId,f.extension,s.majorName FROM document d,file f,subjectlist s WHERE d.documentKey=f.documentKey AND d.subjectName = s.subjectName AND d.profName = s.profName AND d.documentKey=? '; 
    
        db.query(sql,[documentKey],async (err, rows) => { 
            if (err) {
            console.log("자료상세 페이지 전송 실패");
            console.log(err)
            return res.sendStatus(400);
            }
            else{
                return res.status(200).json(rows)
             }
            })
        })

router.post('/documentFile', authMiddleware,(req,res)=>{ // 자료 파일 다운로드 (서버에 저장된 파일 클라이언트에게 전송)
    const db = req.app.get('db');
    
    let pointloadDate = moment().format('YYYY-MM-DD HH:mm:ss');
    let documentKey=req.body.documentKey;
    let uploadId = req.decoded.id; 
    let checkPoint = 'SELECT sum(point)>3 AS C FROM point WHERE uploadId=?' 
    let sqlPoint='INSERT INTO point (uploadId,point,documentKey,pointloadDate) VALUES (?,-3,?,?)'
    let sqlFile='SELECT fileName FROM file WHERE documentKey=?';
    db.query(checkPoint,[uploadId],async (err,rows)=>{
        if(err){
            console.log(err)
            res.send(err)
        }
        else if(rows[0].C=='0'){
            var data=[]
            data.push({ans:false})
            await res.json(data) // 포인트가 부족하여 자료 다운로드 불가
        }
        else{
           
            db.query(sqlPoint,[uploadId,documentKey,pointloadDate],async function(err,row) { 
                if (err) {
                console.log("포인트 차감 실패");
                console.log(err)
                return res.sendStatus(400);
                }
                else{
                   await db.query(sqlFile,[documentKey],function(err,rows){
                        if(err){
                            console.log("자료 파일 전송 실패");
                            return res.sendStatus(400);
                        }
                        else{
                            res.status(200).json(rows);
                        }    
                    })
                }
                });   
        }
    })
   
})


router.post('/reDownload',(req,res) =>{ // 이전에 파일 다운받은 사용자 다시받기 구현
    const db = req.app.get('db');

    let documentKey = req.body.documentKey
    let sqlFile='SELECT fileName FROM file WHERE documentKey=?';

    db.query(sqlFile,[documentKey],function(err,rows){
        if(err){
            
            console.log("자료 파일 전송 실패");
            return res.sendStatus(400);
        }
        else{
            res.status(200).json(rows);
        }    
    })
})


router.get('/categoryResend',(req,res)=>{ //카테고리 과목이름과 교수이름 받은후 과목이름과 교수이름 해당 학과 이름까지 재전송
    const db = req.app.get('db')

    let subjectName = req.query.subjectName
    let profName = req.query.profName
    let sql = 'SELECT majorName,subjectName,profName FROM subjectList WHERE subjectName=? AND profName=?'
    db.query(sql,[subjectName,profName],async (err,rows) => { 
        if (err) {
        console.log("카테고리 과목이름과 교수이름 받은후 과목이름과 교수이름 해당 학과 이름까지 재전송 실패");
        console.log(err)
        return res.sendStatus(400);
        }
        else{
            res.status(200).json(rows);
        }
        })
})


router.get('/mainTop5ScoreList',(req,res)=>{ // main page ->전체 자료 리스트 별점순으로 5개 전송 

    const db = req.app.get('db');

    let sql='SELECT d.documentKey, d.title, DATE_FORMAT(d.uploadDate, "%Y-%m-%d") AS uploadDate, f.extension, avg(r.score) FROM document d INNER JOIN file f on d.documentKey = f.documentKey INNER JOIN review r ON d.documentKey=r.documentKey GROUP BY d.documentKey, f.extension ORDER BY avg(score) desc LIMIT 5'
    db.query(sql, (err, rows) => { 
        if (err) {
            console.log("자료 리스트 별점순으로 5개 전송 (전체자료 중에서) 실패");
            console.log(err)
            return res.sendStatus(400);
       }else{
            res.status(200).json(rows);
           }
    }); 

}) 

router.get('/sendBeforeModify',(req,res)=>{ //수정하기전에 기존에 데이터 전송
    const db = req.app.get('db');
    let documentKey=req.query.documentKey;
    let sql = 'SELECT d.title,d.subjectName,d.profName,d.content,f.extension,f.fileName FROM document AS d INNER JOIN file AS f ON d.documentKey=f.documentKey WHERE d.documentKey=?';  
    
    db.query(sql,[documentKey],(err, rows) => { 
    if (err) {
    console.log("자료상세 페이지 전송 실패");
    console.log(err)
    return res.sendStatus(400);
    }
    else{
         res.status(200).json(rows);
    }
 });  
})


router.post('/sendFileExtension',(req,res)=>{ // 파일 확장자명 전송 (안드로이드 클라이언트에서 요청하여 제작)
    const db = req.app.get('db')
    let documentKey=req.body.documentKey;
    let sql = 'SELECT extension FROM file WHERE documentKey=?'
    db.query(sql,[documentKey],(err,rows) =>{
        if(err){
            console.log("파일 확장자명 전송 실패")
            console.log(err)
            return res.sendStatus(400);
        }
        else{
            res.status(200).json(rows)
        }
    })
})


module.exports = router