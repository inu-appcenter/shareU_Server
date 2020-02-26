const router = require('express').Router()

const delete_doc = require('./delete_doc')
const modify = require('./modify')
const upload = require('./upload')
const send = require('./send')
const user_doc = require('./user_doc')


router.use('/delete_doc',delete_doc)
router.use('/modify',modify)
router.use('/upload',upload)
router.use('/send',send)
router.use('/user_doc',user_doc)


module.exports = router