// 模擬 LLM Agent 服務三種 step 與 LLM Service

import { randomUUID } from "crypto";
import { performance } from "perf_hooks";

function Trace(name?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const traceName = name || propertyKey;
    descriptor.value = async function (
      requestId: string,
      ...args: any[]
    ): Promise<any> {
      const start = performance.now();
      let output: any, error: Error | undefined;
      try {
        output = await originalMethod.apply(this, [requestId, ...args]);
      } catch (e) {
        error = e as Error;
      }
      const end = performance.now();
      console.log(`[${requestId}] ${traceName}`);
      console.log(`  input:`, args);
      console.log(`  output:`, error ? error.message : output);
      console.log(`  duration: ${(end - start).toFixed(2)}ms`);
      if (error) throw error;
      return output;
    };
    return descriptor;
  };
}

class LLMAgent {
  @Trace()
  async invokeLLM(requestId: string, step: string): Promise<string> {
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
