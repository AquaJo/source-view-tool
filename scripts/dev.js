const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8041;

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "") {
    const filePath = path.join(__dirname, "..", "dev.html");

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Fehler beim Laden der Datei");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
  } else if (req.url === "/inject.js") {
    const filePath = path.join(__dirname, "../inject.js");

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Fehler beim Lesen der Datei");
        return;
      }

      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(data);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
