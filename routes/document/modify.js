const express = require('express')
const router = require('express').Router()
// const multer = require('multer')
// const fs = require('fs')
// const path = require('path')
// var randomstring = require("randomstring");
// const fileUpload = require('express-fileupload');
const app = express();

// app.use(fileUpload()); // Don't forget this line!

//const authMiddleware = require('../account/auth')
const utf8 = require('utf8');
var moment =require('moment'); 
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul"); 


// const storage = multer.diskStorage({ 
// destination: function(req, file ,cb){
//     cb(null, "uploads/")
// }, 
// filename : (req,file,cb)=>{ 
//   if (fs.existsSync(path.join("uploads/",file.originalname))) {
//     cb(null, Date.now()+'_'+file.originalname)
//   }else{
//     cb(null, file.originalname)
//   }

// } 
// }) 

// const upload = multer({storage: storage}) 

// //router.use('/',authMiddleware)
// let Array = [] ;

// router.post('/',upload.array('userfile',15), async function(req,res){
router.post('/', async function(req,res){

var db = req.app.get('db');
var documentKey = req.body.documentKey;
var title = req.body.title;
var subjectName = req.body.subjectName;
var profName = req.body.profName;
var content = req.body.content;

var uploadDate = moment().format('YYYY-MM-DD HH:mm:ss');


// if(!req.files[0]){
//   var fileN = null;
//   var extension = null;
// }else{
//   var fileN = req.files[0].filename;
//   var extension = fileN.split('.').pop();
//   console.log("File exists");
// }

// var sqlfile_serch = 'SELECT fileName FROM file WHERE documentKey=?'
//    await db.query(sqlfile_serch,documentKey, async (err,resultN) =>{
//     if(err){
//       console.log(err);
//       return res.sendStatus(400);
//     }else{  
//           var fileName_old = resultN[0].fileName; 
//           // console.log(fileName_old)
//           // console.log(req.files[0].filename)
        
//           // if(fileName_old != req.files[0].filename){ // 현재 입력으로 들어온 파일이름과 db에 저장된 파일 이름 비교
//             // console.log(fileName_old)
//              fs.unlink(`./uploads/${fileName_old}`,(err)=>{ // 원래 있던 파일 삭제
//               if(err) throw err;
//               return console.log('file deleted: ' + fileName_old); 
//               });
//         // }
//       }
//     })

var sql = 'UPDATE document SET title=?,subjectName=?,profName=?,content=?,uploadDate=? WHERE documentKey=?';
 await db.query(sql, [title,subjectName, profName, content, uploadDate, documentKey], async(err, rows) => {
if (err) {
      throw err

// }else if(req.files == null || req.files == undefined || req.files == ""){
// console.log('There is no file');
// return res.sendStatus(400);

 }else{
  console.log('success updating document: ' + rows)
  res.status(200).json({ans:true})
}
});

      //   req.files.map(Data =>Array.push([documentKey,Data.filename,subjectName,profName,uploadId,extension]))
        
      //   var sqlfile_del= 'DELETE FROM file WHERE documentKey=?'
      //  await db.query(sqlfile_del,documentKey, async(err,resultD)=>{
      //   if(err){
      //     console.log(err);
      //     return res.sendStatus(400);
      //   }else{
      //     console.log('success deleting old file column')
      //   }

      //   var sqlfile = 'INSERT INTO file (documentKey,fileName,subjectName,profName,uploadId,extension) VALUES ?';
      //    await db.query(sqlfile,[Array], async(err,results) =>{
      //     if(err){
      //       console.log("File modification failed :" + err);
      //       return res.sendStatus(400);
      //     }else{
      //       console.log('Success!');
      //       res.status(200).json({ans:true});
      //     }
          
      //   });
      
   
      // });
  

});

module.exports = router