// Packages
import express from "express"
const app = express()
import path from "path"
import joinurl from "url-join"
import * as Sentry from "@sentry/node"

// Constants
const origin = "https://ros-url-shortener.glitch.me"
const PORT = process.env.PORT || 80

// Concurrency
import cluster from "cluster"
const numCPUs = require('os').cpus().length;

Sentry.init({ dsn: 'https://0df9f3fb072449879fe3769ed9d8cf18@sentry.io/1493463' });

// Sentry request handling
app.use(Sentry.Handlers.requestHandler());

// Disable CORS
app.use(require("./middleware/cors"))

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({
    extended: true
}))

// Parse JSON bodies (as sent by API clients)
app.use(express.json())

// Match website request
app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "index.html")))

// v3: Match creation request
app.post("/api/", require("./routes/create"))

// LEGACY v2: Match creation request
app.post("/api/:url", (req, res) => res.redirect(308, joinurl("/", "api", `?url=${req.params.url}`)))

// LEGACY v1: Match creation request
app.get("/new/:url", (req, res) => res.redirect(308, joinurl("/", "api", `?url=${req.params.url}`)))

// v3: Match lookup request
app.get("/api/", require("./routes/lookup"))

// LEGACY v1: Match deprecated lookup request
app.get("/get/:url", (req, res) => res.redirect(308, joinurl("/", "api", `?id=${req.params.url}`)))

// Match api documentation request
app.use("/api.yaml", express.static(path.join(__dirname, "api.yaml")));

// Match naked api request
app.get("/api", (_req, res) => res.redirect(308, "https://api-docs.richie-bendall.ml/#https://ros-url-shortener.glitch.me/api.yaml"))

// Match navigation request
app.get("/*", require("./routes/nav"))

// Sentry error handling
app.use(Sentry.Handlers.errorHandler());

// If the current process is the main one
if (cluster.isMaster) {
  // Create processes relative to amount of CPUs
  Array.from({
    length: numCPUs
  }, () => cluster.fork());

  // When worker closed
  cluster.on('exit', worker => {
    console.log(`❌ Worker ${worker.process.pid} died.`);
  });
} else {
    // Listen for HTTP requests
    app.listen(PORT, () => console.log(`🚀 on http://localhost:${PORT}`))
}