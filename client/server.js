const express = require("express");
const next = require("next");

const { createProxyMiddleware } = require("http-proxy-middleware");

const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // apply middlewares
  server.use(express.json());

  // proxy middleware for api
  if (dev) {
    server.use(
      "/api",
      createProxyMiddleware({
        target: "http://localhost:8000",
        changeOrigin: true,
      })
    );
  }

  // handle other requests
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // listen
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("Server listening on PORT 3000");
  });
});
