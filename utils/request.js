const request = require("request-promise")
const version = require("../package.json").version

module.exports = request.defaults({
    json: true,
    gzip: true,
    headers: {
        "User-Agent": `ROS URL Shortener v${version}`
    }
})