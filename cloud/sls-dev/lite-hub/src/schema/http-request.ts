import { Request } from "express";

/**
 * @description The event api gateway send to lambda
 * @ref https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 */
export class HttpRequest {
  version = "2.0";
  routeKey: string = "$default";
  rawPath: string = "";
  rawQueryString: string = "";
  cookies: string[] = [];
  headers: Record<string, string> = {};
  queryStringParameters: Record<string, string> = {};
  pathParameters: Record<string, string> = {};
  stageVariables: Record<string, string> = {};
  requestContext: {
    accountId: string;
    apiId: string;
    authorizer?: {
      jwt: {
        claims: Record<string, string>;
        scopes: string[];
      };
    };
    domainName?: string;
    domainPrefix?: string;
    http: {
      method: string;
      path: string;
      protocol: string;
      sourceIp: string;
      userAgent: string;
    };
    requestId: string;
    routeKey: string;
    stage: string;
    time: string;
    timeEpoch: number;
  };
  body: string = "";
  isBase64Encoded: boolean = false;

  constructor(req: Request) {
    const apiId = "dIipa";
    const date = new Date();
    this.requestContext = {
      accountId: "123456789012",
      apiId,
      domainName: `${apiId}.execute-api.us-east-1.amazonaws.com`,
      domainPrefix: apiId,
      http: {
        method: req.method,
        path: req.path,
        protocol: "HTTP/1.1",
        sourceIp: req.ip || "127.0.0.1",
        userAgent: req.get("User-Agent") || "",
      },
      requestId: "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
      routeKey: "$default",
      stage: "dev",
      time: date.toISOString(),
      timeEpoch: date.getTime(),
    };
  }
}
