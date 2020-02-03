const express = require('express')
const router = require('express').Router()
router.post('/',(req,res)=>{

    let sql = ' ';  
    db.query(sql, (err, rows) => { //
    if (err) {
    console.log("족보 자료 페이지 삭제 실패");
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})

module.exports = router