var express = require('express');
var app = express();
var mongodb = require('mongodb');
var dbUrl = process.env.MONGOLAB_URI;
var client = mongodb.MongoClient;
var base_url = 'https://shortener.glitch.com/'


// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/new/*", function (request, response) {
  client.connect(dbUrl, function (err, db) {
    if (err) serverError(err, response)
    
    //If it already exists reuse the information
    db.collection('urls').find({ original_url: request.params[0]}).toArray(function(err, data){
      
    });
    
    var nextVal = 0;
    db.collection('urls').find().sort({ value: -1}).limit(1).toArray(function(err, max){
      if (err) serverError(err, response);
      
      if (max.length > 0){
        nextVal = max[0].value + 1;  
      }
      db.collection('urls').insert({ value: nextVal, original_url: request.params[0] }, function(err, data) {
        if (err) serverError(err, response);
        
        response.status(201).send({ original_url: data.ops[0].original_url , short_url: base_url + data.ops[0].value });
        db.close();
      });      
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
