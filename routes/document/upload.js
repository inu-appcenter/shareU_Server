const router = require('express').Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken');
const key = require('../../config/jwt').key

var moment =require('moment'); 
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 


const authMiddleware = require('../account/auth')

const storage = multer.diskStorage({ 
    destination: function(req, file ,cb){
      
      jwt.verify(req.body.token,key,(err, user)=>{
        if (err) {}
        else {
          req.id = user.id
          cb(null, "uploads/")
        }
      })
    }, 
    filename : (req,file,cb)=>{ 
     
        var filen=file.originalname
        var ext = filen.split('.').pop();
        cb(null, Date.now()+'_.'+ext)
    
      
    }
}) 
   
const upload = multer({storage}) 


let Array = [] 


router.post('/uploadfile',upload.single('userfile'), async (req,res)=>{ // 자료 업로드
  
    const db = req.app.get('db');
    
    let uploadId=req.id
    let title = req.body.title;
    let subjectName= req.body.subjectName;
    let profName= req.body.profName;
    let content= req.body.content;
    
    let uploadDate = moment().format('YYYY-MM-DD HH:mm:ss');

    let sql='INSERT INTO document (uploadId,title,subjectName,profName,content,uploadDate) VALUES (?,?,?,?,?,?)'; // uploadId 들어가면 수정하기
    let sqlFile = 'INSERT INTO file (documentKey,fileName,subjectName,profName,extension) VALUES (?,?,?,?,?)';
    let sqlPoint = 'INSERT INTO point (uploadId,point,documentKey) VALUES (?,5,?) '
    var filen=req.file.filename;
    var ext = filen.split('.').pop();

    await db.query(sql,[uploadId,title,subjectName,profName,content,uploadDate], async function(err,result)  { 
    if (err) {
    console.log(err);
    return res.sendStatus(400);
    }
    
    else { 
        
        await db.query(sqlFile,[result.insertId,req.file.filename,subjectName,profName,ext],async  function(err){ 
              if(err){
                  console.log("자료 업로드")
                  console.log(err); 
                } 
              else{ 
                await db.query(sqlPoint,[uploadId,result.insertId], async function(err){
                  if(err){
                    console.log(err);
                    return res.sendStatus(400);
                  }
                  else{
                      console.log(result.insertId)
                      await res.json({ans:true}); 
                  }
                })
                   
                   } 
                  
             }) 
           } 
       
       
       
    });  
    
})

router.post('/uploadreview',authMiddleware,(req,res)=>{
    const db = req.app.get('db')
    let uploadDate = moment().format('YYYY-MM-DD HH:mm:ss');
    let uploadId = req.decoded.id;
    let rev= req.body.review;
    let documentK= req.body.documentKey;
    let sco = req.body.score;
    let sql = 'INSERT INTO review (uploadDate,uploadId,review,documentKey,score) VALUES (?,?,?,?,?) ';  //uploadId들어가면 수정하기
    let sqlPoint = 'INSERT INTO point (uploadId,point,documentKey) VALUES (?,2,?) '
    db.query(sql,[uploadDate,uploadId,rev,documentK,sco],async (err, rows) => { 
    if (err) {
    console.log("족보 리뷰 업로드 실패");
    console.log(err)
    return res.sendStatus(400);
    }
     else{
      await db.query(sqlPoint,[uploadId,documentK],async (err,rows)=>{
        if(err){
          return res.sendStatus(400);
        }
        else{
          await res.json({ans:true}); 
        }
      } )
     }
    
    });  
    
})

module.exports = router

