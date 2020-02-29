
const jwt = require('jsonwebtoken')
const key = require('../../config/jwt').key


const authMiddleware = (req,res,next) => {
       //read the token from header or url
    const token =  req.body.token
//req.headers['x-access-token'] ||
    //token does not exist
    if(!token) {
        return res.status(403).json({
            success : false,
            message : 'not logged in'
        })
    }

    //create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token,key,(err,decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    //if it has failed to verify, it will return an error message
    const onError = (error) => {
        res.status(403).json({
            success: false,
            message: error.message
        })
    }
    //process the promise
    p.then((decoded) => {
        req.decoded = decoded
        next()
    }).catch(onError)
}

module.exports = authMiddleware