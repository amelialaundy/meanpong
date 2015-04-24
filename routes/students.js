'use strict';
var express = require('express');
var router = express.Router();
var student = require('../db/student');

// READ all 
router.get('/', function (req, res) {
  student.all(function (err, _student) {
    console.log('students', _student);
    res.send('students', _student);
  });
});

// READ all by cohort
router.get('/cohort/:cohortName', function (req, res) {
  student.all(req.params.cohortName, function (err, _student) {
    console.log(err);
    res.send('student', _student);
  });
});

// READ one
router.get('/:nickname', function (req, res) {
  student.get(req.params.nickname, function (_student) {
    res.send('student', _student);
  });
});


// CREATE new student
router.post('/add', function (req, res) {
  console.log('add', req.body);
  student.add(req.body, function (_student) {
    res.send('student added', _student);
  });
});


// UPDATE student
router.put('/:id/edit', function (req, res) {
  // student.update(req.params.id, function (_student) {
  //   res.send('student updated', _student);
  // });
});

module.exports = router;