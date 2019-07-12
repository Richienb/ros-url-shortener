import request from "request-promise"
import userAgent from "./data/userAgent"

export default request.defaults({
    json: true,
    gzip: true,
    headers: {
        "User-Agent": userAgent
    }
})
