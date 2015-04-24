'use strict';
// name, current cohort, affiliated cohorts, score

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/meanpong';

function addStudent(student, callback) {
  console.log(student);
  // connect to mongo
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('students');
    // Insert some documents
    var _student = {
      name: student.name,
      cohort: student.cohort,
      nickname: student.nickname,
      score: 0
    };
    collection.insert(_student, function () {
      callback(_student);
    });
  });

}

function getStudent(studentNickname, callback) {
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('students');
    // Insert some documents
    var _student = {
      nickname: studentNickname,
    };
    collection.findOne(_student, function (err, result) {
      callback(result);
    });

  });
}

function all(cohort, callback) {
  var _cohort = {
    cohort: cohort
  };
  if (callback === undefined && typeof cohort === 'function') {
    callback = cohort;
    cohort = {};
  }
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('students');
    collection.find(_cohort, function (err, cursor) {
      cursor.toArray(callback);
    });
  });
}

function update(query, _update, callback) {
  console.log(query, _update);
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('students');
    collection.update({
      nickname: query
    }, {
      $set: _update
    }, callback);
  });
}

module.exports.add = addStudent;
module.exports.get = getStudent;
module.exports.all = all;
module.exports.update = update;