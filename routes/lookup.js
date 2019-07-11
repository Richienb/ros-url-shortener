import request from "../utils/request"
const endpoint = process.env.ENDPOINT
import joinurl from "url-join"

module.exports = (req, res) => {
    // Match naked api request
    if(!req.query.id) return res.redirect(308, "https://api-docs.richie-bendall.ml/#https://ros-url-shortener.glitch.me/api.yaml")
    request(joinurl(endpoint, req.query.id))
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