const express = require('express')
const router = require('express').Router()

router.get('/majorList',(req,res)=>{ //전공에서 과이름리스트 전체 전송
    const db = req.app.get('db');
    let sql = 'SELECT majorName,majorInitiality FROM majorList order by binary(majorName)';  
    db.query(sql, (err, rows) => { 
      if (err) {
        console.log("전체과리스트 전송 실패");
        return res.sendStatus(400);
      }
    
      res.status(200).json(rows);
      
    });          
            
})


router.get('/subjectList',(req,res)=>{ //과 선택시 각과 전공과목 전체전송
  const db = req.app.get('db');
  let majorN=req.query.majorName;
  let sql = 'SELECT subjectName AS majorName, profName AS majorProName, subjectInitiality AS majorInitiality FROM subjectList WHERE division="전공"&&majorName=? order by binary(subjectName)'; 
  db.query(sql,majorN, (err, rows) => { 
    if (err) {
      console.log("과선택시 각과 전공과목 전송 실패");
      return res.sendStatus(400);
    }
  
    res.status(200).json(rows);
    
  });  
  
})


router.get('/cultureList',(req,res)=>{ //교양과목 전체전송
  const db = req.app.get('db');
  let sql = 'SELECT subjectName AS majorName,profName AS majorProName,subjectInitiality AS majorInitiality FROM subjectList WHERE division="교양" order by binary(subjectName)';  
  db.query(sql, (err, rows) => { 
    if (err) {
      console.log("교양과목리스트 전송 실패");
      return res.sendStatus(400);
    }
  
    res.status(200).json(rows);
    
  });          
          
})

module.exports = router

