const express = require('express')
const router = require('express').Router()

const deleteD = require('./deleteD')
const modify = require('./modify')
const store = require('./store')
const send = require('./send')



router.use('/deleteD',deleteD)
router.use('/modify',modify)
router.use('/store',store)
router.use('/send',send)



module.exports = router