'use strict';
var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var cohortController = require('../../db/cohort');
var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/meanpong';
var cohortSchema = require('../../db/models/cohort_model').model;

describe('cohort controller', function () {
  describe('addCohort', function () {
    before(function (done) {
      if (mongoose.connection.db) {
        return done();
      }
      console.log('disconnecting');
      mongoose.connect(url, done);
    });
    after(function (done) {
      mongoose.disconnect(function () {
        console.log('disconnecting');
        delete mongoose.connection.db;
        done();
      });
    });
    afterEach(function (done) {
      cohortSchema.remove({}, done);
    });
    it('with valid info', function () {
      var cohortInfo = {
        name: 'name',
        year: 2015
      };
      return cohortController.add(cohortInfo)
        .then(function (result) {
          return expect(result.name).to.eql('name');
        });
    });
    it('with no name', function () {
      var cohortInfo = {
        year: 2015
      };
      return cohortController.add(cohortInfo)
        .catch(function (result) {
          return expect(result.name).to.eql('ValidationError');
        });
    });
    it('with no year', function () {
      var cohortInfo = {
        name: 'name'
      };
      return cohortController.add(cohortInfo)
        .catch(function (result) {
          return expect(result.name).to.eql('ValidationError');
        });
    });
  });
  describe('getCohort', function () {
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
      beforeEach(function () {
        return new cohortSchema({
          name: 'name',
          year: 2015
        }).saveAsync();
      });
      afterEach(function (done) {
        cohortSchema.remove({}, done);
      });
      it('returns the cohort', function () {
        var name = 'name';
        return cohortController.get(name)
          .then(function (result) {
            return expect(result.name).to.eql('name');
          });
      });
    });
    describe('with no cohort', function () {
      afterEach(function (done) {
        cohortSchema.remove({}, done);
      });
      it('returns an error', function () {
        var cohortInfo = {
          year: 2015
        };
        return cohortController.get(cohortInfo)
          .catch(function (result) {
            return expect(result.name).to.eql('ValidationError');
          });
      });
    });
  });
  describe('allCohort', function () {
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
      beforeEach(function (done) {
        return new cohortSchema({
            name: 'name_one',
            year: 2015
          }).saveAsync()
          .then(function () {
            return new cohortSchema({
                name: 'name_two',
                year: 2015
              }).saveAsync()
              .then(function () {
                done();
              });
          });
      });
      afterEach(function (done) {
        cohortSchema.remove({}, done);
      });
      it('returns the cohorts', function () {
        return cohortController.all()
          .then(function (result) {
            expect(result[0].name).to.eql('name_one');
            expect(result[1].name).to.eql('name_two');
          });
      });
    });
    describe('with no cohorts', function () {
      afterEach(function (done) {
        cohortSchema.remove({}, done);
      });
      it('returns an empty array', function () {
        return cohortController.all()
          .then(function (result) {
            return expect(result.length).to.eql(0);
          });
      });
    });
  });
  describe('updateCohort', function () {
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
        new cohortSchema({
          name: 'name',
          year: 2015
        }).saveAsync();
      });
      after(function (done) {
        cohortSchema.remove({}, done);
      });
      it('returns the updated cohort', function (done) {
        return cohortController.update('name', 'new name')
          .then(function (result) {
            return cohortController.get('new name')
              .then(function (_result) {
                expect(_result.name).to.eql('new name');
                done();
              });
          });
      });
    });
    describe('with invalid info', function () {
      before(function () {
        new cohortSchema({
          name: 'name',
          year: 2015
        }).saveAsync();
      });
      after(function (done) {
        cohortSchema.remove({}, done);
      });
      it('returns an error', function () {
        return cohortController.update('badname', 'new name')
          .catch(function (error) {
            return expect(error.name).to.eql('TypeError');
          });
      });
    });
  });
});