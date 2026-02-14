import http from "http";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import chokidar from "chokidar";

const PORT = 8041;
const PROJECT_ROOT = path.resolve();

// ---------------------------
// AUTO BUILD
// ---------------------------
let isBuilding = false;

function runBuild() {
  if (isBuilding) return;
  isBuilding = true;

  console.log("🔧 Building ...");

  exec(
    "node scripts/build.js --dev",
    { cwd: PROJECT_ROOT },
    (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Build-Error:", err);
        console.error(stderr);
      } else {
        console.log("✔ Build successful!");
      }
      isBuilding = false;
    },
  );
}

// ---------------------------
// WATCHER (with Chokidar)
// ---------------------------
function startWatcher() {
  const watchPaths = [
    path.join(PROJECT_ROOT, "src"),
    path.join(PROJECT_ROOT, "scripts/index.ejs"),
  ];

  const watcher = chokidar.watch(watchPaths, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher
    .on("add", (path) => {
      console.log(`➕ File added: ${path}`);
      runBuild();
    })
    .on("change", (path) => {
      console.log(`📝 File changed: ${path}`);
      runBuild();
    })
    .on("unlink", (path) => {
      console.log(`🗑 File removed: ${path}`);
      runBuild();
    })
    .on("error", (error) => console.error(`Watcher error: ${error}`));

  console.log("👀 Watching for file changes with Chokidar...");
}

startWatcher();

// ---------------------------
// HTTP Server
// ---------------------------
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/" || req.url === "") {
    const filePath = path.join(PROJECT_ROOT, "scripts", "dev.html");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Fehler beim Laden der Datei");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
  } else if (req.url === "/bundle.js") {
    const filePath = path.join(PROJECT_ROOT, "dist", "bundle.js");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Fehler beim Lesen von bundle.js");
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
  console.log(`Server running on http://localhost:${PORT}`);
});
