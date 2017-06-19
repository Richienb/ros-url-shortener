var mongodb = require('mongodb');
var dbUrl = process.env.MONGOLAB_URI;
var MongoClient = mongodb.MongoClient;
module.exports = exports = {}


exports.list = function(){
  var result = 'fruta';
  MongoClient.connect(dbUrl, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      db.collection('urls').find({}).toArray(function(err, docs){
        console.log(docs);
        result = docs;
        db.close();
        return result;
      });
    }
  });
  return result;
}
