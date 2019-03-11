const express = require("express")
const app = express()
const endpoint = process.env.ENDPOINT

const getrandom = () => { return Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 5) }

function getrandom() {
    var text = “”;
    var possible = “ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789”;   
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

app.get("/", (_request, response) => {
    response.sendFile("index.html");
});

app.get("/new/*", (request, response) => {
    if (!validUrl.isWebUri(request.params[0])) {
        response.status(400).send('Invalid URL provided');
    } else {
        const MongoClient = mongodb.MongoClient;
        const client = new MongoClient(process.env.MONGOLAB_URI, {
            useNewUrlParser: true
        });

        client.connect(err => {
            const collection = client.db("urls").collection("urls");
            console.log(collection)
            // perform actions on the collection object
            client.close();
        });
    }
//   process.exit(0)
//     client.connect(dbUrl, function(err, db) {
//         console.log(err)
//         if (!err) {
//             //Check provided URL
//             if (!validUrl.isWebUri(request.params[0])) {
//                 response.status(400).send('Invalid URL provided');
//             } else {
//                 //If it already exists reuse the information
//                 db.collection('urls').find({
//                     original_url: request.params[0]
//                 }).toArray(function(err, data) {
//                     if (!err) {
//                         if (data.length > 0) {
//                             response.status(200).send({
//                                 original_url: data[0].original_url,
//                                 short_url: base_url + data[0].value
//                             });
//                         } else {
//                             //Store
//                             var nextVal = 0;
//                             db.collection('urls').find().sort({
//                                 value: -1
//                             }).limit(1).toArray(function(err, max) {
//                                 if (!err) {
//                                     if (max.length > 0) {
//                                         nextVal = max[0].value + 1;
//                                     }
//                                     db.collection('urls').insert({
//                                         value: nextVal,
//                                         original_url: request.params[0]
//                                     }, function(err, data) {
//                                         if (!err) {
//                                             response.status(200).send({
//                                                 original_url: data.ops[0].original_url,
//                                                 short_url: base_url + data.ops[0].value
//                                             });
//                                         } else {
//                                             serverError(err, response);
//                                         }
//                                         db.close();
//                                     });
//                                 } else {
//                                     serverError(err, response);
//                                     db.close();
//                                 }
//                             });
//                         }
//                     } else {
//                         serverError(err, response);
//                         db.close();
//                     }
//                 });
//             }
//         } else {
//             serverError(err, response);
//             db.close();
//         }

//     });
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