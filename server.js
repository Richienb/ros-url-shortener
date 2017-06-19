var express = require('express');
var app = express();
var mongodb = require('mongodb');
var dbUrl = process.env.MONGOLAB_URI;
var client = mongodb.MongoClient;


// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/list", function (request, response) {
  client.connect(dbUrl, function (err, db) {
    if (err) {
      console.log(err);
      response.send(500);
    } else {
      db.collection('urls').find({}).toArray(function(err, docs){
      db.close();
      response.status(200).send(docs);
      });
    }
  });
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
