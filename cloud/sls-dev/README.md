[Update] 新的紀錄都放在 https://github.com/AlexFromXD/lite-hub。

---

[Serverless](https://www.serverless.com/) or [LocalStack](https://www.localstack.cloud/) 免費版不合用時都會被 $$ 綁架，自己做一個簡單的 api gateway 就可以解決這個問題。

## LiteHub

The lightweight function controller for local Lambda development.

- support http/ws request
- support function sync/async invocation

### test

- test http api path mapping

  ```sh
  curl http://localhost:3000/http
  ```

- test ws connection & function invocation

  ```sh
  wscat -c ws://localhost:3002
  ---
  > {"action":"sum","a":1,"b":1}
  < {"ans":2}
  ```
