'use strict';
var express = require('express');
var router = express.Router();
var student = require('../db/student');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('at student!');
  student.add(req.query, function () {
    res.send('respond with all students resource');
  });
});

router.get('/{id}', function(req, res, next) {
  res.send('respond with a student resource');
});

router.post('/add', function(req, res, next) {
  res.send('respond with a new student resource');
});

router.post('/{id}/edit', function(req, res, next) {
  res.send('respond with a new student resource');
});

module.exports = router;
