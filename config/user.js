/*//앱센터
const request=require('request'); 

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
    res.send('sucess');
})

*/