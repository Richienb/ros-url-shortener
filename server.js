const express = require("express")
const app = express()
const endpoint = process.env.ENDPOINT



const getRandomString = ()  => {
    let text = ""
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    return text
}

const getLongUrl = (url) => {
     var protocol_ok = url.startsWith("http://") || url.startsWith("https://") || url.startsWith("ftp://");
     if(!protocol_ok){
         newurl = "http://"+url;
         return newurl;
     }else{
         return url;
     }
  
  const genHash = () => {
    if (window.location.hash == ""){
        window.location.hash = getRandomString();
    }
}
  
  function shortUrl(){
    var longurl = getLongUrl();
    genHash();
    send_request(longurl);
}

app.get("/", (_request, response) => {
    response.sendFile("index.html");
});

app.get("/new/*", (request, response) => {
 
});

app.get("/:data(\\d+)/", function(request, response) {
    client.connect(dbUrl, function(err, db) {
        if (!err) {
            db.collection('urls').find({
                value: parseInt(request.params.data)
            }).toArray(function(err, docs) {
                if (!err) {
                    if (docs.length > 0) {
                        response.redirect(docs[0].original_url);
                    } else {
                        response.sendStatus(404);
                    }
                } else {
                    serverError(err, response);
                }
                db.close();
            });
        } else {
            serverError(err, response);
            db.close();
        }
    });
});

function serverError(err, response) {
    console.error(err);
    response.sendStatus(500);
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});