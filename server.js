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
        method: body ? "POST" : "GET",
        body: body,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.80 Safari/537.36"
        }
    }
}

app.get("/", (_request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

// Match creation request
app.get("/new/*", (_request, response) => {

});

// Match lookup request
app.get("/[0-9]+", (request, response) => {
    request(requestParams(endpoint), (err, _, body) => {
        if (err) {
            throw err
        }

        if (Object.keys(body).includes(request.path.substr(1))) {
          
        }
    })
});

function serverError(err, response) {
    console.error(err);
    response.sendStatus(500);
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});