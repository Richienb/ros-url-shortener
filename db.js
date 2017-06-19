var mongodb = require('mongodb');
var dbUrl = process.env.MONGOLAB_URI;
var MongoClient = mongodb.MongoClient;
var module.exports = exports = {}

MongoClient.connect(dbUrl, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', dbUrl);
    
    //collection called urls;
    
    db.close();
  }
});