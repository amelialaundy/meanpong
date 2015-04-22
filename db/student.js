'use strict';
// name, current cohort, affiliated cohorts, score

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/meanpong';

function addStudent(student, callback) {
  console.log(student)
  MongoClient.connect(url, function (err, db) {
    console.log('Connected correctly to server');
    var collection = db.collection('students');
    // Insert some documents
    collection.insert([
      {name: student.name, cohort: student.cohort, score: 0}
    ], function(err, result) {
      console.log('Inserted 3 documents into the document collection');
      callback(result);
    });

  });

  // Get the documents collection

 
}

module.exports.add = addStudent;