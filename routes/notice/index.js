const router = require('express').Router
const all = require('./noticeAllList')
const one = require('./noticeOne')

router.get('/noticeAllList',noticeAllList)
router.get('/noticeOne',noticeOne)

module.exports = router