'use strict';
var express = require('express');
var router = express.Router();
var cohort = require('../db/cohort');

// READ all 
router.get('/', function (req, res) {
  return cohort.all().then(function (_cohort) {
    console.log('cohorts', _cohort);
    res.send('cohorts', _cohort);
  });
});


// READ one
router.get('/:name', function (req, res) {
  return cohort.get(req.params.name).then(function (_cohort) {
    res.send('cohort', _cohort);
  });
});


// CREATE new cohort
// params: name, year
router.post('/add', function (req, res) {
  console.log('add', req.body);
  return cohort.add(req.body).then(function (_cohort) {
    res.send('cohort added', _cohort);
  });
});


// UPDATE cohort
// params: name, year
router.put('/:nickname/edit', function (req, res) {
  console.log(req.body);
  return cohort.update(req.params.nickname, req.body).then(function (_cohort) {
    console.log(_cohort);
    res.send('cohort updated', _cohort);
  });
});

module.exports = router;