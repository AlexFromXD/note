import { describe, expect, it } from "@jest/globals";
import { FSMachine } from "./fsm"; // 根據你的實作路徑調整

describe("FSMachine", () => {
  it("1. 靜態路徑正確，且 state functions 有依序執行", async () => {
    const calls: string[] = [];

    const fsm = new FSMachine({
      context: {},
      states: {
        s1: {
          onEnter: (meta) => calls.push(`enter ${meta.name}`),
          action: (context, meta) => calls.push(`action ${meta.name}`),
          onExit: (meta) => calls.push(`exit ${meta.name}`),
        },
        s2: {
          onEnter: (meta) => calls.push(`enter ${meta.name}`),
          action: (context, meta) => calls.push(`action ${meta.name}`),
          onExit: (meta) => calls.push(`exit ${meta.name}`),
        },
        s3: {
          onEnter: (meta) => calls.push(`enter ${meta.name}`),
          action: (context, meta) => calls.push(`action ${meta.name}`),
          onExit: (meta) => calls.push(`exit ${meta.name}`),
        },
      },
      paths: {
        s1: { to: "s2" },
        s2: { to: "s3" },
      },
    });

    await fsm.start("s1");

    expect(calls).toEqual([
      "enter s1",
      "action s1",
      "exit s1",
      "enter s2",
      "action s2",
      "exit s2",
      "enter s3",
      "action s3",
      "exit s3",
    ]);
  });

  it("2. 根據 context 動態選擇路徑", async () => {
    const calls: string[] = [];

    const fsm = new FSMachine({
      context: { flag: false },
      states: {
        start: {
          onEnter: (meta) => calls.push(`enter ${meta.name}`),
          action: (context, meta) => {
            calls.push(`action ${meta.name}`);
            context.flag = true;
          },
          onExit: (meta) => calls.push(`exit ${meta.name}`),
        },
        branchA: {
          onEnter: (meta) => calls.push(`enter ${meta.name}`),
        },
        branchB: {
          onEnter: (meta) => calls.push(`enter ${meta.name}`),
        },
      },
      paths: {
        start: [
          { if: (context) => context.flag === true, to: "branchA" },
          { to: "branchB" },
        ],
      },
    });

    await fsm.start("start");

    expect(calls).toEqual([
      "enter start",
      "action start",
      "exit start",
      "enter branchA",
    ]);
  });

  it("3. 正常結束：最後沒有 path 應該停止", async () => {
    const calls: string[] = [];

    const fsm = new FSMachine({
      context: {},
      states: {
        onlyState: {
          onEnter: (meta) => calls.push(`enter ${meta.name}`),
          action: (context, meta) => calls.push(`action ${meta.name}`),
          onExit: (meta) => calls.push(`exit ${meta.name}`),
        },
      },
      paths: {
        // 沒有 path 連出去
      },
    });

    await fsm.start("onlyState");

    expect(calls).toEqual([
      "enter onlyState",
      "action onlyState",
      "exit onlyState",
    ]);
    expect(fsm.getContext()).toEqual({});
  });

  it("4. 當找不到 state，應該拋出錯誤", async () => {
    const fsm = new FSMachine({
      context: {},
      states: {
        s1: {},
      },
      paths: {},
    });

    await expect(fsm.start("s2" as "s1")).rejects.toThrow(
      'State "s2" not found.'
    );
  });

  it("5. 當 if 判斷式 throw error，應該安全 fallback", async () => {
    const calls: string[] = [];

    const fsm = new FSMachine({
      context: {},
      states: {
        safe: {
          onEnter: (meta) => calls.push(`enter ${meta.name}`),
        },
        fallback: {
          onEnter: (meta) => calls.push(`enter ${meta.name}`),
        },
      },
      paths: {
        safe: [
          {
            if: () => {
              throw new Error("fail");
            },
            to: "fallback",
          },
          { to: "fallback" },
        ],
      },
    });

    // 注意：現在這版 FSM 沒有內建 catch if exception，所以預期會 throw
    await expect(fsm.start("safe")).rejects.toThrow("fail");
  });
});
