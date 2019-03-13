const express = require("express")
const app = express()
const path = require("path")
const https = require("https")
const request = require("request")
const isurl = require("is-url")
const urljoin = require("url-join")
const endpoint = process.env.ENDPOINT
const origin = "https://ros-url-shortener.glitch.me"

const requestParams = (url, body) => ({
    url,
    json: true,
    gzip: true,
    method: body ? "POST" : "GET",
    body,
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3163.100 Safari/537.36"
    }
})

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

// Match creation request
app.get("/new/*", (req, res) => {
    request(requestParams(endpoint), (err, _, body) => {
        if (err) res.status(502).json({
            "success": false,
            "message": "Unable to contact the storage endpoint."
        })

        if (body.result === null) body.result = {}
      
        if (isurl(req.path.substr(5))) {
            if (Object.values(body.result).includes(req.path.substr(5))) {
                res.json({
                    "success": true,
                    "new": false,
                    "url": urljoin(origin, Object.keys(body.result)[Object.values(body.result).findIndex(el => el === req.path.substr(5))]),
                    "id": Object.keys(body.result)[Object.values(body.result).findIndex(el => el === req.path.substr(5))]
                })
            } else {
                body.result[Object.keys(body.result).length] = req.path.substr(5)
                request(requestParams(endpoint, body.result), (errb, {ok}) => {
                    if (errb) res.status(502).json({
                        "success": false,
                        "message": "Unable to contact the storage endpoint."
                    })
                    if (ok === false) res.status(502).json({
                        "success": false,
                        "message": "The storage endpoint returned an error."
                    })
                    res.json({
                        "success": true,
                        "new": true,
                        "url": urljoin(origin, Object.keys(body.result).length),
                        "id": Object.keys(body.result).length
                    })
                })
            }
        } else {
            res.status(400).json({
                "success": false,
                "message": "String provided is not a URL."
            })
        }


    })
})

// Match lookup request
app.get("/get/*", (req, res) => {
    request(requestParams(endpoint), (err, _, {result}) => {
        if (err) res.status(502).json({
            "success": false,
            "message": "Unable to contact the storage endpoint."
        })

        if (Object.keys(result).includes(req.path.substr(1))) {
            res.json({
                "success": true,
                "url": result[req.path.substr(1)]
            })
        } else {
            res.status(404).json({
                "success": false,
                "message": "No match found for short URL!"
            })
        }
    })
})

// Match navigation request
app.get("/[0-9]+", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    request(requestParams(endpoint), (err, _, {result}) => {
        if (err) res.status(502).send("Unable to contact the storage endpoint.")

        if (Object.keys(result).includes(req.path.substr(1))) {
            res.redirect(result[req.path.substr(1)])
        } else {
            res.status(404).send("No match found for short URL!")
        }
    })
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${listener.address().port}`)
})