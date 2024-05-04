const { ReqCount, ResLatency, metricsCollector } = require("./metrics");

const app = require("express")();

const port = 8000;

// counter
app.use((req, res, next) => {
  ReqCount.labels({
    method: req.method,
    path: req.path,
  }).inc();

  // --- calc time with `prom-client` utility method ---
  const end = ResLatency.labels({
    method: req.method,
    path: req.path,
  }).startTimer();

  res.on("finish", () => {
    const latency = end();
    metricsCollector.push();
    console.log(
      `[${req.method}] ${req.path} - ${res.statusCode} - ${latency} ms`
    );
  });

  // --- calc time with `process.hrtime()` ---
  // const start = process.hrtime();
  // res.on("finish", () => {
  //   const endTime = process.hrtime(start);
  //   const latency = endTime[0] * 1000 + endTime[1] / 1000000;
  //   console.log(
  //     `[${req.method}] ${req.path} - ${res.statusCode} - ${latency} ms`
  //   );
  // });

  next();
});

app.get("/hc", (req, res) => {
  res.status(200).json({
    msg: "ok",
  });
});

app.get("/delay", async (req, res) => {
  const duration = Math.random() * 1000;
  await new Promise((resolve) => setTimeout(resolve, duration));
  res.status(200).json({
    delay: duration,
  });
});

app.post("/", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  res.status(200).json({
    msg: "ok",
  });
});

app.listen(port, () => {
  console.log("listening on port: " + port);
});
