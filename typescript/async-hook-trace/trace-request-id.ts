import { randomUUID } from "crypto";

class LLMAgent {
  async invokeLLM(requestId: string, step: string): Promise<string> {
    console.log(`=== ${JSON.stringify({ requestId, step })} ===`);
    const random = Math.random();
    await new Promise((resolve) => setTimeout(resolve, random * 1000));
    if (random < 0.5) return "OK";
    throw new Error("LLM error");
  }

  async stepA(requestId: string): Promise<void> {
    try {
      const res = await this.invokeLLM(requestId, "A");
      console.log("A:", res);
    } catch (e) {
      console.log("A error:", (e as Error).message);
    }
  }

  async stepB(requestId: string): Promise<void> {
    try {
      const res = await this.invokeLLM(requestId, "B");
      console.log("B:", res);
    } catch (e) {
      console.log("B error:", (e as Error).message);
    }
  }

  async stepC(requestId: string): Promise<void> {
    try {
      const res = await this.invokeLLM(requestId, "C");
      console.log("C:", res);
    } catch (e) {
      console.log("C error:", (e as Error).message);
    }
  }

  async main(): Promise<void> {
    const requestId = randomUUID();
    await this.stepA(requestId);
    await this.stepB(requestId);
    await this.stepC(requestId);
  }
}

const agent = new LLMAgent();
agent.main();
