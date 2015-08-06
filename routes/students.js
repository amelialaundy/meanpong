'use strict';
var express = require('express');
var router = express.Router();
var student = require('../db/student');

// READ all 
router.get('/', function (req, res) {
  return student.all().then(function (_student) {
    console.log('students', _student);
    res.send('students', _student);
  });
});

// READ all by cohort
router.get('/cohort/:cohortName', function (req, res) {
  return student.all(req.params.cohortName).then(function (_student) {
    res.send('student', _student);
  });
});

// READ one
router.get('/:nickname', function (req, res) {
  return student.get(req.params.nickname).then(function (_student) {
    res.send('student', _student);
  });
});


// CREATE new student
router.post('/add', function (req, res) {
  console.log('add', req.body);
  return student.add(req.body).then(function (_student) {
    res.send('student added', _student);
  });
});


// UPDATE student
router.put('/:nickname/edit', function (req, res) {
  console.log(req.body);
  return student.update(req.params.nickname, req.body).then(function (_student) {
    console.log(err, _student);
    res.send('student updated', _student);
  });
});

module.exports = router;