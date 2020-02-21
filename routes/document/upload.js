const express = require('express')
const router = require('express').Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload()); // Don't forget this line!

//const authMiddleware = require('../account/auth')
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

//router.use('/',authMiddleware)
let Array = [] 


router.post('/uploadfile',upload.array('userfile',15), async (req,res)=>{ // 자료 업로드
    
    const db = req.app.get('db');
    //let uploadId = req.decoded.id;
    let uploadId = req.body.uploadId;
    let title = req.body.title;
    let subjectName= req.body.subjectName;
    let profName= req.body.profName;
    let content= req.body.content;
    if (!req.files[0]) {
        var filen=null;
        var ext=null;
        // File does not exist.
        console.log("No file");
      } else {
        // File exists.
        var filen=req.files[0].filename;
        var ext = filen.split('.').pop();
        console.log("File exists");
      }
    
    let uploadDate = moment().format('YYYY-MM-DD HH:mm:ss');

    let sql='INSERT INTO document (uploadId,title,subjectName,profName,content,uploadDate) VALUES (?,?,?,?,?,?)'; // uploadId 들어가면 수정하기
    let sqlFile = 'INSERT INTO file (documentKey,fileName,subjectName,profName,extension) VALUES ?';
    let sqlPoint = 'INSERT INTO point (userId,point,documentKey) VALUES (?,5,?) '
    

    await db.query(sql,[uploadId,title,subjectName,profName,content,uploadDate], async function(err,result)  { 
    if (err) {
    console.log(err);
    return res.sendStatus(400);
    }
    
     
    else if(req.files == null || req.files == undefined || req.files == "" ){ 
        if(err) throw err; 
            else{ 
              if (err){
                console.log(err);
                return res.sendStatus(400);
              }
              else{
                await db.query(sqlPoint,[uploadId,result.insertId], async function(err){
                  if(err){
                    console.log(err);
                    return res.sendStatus(400);
                  }
                  else{
                     res.json({ans:true}); 
                  }
                })
              }             
            } 
            
          } 

    else { 
        await req.files.map(Data => Array.push([result.insertId,Data.filename,subjectName,profName,ext])) 
        await db.query(sqlFile,[Array],async  function(err){ 
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

router.post('/uploadreview',(req,res)=>{
    const db = req.app.get('db')
    let uploadDate = moment().format('YYYY-MM-DD HH:mm:ss');
    //let uploadId = req.decoded.id;
    let rev= req.body.review;
    let upId = req.body.uploadId;
    let documentK= req.body.documentKey;
    let sco = req.body.score;
    let sql = 'INSERT INTO review (uploadDate,review,documentKey,uploadId,score) VALUES (?,?,?,?,?) ';  //uploadId들어가면 수정하기
    let sqlPoint = 'INSERT INTO point (userId,point,documentKey) VALUES (?,2,?) '
    db.query(sql,[uploadDate,rev,documentK,upId,sco],async (err, rows) => { 
    if (err) {
    console.log("족보 리뷰 업로드 실패");
    console.log(req.body)
    //console.log(review)
   // console.log(uploadId)
   // console.log(documentKey)
    console.log(err)
    return res.sendStatus(400);
    }
     else{
      await db.query(sqlPoint,[upId,documentK],async (err,rows)=>{
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

