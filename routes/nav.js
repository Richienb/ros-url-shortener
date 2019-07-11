const request = require("../utils/request")
const endpoint = process.env.ENDPOINT
import joinurl from "url-join"

export default (req, res) => {
    request(joinurl(endpoint, req.params.id))
        .then(({result, ok}) => {
            if (!ok) res.status(502).send("Unable to contact the storage endpoint.")
            else if (!result) res.status(404).send("No match found for short URL!")
            else res.redirect(result)
        })
        .catch(() => res.status(502).send("Unable to contact the storage endpoint."))
}