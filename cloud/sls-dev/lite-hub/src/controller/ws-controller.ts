import express from "express";
import { createServer } from "http";
import { v4 } from "uuid";
import { WebSocket, WebSocketServer } from "ws";
import { config } from "../config";
import { Invoker } from "../invoker";
import { logger } from "../logger";
import { WSRequest } from "../schema/ws-request";
import { Controller } from "./controller";
/**
 * @description The API Gateway (WebSocket) simulator. Manage WebSocket connections and forward messages to specific function.
 */
export class WSController implements Controller {
  private readonly _app;
  private readonly _server;
  private readonly _invoker: Invoker;
  private readonly _port = config.port + 2;
  private readonly _connections = new Map<string, WebSocket>();

  constructor() {
    if (!config.wsFunction) {
      throw new Error("WebSocket function is not configured");
    }
    this._app = express();
    this._server = createServer(this._app);
    this._invoker = new Invoker();
  }

  init() {
    new WebSocketServer({
      server: this._server,
    }).on("connection", async (ws: WebSocket) => {
      const connectionId = v4();
      this._connections.set(connectionId, ws);
      logger.info("New connection: ", connectionId);

      await this._invoker.wsInvoke(
        config.wsFunction as string,
        new WSRequest(connectionId, {
          eventType: "CONNECT",
          routeKey: "$connect",
        })
      );

      ws.on("message", async (message: string) => {
        try {
          const body = JSON.parse(message) as Message;
          await this._invoker.wsInvoke(
            config.wsFunction as string,
            new WSRequest(
              connectionId,
              {
                eventType: "MESSAGE",
                routeKey: body.action,
              },
              body
            )
          );
        } catch (err) {
          logger.error(err);
        }
      }).on("close", () => {
        this._connections.delete(connectionId);
        this._invoker.wsInvoke(
          config.wsFunction as string,
          new WSRequest(connectionId, {
            eventType: "CONNECT",
            routeKey: "$connect",
          })
        );
      });
    });

    this._app
      .use(express.raw({ type: "*/*" })) // transform body to raw buffer for ws.send()
      .post("/:stage/@connections/:connectionId", (req, res) => {
        const connectionId = req.params.connectionId;
        const stage = req.params.stage;
        logger.info(
          `receive message: stage: ${stage}, connectionId: ${connectionId}`
        );
        const ws = this._connections.get(connectionId);
        if (ws && ws.readyState === WebSocket.OPEN) {
          const data =
            Buffer.isBuffer(req.body) || typeof req.body === "string"
              ? req.body
              : JSON.stringify(req.body);

          ws.send(data);
          res.status(200).json({ ok: true });
        } else {
          res.status(410).json({ error: "Gone" });
        }
      });

    this._server.listen(this._port, () => {
      logger.info(`WSController is listening on port ${this._port}`);
    });
  }
}

type Message = {
  /**
   * @reference https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-develop-routes.html#apigateway-websocket-api-route-selection-expressions
   */
  action: string;
  data: any;
};
