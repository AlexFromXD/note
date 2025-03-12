import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient();
// https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html
const modelId = "anthropic.claude-3-haiku-20240307-v1:0";
// https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-text-completion.html#model-parameters-anthropic-claude-text-completion-request-response
const maxTokensToSample = 4000;

const message = "Hello, world!";

const command = new InvokeModelCommand({
  modelId,
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

(async () => {
  const response = await bedrockClient.send(command);
  const rawRes = response.body;
  const jsonString = new TextDecoder().decode(rawRes);
  const resp = JSON.parse(jsonString).content[0].text;
  console.log(resp);
})();
