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
    if (err) serverError(err, response)
    
    db.collection('urls').find({}).toArray(function(err, docs){
      if (err) serverError(err, response)
      
      db.close();
      response.status(200).send(docs);
    });
    
  });
});

app.get("/new/:data", function (request, response) {
  client.connect(dbUrl, function (err, db) {
    if (err) serverError(err, response)
    
    db.collection('urls').find({}).toArray(function(err, docs){
      if (err) serverError(err, response)
      
      db.close();
      response.status(200).send(docs);
    });
    
  });
});

app.get("/:data", function (request, response) {
  client.connect(dbUrl, function (err, db) {
    if (err) serverError(err, response)
    
    if isNumber()
    db.collection('urls').find({ id: request.params.data }).toArray(function(err, docs){
      if (err) serverError(err, response)
      
      db.close();
      response.status(200).send(docs);
    });
    
  });
});

function serverError(err, response){
  console.error(err);
  response.send(500);
}


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
