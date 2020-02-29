const express = require('express')
const router = require('express').Router()

const all = require('./all')
const bar = require('./bar')


router.use('/all',all)
router.use('/bar',bar)

module.exports = router