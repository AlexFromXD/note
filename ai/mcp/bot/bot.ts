import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import readlineSync from "readline-sync";

const transport = new StdioClientTransport({
  command: "npm",
  args: ["run", "start:server"],
  env: process.env as Record<string, string>, // pass aws-vault env to spawned process (server.ts)
});

const client = new Client(
  {
    name: "example-client",
    version: "1.0.0",
  },
  {
    capabilities: {
      prompts: {},
      resources: {},
      tools: {},
    },
  }
);

(async () => {
  await client.connect(transport);
  console.log("🚀 Welcome to MCP-based LLM CLI");
  while (true) {
    const input = readlineSync.question("> ");
    if (input.toLowerCase() === "exit") {
      console.log("👋 再見！");
      process.exit(0);
    }

    // 透過 MCP Client 呼叫 LLM Service
    await client
      .callTool({
        name: "echo",
        arguments: {
          message: input,
        },
      })
      // @ts-ignore
      .then((response) => console.log("🤖 LLM:", response.content[0].text))
      .catch((err) => console.error("❌ 錯誤:", err.message));
  }
})();
