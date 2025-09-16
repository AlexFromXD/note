const apm = require("elastic-apm-node");
apm.start({
  active: true,
  serviceName: "main-server",
  serverUrl: "http://127.0.0.1:8200",
});

const http = require("http");
const { Pool } = require("pg");

const express = require("express");
const app = express();

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  max: 20,
});

function loginCheck(req, res, next) {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    res.status(401).json({ msg: "user not login" }).end();
    return;
  }

  req.userId = Number(userId);
  apm.setUserContext({
    id: userId,
  });

  next();
}

app.get("/data", loginCheck, (req, res) => {
  const { id } = req.query;

  if (!id) {
    const msg = "id is required";
    apm.setCustomContext({
      detail: msg,
    });

    res.status(400).json({ msg });
    return;
  }

  pool.query("select * from data where id = $1", [id], (err, result) => {
    if (err || req.userId === 666) {
      apm.captureError(err || new Error("user 666"), {
        custom: {
          detail: "user 666 is not allowed",
        },
      });
      apm.setTransactionOutcome("failure");
      res.status(500).json({ msg: "internal server error" });
      return;
    }

    res.json(result);
  });
});

app.post("/span", loginCheck, async (req, res) => {
  for (let i = 1; i < 3; i++) {
    const latency = Math.random() * 500;
    const span = apm.currentTransaction.startSpan(`span-${i}`);
    await new Promise((resolve) => setTimeout(resolve, latency));
    span.end();
  }
  res.json({ msg: "done" });
});

app.get("/ignore/path-1", async (req, res) => {
  res.json({ path: 1 });
});

app.get("/dep", async (req, res) => {
  http.get("http://localhost:4000", (resp) => {
    resp.setEncoding("utf8");

    let rawData = "";
    resp.on("data", (chunk) => {
      rawData += chunk;
    });

    resp.on("end", () => {
      res.json(JSON.parse(rawData));
    });
  });
});

app.listen(3000, () => {
  console.log("server is listening port: 3000");
});
