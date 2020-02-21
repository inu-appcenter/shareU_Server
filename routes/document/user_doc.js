const express = require('express')
const router = require('express').Router()
const app = express();

//const authMiddleware = require('../account/auth')
//router.use('/',authMiddleware)



router.get('/userUploadList',(req,res)=>{ //사용자 업로드 리스트
    const db = req.app.get('db');
    let uploadId=req.query.uploadId
    //let uploadId = req.decoded.id;
    let sql ='SELECT DATE_FORMAT(d.uploadDate, "%Y-%m-%d") AS uploadDate,d.title,f.extension,d.documentKey FROM document d,file f,point p WHERE d.documentKey=f.documentKey AND d.documentKey=p.documentKey AND p.point=5 AND p.userId=?';  
    db.query(sql,uploadId, (err, rows) => { 
    if (err) {
    console.log("사용자 업로드 게시물 리스트 전송 실패");
    return res.sendStatus(400);
    }
    else{
        res.status(200).json(rows);
    }
    
    
    });  
    
})
router.get('/userDownloadList',(req,res)=>{ //사용자 다운로드 리스트
    const db = req.app.get('db');
    let uploadId=req.query.uploadId
    //let uploadId = req.decoded.id;
    let sql ='SELECT DATE_FORMAT(d.uploadDate, "%Y-%m-%d") AS uploadDate,d.title,f.extension,d.documentKey FROM document d,file f,point p WHERE d.documentKey=f.documentKey AND d.documentKey=p.documentKey AND p.point=-3 AND p.userId=?';  
    db.query(sql,uploadId,async (err, rows) => { 
    if (err) {
    
    console.log("사용자 다운로드 게시물 리스트 전송 실패");
    return res.sendStatus(400);
    
    }
    else{
        res.status(200).json(rows);
    }
    
    
    });  
    
})


router.get('/userPage',(req,res)=>{ //사용자 업로드 또는 사용자 다운로드 상세페이지 

    const db = req.app.get('db');
    let userId = req.query.userId;
    let documentKey=req.query.documentKey;
    //let downloadId = req.decoded.id;  
    let sql = 'SELECT d.title,d.subjectName,d.profName,d.content,f.extension,f.fileName FROM document d,file f WHERE d.documentKey=f.documentKey And d.documentKey=? AND d.uploadId=?';  
    
    db.query(sql,[documentKey,uploadId],(err, rows) => { 
    if (err) {
    console.log("사용자 업로드 또는 사용자 다운로드 상세페이지 전송 실패");
    return res.sendStatus(400);
    }
   
    res.status(200).json(rows);
    
    });        
    
})

router.get('/userPageDownloadDelete',(req,res)=>{ //사용자가 다운로드한 게시물 중 선택한 게시물 삭제
    const db = req.app.get('db');
    let userId = req.query.userId;
    let documentKey=req.query.documentKey;
    //let downloadId = req.decoded.id;  
    let sql='DELETE FROM point WHERE point=-3 AND userId=? AND documentKey=?' 
    
    db.query(sql,[userId,documentKey],(err,rows) =>{
        if(err){
            console.log("사용자가 다운로드한 게시물 중 선택한 게시물 삭제 실패");
            return res.sendStatus(400);
        }
        res.json({ans:true}); 
    })

})


// 사용자 업로드 수정
// 사용자 업로드 삭제




module.exports = router