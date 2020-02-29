var app = require('../../config/express')
var router = require('express').Router();
var fs = require('fs');

router.post('/',(req,res)=>{
    var db = req.app.get('db');
    var documentKey = req.body.documentKey;

    let sqljoin_Delete = 'DELETE doc, fi, poi, re, rep FROM document AS doc LEFT JOIN file AS fi ON doc.documentKey = fi.documentKey LEFT JOIN point AS poi ON doc.documentKey = poi.documentKey LEFT JOIN review AS re ON doc.documentKey = re.documentKey LEFT JOIN report AS rep ON doc.documentKey = rep.documentKey WHERE fi.documentKey=?'; 
    //delete a, b, c from tbl_1 as a left join tbl_2 as b on a.col_code = b.col_code left join tbl_3 as c on a.lum_code = c.lum_code where a.id = 1
    // let sqljoin = 'SELECT * FROM document AS doc LEFT JOIN file AS fi ON doc.documentKey = fi.documentKey LEFT JOIN point AS poi ON doc.documentKey = poi.documentKey WHERE fi.documentKey=?'
    
     db.query(sqljoin_Delete, [documentKey], (err, rows) => { 
    if (err) {
    console.log(err);
    return res.sendStatus(400);
  }else {
    console.log(rows)
    console.log('Database successfully deleted!')
  }
});
    
    let sqlfile_search = 'SELECT fileName FROM file WHERE documentKey=?';
      db.query(sqlfile_search,[documentKey], (err,results) =>{
      if(err){
        console.log(err)
        res.sendStatus(400);
      }else{
        console.log(results[0].fileName);
        var fileName_old = results[0].fileName
         fs.unlink(`./uploads/${fileName_old}`, (err)=>{ // 원래 있던 파일 삭제
          if(err) throw err;
          return console.log('File successfully Deleted!: ' + fileName_old); 
          });
          console.log('Success!');
        res.status(200).json({ans:true});
      }
    })
});

module.exports = router;