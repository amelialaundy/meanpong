'use strict';
var mongoose = require('mongoose');
var ShortId = require('mongoose-shortid');
var timestamps = require('mongoose-timestamp');
var BBPromise = require('bluebird');
var Schema = mongoose.Schema;

var CohortSchema = new Schema({
  schemaVersion: String,
  _id: {
    type: ShortId,
    base: 64,
    retries: 4,
    len: 20
  },
  name: {
    type: String,
    required: 'Cohorts must have a name'
  },
  year: {
    type: Number,
    required: 'Cohorts must have a year'
  },
  totalScore: {
    type: Number,
    default: 0,
    required: 'Minimum score must be 0'
  }
});

CohortSchema.plugin(timestamps);

CohortSchema.method({
  setTotalScore: function () {
    var students = this.model('Student').find({ cohort: this._id });
    this.totalScore = students.reduce(function (prevStudent, currentStudent) {
      return prevStudent.totalScore + currentStudent.totalScore;
    });
  }
});

mongoose.model('Cohort', CohortSchema);

var Cohort = mongoose.model('Cohort');
BBPromise.promisifyAll(Cohort);
BBPromise.promisifyAll(Cohort.prototype);
exports.name = 'Cohort';
exports.model = Cohort;