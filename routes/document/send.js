const express = require('express')
const router = require('express').Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
var randomstring = require("randomstring");
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload()); // Don't forget this line!

//const authMiddleware = require('../account/auth')

const storage = multer.diskStorage({ 
    destination: function(req, file ,cb){
        cb(null, "uploads/")
    }, 
    filename : (req,file,cb)=>{ 
        cb(null, file.originalname);
               
    } 
}) 

const upload = multer({storage: storage}) 
//router.use('/',authMiddleware)


router.get('/subjectChoice',(req,res)=>{ // 자료 작성 페이지에서 과목이름 리스트 전송
    const db = req.app.get('db');
    let subject=req.query.subjectName
    
    let sql = 'SELECT subjectName FROM subjectlist WHERE subjectName LIKE'+'"%"'+'?'+ '"%"'; 
    db.query(sql,subject, (err, rows) => { 
    if (err) {
    console.log("과목이름 전송 실패");
   
    return res.sendStatus(400);
    }
    console.log(subject)
    res.status(200).json(rows);
    
    });  
    
})

router.get('/profChoice',(req,res)=>{ // 자료 작성 페이지에서 담당교수 이름 리스트 전송
    const db = req.app.get('db');
    let prof=req.query.profName
    let sql = 'SELECT profName FROM subjectlist WHERE profName LIKE'+'"%"'+'?'+ '"%"';  
    db.query(sql,prof, (err, rows) => { 
    if (err) {
    console.log("교수이름 전송 실패");
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})


router.get('/score',(req,res)=>{ // 게시물 평균 별점 전송
    const db = req.app.get('db');
    let documentK=req.query.documentKey
    let sql = 'select avg(score) from review where documentKey=? ';  
    db.query(sql,documentK, (err, rows) => { 
    if (err) {
    console.log("리뷰 리스트 전송 실패");
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})




router.get('/reviewList',(req,res)=>{ // 리뷰 리스트 전송
    const db = req.app.get('db');
    let documentK=req.query.documentKey
    let sql = 'SELECT uploadDate,uploadId,review,score,reviewKey FROM review WHERE documentKey=? ';  
    db.query(sql,documentK, (err, rows) => { 
    if (err) {
    console.log("리뷰 리스트 전송 실패");
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})

router.get('/documentList',(req,res)=>{ // 자료 전체 리스트 전송 
    const db = req.app.get('db');
    let title=req.query.title
    let sql = 'SELECT title,DATE_FORMAT(uploadDate, "%Y-%m-%d") AS uploadDate FROM document WHERE title LIKE'+'"%"'+'?'+ '"%"';  
    db.query(sql,title, (err, rows) => { 
    if (err) {
    console.log("자료 전체 리스트 전송 실패");
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})

router.get('/documentPage',(req,res)=>{ // 자료 상세 페이지 -> 파일을 다운로드 받기전 뜨는 상세페이지 전송
    const db = req.app.get('db');
    let documentKey=req.query.documentKey;
    let sql = 'SELECT title,subjectName,profName,content,DATE_FORMAT(uploadDate, "%Y-%m-%d") AS uploadDate,uploadId FROM document WHERE documentKey=? ';  
    
    db.query(sql,[documentKey],async (err, rows) => { 
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



router.get('/documentFile',(req,res)=>{ // 자료 파일 다운로드
    const db = req.app.get('db');
    let userId = req.query.userId;
    let documentKey=req.query.documentKey;
    //let downloadId = req.decoded.id;  
    let sqlPoint='INSERT INTO point (userId,point,documentKey) VALUES (?,-3,?)'
    let sqlFile='SELECT fileName FROM file WHERE documentKey=?';
    
    db.query(sqlPoint,[userId,documentKey],async function(err,row) { 
    if (err) {
    console.log("포인트 차감 실패");
    console.log(err)
    return res.sendStatus(400);
    }
    else{
        console.log(userId)
        console.log(documentKey)
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
})





module.exports = router