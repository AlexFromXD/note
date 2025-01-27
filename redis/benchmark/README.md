# Redis-Benchmark 使用介紹

`redis-benchmark` 是 Redis 自帶的一個性能測試工具，用於測試 Redis 伺服器的處理能力。以下是一些常見的用法介紹：

## 基本用法

運行以下命令來執行默認的基準測試：

```sh
redis-benchmark
```

這將會對 Redis 伺服器執行一系列的標準操作，並輸出每秒操作數（OPS）。

## 指定測試命令

可以使用 `-t` 參數來指定要測試的命令，例如：

```sh
redis-benchmark -t set,get
```

這將只測試 `SET` 和 `GET` 命令。

## 指定請求數量和並發數量

可以使用 `-n` 和 `-c` 參數來指定請求數量和並發數量，例如：

```sh
redis-benchmark -n 10000 -c 50
```

這將會發送 10000 個請求，並且同時保持 50 個並發連接。

## 測試不同的數據大小

可以使用 `-d` 參數來指定測試數據的大小，例如：

```sh
redis-benchmark -d 1024
```

這將會使用 1024 字節大小的數據進行測試。

## 完整參數列表

可以使用 `--help` 參數來查看 `redis-benchmark` 的完整參數列表：

```sh
redis-benchmark --help
```

## 輸出格式

|      |    Latency by Percentile Distribution     |   Cumulative Distribution of Latencies   |
| :--: | :---------------------------------------: | :--------------------------------------: |
| 輸出 |            特定百分位的延遲值             |        小於等於某延遲值的累積比例        |
| 關注 |         某個百分位對應的最大延遲          |          某延遲範圍內的請求比例          |
| 用途 | 評估 SLA，分析極端情況（P99、P99.9 等）。 | 理解整體延遲分佈，確認高延遲比例的影響。 |

```
# /data # redis-benchmark -t set -n 100000 -c 200

====== SET ======
  100000 requests completed in 0.34 seconds
  200 parallel clients
  3 bytes payload
  keep alive: 1
  host configuration "save": 3600 1 300 100 60 10000
  host configuration "appendonly": no
  multi-thread: no

Latency by percentile distribution:
0.000% <= 0.135 milliseconds (cumulative count 2)
50.000% <= 0.311 milliseconds (cumulative count 56502)
75.000% <= 0.335 milliseconds (cumulative count 77387)
87.500% <= 0.375 milliseconds (cumulative count 88447)
93.750% <= 0.471 milliseconds (cumulative count 93945)
96.875% <= 0.663 milliseconds (cumulative count 96943)
98.438% <= 0.807 milliseconds (cumulative count 98475)
99.219% <= 0.951 milliseconds (cumulative count 99240)
99.609% <= 1.127 milliseconds (cumulative count 99615)
99.805% <= 1.823 milliseconds (cumulative count 99806)
99.902% <= 2.839 milliseconds (cumulative count 99904)
99.951% <= 3.359 milliseconds (cumulative count 99952)
99.976% <= 3.631 milliseconds (cumulative count 99976)
99.988% <= 3.799 milliseconds (cumulative count 99988)
99.994% <= 3.879 milliseconds (cumulative count 99995)
99.997% <= 3.903 milliseconds (cumulative count 99997)
99.998% <= 3.951 milliseconds (cumulative count 99999)
99.999% <= 3.967 milliseconds (cumulative count 100000)
100.000% <= 3.967 milliseconds (cumulative count 100000)

Cumulative distribution of latencies:
0.000% <= 0.103 milliseconds (cumulative count 0)
0.033% <= 0.207 milliseconds (cumulative count 33)
42.966% <= 0.303 milliseconds (cumulative count 42966)
91.224% <= 0.407 milliseconds (cumulative count 91224)
94.621% <= 0.503 milliseconds (cumulative count 94621)
96.256% <= 0.607 milliseconds (cumulative count 96256)
97.474% <= 0.703 milliseconds (cumulative count 97474)
98.475% <= 0.807 milliseconds (cumulative count 98475)
99.035% <= 0.903 milliseconds (cumulative count 99035)
99.437% <= 1.007 milliseconds (cumulative count 99437)
99.597% <= 1.103 milliseconds (cumulative count 99597)
99.650% <= 1.207 milliseconds (cumulative count 99650)
99.721% <= 1.303 milliseconds (cumulative count 99721)
99.736% <= 1.407 milliseconds (cumulative count 99736)
99.746% <= 1.503 milliseconds (cumulative count 99746)
99.765% <= 1.607 milliseconds (cumulative count 99765)
99.783% <= 1.703 milliseconds (cumulative count 99783)
99.802% <= 1.807 milliseconds (cumulative count 99802)
99.820% <= 1.903 milliseconds (cumulative count 99820)
99.831% <= 2.007 milliseconds (cumulative count 99831)
99.839% <= 2.103 milliseconds (cumulative count 99839)
99.925% <= 3.103 milliseconds (cumulative count 99925)
100.000% <= 4.103 milliseconds (cumulative count 100000)

Summary:
  throughput summary: 297619.06 requests per second
  latency summary (msec):
          avg       min       p50       p95       p99       max
        0.342     0.128     0.311     0.527     0.903     3.967
```

## 範例

以下是一個綜合範例，測試 `SET` 和 `GET` 命令，發送 20000 個請求，並保持 100 個並發連接，數據大小為 512 字節：

```sh
redis-benchmark -t set,get -n 20000 -c 100 -d 512
```

希望這些介紹能幫助你更好地使用 `redis-benchmark` 進行性能測試。

## 實際使用案例

### 案例一：測試寫入性能

假設我們想測試 Redis 的寫入性能，可以使用以下命令：

```sh
redis-benchmark -t set -n 100000 -c 200
```

這個命令會測試 `SET` 命令，發送 100000 個請求，並保持 200 個並發連接。這樣可以模擬高並發寫入的場景，測試 Redis 的寫入性能。

### 案例二：測試讀取性能

如果我們想測試 Redis 的讀取性能，可以使用以下命令：

```sh
redis-benchmark -t get -n 100000 -c 200
```

這個命令會測試 `GET` 命令，發送 100000 個請求，並保持 200 個並發連接。這樣可以模擬高並發讀取的場景，測試 Redis 的讀取性能。

### 案例三：測試混合讀寫性能

我們也可以同時測試讀取和寫入性能，使用以下命令：

```sh
redis-benchmark -t set,get -n 100000 -c 200
```

這個命令會同時測試 `SET` 和 `GET` 命令，發送 100000 個請求，並保持 200 個並發連接。這樣可以模擬混合讀寫的場景，測試 Redis 的綜合性能。

### 案例四：測試大數據量的性能

如果我們想測試大數據量的性能，可以使用以下命令：

```sh
redis-benchmark -t set -n 100000 -c 200 -d 2048
```

這個命令會測試 `SET` 命令，發送 100000 個請求，並保持 200 個並發連接，數據大小為 2048 字節。這樣可以測試 Redis 在處理大數據量時的性能。

這些實際使用案例可以幫助你更好地理解 `redis-benchmark` 的參數和用法，並根據不同的測試需求進行性能測試。
