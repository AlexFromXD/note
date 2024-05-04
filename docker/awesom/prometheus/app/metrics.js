const { Counter, Summary, Registry, Pushgateway } = require("prom-client");

const register = new Registry();
const labels = ["path", "method", "status"];

const ReqCount = new Counter({
  name: "request_count",
  help: "count of api requests",
  registers: [register],
  labelNames: ["path", "method"],
});

const ResLatency = new Summary({
  name: "response_latency",
  help: "calc latency for each endpoint",
  registers: [register],
  labelNames: ["path", "method"],
  percentiles: [0.5, 0.9, 0.99],
});

class MetricsCollector {
  constructor(
    endpoint = "http://127.0.0.1:9091",
    jobName = "collect_custom_metrics"
  ) {
    this._jobName = jobName;
    this._gateway = new Pushgateway(endpoint, [], register);
    register.registerMetric(ReqCount);
    register.registerMetric(ResLatency);
  }

  push() {
    this._gateway
      // this jobName will become the `exported_job` label in prometheus
      .push({ jobName: this._jobName })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }
}

const metricsCollector = new MetricsCollector();

module.exports = {
  ReqCount,
  ResLatency,
  metricsCollector,
};
