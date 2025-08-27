# UUID vs. Serial/IDENTITY 主鍵效能基準測試

這個專案比較了三種主流資料庫（PostgreSQL、MySQL、SQL Server）在不同主鍵策略下的效能表現，包括自增整數、隨機 UUID(v4)、時間序 UUID(v7)的插入、查詢和儲存空間效率。

## 🚀 快速開始

### 運行模式

專案支援兩種運行模式：

#### Docker 模式（推薦）

所有資料庫在容器中運行，測試程式在本機執行：

```bash
cd bench
npm install
npm run test:local
```

#### 容器模式

測試程式也在容器中運行：

```bash
cd bench
docker compose --profile all up
```

### 自訂參數

```bash
npm run test:local -- --rows=50000 --batch=1000 --runs=3 --warmup=1000
```

參數說明：

- `--rows`: 每輪測試的資料量（預設：10,000）
- `--batch`: 批次插入大小（預設：500）
- `--runs`: 測試輪數（預設：1）
- `--warmup`: 預熱資料量（預設：1,000）

### 預熱機制 (Warmup)

#### 為什麼需要預熱？

基準測試中的預熱是消除「冷啟動」效應的重要步驟：

1. **資料庫緩衝池 (Buffer Pool)**：

   ```
   冷啟動：磁碟讀取 → 緩慢
   預熱後：記憶體讀取 → 快速
   ```

2. **連接池初始化**：

   - 建立連接需要額外開銷
   - 預熱確保連接池已就緒

3. **查詢計劃快取**：

   - 第一次執行需要解析和規劃
   - 預熱後查詢計劃已快取

4. **作業系統頁快取**：
   - 檔案系統快取需要時間建立
   - 預熱確保常用頁面已載入記憶體

#### 預熱實作方式

```javascript
// 對每個測試階段進行預熱
async warmup(phases) {
  const { WARMUP } = this.config; // 預設 1000 行

  for (const phase of phases) {
    console.log(`  - 預熱 ${phase.description}`);
    for (let i = 0; i < WARMUP; i++) {
      // 執行插入操作，建立基礎資料和索引結構
      await this.client.query(phase.sql, phase.gen());
    }
  }
}
```

#### 預熱的具體效果

**PostgreSQL 預熱**：

- 建立基礎資料行（預設 1000 行）
- 初始化 shared_buffers 快取
- 建立連接池和查詢計劃快取

**MySQL 預熱**：

- 填充 InnoDB Buffer Pool
- 初始化叢集索引結構
- 建立自適應雜湊索引（AHI）

**SQL Server 預熱**：

- 載入資料頁到緩衝池
- 初始化執行計劃快取
- 建立統計資訊

#### 預熱 vs 測試資料

```
預熱階段：插入 1,000 行    → 建立基礎環境
測試階段：插入 10,000 行  → 測量真實效能
查詢階段：查詢測試資料    → 測量讀取效能
```

這確保測試結果反映的是穩定狀態下的效能，而不是冷啟動的異常值。

## 📚 資料庫索引基礎概念

### B-tree 索引結構

現代資料庫普遍使用 B-tree（平衡樹）結構來組織索引：

```
        [Root Page]
       /     |     \
  [Branch]  [Branch]  [Branch]
   /   \     /   \     /   \
[Leaf] [Leaf] [Leaf] [Leaf] [Leaf] [Leaf]
```

- **頁面 (Page)**：資料庫儲存的基本單位，通常 8KB-16KB
- **葉節點 (Leaf)**：包含實際資料或指標
- **分支節點 (Branch)**：用於導航的中間層
- **根節點 (Root)**：樹的頂層入口點

### 叢集索引 vs 二級索引

#### 叢集索引 (Clustered Index)

- **資料物理順序**與索引邏輯順序一致
- 每個資料表只能有一個叢集索引
- 直接包含完整資料行

#### 二級索引 (Secondary Index / Non-clustered)

- 獨立於資料物理儲存順序
- 可以有多個二級索引
- 通常包含指向實際資料的指標

### 各資料庫的索引特性

| 資料庫           | 叢集索引預設     | 二級索引指向      | 特殊機制   |
| ---------------- | ---------------- | ----------------- | ---------- |
| **PostgreSQL**   | 無（heap table） | 指向 heap tuple   | MVCC, WAL  |
| **MySQL InnoDB** | 主鍵自動叢集     | 指向主鍵值        | 叢集索引表 |
| **SQL Server**   | 可選叢集索引     | 指向 RID 或叢集鍵 | 頁分裂偵測 |

### 填充因子 (Fill Factor)

填充因子控制索引頁面的空間使用率，影響頁分裂頻率和效能。

詳細說明請參考：[fillfactor.md](./fillfactor.md)

## 📊 測試結果解析

### 主鍵策略比較

#### 🏆 自增整數 (IDENTITY/AUTO_INCREMENT)

**優勢：**

- 插入效能最佳（順序寫入）
- 索引碎片最少
- 儲存空間最小（8 bytes）
- 範圍查詢效率高

**劣勢：**

- 中心化 ID 生成（單點故障）
- 分散式環境下衝突風險
- 可能洩漏業務資訊（如用戶數量）

#### 🎲 隨機 UUID (UUIDv4)

**優勢：**

- 全域唯一性保證
- 分散式友善
- 不洩漏業務資訊

**劣勢：**

- 隨機性導致頁分裂頻繁
- 索引碎片嚴重（特別是叢集索引）
- 儲存空間大（16 bytes）
- 快取命中率低

#### ⏰ 時間序 UUID (UUIDv7)

**優勢：**

- 保持全域唯一性
- 時間排序特性
- 相對較少的頁分裂
- 分散式友善

**劣勢：**

- 仍有一定碎片問題
- 儲存空間較大
- 時間戳可能洩漏建立時間

### 資料庫間效能差異原因

#### PostgreSQL - 整體平衡

```
插入效能：⭐⭐⭐⭐⭐ (最佳批次插入效能)
查詢效能：⭐⭐⭐⭐ (優秀的 B-tree 實現)
UUID 支援：⭐⭐⭐⭐ (相對友善的 UUID 處理)
```

**技術原因：**

- **WAL (Write-Ahead Log)**：批次操作優化良好
- **MVCC**：多版本控制減少鎖競爭
- **Heap Table**：沒有叢集索引的額外負擔
- **優秀的批次插入**：VALUES 語法效率極高

#### MySQL InnoDB - 叢集索引特化

```
插入效能：⭐⭐⭐ (叢集索引維護開銷)
查詢效能：⭐⭐⭐⭐ (叢集索引查詢快)
UUID 支援：⭐⭐ (叢集索引下 UUID 代價高)
```

**技術原因：**

- **強制叢集索引**：所有表都有叢集索引
- **頁分裂敏感**：叢集索引的隨機插入代價高
- **二級索引開銷**：需要回表查詢完整資料
- **Buffer Pool**：針對叢集索引優化的快取機制

#### MySQL 統計資訊採樣機制

MySQL InnoDB 使用**採樣統計**來估算表的行數和其他統計資訊，這可能導致統計值與實際值出現差異：

**採樣機制運作原理：**

```sql
-- 實際行數（精確但慢）
SELECT COUNT(*) FROM t_uuidv4;  -- 結果：10,500 行

-- 統計資訊（快速但可能不準確）
SELECT TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 't_uuidv4';  -- 結果：可能是 9,593 行
```

**為什麼會有差異？**

1. **採樣限制**：InnoDB 預設只採樣 20 個隨機頁面來估算總行數
2. **頁面填充率不均**：不同主鍵策略導致的頁面利用率差異

   ```
   自增 ID:  [1][2][3][4][5]...[50]     ← 每頁 50 行，填充均勻
   隨機 UUID: [A][C][Z][...]           ← 每頁 20-45 行，填充不均
   ```

3. **採樣偏差影響**：
   - **自增 ID 表**：順序插入，頁面填充率一致，採樣準確
   - **UUID 表**：隨機插入導致頁分裂，頁面填充率變化大，採樣可能偏差

**實際影響：**

- **儲存效率差異**：相同行數下，UUIDv4 每行平均佔用空間更大
  ```
  t_identity: 151 bytes/行  (高效率)
  t_uuidv4:   251 bytes/行  (66% 更大！)
  t_uuidv7:   151 bytes/行  (接近自增 ID)
  ```
- **查詢優化器影響**：不準確的統計可能影響執行計劃選擇
- **監控誤導**：表面上看起來行數不同，實際上是空間利用率問題

#### SQL Server - 企業級特性

```
插入效能：⭐⭐⭐⭐ (OPTIMIZE_FOR_SEQUENTIAL_KEY)
查詢效能：⭐⭐⭐ (網路延遲較高)
UUID 支援：⭐ (叢集索引下碎片極嚴重)
```

**技術原因：**

- **頁分裂偵測**：對隨機插入特別敏感
- **填充因子預設值**：可能不適合 UUID 工作負載
- **統計收集**：詳細的碎片分析功能
- **鎖粒度**：頁級鎖可能影響併發效能

### 範圍查詢測試方法論

#### 為什麼對 UUID 使用 ORDER BY 而不是 BETWEEN？

範圍查詢測試需要確保對不同主鍵類型的比較是公平的。我們採用不同的查詢策略：

**自增 ID（Auto-increment）**：

```sql
-- 利用連續性優勢，進行真正的範圍查詢
SELECT * FROM t_identity WHERE id BETWEEN 1 AND 4000;
```

**UUID 類型**：

```sql
-- 使用排序限制，避免不公平的範圍比較
SELECT * FROM t_uuidv4 ORDER BY id LIMIT 4000;
```

#### 為什麼這樣比較才公平？

1. **UUID 無法進行有意義的範圍查詢**：

   - UUIDv4 是隨機值，BETWEEN 查詢沒有實際意義
   - UUIDv7 雖有時間序，但範圍查詢仍不如自增 ID 直觀

2. **不同查詢模式反映真實使用場景**：

   ```sql
   -- 自增 ID 的典型使用：範圍掃描
   SELECT * FROM orders WHERE id BETWEEN 1000 AND 2000;

   -- UUID 的典型使用：排序分頁
   SELECT * FROM users ORDER BY id LIMIT 50 OFFSET 1000;
   ```

3. **索引掃描行為差異**：

   - **自增 ID + BETWEEN**：連續的索引頁掃描，快取友善
   - **UUID + BETWEEN**：可能跨越整個索引空間，快取不友善
   - **UUID + ORDER BY LIMIT**：從索引開始位置順序掃描，相對公平

4. **避免人為製造 UUID 優勢**：
   如果對 UUID 也使用 BETWEEN 1 AND 4000，實際上是在測試：
   ```sql
   -- 這個查詢可能返回很少或沒有資料
   SELECT * FROM t_uuidv4 WHERE id BETWEEN '00000000-0000-0000-0000-000000000001'
                                        AND '00000000-0000-0000-0000-000000004000';
   ```

#### 範圍大小計算

測試使用動態範圍大小：

```javascript
// 20% 的總行數，最少 1000 行
const rangeLimit = Math.max(Math.floor(ROWS * 0.2), 1000);
```

這確保了範圍查詢的效能差異足夠明顯，同時反映真實的查詢負載。

### 碎片化分析

#### 為什麼 SQL Server 的 UUID 碎片率這麼高？

1. **叢集索引強制排序**：

   ```sql
   -- 隨機 UUID 導致插入位置隨機分佈
   INSERT INTO t_guid_v4 VALUES (NEWID(), 'data')  -- 可能插入到索引任何位置
   ```

2. **頁分裂頻率**：

   ```
   自增 ID:  [1][2][3][4][5]     → 順序插入，無頁分裂
   隨機 UUID: [A][C][E][B][D]    → 頻繁頁分裂
   ```

3. **填充因子影響**：
   - 預設 100% 填充，沒有預留空間給插入
   - UUID 插入模式需要更低的填充因子

## 🎯 選擇建議

### 使用自增整數的場景

- 單一資料庫應用
- 對效能要求極高的系統
- 儲存空間敏感的應用
- 需要範圍查詢的業務

### 使用時間序 UUID 的場景

- 分散式系統
- 需要全域唯一 ID
- 跨資料庫資料同步
- 微服務架構

### 使用隨機 UUID 的場景

- 安全性要求高（避免 ID 推測）
- 分散式系統
- 不在意效能損失的業務場景

## 📈 效能調優建議

### PostgreSQL 優化

```sql
-- 調整 WAL 設定提升批次插入效能
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET checkpoint_segments = 32;
```

### MySQL 優化

```sql
-- 考慮將 UUID 作為二級索引
ALTER TABLE t_uuid ADD INDEX idx_uuid(id), DROP PRIMARY KEY, ADD PRIMARY KEY(auto_id);
```

### SQL Server 優化

```sql
-- 為 UUID 表設定適當的填充因子
CREATE INDEX ix_uuid ON t_uuid(id) WITH (FILLFACTOR = 70);
```

## 📝 Take Away

### 1. SQL Server 擅長隨機寫入

SQL Server 的 UUIDv4 插入效能優於 UUIDv7，甚至接近自增 ID 效能。

**原因**：

- `OPTIMIZE_FOR_SEQUENTIAL_KEY` 特性針對熱點競爭優化
- 較智能的頁分裂處理算法
- 對隨機插入模式的緩衝池管理較佳

### 2. 碎片化問題的差異

| 資料庫     | 碎片率 (UUIDv4) | 主要原因                        |
| ---------- | --------------- | ------------------------------- |
| PostgreSQL | < 1%            | Heap Table 架構，資料與索引分離 |
| MySQL      | 6.50%           | 強制叢集索引 + 頁分裂處理較保守 |
| SQL Server | > 30%           | 預設填充因子不適合隨機插入      |

**PostgreSQL 無碎片**是因為使用 Heap Table 架構，沒有強制叢集索引的負擔。

**MySQL 碎片**主要來自強制叢集索引，當 UUID 作為主鍵時，所有二級索引都需要存儲完整 UUID。

### 3. PostgreSQL 需關注 Bloating

PostgreSQL 雖無碎片問題，但需要關注 Table Bloating。其他資料庫相對較少有此問題：

- MySQL InnoDB：叢集索引結構較緊密
- SQL Server：有自動維護機制

```sql
-- 檢查 PostgreSQL bloating
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables WHERE tablename LIKE 't_%';
```

### 4. 分散式系統建議

推薦使用時間序 UUID (UUIDv7)：

```sql
-- PostgreSQL
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    -- 其他欄位
);

-- MySQL 8.0+
CREATE TABLE users (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    -- 其他欄位
);
```

### 5. 調優優先級

1. **MySQL**：考慮 UUID 作為二級索引而非主鍵
2. **SQL Server**：調整 FILLFACTOR 到 70-80%
3. **PostgreSQL**：定期 VACUUM 防止 bloating

---

**Note**: 這個基準測試使用各資料庫的預設設定，目的是測量真實世界的效能表現，而不是經過調優的理想狀況。
