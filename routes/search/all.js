const express = require('express')
const router = require('express').Router()

router.get('/all',(req,res)=>{
    const db = req.app.get('db');
    let sql = 'SELECT majorName,majorInitiality FROM majorList';  
    db.query(sql, (err, rows) => { //
      if (err) {
        console.log("전체과리스트 전송 실패");
        return res.sendStatus(400);
      }
    
      res.status(200).json(rows);
      
    });          
            
})


module.exports = router