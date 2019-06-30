const request = require("../utils/request")
const endpoint = process.env.ENDPOINT
const joinurl = require("url-join")

module.exports = (req, res) => {
    request(joinurl(endpoint, req.path.slice(5)))
        .then(({result, ok}) => {
            if (!ok) res.status(502).json({
                    "success": false,
                    "message": "Unable to contact the storage endpoint."
                })
            else if (!result) res.status(404).json({
                    "success": false,
                    "message": "No match found for the ID!"
                })
            else res.json({
                    "success": true,
                    "url": result
                })
        })
        .catch(() => res.status(502).json({
            "success": false,
            "message": "Unable to contact the storage endpoint."
        }))
}