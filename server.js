const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = parseInt(process.env.PORT || "53712", 10);
const ROOT = "/home/workspace/chloe-nicoles-catering";

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function serve(req, res) {
  let filePath = path.join(ROOT, req.url === "/" ? "/index.html" : req.url);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        fs.readFile(path.join(ROOT, "index.html"), (err2, data2) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data2);
        });
      } else {
        res.writeHead(500);
        res.end("Server Error");
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
}

const server = http.createServer(serve);
server.listen(PORT, () => {
  process.stdout.write(`Serving on port ${PORT}\n`);
});
