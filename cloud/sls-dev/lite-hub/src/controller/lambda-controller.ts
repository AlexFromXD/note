import express from "express";
import { createProxyServer } from "http-proxy";
import { config } from "../config";
import { Invoker } from "../invoker";
import { logger } from "../logger";
import { Controller } from "./controller";
/**
 * @description The Lambda service simulator. Handle Lambda Invocation.
 */
export class LambdaController implements Controller {
  private readonly _app;
  private readonly _proxy;
  private readonly _invoker: Invoker;
  private readonly _port = config.port + 1;

  constructor() {
    this._app = express();
    this._proxy = createProxyServer();
    this._invoker = new Invoker();
  }

  init() {
    this._app
      .post(
        "/2015-03-31/functions/:functionName/invocations",
        async (req, res) => {
          const functionName = req.params.functionName;
          const url = this._invoker.getUrl(functionName);
          req.url = url.pathname;
          this._proxy.web(
            req,
            res,
            {
              target: url.origin,
            },
            (err) => {
              logger.error(`Proxy error: ${err}`);
              res.status(502).send("Bad Gateway");
            }
          );
        }
      )
      .listen(this._port, () => {
        logger.info(
          `LambdaController is listening on this._port ${this._port}`
        );
      });
  }
}
