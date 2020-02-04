const express = require('express')
const router = require('express').Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
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
        cb(null,new Date().valueOf() + path.extname(file.originalname));
    } 
}) 


const upload = multer({storage: storage}) 

//router.use('/',authMiddleware)
let Array = [] 


router.post('/upload',upload.array('userfile',15), async (req,res)=>{
    console.log("메롱")
    const db = req.app.get('db');
    //let uploadId = req.decoded.id;
    let title = req.body.title;
    let subjectName= req.body.subjectName;
    let profName= req.body.profName;
    let content= req.body.content;
    
    let uploadDate = moment().format('YYYY-MM-DD HH:mm:ss');

    let sql='INSERT INTO document (title,subjectName,profName,content,uploadDate) VALUES (?,?,?,?,?)';
    let sqlFile = 'INSERT INTO file (documentKey,fileName,subjectName,profName) VALUES ?';

    await db.query(sql,[title,subjectName,profName,content,uploadDate], async function(err,result)  { 
    if (err) {
    console.log(err);
    return res.sendStatus(400);
    }
    
     
    else if(req.files == null || req.files == undefined || req.files == "" ){ 
        if(err) throw err; 
            else{ 
               res.json({ans:true}); 
            } 
            
          } 

    else { 
        await req.files.map(Data => Array.push([result.insertId,Data.filename,subjectName,profName])) 
        await db.query(sqlFile,[Array],  function(err){ 
              if(err){ 
                  console.log(err); 
                } 
              else{ 
                    
                   res.json({ans:true}); 
                   } 
                  
             }) 
           } 
       
       
       
    });  
    
})

module.exports = router

