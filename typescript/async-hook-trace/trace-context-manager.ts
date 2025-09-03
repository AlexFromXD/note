import async_hooks from "async_hooks";
import { randomUUID } from "crypto";
import { performance } from "perf_hooks";

type Span = {
  id: string;
  name: string;
  start: number;
  end: number | null;
  error?: Error;
  parentId?: string;
  children: Span[];
};

type Transaction = {
  id: string;
  name: string;
  start: number;
  end: number | null;
  spans: Span[];
};

/**
 * Context 儲存當前執行環境的追蹤資訊
 * 透過 async_hooks 在非同步操作間傳遞
 */
type Context = {
  /** 當前執行的 Transaction，代表一個完整的請求或業務流程 */
  transaction: Transaction | null;

  /** 當前活躍的 Span，指向正在執行的方法或操作 */
  span: Span | null;

  /** Span 堆疊，用於管理巢狀方法調用的階層關係
   *  當方法 A 呼叫方法 B 時，A 的 span 會在堆疊底部，B 的 span 在頂部
   *  這樣可以正確建立 parent-child 關係並在方法結束時回到父級 span
   */
  spanStack: Span[];
};

const contextMap = new Map<number, Context>();

const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    if (contextMap.has(triggerAsyncId)) {
      contextMap.set(asyncId, contextMap.get(triggerAsyncId)!);
    }
  },
  destroy(asyncId) {
    contextMap.delete(asyncId);
  },
});

hook.enable();

function getCurrentContext(): Context | undefined {
  return contextMap.get(async_hooks.executionAsyncId());
}

interface TraceExporter {
  export(transaction: any): void;
}

class ConsoleExporter implements TraceExporter {
  export(transaction: any): void {
    console.log("[transaction]", JSON.stringify(transaction, null, 2));
  }
}

class ContextManager {
  private static exporter: TraceExporter = new ConsoleExporter();

  static setExporter(exporter: TraceExporter): void {
    this.exporter = exporter;
  }

  static startTransaction(name: string): string {
    const id = randomUUID();
    const start = performance.now();
    contextMap.set(async_hooks.executionAsyncId(), {
      transaction: { id, name, start, end: null, spans: [] },
      span: null,
      spanStack: [],
    });
    return id;
  }

  static endTransaction(): void {
    const ctx = getCurrentContext();
    if (ctx && ctx.transaction) {
      ctx.transaction.end = performance.now();
      const output = {
        id: ctx.transaction.id,
        name: ctx.transaction.name,
        duration: (ctx.transaction.end - ctx.transaction.start).toFixed(2),
        spans: ctx.transaction.spans.map((span) =>
          this.formatSpanHierarchy(span)
        ),
      };
      this.exporter.export(output);
      ctx.transaction = null;
    }
  }

  private static formatSpanHierarchy(span: Span): any {
    return {
      id: span.id,
      name: span.name,
      duration: (span.end! - span.start).toFixed(2),
      error: span.error
        ? {
            name: span.error.name,
            message: span.error.message,
            stack: span.error.stack,
          }
        : undefined,
      children: span.children.map((child) =>
        ContextManager.formatSpanHierarchy(child)
      ),
    };
  }

  static startSpan(name: string): Span | undefined {
    const ctx = getCurrentContext();
    if (!ctx || !ctx.transaction) {
      return;
    }

    const parentSpan = ctx.span;
    const span: Span = {
      id: randomUUID(),
      name,
      start: performance.now(),
      end: null,
      parentId: parentSpan?.id,
      children: [],
    };

    // 如果有 parent span，加到其 children
    if (parentSpan) {
      parentSpan.children.push(span);
    } else {
      // 沒有 parent，是 top-level span
      ctx.transaction.spans.push(span);
    }

    ctx.spanStack.push(span);
    ctx.span = span;
    return span;
  }

  static endSpan(): void {
    const ctx = getCurrentContext();
    if (!ctx || !ctx.span) {
      return;
    }

    ctx.span.end = performance.now();
    ctx.spanStack.pop();
    // 設定當前 span 為 stack 的最後一個
    ctx.span = ctx.spanStack[ctx.spanStack.length - 1] || null;
  }
}

function TraceSpan(spanName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const span = ContextManager.startSpan(spanName);

      let result;
      try {
        result = await originalMethod.apply(this, args);
      } catch (e) {
        if (span) {
          span.error = e as Error;
        }
        throw e;
      } finally {
        ContextManager.endSpan();
      }
      return result;
    };
    return descriptor;
  };
}

class LLMAgent {
  @TraceSpan("invokeLLM")
  async invokeLLM(step: string): Promise<string> {
    const random = Math.random();
    await new Promise((resolve) => setTimeout(resolve, random * 1000));
    if (random < 0.5) return "OK";
    throw new Error("LLM error");
  }

  @TraceSpan("stepA")
  async stepA() {
    try {
      const res = await this.invokeLLM("A");
      console.log("A:", res);
    } catch (e) {
      console.log("A error:", (e as Error).message);
    }
  }

  @TraceSpan("stepB")
  async stepB() {
    try {
      const res = await this.invokeLLM("B");
      console.log("B:", res);
    } catch (e) {
      console.log("B error:", (e as Error).message);
    }
  }

  @TraceSpan("stepC")
  async stepC() {
    try {
      const res = await this.invokeLLM("C");
      console.log("C:", res);
    } catch (e) {
      console.log("C error:", (e as Error).message);
    }
  }

  async main() {
    ContextManager.startTransaction("llm-request"); // +1 line
    await this.stepA();
    await this.stepB();
    await this.stepC();
    ContextManager.endTransaction(); // +1 line
  }
}

const agent = new LLMAgent();
agent.main();
