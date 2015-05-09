'use strict';
var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var studentController = require('../../db/student');
var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/meanpong';
var studentSchema = require('../../db/models/student_model').model;
var cohortSchema = require('../../db/models/cohort_model').model;

describe('student controller', function () {

  describe('addStudent', function () {
    before(function (done) {
      if (mongoose.connection.db) {
        return done();
      }
      console.log('disconnecting')
      mongoose.connect(url, done);
    });
    after(function (done) {
      mongoose.disconnect(function () {
        console.log('disconnecting')
        delete mongoose.connection.db;
        done();
      });
    });
    afterEach(function (done) {
      studentSchema.remove({}, done);
    });
    it('with valid info', function () {
      var studentInfo = {
        name: 'name',
        nickname: 'nickname',
        cohort: 1
      };
      return studentController.add(studentInfo)
        .then(function (result) {
          return expect(result.name).to.eql('name');
        });
    });
    it('with no name', function () {
      var studentInfo = {
        nickname: 'nickname',
        cohort: 'cohort'
      };
      return studentController.add(studentInfo)
        .catch(function (result) {
          return expect(result.name).to.eql('ValidationError');
        });
    });
    it('with no nickname', function () {
      var studentInfo = {
        name: 'name',
        cohort: 'cohort'
      };
      return studentController.add(studentInfo)
        .catch(function (result) {
          return expect(result.name).to.eql('ValidationError');
        });
    });
    it('with no cohort', function () {
      var studentInfo = {
        name: 'name',
        nickname: 'nickname'
      };
      return studentController.add(studentInfo)
        .catch(function (result) {
          return expect(result.name).to.eql('ValidationError');
        });
    });
  });
});