import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const bedrockClient = new BedrockRuntimeClient();

const server = new McpServer({
  name: "Echo",
  version: "1.0.0",
});

server.tool("echo", { message: z.string() }, async ({ message }) => {
  const command = new InvokeModelCommand({
    // https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: message }],
        },
      ],
    }),
  });

  const response = await bedrockClient.send(command);
  const rawRes = response.body;
  const jsonString = new TextDecoder().decode(rawRes);

  return {
    content: [{ type: "text", text: JSON.parse(jsonString).content[0].text }],
  };
});

const transport = new StdioServerTransport();
server.connect(transport);
