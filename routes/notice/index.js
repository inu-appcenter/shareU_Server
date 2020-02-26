const router = require('express').Router()

const noticeAllList = require('./noticeAllList')
const noticeOne = require('./noticeOne')

// test
router.get('/', (req,res)=>{
    res.send('여기 옴')
})
router.use('/noticeAllList',noticeAllList)
router.use('/noticeOne',noticeOne)

module.exports = router