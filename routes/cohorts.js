'use strict';
var express = require('express');
var router = express.Router();

/* GET cohorts listing. */
router.get('/', function(req, res, next) {
  res.send('respond with all cohorts');
});

router.get('/{id}', function(req, res, next) {
  res.send('respond with one cohort');
});

module.exports = router;
