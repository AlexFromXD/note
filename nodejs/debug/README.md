# Node.js Debug

> #### 本文由 GPT-4o 產生

## --inspect 發生了什麼事？

當 Node.js 啟動時加上 `--inspect`，它會啟動 V8 Inspector Protocol，允許開發人員使用外部工具（如 `chrome://inspect`）進行遠端偵錯。啟用後，Node.js 會在 `ws://127.0.0.1:9229` 開啟一個 WebSocket 端口，供調試工具連線。

> 官方文件: [Debugging - Node.js](https://nodejs.org/en/learn/getting-started/debugging)

### --inspect vs --inspect-brk

| 選項            | 行為                                                                                 |
| --------------- | ------------------------------------------------------------------------------------ |
| `--inspect`     | 啟用偵錯模式，Node.js 會立即開始執行程式碼，但可以在任何時候透過 DevTools 設定中斷點 |
| `--inspect-brk` | 啟用偵錯模式並在第一行程式碼執行前暫停，確保開發人員可以在程式一開始時設定中斷點     |

如果你想要調試應用程式的初始化過程（例如 `require` 其他模組時的行為），應該使用 `--inspect-brk`。

---

## Debug Tool

Node.js 的偵錯功能基於 V8 Inspector Protocol，因此任何支援該協議的工具都可以用來偵錯 Node.js 應用程式。

### 為什麼 `chrome://inspect` 可以連到所有的 Node.js Process？

Chrome DevTools 透過 `chrome://inspect` 提供一個介面來連接所有開啟 `--inspect` 模式的 Node.js 進程。這是因為：

1. Node.js 使用 V8 Inspector Protocol，這與 Chrome DevTools 相容。
2. DevTools 會自動掃描 `ws://127.0.0.1:9229/json` 來發現可偵錯的進程。
3. 多個 Node.js 進程可以使用不同的 port 來開啟偵錯，例如 `--inspect=9229`、`--inspect=9230`，然後 DevTools 可以手動連接到這些 port。

你也可以透過 `node --inspect --inspect-port=9230` 指定其他連接埠，然後手動在 DevTools 輸入 `ws://localhost:9230` 來連線。

---

## Tips

### 在 Container 內進行 Debug

在 Docker 等容器環境中進行偵錯時，預設 `--inspect` 只監聽 `127.0.0.1:9229`，這會導致無法從主機連線。因此，你應該使用 `--inspect=0.0.0.0:9229` 來讓 Node.js 監聽所有網路介面，例如：

```sh
node --inspect=0.0.0.0:9229 app.js
```

### 在 TypeScript 專案中 Debug

使用 TypeScript 進行開發時，Node.js 無法直接執行 .ts 檔案，而是透過 ts-node 或 node 執行編譯後的 .js 檔案，因此偵錯時需要額外注意 Source Maps 的使用。

1. 確保 TypeScript 編譯產生 .map 檔案
   在 tsconfig.json 中加入：

   ```json
   {
     "compilerOptions": {
       "sourceMap": true
     }
   }
   ```

2. 啟用 --enable-source-maps
   Node.js 需要 --enable-source-maps 來正確對應 .ts 檔案與對應的 .map，例如：

   ```sh
   node --enable-source-maps --inspect app.js
   ```

3. 如果使用 ts-node
   當使用 ts-node 直接執行 TypeScript 檔案時，可以這樣啟動 debug：

   ```sh
   ts-node --inspect-brk --require tsconfig-paths/register app.ts
   ```
