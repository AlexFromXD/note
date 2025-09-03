import async_hooks from "async_hooks";
import { randomUUID } from "crypto";
import { performance } from "perf_hooks";

const requestIdMap = new Map<number, string>();

const hook = async_hooks.createHook({
  init(asyncId: number, type: string, triggerAsyncId: number) {
    if (requestIdMap.has(triggerAsyncId)) {
      requestIdMap.set(asyncId, requestIdMap.get(triggerAsyncId)!);
    }
  },
  destroy(asyncId: number) {
    requestIdMap.delete(asyncId);
  },
});
hook.enable();

function getCurrentRequestId(): string | undefined {
  return requestIdMap.get(async_hooks.executionAsyncId());
}

class LLMAgent {
  async invokeLLM(step: string): Promise<string> {
    const start = performance.now();
    const requestId = getCurrentRequestId();
    let output: string | undefined, error: Error | undefined;
    try {
      const random = Math.random();
      await new Promise((resolve) => setTimeout(resolve, random * 1000));
      if (random < 0.5) return "OK";
      throw new Error("LLM error");
    } catch (e) {
      error = e as Error;
    }
    const end = performance.now();
    console.log(`[${requestId}] invokeLLM`);
    console.log(`  input:`, step);
    console.log(`  output:`, error ? error.message : output);
    console.log(`  duration: ${(end - start).toFixed(2)}ms`);
    if (error) throw error;
    return output!;
  }

  async stepA(): Promise<void> {
    try {
      const res = await this.invokeLLM("A");
      console.log("A:", res);
    } catch (e) {
      console.log("A error:", (e as Error).message);
    }
  }

  async stepB(): Promise<void> {
    try {
      const res = await this.invokeLLM("B");
      console.log("B:", res);
    } catch (e) {
      console.log("B error:", (e as Error).message);
    }
  }

  async stepC(): Promise<void> {
    try {
      const res = await this.invokeLLM("C");
      console.log("C:", res);
    } catch (e) {
      console.log("C error:", (e as Error).message);
    }
  }

  async main(): Promise<void> {
    const requestId = randomUUID();
    // 設定 requestId 到 async context
    requestIdMap.set(async_hooks.executionAsyncId(), requestId);
    await this.stepA();
    await this.stepB();
    await this.stepC();
    requestIdMap.delete(async_hooks.executionAsyncId());
  }
}

const agent = new LLMAgent();
agent.main();
