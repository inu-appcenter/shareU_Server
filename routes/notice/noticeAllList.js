router.get('/noticeAllList',(req,res)=>{

    let sql = ' SELECT title, DATE_FORMAT(noticeDate, "%Y-%m-%d") AS noticeDate FROM notice';  
    db.query(sql, (err, rows) => { //
    if (err) {
    console.log("전체 공지사항 리스트 전송 실패");
    return res.sendStatus(400);
    }
    
    res.status(200).json(rows);
    
    });  
    
})