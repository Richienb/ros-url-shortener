import request from "../utils/request"
const endpoint = process.env.ENDPOINT
import joinurl from "url-join"
import isurl from "is-url"
import randString from "../utils/randString"
const origin = "https://ros-url-shortener.glitch.me"

const genId = (notin) => {
    const str = randString.string({
        length: 5,
        pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    });
    if (str in Object.values(notin)) return genId(notin)
    else return str
}

module.exports = (req, res) => {
    const url = req.query.url
    if (!isurl(url)) res.status(400).json({
        "success": false,
        "message": "String provided is not a URL."
    })
    else request(endpoint)
        .then(({
            result,
            ok
        }) => {
            if (!ok) res.status(502).json({
                "success": false,
                "message": "Unable to contact the storage endpoint."
            })
            else {
                const i = Object.values(result).indexOf(url)
                if (i >= 0) {
                    const id = Object.keys(result)[i].toString()
                    res.json({
                    "success": true,
                    "new": false,
                    "url": joinurl(origin, id),
                    "id": id
                })
            }
                else {
                    const id = genId(Object.keys(result))
                    request.put({url: joinurl(endpoint, id), body: url})
                    .then(() => res.json({
                        "success": true,
                        "new": true,
                        "url": joinurl(origin, id),
                        "id": id
                    }))
                    .catch(() => res.status(502).send("Unable to contact the storage endpoint."))
                }
            }
        })
        .catch(() => res.status(502).send("Unable to contact the storage endpoint."))
}