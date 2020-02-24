const express = require('express')
const router = require('express').Router()


router.get('/majorChoice',(req,res)=>{ // 전공이름 리스트 전송 ->카테고리에서
    const db = req.app.get('db');
    
    let majorName=req.query.majorName
    let sql = 'SELECT majorName,majorInitiality FROM majorlist WHERE majorName LIKE'+'"%"'+'?'+ '"%"'+'order by binary(majorInitiality)'; 
    db.query(sql,[majorName], (err, rows) => { 
    if (err) {
    console.log("전공이름 리스트 전송 ->카테고리에서 실패");
   
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})

router.get('/subjectChoice',(req,res)=>{ // 전공이름 선택후 전공과목이름 리스트 전송 ->카테고리에서
    const db = req.app.get('db');

    let subject=req.query.subjectName
    let majorName=req.query.majorName
    let sql = 'SELECT subjectName,subjectInitiality,profName FROM subjectlist WHERE division=? subjectName LIKE'+'"%"'+'?'+ '"%"'+'order by binary(subjectInitiality)'; 
    db.query(sql,[majorName,subject], (err, rows) => { 
    if (err) {
    console.log("전공이름 선택후 전공과목이름 ->카테고리에서 실패");
   
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})


router.get('/subjectChoice',(req,res)=>{ // 교양 과목이름 리스트 전송 ->카테고리에서
    const db = req.app.get('db');

    let subject=req.query.subjectName
    let sql = 'SELECT subjectName,subjectInitiality FROM subjectlist WHERE division=? AND subjectName LIKE'+'"%"'+'?'+ '"%"'+'order by binary(subjectInitiality)'; 
    db.query(sql,['교양',subject], (err, rows) => { 
    if (err) {
    console.log("교양 과목이름 리스트 전송 ->카테고리에서 실패");
   
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})



router.get('/profChoice',(req,res)=>{ // 담당교수 이름 리스트 전송 ->자료 작성 페이지에서
    const db = req.app.get('db');
    let prof=req.query.profName
    let subjectName=req.query.subjectName
    let sql = 'SELECT profName FROM subjectlist WHERE subjectName=? AND profName LIKE'+'"%"'+'?'+ '"%"'+'order by binary(profName)';  
    db.query(sql,[subjectName,prof], (err, rows) => { 
    if (err) {
    console.log("담당교수 이름 리스트 전송 ->자료 작성 페이지에서 실패");
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})


router.get('/subjectChoice',(req,res)=>{ // 과목이름 리스트 전송 ->자료작성 페이지에서
    const db = req.app.get('db');

    let subject=req.query.subjectName
    let sql = 'SELECT subjectName,subjectInitiality FROM subjectlist WHERE subjectName LIKE'+'"%"'+'?'+ '"%"'+'AND subjectListKey IN (SELECT MAX(subjectListKey) FROM subjectList GROUP BY subjectName) order by binary(subjectInitiality)'; 
    db.query(sql,[subject], (err, rows) => { 
    if (err) {
    console.log("과목이름 리스트 전송 ->자료작성 페이지에서 실패");
   
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})


module.exports = router