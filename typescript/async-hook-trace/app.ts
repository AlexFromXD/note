class LLMAgent {
  async invokeLLM(step: string): Promise<string> {
    const random = Math.random();
    await new Promise((resolve) => setTimeout(resolve, random * 1000));

    if (random < 0.5) return "OK";
    throw new Error("LLM error");
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
    await this.stepA();
    await this.stepB();
    await this.stepC();
  }
}

const agent = new LLMAgent();
agent.main();
