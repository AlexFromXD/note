# Async Hook Trace

## Async Hooks 介紹

Node.js 的 `async_hooks` 是一個強大但較少被知的核心模組，它允許開發者監聽非同步資源的生命週期。這個 API 最初設計用於 APM（Application Performance Monitoring）工具，如 Elastic APM、New Relic 等。

### 核心概念

每當 Node.js 建立非同步資源（Promise、Timer、File Handle 等），都會分配一個唯一的 `asyncId`。Async hooks 允許我們：

1. **監聽資源建立**：當新的非同步資源建立時觸發
2. **追蹤觸發關係**：記錄是哪個 asyncId 觸發了新資源的建立
3. **自動上下文傳播**：利用觸發關係實現跨非同步邊界的資料傳遞

### 實際運作原理

```javascript
import async_hooks from "async_hooks";

const contextMap = new Map();

const hook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    // 當新的非同步資源建立時觸發
    // triggerAsyncId = parent (觸發者，已存在的非同步資源)
    // asyncId = child (新建立的非同步資源)
    if (contextMap.has(triggerAsyncId)) {
      // 將 parent 的上下文傳給 child
      // 例如：當 Promise.then() 建立新 Promise 時，
      // triggerAsyncId 是原始 Promise，asyncId 是新的 Promise
      contextMap.set(asyncId, contextMap.get(triggerAsyncId));
    }
  },
  destroy(asyncId) {
    // 清理避免記憶體洩漏
    contextMap.delete(asyncId);
  },
});

hook.enable();
```

這樣，當你呼叫 `await someAsyncFunction()` 時，新的 Promise 會自動繼承當前的追蹤上下文，無需手動傳遞。

### 為什麼適合 Tracing

傳統的 tracing 面臨的最大挑戰是「上下文丟失」：

```javascript
// 問題：requestId 如何傳遞到 nested async calls？
async function processRequest(requestId) {
  await step1(); // requestId 丟失了
  await step2(); // 無法知道這是哪個 request
}
```

Async hooks 解決了這個根本問題，讓追蹤資訊可以「無縫」地跟隨執行流程，這正是 APM 工具需要的能力。

## Problem

現代應用開發中，observability（可觀測性）是必備能力。然而，既有的 legacy code 通常沒有內建 tracing 機制，要在不大幅重構的前提下加入追蹤功能是個挑戰。

### 核心需求

1. **最小化改動**：不能要求開發者重寫既有邏輯
2. **自動傳播**：追蹤資訊需要在非同步調用間自動傳遞
3. **階層資訊**：需要記錄方法間的調用關係和執行時間
4. **錯誤捕獲**：自動記錄執行過程中的例外狀況

## Example

假設我們有一個簡單的 [LLM Agent](./app.ts)：

```typescript
class LLMAgent {
  async invokeLLM(step: string): Promise<string> {
    // 模擬 LLM 調用，可能成功或失敗
    const random = Math.random();
    await new Promise((resolve) => setTimeout(resolve, random * 1000));
    if (random < 0.5) return "OK";
    throw new Error("LLM error");
  }

  async stepA() {
    const res = await this.invokeLLM("A");
    console.log("A:", res);
  }

  async stepB() {
    const res = await this.invokeLLM("B");
    console.log("B:", res);
  }

  async stepC() {
    const res = await this.invokeLLM("C");
    console.log("C:", res);
  }

  async main() {
    await this.stepA();
    await this.stepB();
    await this.stepC();
  }
}
```

我們的目標是在**不修改業務邏輯**的前提下，讓這個 Agent 具備完整的 tracing 能力。

### Solution

本專案實作了幾種不同的 tracing 方法：

#### [方法一：RequestId](trace-request-id.ts)

- 需要在每個方法簽名添加 `requestId` 參數
- 需要手動傳遞追蹤 ID

```typescript
async stepA(requestId: string) {
  console.log(`[${requestId}] stepA start`);
  const res = await this.invokeLLM("A", requestId);
  console.log(`[${requestId}] stepA end`);
}
```

#### [方法二：Decorator](trace-decorator.ts)

- 使用 TypeScript 裝飾器自動包裝方法
- 不需要修改方法簽名

```typescript
@Trace("stepA")
async stepA() {
  const res = await this.invokeLLM("A");
  console.log("A:", res);
}
```

#### [方法三：Async Hook](./trace-async-hook.ts)

- 利用 Node.js async_hooks 實現自動的 requestId 傳播
- 在方法內手動記錄追蹤資訊
- 不需要修改方法簽名

```typescript
async invokeLLM(step: string): Promise<string> {
  const start = performance.now();
  const requestId = getCurrentRequestId(); // 自動取得 requestId
  // ... 業務邏輯 ...
  console.log(`[${requestId}] invokeLLM duration: ${duration}ms`);
}

async main() {
  const requestId = randomUUID();
  requestIdMap.set(async_hooks.executionAsyncId(), requestId); // +1 行
  await this.stepA();
  await this.stepB();
  await this.stepC();
}
```

#### [方法四：Context Manager](trace-context-manager.ts)

- 基於 `trace-async-hook.ts` 的 async_hooks 機制
- 加上裝飾器實現自動追蹤
- 增加階層式 Span 管理
- 總共只需要 6 行改動

```typescript
class LLMAgent {
  @TraceSpan("invokeLLM")  // +1 裝飾器
  async invokeLLM(step: string): Promise<string> { ... }

  @TraceSpan("stepA")      // +1 裝飾器
  async stepA() { ... }

  @TraceSpan("stepB")      // +1 裝飾器
  async stepB() { ... }

  @TraceSpan("stepC")      // +1 裝飾器
  async stepC() { ... }

  async main() {
    ContextManager.startTransaction("llm-request"); // +1 行
    await this.stepA();
    await this.stepB();
    await this.stepC();
    ContextManager.endTransaction();                // +1 行
  }
}
```

### 方案比較表

| 方案                | 改動量           | 上下文傳播      | 階層結構 | 自動化程度 | 學習成本 | 適用場景                     |
| ------------------- | ---------------- | --------------- | -------- | ---------- | -------- | ---------------------------- |
| **RequestId**       | 高 (10+ 改動)    | ❌ 手動傳遞     | ❌ 無    | 低         | 低       | 簡單專案，臨時追蹤           |
| **Decorator**       | 最小 (4 改動)    | ❌ 無法跨非同步 | ❌ 無    | 中         | 中       | 同步操作為主的程式碼         |
| **Async Hooks**     | 中等 (8-10 改動) | ✅ 自動         | ❌ 無    | 中         | 高       | 需要跨非同步追蹤但不要求階層 |
| **Context Manager** | 小 (6 改動)      | ✅ 自動         | ✅ 完整  | 高         | 高       | 生產環境，完整 observability |

### 詳細比較

**改動量計算**：

- **RequestId**：每個方法簽名 + 每次調用都要傳參數
- **Decorator**：4 個裝飾器（純裝飾器，不需要額外管理程式碼）
- **Async Hooks**：1 行設定 + 每個方法內手動記錄
- **Context Manager**：4 個裝飾器 + 2 行生命週期管理

**功能完整度**：

- **階層追蹤**：只有 Context Manager 支援 parent-child 關係
- **錯誤捕獲**：Decorator 和 Context Manager 自動處理
- **效能測量**：所有方案都支援，但精確度不同
- **輸出格式**：Context Manager 提供 OpenTelemetry 相容格式

### 方案演進路徑

這四種方案呈現了漸進式的演進：

1. **trace-request-id.ts** → 建立基本追蹤概念
2. **trace-decorator.ts** → 引入 Decorator 減少重複程式碼
3. **trace-async-hook.ts** → 解決上下文自動傳播問題
4. **trace-context-manager.ts** → 結合前述優點，加上階層管理

## 最終方案特色

### 改動最小化 vs 資訊最大化

最終的 `trace-context-manager.ts` 達到了最佳的平衡：

**程式碼改動**：

- 4 個裝飾器（@TraceSpan）
- 2 行管理程式碼（start/endTransaction）
- **總計：6 個改動點**

**獲得的追蹤資訊**：

- 完整的執行時間測量
- 階層式的調用關係
- 自動錯誤捕獲和記錄
- OpenTelemetry 風格的輸出格式

### 輸出範例

```json
{
  "id": "abc-123",
  "name": "llm-request",
  "duration": "2543.21",
  "spans": [
    {
      "id": "span-1",
      "name": "stepA",
      "duration": "892.45",
      "children": [
        {
          "id": "span-1-1",
          "name": "invokeLLM",
          "duration": "856.78",
          "error": {
            "name": "Error",
            "message": "LLM error"
          }
        }
      ]
    }
  ]
}
```
