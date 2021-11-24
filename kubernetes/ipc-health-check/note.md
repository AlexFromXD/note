## 前言

k8s container 的 liveness & readiness check 可以分成三種類型：

- Command
- HTTP
- TCP

一般的 API service 用 HTTP check 就可以輕鬆搞定了，TCP 可能會用在 Proxy service 之類的，至於 Command 通常是用在 cronjob / async worker 這種本來沒有開放連線的 service。以下只討論 Command 的部分。

---

## 正文

首先根據官方說法

> If the command succeeds, it returns 0, and the kubelet considers the container to be alive and healthy. If the command returns a non-zero value, the kubelet kills the container and restarts it.

`kubelet` 會用 command 的 `exit code` 來判斷 container 是否健康。

所以方案一可以參考官方案例

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    test: liveness
  name: liveness-exec
spec:
  containers:
    - name: liveness
      image: k8s.gcr.io/busybox
      args:
        - /bin/sh
        - -c
        - touch /tmp/healthy; sleep 30; rm -rf /tmp/healthy; sleep 600
      livenessProbe:
        exec:
          command:
            - cat
            - /tmp/healthy
        initialDelaySeconds: 5
        periodSeconds: 5
```

改寫成

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    test: liveness
  name: liveness-exec
spec:
  containers:
    - name: liveness
      image: your_image
      livenessProbe:
        exec:
          command:
            - rm
            - /your_hc_file_path
        initialDelaySeconds: 5
        periodSeconds: 5
```

只要讓你的 image 裡面定期寫出空白的 hc_file，然後讓 check command 定期去刪掉這個 file，如果檔案不存在會發生

```
rm: /your_hc_file_path: No such file or directory
```

而此時 exit code 會變成 1。

> 在 linux / macOS 跑完 command 後接著跑 `echo $?` 可以得到前一個 command 的 exit code。

. . .

至於方案二，我們可以幫 container 裡的主程式 跟 check command 做一個 IPC connection， 如果你的程式是用 Node.js 寫的，原生的 net module 剛好有支援 IPC 功能。

> The net module supports IPC with named pipes on Windows, and Unix domain sockets on other operating systems.

首先在原本的 code 裡加入下面這段

```js
const { createServer } = require("net");

function hc() {
  // check db connection or do anything you want
}

createServer((stream) => {
  stream.on("data", async () => {
    const exitCode = hc() ? "0" : "1";
    stream.write(exitCode);
  });
}).listen("/your/domain/socket");
```

然後另外寫一個 check script

```js
const { createConnection } = require("net");

// 設個timeout避免hc()發生意外
setTimeout(() => {
  console.error("check timeout");
  process.exit(1);
}, 2000);

createConnection({
  path: "/your/domain/socket",
})
  .setEncoding("utf-8")
  .on("data", (exitCode) => {
    if (!exitCode) {
      exitCode = 1;
    }
    process.exit(exitCode);
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  })
  .write("hc");
```

最後把 check script 寫進 package.json 就大功告成啦。

```json
{
  "script": {
    "hc": "node your_health_check_script.js"
  }
}
```

### 注意事項

- socket file 如果已經存在會 error
- ipc 溝通如果不是用`write()`而是`emit('data')`會 `emit` 到自己。

### 討論

雖然`net.createServer()`可以開 IPC server 也可以開 TCP server

> The server can be a TCP server or an IPC server, depending on what it listen() to.

但既然原本不是對外開放的 service ，加上有些說法是 domain socket 的 performance 比 TCP loopback 更好，所以就還是別把 port 打開吧。

---

## Reference

- [Configure Liveness, Readiness and Startup Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)

- [Net - IPC support](https://nodejs.org/api/net.html#ipc-support)

- [unix domain socket VS named pipes?](https://stackoverflow.com/questions/9475442/unix-domain-socket-vs-named-pipes)

- [What is the difference between Unix sockets and TCP/IP sockets?](https://serverfault.com/questions/124517/what-is-the-difference-between-unix-sockets-and-tcp-ip-sockets)
