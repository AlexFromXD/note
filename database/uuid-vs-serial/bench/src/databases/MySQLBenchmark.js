/**
 * MySQL 基準測試實現
 */
import mysql from "mysql2/promise";
import fs from "node:fs/promises";
import { v4 as uuidv4, v7 as uuidv7 } from "uuid";
import { formatSize } from "../utils/format.js";
import { DatabaseBenchmark } from "./DatabaseBenchmark.js";

/**
 * MySQL 基準測試類
 * 實現對 MySQL InnoDB 的基準測試
 */
export class MySQLBenchmark extends DatabaseBenchmark {
  constructor(config, formatNumber) {
    super(config, formatNumber);
    this.testName = "MySQL InnoDB";
    this.conn = null;
  }

  /**
   * 取得 MySQL 測試階段定義
   * @returns {Array<TestPhase>}
   */
  getPhases() {
    return [
      {
        name: "my_identity",
        table: "t_identity",
        description: "BIGINT AUTO_INCREMENT（叢集索引）",
        sql: "INSERT INTO t_identity(payload) VALUES (?)",
        gen: () => [this.payload],
      },
      {
        name: "my_uuidv4",
        table: "t_uuidv4",
        description: "BINARY(16) 存 UUIDv4（叢集索引 + UUID_TO_BIN 重排）",
        sql: "INSERT INTO t_uuidv4(id,payload) VALUES (UUID_TO_BIN(?,1),?)",
        gen: () => [uuidv4(), this.payload],
      },
      {
        name: "my_uuidv7",
        table: "t_uuidv7",
        description: "BINARY(16) 存 UUIDv7（叢集索引 + 時間序）",
        sql: "INSERT INTO t_uuidv7(id,payload) VALUES (UUID_TO_BIN(?,1),?)",
        gen: () => [uuidv7(), this.payload],
      },
    ];
  }

  /**
   * 連接到 MySQL 資料庫
   * @returns {Promise<void>}
   */
  async connect() {
    this.conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST || "mysql",
      port: parseInt(process.env.MYSQL_PORT) || 3306,
      user: "root",
      password: "root",
      database: "benchmark",
      multipleStatements: true,
    });
  }

  /**
   * 初始化 MySQL 資料表
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      const mySql = await fs.readFile("./sql/mysql.sql", "utf8");
      await this.conn.query(mySql);
      console.log("MySQL tables initialized successfully");
    } catch (error) {
      console.error("Error initializing MySQL tables:", error.message);
      throw error;
    }
  }

  /**
   * 執行 MySQL 預熱
   * @param {Array<TestPhase>} phases - 測試階段定義
   * @returns {Promise<void>}
   */
  async warmup(phases) {
    const { WARMUP } = this.config;

    for (const p of phases) {
      console.log(`  - 預熱 ${p.description}`);
      const warmupSql = `${p.sql};`.repeat(WARMUP);
      const warmupVals = Array.from({ length: WARMUP }, () => p.gen()).flat();
      await this.conn.query("START TRANSACTION");
      await this.conn.query(warmupSql, warmupVals);
      await this.conn.query("COMMIT");
    }
  }

  /**
   * 執行 MySQL 插入測試
   * @param {TestPhase} phase - 當前測試階段
   * @returns {Promise<Object>} 插入測試結果
   */
  async testInsert(phase) {
    const { ROWS, BATCH, RUNS } = this.config;
    const runTimes = [];

    // 定義批次插入函數
    const batchInsertFn = async (startIndex, currentBatchSize) => {
      const [sql, vals] = [
        `${phase.sql};`.repeat(currentBatchSize),
        Array.from({ length: currentBatchSize }, () => phase.gen()).flat(),
      ];
      await this.conn.query("START TRANSACTION");
      await this.conn.query(sql, vals);
      await this.conn.query("COMMIT");
    };

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
   * 取得隨機 ID 樣本的 MySQL 實現
   * @param {TestPhase} phase - 當前測試階段
   * @param {number} sampleSize - 需要的樣本大小
   * @returns {Promise<Array>} ID 陣列
   */
  async getRandomIds(phase, sampleSize) {
    let ids = [];
    if (phase.name === "my_identity") {
      // 取得最大 ID
      const [maxResult] = await this.conn.query(
        "SELECT MAX(id) as max_id FROM t_identity"
      );
      const maxId = maxResult[0].max_id;
      ids = Array.from(
        { length: sampleSize },
        () => Math.floor(Math.random() * maxId) + 1
      );
    } else {
      // 取得隨機 UUID
      const [idsResult] = await this.conn.query(
        `SELECT BIN_TO_UUID(id, 1) as uuid FROM ${phase.table} ORDER BY RAND() LIMIT ?`,
        [sampleSize]
      );
      ids = idsResult.map((row) => row.uuid);
    }
    return ids;
  }

  /**
   * 執行 MySQL 查詢測試
   * @param {TestPhase} phase - 當前測試階段
   * @param {Object} result - 插入測試結果
   * @returns {Promise<Object>} 更新後的測試結果
   */
  async testQuery(phase, result) {
    try {
      // 使用共用方法計算查詢數量
      const lookupCount = this.getLookupCount();

      // 隨機 ID 查詢測試
      console.log(`  - 取得隨機 ID 樣本...`);
      const ids = await this.getRandomIds(phase, lookupCount);

      // 主鍵查詢測試
      console.log(`  - 執行主鍵點查詢測試...`);

      // 定義點查詢函數
      const lookupFn = async (id) => {
        if (phase.name === "my_identity") {
          await this.conn.query(`SELECT * FROM t_identity WHERE id = ?`, [id]);
        } else {
          await this.conn.query(
            `SELECT * FROM ${phase.table} WHERE id = UUID_TO_BIN(?, 1)`,
            [id]
          );
        }
      };

      // 定義每次查詢前的清除快取函數
      const lookupPreFn = async () => {
        try {
          // MySQL 8.0 已經移除查詢快取功能，改用其他方式清除
          // 可以清除一些會話級別的快取
          await this.conn.query("FLUSH LOCAL STATUS");
        } catch (e) {
          // 某些 MySQL 版本可能不支援此命令
          console.log("MySQL: 清除快取失敗，可能不支援此功能");
        }
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
        if (phase.name === "my_identity") {
          // 自增 ID 支援真正的範圍查詢
          await this.conn.query(
            "SELECT * FROM t_identity WHERE id BETWEEN ? AND ?",
            [1, rangeLimit]
          );
        } else {
          // UUID：真正的範圍查詢測試 - 使用 ORDER BY + LIMIT
          // 這會測試在 UUID 索引上進行排序和限制的性能
          await this.conn.query(
            `SELECT * FROM ${phase.table} ORDER BY id LIMIT ?`,
            [rangeLimit]
          );
        }
      };

      // 定義每次查詢前的清除快取函數（MySQL）
      const preFn = async () => {
        // MySQL 8.0 已經移除查詢快取功能，改用其他方式
        try {
          await this.conn.query("FLUSH LOCAL STATUS");
        } catch (e) {
          console.log("MySQL: 清除快取失敗");
        }
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
   * 收集 MySQL 空間使用統計
   * @returns {Promise<Object>} 空間使用統計
   */
  async collectStats() {
    // 強制更新統計資訊
    console.log(`\n📊 更新 MySQL 統計資訊...`);
    await this.conn.query("ANALYZE TABLE t_identity, t_uuidv4, t_uuidv7");

    // 分析表大小與索引大小
    console.log(`\n📊 MySQL InnoDB 表大小分析`);

    // 使用更簡單直接的查詢
    const sizeQuery = `
      SELECT 
        TABLE_NAME as table_name,
        DATA_LENGTH as data_length,
        INDEX_LENGTH as index_length,
        (DATA_LENGTH + INDEX_LENGTH) as total_bytes,
        TABLE_ROWS as row_count,
        AVG_ROW_LENGTH as avg_row_length
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME IN ('t_identity','t_uuidv4','t_uuidv7')
      ORDER BY TABLE_NAME;
    `;

    const [sizes] = await this.conn.query(sizeQuery);

    console.table(
      sizes.map((r) => ({
        表名稱: r.table_name || "",
        資料大小: formatSize(r.data_length),
        索引大小: formatSize(r.index_length),
        總大小: formatSize(r.total_bytes),
        行數: this.formatNumber(r.row_count),
        平均行大小: formatSize(r.avg_row_length),
        總位元組數: this.formatNumber(r.total_bytes),
      }))
    );

    // InnoDB碎片分析 - 修正計算邏輯
    const fragQuery = `
      SELECT 
        TABLE_NAME as table_name,
        DATA_FREE as data_free,
        DATA_LENGTH as data_length,
        INDEX_LENGTH as index_length,
        (DATA_LENGTH + INDEX_LENGTH + DATA_FREE) as total_allocated,
        CASE 
          WHEN (DATA_LENGTH + INDEX_LENGTH + DATA_FREE) > 0 
          THEN ROUND(DATA_FREE / (DATA_LENGTH + INDEX_LENGTH + DATA_FREE) * 100, 2)
          ELSE 0 
        END AS fragmentation_pct
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME IN ('t_identity','t_uuidv4','t_uuidv7')
      ORDER BY TABLE_NAME;
    `;

    const [fragmentation] = await this.conn.query(fragQuery);

    console.log(`\n📊 MySQL InnoDB 碎片分析`);
    console.log(
      `注意：DATA_FREE 包含 InnoDB 預分配空間和真正碎片，小表的預分配空間佔比較高`
    );

    console.table(
      fragmentation.map((r) => ({
        表名稱: r.table_name || "",
        資料大小: formatSize(r.data_length),
        索引大小: formatSize(r.index_length),
        空閒空間: formatSize(r.data_free),
        總分配空間: formatSize(r.total_allocated),
        碎片百分比: `${r.fragmentation_pct || 0}%`,
        說明: (r.data_free || 0) > 1024 * 1024 ? "包含預分配空間" : "實際碎片",
      }))
    );

    // InnoDB 統計信息
    console.log(`\n📊 MySQL InnoDB B-tree 統計信息`);
    try {
      const statsQuery = `
        SELECT 
          TABLE_NAME as table_name,
          INDEX_NAME as index_name,
          STAT_NAME as stat_name,
          STAT_VALUE as stat_value,
          SAMPLE_SIZE as sample_size
        FROM mysql.innodb_index_stats 
        WHERE DATABASE_NAME = DATABASE()
          AND TABLE_NAME IN ('t_identity','t_uuidv4','t_uuidv7')
        ORDER BY TABLE_NAME, INDEX_NAME, STAT_NAME
      `;

      const [stats] = await this.conn.query(statsQuery);

      console.table(
        stats.map((r) => ({
          表名稱: r.table_name || r.TABLE_NAME,
          索引名稱: r.index_name || r.INDEX_NAME,
          統計指標: r.stat_name || r.STAT_NAME,
          值: r.stat_value || r.STAT_VALUE,
        }))
      );
    } catch (e) {
      console.log("  未能取得詳細索引統計資料（需要更高權限）");
    }

    // 返回測試結果
    return {
      sizes,
      fragmentation,
    };
  }

  /**
   * 關閉 MySQL 連接
   * @returns {Promise<void>}
   */
  async close() {
    await this.conn.end();
  }
}
