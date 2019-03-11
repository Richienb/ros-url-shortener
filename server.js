const express = require("express")
const app = express()
const path = require("path")
const https = require("https")
const endpoint = process.env.ENDPOINT
const request = require("request")
const isurl = require("is-url")

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

app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Match creation request
app.get("/new/*", (req, res) => {
    request(requestParams(endpoint), (err, _, body) => {
        if (err) {
            res.status()
        }

        if (isurl(req.path.substr(5))) {
            if (Object.values(body).includes(req.path.substr(5))) {
                res.json({
                    "success": true,
                    url: body.find((el) => {
                        return el === req.path.substr(5)
                    })
                })
            } else {
                body[Object.keys(body).length + 1] = req.path.substr(5)
                request(requestParams(endpoint, body), (err2, body2) => {

                })
            }
        }


    })
});

// Match lookup request
app.get("/[0-9]+", (req, res) => {
    request(requestParams(endpoint), (err, _, body) => {
        if (err) {
            throw err
        }

        if (Object.keys(body).includes(req.path.substr(1))) {
            res.redirect(body[req.path.substr(1)])
        }
    })
});

function serverError(err, res) {
    console.error(err);
    res.sendStatus(500);
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});