// name, year, id, total score
'use strict';
var BBPromise = require('bluebird');
var mongo = BBPromise.promisifyAll(require('mongodb'));
var MongoClient = mongo.MongoClient;

var cohortSchema = require('./models/cohort_model').model;

function addCohort(cohort) {
  return new cohortSchema({
    name: cohort.name,
    year: cohort.year
  }).saveAsync();
}

function getCohort(cohortName) {
  var _cohort = {
    name: cohortName,
  };
  return cohortSchema.findOneAsync(_cohort)
    .then(function (result) {
      return result;
    });
}

function all() {
  return cohortSchema.findAsync({})
    .then(function (result) {
      return result;
    });
}

function update(existingName, updateName) {
  var query = {
    name: existingName
  };
  return cohortSchema.findOneAsync(query)
    .then(function (_cohort) {
      return _cohort.updateAsync({
        $set: {
          name: updateName
        }
      }).then(function (updatedCohort) {
        return updatedCohort;
      });
    });

}

module.exports.add = addCohort;
module.exports.get = getCohort;
module.exports.all = all;
module.exports.update = update;