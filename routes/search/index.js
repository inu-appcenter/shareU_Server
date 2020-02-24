const express = require('express')
const router = require('express').Router()

const one = require('./one')
const all = require('./all')
const bar = require('./bar')


router.use('/all',all)
router.use('/one',one)
router.use('/bar',bar)

module.exports = router