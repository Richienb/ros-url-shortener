const request = require("../utils/request")
const endpoint = process.env.ENDPOINT
const joinurl = require("url-join")

module.exports = (req, res) => {
    request(joinurl(endpoint, req.path.slice(1)))
        .then(({result, ok}) => {
            if (!ok) res.status(502).send("Unable to contact the storage endpoint.")
            else if (!result) res.status(404).send("No match found for short URL!")
            else res.redirect(result)
        })
        .catch(() => res.status(502).send("Unable to contact the storage endpoint."))
}