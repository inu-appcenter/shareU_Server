const express = require('express')
const router = require('express').Router()
router.get('/',(req,res)=>{
    const db = req.app.get('db');
    let sql = ' SELECT title, DATE_FORMAT(noticeDate, "%Y-%m-%d") AS noticeDate, noticeKey FROM notice';  
    db.query(sql, (err, rows) => { //
    if (err) {
    console.log("전체 공지사항 리스트 전송 실패");
    console.log(err)
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})

module.exports = router