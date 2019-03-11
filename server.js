const express = require("express")
const app = express()
const path = require("path")
const https = require("https")
const endpoint = process.env.ENDPOINT
const request = require("request")

const requestParams = (url, body) => {
    return {
        url: url,
        json: true,
        gzip: true,
        method: method,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.80 Safari/537.36"
        }
    }
}

request(requestParams(endpoint), (err, _, body) => {
    if (err) {
        throw err
    }

    console.log(body)
})

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
        headers: {
            'Content-Type': "application/json"
        }
    }, (res) => {
        let data = ""

        res.on('data', (d) => {
            process.stdout.write(d);
        });

        res.on('end')

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