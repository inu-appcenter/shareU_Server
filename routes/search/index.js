const express = require('express')
const router = require('express').Router()

const one = require('./one')
const all = require('./all')

router.use('/all',all)

//router.get('/one',one)

module.exports = router