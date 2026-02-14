import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import ejs from "ejs";

const PROJECT_ROOT = path.resolve();

const isDev = process.argv.includes("--dev");

async function build() {
  const entry = path.join(PROJECT_ROOT, "./src/index.js");
  const outBundle = path.join(PROJECT_ROOT, "./dist/bundle.js");
  const outputHTML = path.join(PROJECT_ROOT, "./dist/index.html");

  console.log(
    isDev ? "🏗  Running in DEV mode..." : "🚀 Running in PRODUCTION mode...",
  );

  // 1. Bundle with esbuild
  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: "iife",
    platform: "browser",
    minify: !isDev,
    sourcemap: isDev,
    outfile: outBundle,
    loader: {
      ".png": "dataurl",
      ".jpg": "dataurl",
      ".svg": "dataurl",
      ".gif": "dataurl",
      ".css": "text",
    },
  });

  console.log("✔ esbuild bundling done");

  // 2. get code (minified or raw and unminified depending on mode)
  const rawCode = fs.readFileSync(outBundle, "utf8");

  // 3. build bookmarklet
  const bookmarklet = "javascript:" + encodeURIComponent(rawCode);

  ejs.renderFile(
    path.join(PROJECT_ROOT, "./scripts/index.ejs"),
    { staticJavascript: bookmarklet },
    function (err, data) {
      if (err) {
        console.error("EJS render error:", err);
        return;
      }

      fs.writeFileSync(outputHTML, data);
      console.log(
        `✔ ${isDev ? "Unminified" : "Minified"} Website code saved to dist/index.html`,
      );
    },
  );
}

build().catch(console.error);
