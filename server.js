const express = require("express")
const app = express()
const path = require("path")
const https = require("https")
const endpoint = process.env.ENDPOINT

app.get("/", (_request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

// Match creation request
app.get("/new/*", (request, response) => {

});

// Match lookup request
app.get("/[0-9]+", (request, response) => {
    https.get({
        host: endpoint,
        port: 443,
        path: '/'
    }, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });

    }).on('error', (e) => {
        console.error(e);
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