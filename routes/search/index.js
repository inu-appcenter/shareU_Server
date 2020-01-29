const express = require('express')
const router = require('express').Router()
const all = require('./all')
const one = require('./one')

router.get('/all',all)
//router.get('/one',one)

module.exports = router