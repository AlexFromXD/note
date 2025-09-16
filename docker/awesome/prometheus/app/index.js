const client = require("prom-client");

function run() {
  const Registry = client.Registry;
  const register = new Registry();
  const gateway = new client.Pushgateway("http://127.0.0.1:9091", [], register);
  const metric = "my_counter";

  const counter = new client.Counter({
    name: metric,
    help: "a counter to test custom metrics",
    registers: [register],
  });

  register.registerMetric(counter);
  counter.inc(10);

  return (
    gateway
      // this jobName will become the `exported_job` label in prometheus
      .push({ jobName: metric })
      .then(({ resp, body }) => {
        console.log(`Body: ${body}`);
        console.log(`Response status: ${resp.statusCode}`);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      })
  );
}

run();
