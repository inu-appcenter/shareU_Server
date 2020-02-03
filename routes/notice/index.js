const express = require('express')
const router = require('express').Router()

const noticeAllList = require('./noticeAllList')
const noticeOne = require('./noticeOne')

router.use('/noticeAllList',noticeAllList)
router.use('/noticeOne',noticeOne)

module.exports = router