本文為[【生成式 AI 時代下的機器學習(2025)】第二講：一堂課搞懂 AI Agent 的原理](https://www.youtube.com/watch?v=M2Yg1kwPpts) 筆記

---

## RL Agent vs LLM Agent

在 LLM 時代以前就存在基於 Reinforcement Learning 的 AI Agent，其特色是單一模型專注於單一任務，例如[下圍棋的 AlphaGo](https://zh.wikipedia.org/zh-tw/AlphaGo)。

![RL Agent](./img/RL-agent.png)
![LLM Agent](./img/LLM-agent.png)

以 LLM 運行的 Agent 的明顯優勢是「近乎無限可能的輸出」（只要再搭配正確的 Tool 就會變成無所不能），此外也不需要再人為介入設定 Reward，直接提供更真實且豐富的資訊即可互動。
![LLM Agent Pros 1](./img/LLM-agent-pros-1.png)
![LLM Agent Pros 2](./img/LLM-agent-pros-2.png)

## StreamBench

模型有沒有辦法自主學習呢？

> Overview of StreamBench, illustrating the continuous improvement process of language agents in streaming. [Ref](https://github.com/stream-bench/stream-bench)

![StreamBench](./img/Stream-bench.png)
