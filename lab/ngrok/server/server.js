const express = require("express");
const httpProxy = require("http-proxy");
const { v4 } = require("uuid");

const app = express();
const proxy = httpProxy.createProxyServer({});
const id2Port = {};
const port2Id = {};
const maxPort = 49151;
const minPort = 1024;

function register() {
  const port = checkPort(
    Math.floor(Math.random() * (maxPort - minPort) + minPort)
  );
  const id = v4();
  id2Port[id] = port;
  port2Id[port] = id;
  return {
    id,
    port,
  };
}

function checkPort(port) {
  if (port > maxPort) {
    throw Error("port out of range");
  }

  if (port in port2Id) {
    port += 1;
    return checkPort(port);
  } else {
    return port;
  }
}

app.post("/register", (req, res) => {
  const { id, port } = register();
  res.json({ id, port });
});

app.post("deregister", (req, res) => {});

app.use("/:id", (req, res) => {
  const { id } = req.params;
  const port = id2Port[id];
  if (port) {
    proxy.web(req, res, { target: `http://localhost:${port}` }, (err) => {
      if (err) {
        console.error(id, err);
        res.status(500).json({
          msg: err,
        });
      }
    });
  } else {
    res.status(400).json({ msg: "invalid id" });
  }
});

app.listen(3000);
