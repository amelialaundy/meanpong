// name, year, id, total score
'use strict';
var _ = require('lodash');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/meanpong';

function addCohort(cohort, callback) {
  console.log(cohort);
  // connect to mongo
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('cohorts');
    // Insert some documents
    var _cohort = {
      name: cohort.name,
      year: cohort.year,
      totalScore: 0
    };
    collection.insert(_cohort, function (err, result) {
      // if (!err) {
        callback(_cohort);
      // }
    });
  });

}

function getCohort(cohortNickname, callback) {
  console.log(cohortNickname)
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('cohorts');
    // Insert some documents
    var _cohort = {
      name: cohortNickname,
    };
    collection.findOne(_cohort, function (err, result) {
      if (!err) {
        callback(result);
      }
    });

  });
}

function all(callback) {
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('cohorts');
    collection.find({}, function (err, cursor) {
      cursor.toArray(callback);
    });
  });
}

function update(query, update, callback) {
  console.log(query, update);
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('cohorts');
    collection.update({name: query}, {$set: update}, callback);
  });
}

module.exports.add = addCohort;
module.exports.get = getCohort;
module.exports.all = all;
module.exports.update = update;