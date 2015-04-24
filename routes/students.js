'use strict';
var express = require('express');
var router = express.Router();
var student = require('../db/student');

/* GET users listing. */
router.get('/', function(req, res, next) {
  student.add(req.query, function (_student) {
    res.send('student added', _student);
  });
});

router.get('/:nickname', function(req, res, next) {
  console.log('nickname')
  student.get(req.params.nickname, function (_student) {
    res.send('student', _student);
  });
});

router.post('/add', function(req, res, next) {
  res.send('respond with a new student resource');
});

router.post('/{id}/edit', function(req, res, next) {
  res.send('respond with a new student resource');
});

module.exports = router;
