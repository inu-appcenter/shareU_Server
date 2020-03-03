const express = require('express')
const router = require('express').Router()
const app = express();
const authMiddleware = require('../account/auth')

var moment =require('moment'); 
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 

router.post('/userUploadList',authMiddleware,(req,res)=>{ //사용자 업로드 리스트
    const db = req.app.get('db');
    
    let uploadId = req.decoded.id;
    let sql ='SELECT DATE_FORMAT(d.uploadDate, "%Y-%m-%d") AS uploadDate,d.title,f.extension,d.documentKey FROM document d,file f,point p WHERE d.documentKey=f.documentKey AND d.documentKey=p.documentKey AND p.point=5 AND p.uploadId=?';  
    db.query(sql,uploadId, (err, rows) => { 
    if (err) {
    console.log("사용자 업로드 게시물 리스트 전송 실패");
    console.log(err)
    return res.sendStatus(400);
    }
    else{
        res.status(200).json(rows);
    }
    
    
    });  
    
})


router.post('/userDownloadList',authMiddleware,(req,res)=>{ //사용자 다운로드 리스트
    const db = req.app.get('db');
    
    let uploadId = req.decoded.id;
    let sql ='SELECT DATE_FORMAT(d.uploadDate, "%Y-%m-%d") AS uploadDate,d.title,f.extension,d.documentKey FROM document d,file f,point p WHERE d.documentKey=f.documentKey AND d.documentKey=p.documentKey AND p.point=-3 AND p.uploadId=?';  
    db.query(sql,uploadId,async (err, rows) => { 
    if (err) {
    
    console.log("사용자 다운로드 게시물 리스트 전송 실패");
    console.log(err)
    return res.sendStatus(400);
    
    }
    else{
        res.status(200).json(rows);
    }
    
    
    });  
    
})


router.post('/userPage',authMiddleware,(req,res)=>{ //사용자 업로드 또는 사용자 다운로드 상세페이지 

    const db = req.app.get('db');
   
    let documentKey=req.body.documentKey;
    let uploadId = req.decoded.id;  
    let sql = 'SELECT d.title,d.subjectName,d.profName,d.content,f.extension,f.fileName FROM document d,file f WHERE d.documentKey=f.documentKey And d.documentKey=? AND d.uploadId=?';  
    
    db.query(sql,[documentKey,uploadId],(err, rows) => { 
    if (err) {
    console.log("사용자 업로드 또는 사용자 다운로드 상세페이지 전송 실패");
    return res.sendStatus(400);
    }
   
    res.status(200).json(rows);
    
    });        
    
})


router.post('/userPoint',authMiddleware,(req,res)=>{ //사용자 포인트 총 합 전송
    const db= req.app.get('db')
    
    let uploadId = req.decoded.id;
    let sql ='SELECT sum(point) FROM point WHERE uploadId=?'
    db.query(sql,[uploadId],(err, rows) => { 
        if (err) {
        console.log("사용자 사용자 포인트 총 합 전송 실패");
        return res.sendStatus(400);
        }
       res.status(200).json(rows);      
        });  
})


router.post('/userPointList',authMiddleware,(req,res)=>{ //사용자 포인트 상세페이지 전송
    const db=req.app.get('db')

    let uploadId = req.decoded.id;
    let sqlPoint ='SELECT point,documentKey,DATE_FORMAT(pointloadDate, "%Y-%m-%d") AS pointloadDate,(SELECT title FROM document d WHERE d.documentKey = p.documentKey) AS title FROM point p WHERE uploadId=? ORDER BY pointloadDate' 

    db.query(sqlPoint,uploadId,(err,rows)=>{
        if(err){
            console.log('포인트 상세페이지 검색 실패: ' + err)
            return res.sendStatus(400)
        }else{
            res.status(200).json(rows); 
        }
    })
  
})

router.use('/giftPoint',authMiddleware)
router.post('/giftPoint',(req,res)=>{ //회원가입시 10포인트 선물
    const db = req.app.get('db')

    let uploadId = req.decoded.id
    let uploadDate = moment().format('YYYY-MM-DD HH:mm:ss');
    let sqlC='SELECT uploadId FROM point WHERE point=10 AND uploadId=?'
    let sql = 'INSERT INTO point (point,documentKey,uploadId,pointloadDate) VALUES (10,0,?,?)'
    db.query(sqlC,[uploadId],(err,rows)=>{
        if(err){
            console.log(err)
        }
        else{
            if(rows == undefined || rows == null || rows ==""){
                db.query(sql,[uploadId,uploadDate],(err,rows)=>{
                    if(err){
                        console.log('회원가입시 10포인트 선물 실패')
                        console.log(err)
                    }
                    res.json({ans:true}); 
                })
            }
            else{
                res.json({ans:false}) // 포인트 받은적 있음
            }
        }
    })
    
})


router.post('/checkGiftPoint',authMiddleware,(req,res)=>{ //회원가입 10포인트 선물 여부 확인
    const db = req.app.get('db')

    let uploadId = req.decoded.id
    let sql = 'SELECT * FROM point WHERE uploadId=? AND point = 10 AND documentKey=0'
    db.query(sql,[uploadId],(err,rows)=>{
        if(err){
            console.log('회원가입 10포인트 선물 여부 확인 실패')
            console.log(err)
        }
        else if(rows == undefined || rows == null || rows ==""){
            res.json({ans:true}) // 포인트 받은적 없음 
        }
        else{
            res.json({ans:false}) // 포인트 받은적 있음
        }
    })
})


module.exports = router