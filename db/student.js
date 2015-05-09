'use strict';
// name, current cohort, affiliated cohorts, score
var BBPromise = require('bluebird');
var mongo = BBPromise.promisifyAll(require('mongodb'));
var MongoClient = mongo.MongoClient;

var studentSchema = require('./models/student_model').model;

function addStudent(student) {
  // connect to mongo
  // mongoose.connect(url);
  return new studentSchema({
    name: student.name,
    cohort: student.cohort,
    nickname: student.nickname,
    score: 0
  }).saveAsync();
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