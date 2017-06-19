var mongodb = require('mongodb');
var dbUrl = process.env.MONGOLAB_URI;
var MongoClient = mongodb.MongoClient;
module.exports = exports = {}


exports.list = function(){
  MongoClient.connect(dbUrl, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      var urls = db.collection('urls');
      var arr = urls.find({}).toArray(function(err, docs){
        db.close();
        return docs;  
      });
    }
  });  
}
