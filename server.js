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
    if (err) serverError(err, response);
    
    db.collection('urls').find({}).toArray(function(err, docs){
      if (err) serverError(err, response)
      
      db.close();
      response.status(200).send(docs);
    });
    
  });
});

app.get("/new/*", function (request, response) {
  client.connect(dbUrl, function (err, db) {
    if (err) serverError(err, response)
    
    db.collection('urls').find()
    
    db.collection('urls').insert({ value: 1, original_url: request.params[0] }, function(err, data) {
      if (err) serverError(err, response);
      
      response.status(201).send(data);
      db.close();
    });
    
    
  });
});

app.get("/:data", function (request, response) {
  client.connect(dbUrl, function (err, db) {
    if (err) serverError(err, response);
    if (isNaN(request.params.data)) { response.status(400).send('Invalid URL'); }
    
    db.collection('urls').find({ id: parseInt(request.params.data) }).toArray(function(err, docs){
      if (err) serverError(err, response)
      db.close();
      response.redirect(docs[0].original_url);
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
