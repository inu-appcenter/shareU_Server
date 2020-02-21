//앱센터 스터디
const express = require('express')
const router = express.Router()
//const config = require('./express')
const request = require('request')
const authMiddleWare = require('./auth')
let returnJson = {}
let returnStatus

router.use('/myPage',authMiddleWare)
router.use('/changeInfo',authMiddleWare)


router.get('/login',(req,res)=>{
    const query ={
        url :'http://117.16.191.242:7003/signIn',
        headers : {
            'Content-type' : 'application/x-www-form/urlencoded'
        },
        method : 'post',
        form: {
            id :req.body.id,
            passwd : req.body.passwd
        },
        json: true
    }
    request.post()
    res.status(returnStatus).json(returnJson)
            return response
})

/*

const express = require('express')
const router = express.Router()
//const config = require('./express')
const request = require('request')
const authMiddleWare = require('./auth')
let returnJson = {}
let returnStatus

router.use('/myPage',authMiddleWare)
router.use('/changeInfo',authMiddleWare)


router.post('/signUp',(req,res)=>{
    const signUpOptions = {
        url : config.signUpPath,
        headers : {
            'Content-Type':'application/x-www-form-urlencoded'
        },
        method : 'POST',
        form:{
            id:req.body.id,
            passwd : req.body.passwd,
            tel : req.body.tel,
            major : req.body.major,
            name : req.body.name
        },
        json:true
    }
    request.post(signUpOptions,(err,response,body)=>{
        if(!err){
            switch (response.statusCode){
                case 200:
                    returnStatus = 200
                    returnJson = {
                        ans : response.body.answer
                    }
                    break
                case 400:
                    returnStatus = 400
                    returnJson = {
                        ans : response.body.answer
                    }
                    break
                default:
                    break
            }
            res.status(returnStatus).json(returnJson)
            return response
        }else{
            console.log(err)
        }
    })
})

 router.post('/signIn',async (req,res)=>{
    const signInOptions = {
        url : 'http://117.16.191.242:7003/signIn',
        headers : {
            'Content-Type':'application/x-www-form-urlencoded'
        },
        form :{
            id : req.body.id,
            passwd : req.body.passwd
        },
        json:true
    }
    request.post(signInOptions,(err,response,body)=>{
        if(!err){
            switch (response.statusCode){
                case 200:
                    returnStatus = 200
                    returnJson = {
                        token : response.body.token
                    }
                    break
                case 400:
                    returnStatus = 400
                    returnJson = {
                        ans : response.body.ans
                    }
                    break
                default:
                    break
            }
            res.status(returnStatus).json(returnJson)
            return response
        }else{
            console.log(err)
        }
    })

})

router.post('/changeInfo',(req,res)=>{
    const changeQuery = {
        url : config.changeInfoPath,
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        method : 'POST',
        form : {
            id : req.decoded.id,
            passwd : req.body.passwd,
            newPasswd : req.body.newPasswd,
            tel : req.body.tel,
            major : req.body.major,
            name : req.body.name
        },
        json : true
    }
    request.post(changeQuery,(err,response,body)=>{
        if(!err){
            switch(response.statusCode){
                case 200 :
                    returnStatus = 200
                    returnJson = {
                        ans : "success"
                    }
                break
                
                case 400 :
                    returnStatus = 400
                    returnJson = {
                        ans : "password"
                    }
                break

                default:
                break
            }
            res.status(returnStatus).json(returnJson)
        }
        else{
            console.log(err)
        }
    })
})

router.post('/tmpPasswd', async(req,res)=>{
    const tmpPasswdQuery = {
        url : config.tmpPasswdPath,
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        form : {
            id : req.body.id,
            name : req.body.name
        },
        json : true
    }

    request.post(tmpPasswdQuery,(err,response,body)=>{
        if(!err){
            switch(response.statusCode){
                case 200 :
                    returnStatus = 200
                    returnJson = {
                        ans : "success"
                    }
                break
                case 400 :
                    returnStatus = 400
                    returnJson = {
                        ans : "fail"
                    }
                breakß

                default :
                break
            }
            res.status(returnStatus).json(returnJson)
        }
        else{
            console.log(err)
        }
    })
})

router.post('/myPage',async (req,res) => {
    let decodedQuery = {
        id : req.decoded.id,
        name : req.decoded.name,
        major : req.decoded.major,
        tel : req.decoded.tel
    }
    res.status(200).json(decodedQuery)
})

*/



module.exports = router


