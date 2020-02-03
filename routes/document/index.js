const express = require('express')
const router = require('express').Router()

const deleteD = require('./deleteD')
const modify = require('./modify')
const store = require('./store')
const send = require('./send')



router.post('/deleteD',deleteD)
router.post('/modify',modify)
router.post('/store',store)
router.use('/send',send)



module.exports = router