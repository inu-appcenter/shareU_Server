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

router.use('/',authMiddleware)


router.get('/score',(req,res)=>{ // 게시물 평균 별점 전송
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
    let sql = 'SELECT uploadDate,uploadId,review,score,reviewKey FROM review WHERE documentKey=? ORDER BY uploadDate';  
    db.query(sql,documentK, (err, rows) => { 
    if (err) {
    console.log("리뷰 리스트 전송 실패");
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})


router.get('/more' , (req,res) =>{
    const db = req.app.get('db');
    let subject=req.query.subjectName
    let prof=req.query.profName

    let sql_sub = 'SELECT doc.documentKey, doc.subjectName, doc.title, doc.profName, fi.extension, DATE_FORMAT(doc.uploadDate, "%Y-%m-%d") AS uploadDate, re.score, re.reviewKey FROM document doc LEFT JOIN file fi ON doc.documentKey = fi.documentKey LEFT JOIN review  re ON doc.documentKey = re.documentKey WHERE doc.subjectName LIKE'+'"%"'+'?'+ '"%"' + 'ORDER BY doc.uploadDate'
    let sql_prof = 'SELECT doc.documentKey, doc.subjectName, doc.title, doc.profName, fi.extension, DATE_FORMAT(doc.uploadDate, "%Y-%m-%d") AS uploadDate, re.score, re.reviewKey FROM document doc LEFT JOIN file fi ON doc.documentKey = fi.documentKey LEFT JOIN review  re ON doc.documentKey = re.documentKey WHERE doc.profName LIKE'+'"%"'+'?'+ '"%"' + 'ORDER BY doc.uploadDate'

    if(subject){
    db.query(sql_sub,subject, (err,rows)=>{
        if(err){
            throw err
        }else{
            console.log('Searching all info is success! ' + rows)
            res.status(200).json(rows);
        }
    })

    }else if(prof){
        db.query(sql_prof,prof, (err,results)=>{
            if(err){
                console.log(err)
                res.sendStatus(400)
            }else{
                console.log('Searching all info is success! ' + results)
                res.status(200).json(results);
                }
        })
    }
})


router.get('/documentTop5ScoreList',(req,res)=>{ // 자료 리스트 별점순으로 5개 전송 
    const db = req.app.get('db');
    let title=req.query.title
    let subjectN=req.query.subjectName
    let profN=req.query.profName
    let sql='SELECT d.title,DATE_FORMAT(d.uploadDate, "%Y-%m-%d") AS uploadDate,avg(r.score) FROM document d INNER JOIN review r ON d.documentKey=r.documentKey WHERE subjectName=? AND profName=? GROUP BY d.documentKey ORDER BY avg(score) LIMIT 5'
    let sqlBar = 'SELECT d.title,DATE_FORMAT(d.uploadDate, "%Y-%m-%d") AS uploadDate,avg(r.score) FROM document d INNER JOIN review r ON d.documentKey=r.documentKey WHERE title LIKE'+'"%"'+'?'+ '"%"'+'GROUP BY d.documentKey ORDER BY avg(score) LIMIT 5';  
    if((subjectN=== null || subjectN == undefined || subjectN == "")&&(profN=== null || profN == undefined || profN == "")){
        db.query(sqlBar,title, (err, rows) => { 
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
    console.log("자료 리스트 별점순으로 5개 전송 (카테고리 선택했을시) 실패");
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
 
    });  
}
})


router.get('/documentTop5DateList',(req,res)=>{ // 자료 리스트 최신순으로 5개 전송 
    let title=req.query.title
    let subjectN=req.query.subjectName
    let profN=req.query.profName
    let sql='SELECT title,DATE_FORMAT(uploadDate, "%Y-%m-%d") AS uploadDate FROM document WHERE subjectName=? AND profName=? GROUP BY d.documentKey ORDER BY avg(score) LIMIT 5'
    let sqlBar = 'SELECT title,DATE_FORMAT(uploadDate, "%Y-%m-%d") AS uploadDate FROM document WHERE title LIKE'+'"%"'+'?'+ '"%"'+'ORDER BY uploadDate DESC LIMIT 5';  
    if((subjectN=== null || subjectN == undefined || subjectN == "")&&(profN=== null || profN == undefined || profN == "")){
        db.query(sqlBar,title, (err, rows) => { 
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
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
 
    });  
}
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


router.post('/documentFile',(req,res)=>{ // 자료 파일 다운로드 (서버에 저장된 파일 클라이언트에게 전송)
    const db = req.app.get('db');
    
    let documentKey=req.body.documentKey;
    let uploadId = req.decoded.id;  
    let sqlPoint='INSERT INTO point (uploadId,point,documentKey) VALUES (?,-3,?)'
    let sqlFile='SELECT fileName FROM file WHERE documentKey=?';
    
    db.query(sqlPoint,[uploadId,documentKey],async function(err,row) { 
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
})



module.exports = router