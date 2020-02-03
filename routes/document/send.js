const express = require('express')
const router = require('express').Router()


router.get('/subjectChoice',(req,res)=>{
    const db = req.app.get('db');
    let subject=req.query.subjectName
    
    let sql = 'SELECT subjectName FROM subjectlist WHERE subjectName LIKE'+'"%"'+'?'+ '"%"'; 
    db.query(sql,subject, (err, rows) => { //
    if (err) {
    console.log("과목이름 전송 실패");
   
    return res.sendStatus(400);
    }
    console.log(subject)
    res.status(200).json(rows);
    
    });  
    
})

router.get('/profChoice',(req,res)=>{
    const db = req.app.get('db');
    let prof=req.query.profName
    let sql = 'SELECT profName FROM subjectlist WHERE profName LIKE'+'"%"'+'?'+ '"%"';  
    db.query(sql,prof, (err, rows) => { //
    if (err) {
    console.log("교수이름 전송 실패");
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})


module.exports = router