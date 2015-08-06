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

function getStudent(studentNickname) {
  // Insert some documents
  var _student = {
    nickname: studentNickname,
  };
  return studentSchema.findOneAsync(_student)
    .then(function (result) {
      return result;
    });
}

function all(cohort) {
  var requestedCohort = {};
  if (cohort !== undefined) {
    requestedCohort.cohort = cohort;
  }
  return studentSchema.findAsync(requestedCohort)
    .then(function (_student) {
      return _student;
    });
}

function update(query, _update) {
  return studentSchema.findOneAsync(query)
    .then(function (_student) {
      if (_student !== null) {
        return _student.updateAsync({
          $set: {
            nickname: _update
          }
        }).then(function (updatedStudent) {
          return updatedStudent;
        });
      } else {
        throw new Error('StudentNotFound');
      }
    });
}

module.exports.add = addStudent;
module.exports.get = getStudent;
module.exports.all = all;
module.exports.update = update;