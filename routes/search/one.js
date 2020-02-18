const express = require('express')
const router = require('express').Router()

router.get('/Choice',(req,res)=>{ // 전공과 과목과 교수님을 선택했을때 리스트 출력
    const db = req.app.get('db');
    let subjectName = req.query.subjectName;
    let profName = req.query.profName
    let sql = 'SELECT title,DATE_FORMAT(uploadDate, "%Y-%m-%d") AS uploadDate FROM document WHERE subjectName=? AND profName =?;';  
    db.query(sql,[subjectName,profName], (err, rows) => { 
      if (err) {
        console.log("전공을 선택했을때 리스트 출력 실패");
        return res.sendStatus(400);
      }
    
      res.status(200).json(rows);
      
    });          
            
})



module.exports = router
