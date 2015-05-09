'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;

var StudentSchema = new Schema({
  schemaVersion: String,
  _id: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20
  },
  name: {
    type: String,
    required: 'Students must have a name'
  },
  nickname: {
    type: String,
    unique: true,
    required: 'Students must have a nickname'
  },
  cohort: {
    type: ShortId,
    ref: 'Cohort',
    required: 'Students must belong to a valid cohort'
  },
  score: {
    type: Number,
    default: 0,
    required: true
  }
});

StudentSchema.plugin(timestamps);

mongoose.model('Student', StudentSchema);

var Student = mongoose.model('Student');
BBPromise.promisifyAll(Student);
BBPromise.promisifyAll(Student.prototype);
exports.name = 'Student';
exports.model = Student;