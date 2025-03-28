import { HttpController } from "./controller/http-controller";
import { LambdaController } from "./controller/lambda-controller";
import { WSController } from "./controller/ws-controller";

const httpController = new HttpController();
const lambdaController = new LambdaController();
const wsController = new WSController();

httpController.init();
lambdaController.init();
wsController.init();

// import express, { Request, Response } from 'express';
// import bodyParser from 'body-parser';
// import WebSocket from 'ws';
// import http from 'http';
// import axios from 'axios';

// const wss = new WebSocket.Server({ server });

// const LAMBDA_URL = 'http://lambda:3000/invoke';

// // 用來追蹤 connectionId 與對應的 ws 實例
// const connections = new Map<string, WebSocket>();

// app.use(bodyParser.json());
// app.use(bodyParser.text({ type: '*/*' }));

// // 模擬 REST API Gateway
// app.all('*', async (req: Request, res: Response) => {
//   // 處理 WebSocket 回應 API：/@connections/{connectionId}
//   if (req.method === 'POST' && req.path.startsWith('/@connections/')) {
//     const connectionId = req.path.split('/').pop()!;
//     const ws = connections.get(connectionId);
//     if (ws && ws.readyState === WebSocket.OPEN) {
//       ws.send(req.body);
//       res.status(200).send('OK');
//     } else {
//       res.status(410).send('Gone');
//     }
//     return;
//   }

//   const event = {
//     resource: req.path,
//     path: req.path,
//     httpMethod: req.method,
//     headers: req.headers,
//     multiValueHeaders: {},
//     queryStringParameters: req.query,
//     multiValueQueryStringParameters: {},
//     pathParameters: {},
//     stageVariables: null,
//     requestContext: {
//       resourcePath: req.path,
//       httpMethod: req.method,
//       path: req.path,
//       stage: 'dev',
//       identity: {
//         sourceIp: req.ip,
//         userAgent: req.get('User-Agent') || ''
//       }
//     },
//     body: req.body ? JSON.stringify(req.body) : null,
//     isBase64Encoded: false
//   };

//   try {
//     const response = await axios.post(LAMBDA_URL, event);
//     const lambdaRes = response.data;
//     const body = lambdaRes.isBase64Encoded
//       ? Buffer.from(lambdaRes.body, 'base64')
//       : lambdaRes.body;

//     res.status(lambdaRes.statusCode || 200)
//       .set(lambdaRes.headers || {})
//       .send(body);
//   } catch (error: any) {
//     res.status(500).send(error.message || 'Lambda invocation failed');
//   }
// });

// // WebSocket handler
// wss.on('connection', (ws, req) => {
//   const connectionId = Math.random().toString(36).substring(2, 15);
//   connections.set(connectionId, ws);

//   const baseEvent = {
//     requestContext: {
//       routeKey: '$connect',
//       eventType: 'CONNECT',
//       connectionId,
//       domainName: req.headers.host,
//       stage: 'dev'
//     },
//     headers: req.headers,
//     isBase64Encoded: false,
//     body: null
//   };

//   axios.post(LAMBDA_URL, baseEvent).catch(console.error);

//   ws.on('message', (message) => {
//     const event = {
//       requestContext: {
//         routeKey: 'sendMessage',
//         eventType: 'MESSAGE',
//         connectionId,
//         domainName: req.headers.host,
//         stage: 'dev'
//       },
//       headers: req.headers,
//       isBase64Encoded: false,
//       body: message.toString()
//     };

//     axios.post(LAMBDA_URL, event).catch(console.error);
//   });

//   ws.on('close', () => {
//     connections.delete(connectionId);
//     const event = {
//       requestContext: {
//         routeKey: '$disconnect',
//         eventType: 'DISCONNECT',
//         connectionId,
//         domainName: req.headers.host,
//         stage: 'dev'
//       },
//       headers: req.headers,
//       isBase64Encoded: false,
//       body: null
//     };

//     axios.post(LAMBDA_URL, event).catch(console.error);
//   });
// });

// server.listen(8080, () => {
//   console.log('API Gateway mock listening on http://localhost:8080');
// });
