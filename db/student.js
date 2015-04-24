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
    collection.insert(_student, function (err, result) {
      if (!err) {
        callback(_student);
      }
    });

  });

}

function getStudent (studentNickname, callback) {
  console.log(studentNickname)
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('students');
    // Insert some documents
    var _student = {
      nickname: studentNickname,
    };
    collection.findOne(_student, function (err, result) {
      if (!err) {
        callback(result);
      }
    });

  });
}

module.exports.add = addStudent;
module.exports.get = getStudent;