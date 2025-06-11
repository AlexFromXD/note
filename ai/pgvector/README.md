# Vector Search

pgvector 支援幾種不同的向量搜尋方法

- <-> - L2 distance
- <#> - (negative) inner product
- <=> - cosine distance
- <+> - L1 distance
- <~> - Hamming distance (binary vectors)
- <%> - Jaccard distance (binary vectors)

> https://github.com/pgvector/pgvector?tab=readme-ov-file#querying

由於 Embedding Model 基本上都是產生 float vector 為主，所以先不討論 binary vector 使用的 `<~>` & `<%>`。

# Concept

- **Metric Function / Distance Function** - 定義集合內每一對元素之間的距離，需滿足四個條件：

  - **非負性（Non-negativity）**：距離不能是負數。
  - **恆等性（Identity of indiscernibles）**：只有同一點距離才為 0。
  - **對稱性（Symmetry）**：距離與方向無關。
  - **三角不等式（Triangle inequality）**：任兩點間的距離，不會超過經第三點繞路的距離。

# Operation

- **<+> - L1 distance**

  把每一維的差絕對值相加，類似走棋盤的步數。對離群值不敏感，常用在噪音多或分布不平均的情境。

  $$
  \text{L1}(\mathbf{x}, \mathbf{y}) = \sum_{i=1}^{n} \left| x_i - y_i \right|
  $$

- **<-> - L2 distance**

  兩點間的直線距離。誰離 query 向量最近，誰就最相似。常用於圖像或空間距離直觀的情境。

  $$
  {\displaystyle d(p,q)={\sqrt {(p_{1}-q_{1})^{2}+(p_{2}-q_{2})^{2}+\cdots +(p_{n}-q_{n})^{2}}}.}
  $$

- **<#> - Inner product**

  看「對齊程度 × 強度」，兩個向量越同方向且越長，內積越大。推薦系統喜歡用它來衡量偏好一致與強烈程度。

  $$
  {\displaystyle \left\langle {\vec {a}},{\vec {b}}\right\rangle =\sum _{i=1}^{n}a_{i}b_{i}}
  $$

  or

  $$
  {\displaystyle {\vec {a}}\cdot {\vec {b}}=|{\vec {a}}||{\vec {b}}|\cos \theta \;},
  $$

- **<=> - Cosine distance**

  不看向量長度，只看兩者「方向」像不像，在數學上就是 `(方向 * 長度) / 長度`。常用於語意比較，例如兩段文字講的是不是差不多的事。

  Cosine Similarity：

  $$
  \cos \theta = \frac{\vec{a} \cdot \vec{b}}{|\vec{a}| |\vec{b}|}
  $$

  > Cosine distance = 1 - Cosine Similarity

## Comparison

| 符號  | 名稱                | 是否為 Metric Function  | 是否標準化       | 計算量      | 是否浮動       | 適用場景                                                   |
| ----- | ------------------- | ----------------------- | ---------------- | ----------- | -------------- | ---------------------------------------------------------- |
| `<+>` | **L1 distance**     | ✅                      | ❌               | 中等 (O(n)) | ❌             | 稀疏向量、強調單維度差異；如 anomaly detection、LASSO 回歸 |
| `<->` | **L2 distance**     | ✅                      | ❌               | 中等 (O(n)) | ❌             | 密集向量、幾何直觀，常用於 k-NN、clustering                |
| `<#>` | **inner product**   | 違反非負性 & 三角不等式 | ❌               | 低 (O(n))   | ❌             | 保留向量強度，適合用於注意力、分類等模型打分               |
| `<=>` | **Cosine distance** | 違反恆等性 & 三角不等式 | ✅（須單位向量） | 中等 (O(n)) | ✅（可能誤差） | 語意相似、文本/句子 embedding，常見於 NLP 任務             |

在 LLM RAG 中，通常建議選用 Cosine distance 作為相似度評分方式，因為它專注於向量的「方向相似性」，能有效對齊語意表達，同時消除不同語句在 embedding 長度上的差異，進而避免因敘述冗長或頻率偏差而影響排序。Cosine distance 在角度接近 90° 時分數變化劇烈，但搭配 Top-K 機制可以避開這個區段。其他算法的各有一些主要缺點：Inner Product 可能會遺漏語意相近但字數不同的向量，L2 容易受離群值影響，也就是單一維度的落差導致最終結果失真，L1 則是不利於反應語意空間的連續變化。

測試：

```sql
SELECT label, vec, vec <=> '[1, 2, 3]' AS cos FROM vec_test ORDER BY cos;
```

output:
| label | vec | cos |
| :---: | :--------: | :----------------: |
| v1 | [1,2,3] | 0 |
| v2 | [2,4,6] | 0 |
| v4 | [0,0,1] | 0.1982162742627268 |
| v3 | [3,2,1] | 0.2857142857142857 |
| v5 | [-1,-2,-3] | 2 |

如果想縮放到 `0~1` 並且呈現「相似分數」而非「距離」，可以改用：

```sql
SELECT label, vec, 1 - (vec <=> '[1, 2, 3]')/2 AS cos FROM vec_test ORDER BY cos;
```

output:
| label | vec | cos |
| :---: | :--------: | :----------------: |
|v5 | [-1,-2,-3] | 0|
|v3 | [3,2,1] | 0.8571428571428572|
|v4 | [0,0,1] | 0.9008918628686367|
|v1 | [1,2,3] | 1|
|v2 | [2,4,6] | 1|

---

# Index

Brute Force 雖然會有最高精度，但是當 vector 量級超過 10k 時，可能需要啟用 ANN (Approximate Nearest Neighbor) Index，透過犧牲精確度來維持效能。pgvector 支援 `IVFFlat` & `HNSW` 兩種機制。

## IVFFlat

透過 KMeans 先將資料預分為多個「cell」，查詢時只針對最接近的幾個 cell 進行掃描（由 nprobe 決定範圍），每個 cell 內仍使用 `Brute Force` 精確比對。這種方法能有效降低查詢延遲，同時保有中等程度的準確率，特別適合查詢頻繁且資料不頻繁更新的情境。其優勢是建表簡單、查詢速度快，缺點是 recall 高度依賴聚類品質與 nprobe 的調校。

## HNSW

模擬人類在地圖中逐層縮小範圍的搜尋策略：從 coarse layer 開始快速導引到大致區域，再在細層進行精細比對。HNSW 不需要事前訓練，支援動態插入與高查詢速度，並能在高 recall 下仍維持極低延遲。缺點是建表時間較長，且索引結構佔用記憶體較大，適用於低寫入、高讀取、對查詢速度要求嚴苛的場景。

## Comparison

| 特性               | **IVFFlat**                    | **HNSW**                                |
| ------------------ | ------------------------------ | --------------------------------------- |
| 查詢速度           | 快（與 `nprobe` 成正比）       | 非常快（接近 O(log N)）                 |
| 查詢精度（recall） | 中等，可調（取決於 `nprobe`）  | 高，可調（取決於 `ef_search`）          |
| 建表速度           | 快（需 KMeans 聚類）           | 慢（需建立多層圖）                      |
| 記憶體佔用         | 較低                           | 較高（需儲存多層鄰接資訊）              |
| 支援動態插入       | 部分（插入後最佳化需重訓）     | ✅ 原生支援                             |
| 實作參數           | `lists`, `probes`              | `ef_search`, `ef_construction`, `M`     |
| 適合場景           | 百萬級資料、大量查詢、批次處理 | 極低延遲查詢、互動式搜尋、recall 要求高 |
