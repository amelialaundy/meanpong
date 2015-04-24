'use strict';
var express = require('express');
var router = express.Router();
var cohort = require('../db/cohort');

// READ all 
router.get('/', function (req, res) {
  cohort.all(function (err, _cohort) {
    console.log('cohorts', _cohort);
    res.send('cohorts', _cohort);
  });
});


// READ one
router.get('/:name', function (req, res) {
  cohort.get(req.params.name, function (_cohort) {
    res.send('cohort', _cohort);
  });
});


// CREATE new cohort
// params: name, year
router.post('/add', function (req, res) {
  console.log('add', req.body);
  cohort.add(req.body, function (_cohort) {
    res.send('cohort added', _cohort);
  });
});


// UPDATE cohort
// params: name, year
router.put('/:nickname/edit', function (req, res) {
  console.log(req.body);
  cohort.update(req.params.nickname, req.body, function (err, _cohort) {
    console.log(err, _cohort);
    res.send('cohort updated', _cohort);
  });
});

module.exports = router;