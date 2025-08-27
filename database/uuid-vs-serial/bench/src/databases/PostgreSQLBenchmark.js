/**
 * PostgreSQL 基準測試實現
 */
import fs from "node:fs/promises";
import { Client as Pg } from "pg";
import { v4 as uuidv4, v7 as uuidv7 } from "uuid";
import { formatSize } from "../utils/format.js";
import { DatabaseBenchmark } from "./DatabaseBenchmark.js";

/**
 * PostgreSQL 基準測試類
 * 實現對 PostgreSQL 的基準測試
 */
export class PostgreSQLBenchmark extends DatabaseBenchmark {
  constructor(config, formatNumber) {
    super(config, formatNumber);
    this.testName = "PostgreSQL";
    this.client = null;
  }

  /**
   * 取得 PostgreSQL 測試階段定義
   * @returns {Array<TestPhase>}
   */
  getPhases() {
    return [
      {
        name: "pg_identity",
        table: "t_identity",
        description: "BIGINT GENERATED ALWAYS AS IDENTITY",
        sql: "INSERT INTO t_identity(payload) VALUES ($1)",
        gen: () => [this.payload],
      },
      {
        name: "pg_uuidv4",
        table: "t_uuidv4",
        description: "UUID 型別（亂數分佈）",
        sql: "INSERT INTO t_uuidv4(id,payload) VALUES ($1,$2)",
        gen: () => [uuidv4(), this.payload],
      },
      {
        name: "pg_uuidv7",
        table: "t_uuidv7",
        description: "UUID 型別（時間序）",
        sql: "INSERT INTO t_uuidv7(id,payload) VALUES ($1,$2)",
        gen: () => [uuidv7(), this.payload],
      },
    ];
  }

  /**
   * 連接到 PostgreSQL 資料庫
   * @returns {Promise<void>}
   */
  async connect() {
    this.client = new Pg({
      host: process.env.PG_HOST || "pg",
      port: parseInt(process.env.PG_PORT) || 5432,
      user: "postgres",
      password: "postgres",
      database: "benchmark",
    });
    await this.client.connect();
  }

  /**
   * 初始化 PostgreSQL 資料表
   * @returns {Promise<void>}
   */
  async initialize() {
    const pgSql = await fs.readFile("./sql/pg.sql", "utf8");
    await this.client.query(pgSql);
  }

  /**
   * 執行 PostgreSQL 預熱
   * @param {Array<TestPhase>} phases - 測試階段定義
   * @returns {Promise<void>}
   */
  async warmup(phases) {
    const { WARMUP } = this.config;

    for (const p of phases) {
      console.log(`  - 預熱 ${p.description}`);
      for (let i = 0; i < WARMUP; i++) {
        await this.client.query(p.sql, p.gen());
      }
    }
  }

  /**
   * 執行 PostgreSQL 插入測試
   * @param {TestPhase} phase - 當前測試階段
   * @returns {Promise<Object>} 插入測試結果
   */
  async testInsert(phase) {
    const { ROWS, BATCH, RUNS } = this.config;
    const runTimes = [];

    // 定義批次插入函數
    const batchInsertFn = async (startIndex, currentBatchSize) => {
      await this.client.query("BEGIN");

      // 使用真正的批次插入，而不是逐行插入
      if (phase.name === "pg_identity") {
        // 對於 IDENTITY，使用 VALUES 批次插入
        const placeholders = Array.from(
          { length: currentBatchSize },
          (_, i) => `($${i + 1})`
        ).join(", ");
        const values = Array.from({ length: currentBatchSize }, () =>
          phase.gen()
        ).flat();
        const batchSql = `INSERT INTO ${phase.table}(payload) VALUES ${placeholders}`;
        await this.client.query(batchSql, values);
      } else {
        // 對於 UUID，使用 VALUES 批次插入
        const placeholders = Array.from(
          { length: currentBatchSize },
          (_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`
        ).join(", ");
        const values = Array.from({ length: currentBatchSize }, () =>
          phase.gen()
        ).flat();
        const batchSql = `INSERT INTO ${phase.table}(id, payload) VALUES ${placeholders}`;
        await this.client.query(batchSql, values);
      }

      await this.client.query("COMMIT");
    };

    // 對每個運行執行批次插入
    for (let run = 0; run < RUNS; run++) {
      // 測量單次運行的插入效能
      const result = await this.measureBatchInsert(batchInsertFn, ROWS, BATCH);
      runTimes.push(result.insertMs);

      console.log(
        `  - 第 ${run + 1}/${RUNS} 輪測試：插入 ${this.formatNumber(
          ROWS
        )} 行耗時 ${this.formatNumber(result.insertMs)} ms (${this.formatNumber(
          result.insertRowsPerSec
        )} 行/秒)`
      );
    }

    // 計算平均值
    const avgMs = Math.round(
      runTimes.reduce((sum, time) => sum + time, 0) / runTimes.length
    );
    const result = {
      insertMs: avgMs,
      insertRowsPerSec: Math.round(ROWS / (avgMs / 1000)),
    };

    console.log(
      `  ✓ 平均效能：插入 ${this.formatNumber(ROWS)} 行耗時 ${this.formatNumber(
        avgMs
      )} ms (${this.formatNumber(result.insertRowsPerSec)} 行/秒)`
    );

    return result;
  }

  /**
   * 取得隨機 ID 樣本的 PostgreSQL 實現
   * @param {TestPhase} phase - 當前測試階段
   * @param {number} sampleSize - 需要的樣本大小
   * @returns {Promise<Array>} ID 陣列
   */
  async getRandomIds(phase, sampleSize) {
    let ids = [];
    if (phase.name === "pg_identity") {
      // 對於自增 ID，選擇隨機範圍內的 ID
      const maxId = await this.client.query("SELECT MAX(id) FROM t_identity");
      const max = parseInt(maxId.rows[0].max);
      ids = Array.from(
        { length: sampleSize },
        () => Math.floor(Math.random() * max) + 1
      );
    } else {
      // 對於 UUID，先取得隨機 ID
      const idsResult = await this.client.query(
        `SELECT id FROM ${phase.table} ORDER BY random() LIMIT $1`,
        [sampleSize]
      );
      ids = idsResult.rows.map((row) => row.id);
    }
    return ids;
  }

  /**
   * 執行 PostgreSQL 查詢測試
   * @param {TestPhase} phase - 當前測試階段
   * @param {Object} result - 插入測試結果
   * @returns {Promise<Object>} 更新後的測試結果
   */
  async testQuery(phase, result) {
    try {
      // 使用共用方法計算查詢數量
      const lookupCount = this.getLookupCount();

      // 隨機選擇 ID 進行查詢測試
      console.log(`  - 取得隨機 ID 樣本...`);
      const ids = await this.getRandomIds(phase, lookupCount);

      // 主鍵查詢測試
      console.log(`  - 執行主鍵點查詢測試...`);

      // 定義點查詢函數
      const lookupFn = async (id) => {
        await this.client.query(`SELECT * FROM ${phase.table} WHERE id = $1`, [
          id,
        ]);
      };

      // 定義每次查詢前的清除快取函數
      const lookupPreFn = async () => {
        await this.client.query("DISCARD TEMP");
      };

      // 使用共用方法測量主鍵查詢時間
      const lookupResult = await this.measureLookupQueries(
        lookupFn,
        ids,
        lookupPreFn
      );
      result.lookupMs = lookupResult.lookupMs;
      result.lookupPerSec = lookupResult.lookupPerSec;

      // 範圍掃描測試
      console.log(`  - 執行範圍掃描測試...`);
      const rangeLimit = this.getRangeLimit(); // 使用共用方法取得範圍限制

      // 定義範圍查詢函數
      const rangeQueryFn = async () => {
        if (phase.name === "pg_identity") {
          // 自增 ID 支援真正的範圍查詢
          await this.client.query(
            "SELECT * FROM t_identity WHERE id BETWEEN $1 AND $2",
            [1, rangeLimit]
          );
        } else {
          // UUID 類型的範圍查詢測試
          // 使用 ORDER BY 來確保執行了索引掃描
          await this.client.query(
            `SELECT * FROM ${phase.table} ORDER BY id LIMIT $1`,
            [rangeLimit]
          );
        }
      };

      // 定義每次查詢前的清除快取函數
      const preFn = async () => {
        await this.client.query("DISCARD TEMP");
      };

      // 使用共用方法測量範圍查詢時間
      const rangeMs = await this.measureRangeQuery(rangeQueryFn, preFn);
      result.rangeMs = rangeMs;

      console.log(
        `  ✓ 讀取效能結果：\n` +
          `    • 主鍵查詢（${ids.length}次）：${this.formatNumber(
            result.lookupMs
          )} ms (${this.formatNumber(result.lookupPerSec)} 查詢/秒)\n` +
          `    • 範圍掃描（${rangeLimit}行）：${this.formatNumber(rangeMs)} ms`
      );

      return result;
    } catch (e) {
      console.error(`  ✗ 讀取測試失敗：${e.message}`);
      return result;
    }
  }

  /**
   * 收集 PostgreSQL 空間使用統計
   * @returns {Promise<Object>} 空間使用統計
   */
  async collectStats() {
    // 分析索引大小
    console.log(`\n📊 PostgreSQL 索引大小分析`);
    const size = await this.client.query(`
      SELECT 
        c.relname AS index_name, 
        pg_total_relation_size(i.indexrelid) AS total_bytes
      FROM pg_catalog.pg_statio_user_indexes i
      JOIN pg_catalog.pg_class c ON i.indexrelid = c.oid
      WHERE c.relkind = 'i' 
        AND c.relname LIKE '%pkey'
        AND i.schemaname = 'public'
      ORDER BY 1;
    `);

    // 格式化顯示索引大小
    const indexSizes = size.rows.map((r) => ({
      索引名稱: String(r.index_name || "").replace(/['"]/g, ""), // 移除可能的引號
      大小: formatSize(r.total_bytes),
      位元組數: this.formatNumber(r.total_bytes),
    }));
    console.table(indexSizes);

    // 分析表與碎片情況
    console.log(`\n📊 PostgreSQL 表大小與空間分析`);
    const fragmentation = await this.client.query(`
      SELECT 
        c.relname as table_name,
        pg_total_relation_size(c.oid) as total_bytes,
        pg_table_size(c.oid) as table_bytes,  -- 使用pg_table_size而不是pg_relation_size
        round(100 * pg_table_size(c.oid) / nullif(pg_total_relation_size(c.oid), 0), 2) as table_percent,
        pg_indexes_size(c.oid) as index_bytes,  -- 使用pg_indexes_size來獲取索引大小
        COALESCE((SELECT n_dead_tup FROM pg_stat_all_tables WHERE relname = c.relname), 0) as dead_tuples
      FROM pg_class c
      LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relname IN ('t_identity', 't_uuidv4', 't_uuidv7')
        AND n.nspname = 'public'
        AND c.relkind = 'r'  -- 只選擇普通表
    `);

    // 格式化顯示表分析結果
    const tableAnalysis = fragmentation.rows.map((r) => ({
      表名稱: String(r.table_name || "").replace(/['"]/g, ""), // 移除可能的引號
      總大小: formatSize(r.total_bytes),
      資料大小: formatSize(r.table_bytes),
      索引大小: formatSize(r.index_bytes),
      資料佔比: `${r.table_percent || 0}%`,
      死元組數: r.dead_tuples || 0,
    }));
    console.table(tableAnalysis);

    // 分析索引頁填充率（fillfactor 效果）
    console.log(`\n📊 PostgreSQL 索引頁填充情況分析`);
    const fillStats = await this.client.query(`
      SELECT
        s.relname as index_name,
        CASE 
          WHEN s.reloptions IS NULL THEN '使用預設值'
          ELSE array_to_string(s.reloptions, ', ')
        END AS fill_options,
        pg_relation_size(i.indexrelid) AS size_bytes,
        CASE WHEN i.indisunique THEN '是' ELSE '否' END AS is_unique
      FROM pg_index i
      JOIN pg_class c ON c.oid = i.indrelid
      JOIN pg_class s ON s.oid = i.indexrelid
      WHERE c.relname IN ('t_identity', 't_uuidv4', 't_uuidv7')
    `);
    console.table(
      fillStats.rows.map((r) => ({
        索引名稱: String(r.index_name || "").replace(/['"]/g, ""), // 移除可能的引號
        填充選項: r.fill_options || "",
        大小: formatSize(r.size_bytes),
        唯一索引: r.is_unique || "",
      }))
    );

    // 返回所有結果以便後續匯總比較
    return {
      sizes: size.rows,
      fragmentation: fragmentation.rows,
      fillStats: fillStats.rows,
    };
  }

  /**
   * 關閉 PostgreSQL 連接
   * @returns {Promise<void>}
   */
  async close() {
    await this.client.end();
  }
}
