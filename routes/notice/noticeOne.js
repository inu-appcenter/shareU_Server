const express = require('express')
const router = require('express').Router()
router.get('/',(req,res)=>{

    const db = req.app.get('db');
    
    let keyNum = req.query.noticeKey;
    let sql = 'SELECT title, DATE_FORMAT(noticeDate, "%Y-%m-%d") AS noticeDate,content FROM notice WHERE noticeKey=?';  
    db.query(sql,keyNum,(err, rows) => { //
    if (err) {
    console.log(err)
    console.log("선택한 공지사항 리스트 전송 실패");
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });        
    
})

module.exports = router