// Packages
const express = require("express")
const app = express()
const path = require("path")
const joinurl = require("url-join")
const Sentry = require('@sentry/node');

// Constants
const origin = "https://ros-url-shortener.glitch.me"
const PORT = process.env.PORT || 80

// Concurrency
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

Sentry.init({ dsn: 'https://0df9f3fb072449879fe3769ed9d8cf18@sentry.io/1493463' });

// Sentry request handling
app.use(Sentry.Handlers.requestHandler());

// Disable CORS
app.use(require("./middleware/cors"))

// Match website request
app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "index.html")))

// Match creation request
app.post("/api/*", require("./routes/create"))

// Match deprecated creation request
app.get("/new/*", (req, res) => res.redirect(308, joinurl(origin, "api", req.path.substr(5))))

// Match lookup request
app.get("/api/*", require("./routes/lookup"))

// Match deprecated lookup request
app.get("/get/*", (req, res) => res.redirect(308, joinurl(origin, "api", req.path.substr(5))))

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