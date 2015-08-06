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
      mongoose.connect(url, done);
    });
    after(function (done) {
      mongoose.disconnect(function () {
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
  describe('getStudent', function () {
    before(function (done) {
      if (mongoose.connection.db) {
        return done();
      }
      mongoose.connect(url, done);
    });
    after(function (done) {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });
    afterEach(function (done) {
      studentSchema.remove({}, done);
    });
    describe('with valid info', function () {
      beforeEach(function () {
        var studentInfo = {
          name: 'name',
          nickname: 'nickname',
          cohort: 1
        };
        return new studentSchema(studentInfo).saveAsync();
      });
      afterEach(function (done) {
        studentSchema.remove({}, done);
      });
      it('returns the student', function () {
        var name = 'nickname';
        return studentController.get(name)
          .then(function (result) {
            return expect(result.name).to.eql('name');
          });
      });
    });
    describe('with no student', function () {
      afterEach(function (done) {
        studentSchema.remove({}, done);
      });
      it('returns an error', function () {
        var name = 'nickname';
        return studentController.add(name)
          .catch(function (result) {
            return expect(result.name).to.eql('ValidationError');
          });
      });
    });
  });
  describe('allStudent', function () {
    before(function (done) {
      if (mongoose.connection.db) {
        return done();
      }
      mongoose.connect(url, done);
    });
    after(function (done) {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });
    describe('with valid cohort info', function () {
      beforeEach(function (done) {
        var studentInfoOne = {
          name: 'name_one',
          nickname: 'nickname1',
          cohort: 1
        };
        var studentInfoTwo = {
          name: 'name_two',
          nickname: 'nickname2',
          cohort: 1
        };
        return new studentSchema(studentInfoOne).saveAsync()
          .then(function () {
            return new studentSchema(studentInfoTwo).saveAsync()
              .then(function () {
                done();
              });
          });
      });
      afterEach(function (done) {
        studentSchema.remove({}, done);
      });
      it('returns the cohorts', function () {
        return studentController.all()
          .then(function (result) {
            expect(result[0].name).to.eql('name_one');
            expect(result[1].name).to.eql('name_two');
          });
      });
    });
    describe('with no cohort requested', function () {
      it('returns an empty array', function () {
        return studentController.all()
          .then(function (result) {
            return expect(result.length).to.eql(0);
          });
      });
    });
  });
  describe('updateStudent', function () {
    before(function (done) {
      if (mongoose.connection.db) {
        return done();
      }
      mongoose.connect(url, done);
    });
    after(function (done) {
      mongoose.disconnect(function () {
        delete mongoose.connection.db;
        done();
      });
    });
    describe('with valid info', function () {
      before(function () {
        var studentInfo = {
          name: 'name',
          nickname: 'nickname',
          cohort: 1
        };
        new studentSchema(studentInfo).saveAsync();
      });
      after(function (done) {
        studentSchema.remove({}, done);
      });
      it('returns the updated cohort', function (done) {
        return studentController.update({nickname: 'nickname'}, 'new nickname')
          .then(function (result) {
            return studentController.get('new nickname')
              .then(function (_result) {
                expect(_result.nickname).to.eql('new nickname');
                done();
              });
          });
      });
    });
    describe('with invalid info', function () {
      before(function () {
        var studentInfo = {
          name: 'name',
          nickname: 'nickname',
          cohort: 1
        };
        return new studentSchema(studentInfo).saveAsync();
      });
      after(function (done) {
        studentSchema.remove({}, done);
      });
      it('returns an error', function () {
        return studentController.update({nickname: 'badname'}, 'new name')
          .catch(function (error) {
            return expect(error.name).to.eql('Error');
          });
      });
    });
  });
});