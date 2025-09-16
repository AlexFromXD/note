const apm = require("elastic-apm-node");

apm.start({
  active: true,
  serviceName: "dep-server",
  serverUrl: "http://127.0.0.1:8200",
});

const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  const span = apm.currentTransaction.startSpan("operation in dep server");
  await new Promise((resolve) => setTimeout(resolve, 200));
  span.end();
  res.json({ data: "dep" });
});

app.listen(4000, () => {
  console.log("server is listening port: 4000");
});
