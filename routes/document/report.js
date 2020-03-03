var app = require('../../config/express')
var router = require('express').Router();

router.post('/', (req, res)=>{
    const db = req.app.get('db')
    const documentKey = req.body.documentKey
    const reportContent = req.body.reportContent

    var moment =require('moment'); 
    require('moment-timezone'); 
    moment.tz.setDefault("Asia/Seoul"); 

    const reportDate = moment().format('YYYY-MM-DD HH:mm:ss');

    let sql_report = 'INSERT INTO report (documentKey, reportContent, reportDate) VALUES(?,?,?)'

    db.query(sql_report,[documentKey,reportContent,reportDate], (err,rows) =>{
        if(err){
            console.log(err)
            return res.sendStatus(400)
        }else{
            res.status(200).json({ans:true})
        }
    })
})

module.exports = router;