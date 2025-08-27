/**
 * SQL Server 基準測試實現
 */
import mssql from "mssql";
import fs from "node:fs/promises";
import { v7 as uuidv7 } from "uuid";
import { formatSize } from "../utils/format.js";
import { DatabaseBenchmark } from "./DatabaseBenchmark.js";

/**
 * SQL Server 基準測試類
 * 實現對 SQL Server 的基準測試
 */
export class SQLServerBenchmark extends DatabaseBenchmark {
  constructor(config, formatNumber) {
    super(config, formatNumber);
    this.testName = "SQL Server";
    this.pool = null;
  }

  /**
   * 取得 SQL Server 測試階段定義
   * @returns {Array<TestPhase>}
   */
  getPhases() {
    return [
      {
        name: "ms_identity",
        table: "dbo.t_identity",
        description: "BIGINT IDENTITY + OPTIMIZE_FOR_SEQUENTIAL_KEY",
        gen: () => `(N'${this.payload.replace(/'/g, "''")}')`,
        cols: "(payload)",
      },
      {
        name: "ms_guid_v4",
        table: "dbo.t_guid_v4",
        description: "UNIQUEIDENTIFIER + NEWID()（亂數叢集索引）",
        gen: () => `(NEWID(), N'${this.payload.replace(/'/g, "''")}')`,
        cols: "(id,payload)",
      },
      {
        name: "ms_guid_v7",
        table: "dbo.t_guid_v7",
        description: "UNIQUEIDENTIFIER 存 UUIDv7（時間序叢集索引）",
        gen: () =>
          `(CONVERT(uniqueidentifier, '${uuidv7()}'), N'${this.payload.replace(
            /'/g,
            "''"
          )}')`,
        cols: "(id,payload)",
      },
    ];
  }

  /**
   * 連接到 SQL Server 資料庫
   * @returns {Promise<void>}
   */
  async connect() {
    this.pool = new mssql.ConnectionPool({
      server: process.env.MSSQL_HOST || "mssql",
      port: parseInt(process.env.MSSQL_PORT) || 1433,
      user: "sa",
      password: process.env.MSSQL_PASSWORD || "P@ssw0rd12345",
      database: "master", // 先連接到 master 資料庫
      options: { trustServerCertificate: true, encrypt: false },
    });
    await this.pool.connect();

    // 建立 benchmark 資料庫（如果不存在）
    try {
      await this.pool.request().query(`
        IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'benchmark')
        CREATE DATABASE benchmark
      `);
      console.log("已確保 benchmark 資料庫存在");

      // 切換到 benchmark 資料庫
      await this.pool.close();
      this.pool = new mssql.ConnectionPool({
        server: process.env.MSSQL_HOST || "mssql",
        port: parseInt(process.env.MSSQL_PORT) || 1433,
        user: "sa",
        password: process.env.MSSQL_PASSWORD || "P@ssw0rd12345",
        database: "benchmark",
        options: { trustServerCertificate: true, encrypt: false },
      });
      await this.pool.connect();
    } catch (error) {
      console.error("建立或切換資料庫時發生錯誤:", error.message);
      throw error;
    }
  }

  /**
   * 初始化 SQL Server 資料表
   * @returns {Promise<void>}
   */
  async initialize() {
    const msSql = await fs.readFile("./sql/mssql.sql", "utf8");
    await this.pool.request().batch(msSql);
  }

  /**
   * 執行 SQL Server 預熱
   * @param {Array<TestPhase>} phases - 測試階段定義
   * @returns {Promise<void>}
   */
  async warmup(phases) {
    const { WARMUP } = this.config;

    for (const p of phases) {
      console.log(`  - 預熱 ${p.description}`);
      const warmupValues = Array.from({ length: WARMUP }, () => p.gen()).join(
        ","
      );
      await this.pool
        .request()
        .batch(
          `BEGIN TRAN; INSERT INTO ${p.table} ${p.cols} VALUES ${warmupValues}; COMMIT;`
        );
    }
  }

  /**
   * 執行 SQL Server 插入測試
   * @param {TestPhase} phase - 當前測試階段
   * @returns {Promise<Object>} 插入測試結果
   */
  async testInsert(phase) {
    const { ROWS, BATCH, RUNS } = this.config;
    const runTimes = [];

    // 定義批次插入函數
    const batchInsertFn = async (startIndex, currentBatchSize) => {
      const values = Array.from({ length: currentBatchSize }, () =>
        phase.gen()
      ).join(",");
      await this.pool
        .request()
        .batch(
          `BEGIN TRAN; INSERT INTO ${phase.table} ${phase.cols} VALUES ${values}; COMMIT;`
        );
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
   * 取得隨機 ID 樣本的 SQL Server 實現
   * @param {TestPhase} phase - 當前測試階段
   * @param {number} sampleSize - 需要的樣本大小
   * @returns {Promise<Array>} ID 陣列
   */
  async getRandomIds(phase, sampleSize) {
    // 兩種索引類型都使用相同方式取得隨機 ID
    const idResult = await this.pool
      .request()
      .input("sampleSize", sampleSize)
      .query(
        `SELECT TOP (@sampleSize) id FROM ${phase.table} ORDER BY NEWID()`
      );
    return idResult.recordset.map((r) => r.id);
  }

  /**
   * 執行 SQL Server 查詢測試
   * @param {TestPhase} phase - 當前測試階段
   * @param {Object} result - 插入測試結果
   * @returns {Promise<Object>} 更新後的測試結果
   */
  async testQuery(phase, result) {
    try {
      // 使用共用方法計算查詢數量
      const lookupCount = this.getLookupCount();

      // 取得隨機 ID 進行測試
      console.log(`  - 取得隨機 ID 樣本...`);
      const ids = await this.getRandomIds(phase, lookupCount);

      // 主鍵查詢測試
      console.log(`  - 執行主鍵點查詢測試...`);

      // 定義點查詢函數
      const lookupFn = async (id) => {
        await this.pool
          .request()
          .input("id", id)
          .query(`SELECT * FROM ${phase.table} WHERE id = @id`);
      };

      // 定義每次查詢前的清除快取函數
      const lookupPreFn = async () => {
        try {
          // SQL Server 清除查詢計畫快取（需要 sysadmin 權限）
          await this.pool
            .request()
            .query("DBCC FREEPROCCACHE WITH NO_INFOMSGS");
        } catch (e) {
          // 可能權限不足
          console.log("SQL Server: 清除快取失敗，可能權限不足");
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
        if (phase.name === "ms_identity") {
          // 自增 ID 支援真正的範圍查詢
          await this.pool
            .request()
            .input("rangeLimit", rangeLimit)
            .query(
              `SELECT * FROM ${phase.table} WHERE id BETWEEN 1 AND @rangeLimit`
            );
        } else {
          // UUID：真正的範圍查詢測試 - 使用 ORDER BY + TOP
          // 這會測試在 UUID 索引上進行排序和限制的性能
          await this.pool
            .request()
            .input("rangeLimit", rangeLimit)
            .query(
              `SELECT TOP (@rangeLimit) * FROM ${phase.table} ORDER BY id`
            );
        }
      };

      // 定義每次查詢前的清除快取函數（SQL Server）
      const preFn = async () => {
        // SQL Server 清除查詢計畫快取
        try {
          await this.pool.request().query("DBCC FREEPROCCACHE"); // 清除計畫快取
          await this.pool.request().query("DBCC DROPCLEANBUFFERS"); // 清除資料快取
        } catch (e) {
          console.log("SQL Server: 無法清除快取，可能需要更高權限");
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
   * 收集 SQL Server 空間使用統計
   * @returns {Promise<Object>} 空間使用統計
   */
  async collectStats() {
    // 分析索引大小
    console.log(`\n📊 SQL Server 索引大小分析`);
    const size = await this.pool.request().query(`
      SELECT 
        i.name AS index_name, 
        OBJECT_NAME(i.object_id) AS table_name,
        i.type_desc AS index_type,
        SUM(a.total_pages)*8*1024 AS bytes
      FROM sys.indexes i
      JOIN sys.partitions p ON i.object_id=p.object_id AND i.index_id=p.index_id
      JOIN sys.allocation_units a ON p.partition_id=a.container_id
      WHERE OBJECT_NAME(i.object_id) IN ('t_identity','t_guid_v4','t_guid_v7')
      GROUP BY i.name, OBJECT_NAME(i.object_id), i.type_desc
      ORDER BY OBJECT_NAME(i.object_id), i.name;
    `);

    console.table(
      size.recordset.map((r) => ({
        索引名稱: r.index_name || "",
        表名稱: r.table_name || "",
        索引類型: r.index_type || "",
        大小: formatSize(r.bytes),
        位元組數: this.formatNumber(r.bytes),
      }))
    );

    // 碎片分析
    console.log(`\n📊 SQL Server 碎片分析`);
    const fragmentation = await this.pool.request().query(`
      SELECT 
        OBJECT_NAME(object_id) AS table_name,
        index_id,
        index_type_desc,
        avg_fragmentation_in_percent,
        fragment_count,
        page_count,
        record_count
      FROM sys.dm_db_index_physical_stats(
        DB_ID(), NULL, NULL, NULL, 'SAMPLED'
      )
      WHERE OBJECT_NAME(object_id) IN ('t_identity','t_guid_v4','t_guid_v7')
        AND index_id > 0
        AND alloc_unit_type_desc = 'IN_ROW_DATA'  -- 只取得主要資料頁統計，避免重複
      ORDER BY OBJECT_NAME(object_id), index_id
    `);

    console.table(
      fragmentation.recordset.map((r) => ({
        表名稱: r.table_name,
        索引ID: r.index_id,
        索引類型: r.index_type_desc,
        碎片百分比: `${r.avg_fragmentation_in_percent.toFixed(2)}%`,
        碎片數量: r.fragment_count,
        頁數: r.page_count,
        記錄數: r.record_count,
      }))
    );

    // 分析頁密度
    console.log(`\n📊 SQL Server 頁密度分析`);
    const pageDensity = await this.pool.request().query(`
      SELECT 
        OBJECT_NAME(object_id) AS table_name,
        index_id,
        index_type_desc,
        avg_page_space_used_in_percent,
        avg_record_size_in_bytes,
        page_count
      FROM sys.dm_db_index_physical_stats(
        DB_ID(), NULL, NULL, NULL, 'SAMPLED'
      )
      WHERE OBJECT_NAME(object_id) IN ('t_identity','t_guid_v4','t_guid_v7')
        AND index_id > 0
        AND alloc_unit_type_desc = 'IN_ROW_DATA'  -- 只取得主要資料頁統計，避免重複
      ORDER BY OBJECT_NAME(object_id), index_id
    `);

    console.table(
      pageDensity.recordset.map((r) => ({
        表名稱: r.table_name,
        索引類型: r.index_type_desc,
        頁面使用率: `${r.avg_page_space_used_in_percent.toFixed(2)}%`,
        平均記錄大小: `${r.avg_record_size_in_bytes} bytes`,
        頁數: r.page_count,
      }))
    );

    // 返回測試結果
    return {
      sizes: size.recordset,
      fragmentation: fragmentation.recordset,
      pageDensity: pageDensity.recordset,
    };
  }

  /**
   * 關閉 SQL Server 連接
   * @returns {Promise<void>}
   */
  async close() {
    await this.pool.close();
  }
}
