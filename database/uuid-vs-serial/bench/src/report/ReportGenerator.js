/**
 * 報告生成模組
 * 用於產生綜合性能報告
 */

/**
 * 測試報告生成器類別
 */
export class ReportGenerator {
  /**
   * 建構函數
   * @param {Object} config - 測試配置
   * @param {Function} formatNumber - 數字格式化函數
   */
  constructor(config, formatNumber) {
    this.config = config;
    this.formatNumber = formatNumber;
  }

  /**
   * 生成綜合性能報告
   * @param {Object} pgResults - PostgreSQL 測試結果
   * @param {Object} myResults - MySQL 測試結果
   * @param {Object} msResults - SQL Server 測試結果
   */
  generateReport(pgResults, myResults, msResults) {
    console.log("\n======= UUID vs. Serial 綜合性能報告 =======\n");

    // 插入性能比較表格
    console.log("📊 1. 插入性能比較 (行/秒):");
    const insertCompare = [
      {
        主鍵類型: "自增整數 (IDENTITY/AUTO_INCREMENT)",
        PostgreSQL: this.formatNumber(
          pgResults.results.pg_identity.insertRowsPerSec
        ),
        MySQL: this.formatNumber(
          myResults.results.my_identity.insertRowsPerSec
        ),
        "SQL Server": this.formatNumber(
          msResults.results.ms_identity.insertRowsPerSec
        ),
      },
      {
        主鍵類型: "隨機 UUID (UUIDv4)",
        PostgreSQL: this.formatNumber(
          pgResults.results.pg_uuidv4.insertRowsPerSec
        ),
        MySQL: this.formatNumber(myResults.results.my_uuidv4.insertRowsPerSec),
        "SQL Server": this.formatNumber(
          msResults.results.ms_guid_v4.insertRowsPerSec
        ),
      },
      {
        主鍵類型: "時間序 UUID (UUIDv7)",
        PostgreSQL: this.formatNumber(
          pgResults.results.pg_uuidv7.insertRowsPerSec
        ),
        MySQL: this.formatNumber(myResults.results.my_uuidv7.insertRowsPerSec),
        "SQL Server": this.formatNumber(
          msResults.results.ms_guid_v7.insertRowsPerSec
        ),
      },
    ];
    console.table(insertCompare);

    // 主鍵查詢性能比較
    console.log("\n📊 2. 主鍵查詢性能比較 (查詢/秒):");
    const lookupCompare = [
      {
        主鍵類型: "自增整數 (IDENTITY/AUTO_INCREMENT)",
        PostgreSQL: this.formatNumber(
          pgResults.results.pg_identity.lookupPerSec
        ),
        MySQL: this.formatNumber(myResults.results.my_identity.lookupPerSec),
        "SQL Server": this.formatNumber(
          msResults.results.ms_identity.lookupPerSec
        ),
      },
      {
        主鍵類型: "隨機 UUID (UUIDv4)",
        PostgreSQL: this.formatNumber(pgResults.results.pg_uuidv4.lookupPerSec),
        MySQL: this.formatNumber(myResults.results.my_uuidv4.lookupPerSec),
        "SQL Server": this.formatNumber(
          msResults.results.ms_guid_v4.lookupPerSec
        ),
      },
      {
        主鍵類型: "時間序 UUID (UUIDv7)",
        PostgreSQL: this.formatNumber(pgResults.results.pg_uuidv7.lookupPerSec),
        MySQL: this.formatNumber(myResults.results.my_uuidv7.lookupPerSec),
        "SQL Server": this.formatNumber(
          msResults.results.ms_guid_v7.lookupPerSec
        ),
      },
    ];
    console.table(lookupCompare);

    // 範圍掃描性能比較
    console.log("\n📊 3. 範圍掃描性能比較 (毫秒，越低越好):");
    const rangeCompare = [
      {
        主鍵類型: "自增整數 (IDENTITY/AUTO_INCREMENT)",
        PostgreSQL: this.formatNumber(pgResults.results.pg_identity.rangeMs),
        MySQL: this.formatNumber(myResults.results.my_identity.rangeMs),
        "SQL Server": this.formatNumber(msResults.results.ms_identity.rangeMs),
      },
      {
        主鍵類型: "隨機 UUID (UUIDv4)",
        PostgreSQL: this.formatNumber(pgResults.results.pg_uuidv4.rangeMs),
        MySQL: this.formatNumber(myResults.results.my_uuidv4.rangeMs),
        "SQL Server": this.formatNumber(msResults.results.ms_guid_v4.rangeMs),
      },
      {
        主鍵類型: "時間序 UUID (UUIDv7)",
        PostgreSQL: this.formatNumber(pgResults.results.pg_uuidv7.rangeMs),
        MySQL: this.formatNumber(myResults.results.my_uuidv7.rangeMs),
        "SQL Server": this.formatNumber(msResults.results.ms_guid_v7.rangeMs),
      },
    ];
    console.table(rangeCompare);

    this.printConclusion();
    this.saveResultsToFile(
      pgResults,
      myResults,
      msResults,
      insertCompare,
      lookupCompare,
      rangeCompare
    );
  }

  /**
   * 輸出結論與建議
   */
  printConclusion() {
    console.log("\n📋 4. 結論與建議:");
    console.log(`
主鍵選擇結論與建議：

1. 插入性能:
   • 自增整數：在所有資料庫中都提供最佳的插入性能
   • UUIDv4（亂數）：在 MySQL 和 SQL Server 的叢集索引中表現最差
   • UUIDv7（時間序）：性能接近自增整數，是 UUID 的最佳選擇

2. 查詢性能:
   • 主鍵查詢：三種類型性能相近，因為 B-tree 索引查詢都是 O(log n)
   • 範圍掃描：自增整數明顯優於 UUID，因為實體順序與邏輯順序一致

3. 空間使用與碎片化:
   • 自增整數：佔用空間最小、碎片最少
   • UUIDv4：在叢集索引下產生大量碎片和頁分裂
   • UUIDv7：碎片情況顯著優於 UUIDv4，尤其在叢集索引中

4. 適用場景建議:
   • 單體應用或中心化 ID 生成：首選自增整數（效能最佳、空間最小）
   • 分散式系統需要用 UUID 時：強烈建議使用 UUIDv7（或類似的時間序 UUID）
   • 對於 MySQL 與 SQL Server：若必須用 UUID，考慮設為非叢集索引
   • PostgreSQL：UUID 影響較小，但 UUIDv7 仍有空間效率優勢
  `);
  }

  /**
   * 將結果保存為 JSON 檔案
   * @param {Object} pgResults - PostgreSQL 測試結果
   * @param {Object} myResults - MySQL 測試結果
   * @param {Object} msResults - SQL Server 測試結果
   * @param {Array} insertCompare - 插入比較結果
   * @param {Array} lookupCompare - 查詢比較結果
   * @param {Array} rangeCompare - 範圍查詢比較結果
   */
  saveResultsToFile(
    pgResults,
    myResults,
    msResults,
    insertCompare,
    lookupCompare,
    rangeCompare
  ) {
    try {
      const { ROWS, BATCH, RUNS, WARMUP } = this.config;
      const results = {
        config: {
          rows: ROWS,
          batch: BATCH,
          runs: RUNS,
          warmup: WARMUP,
          date: new Date().toISOString(),
        },
        postgres: pgResults,
        mysql: myResults,
        sqlserver: msResults,
        summary: {
          insertCompare,
          lookupCompare,
          rangeCompare,
        },
      };

      // 移除 JSON 生成，只保留控制台輸出
      // fs.writeFileSync("./bench-results.json", JSON.stringify(results, null, 2));
      // console.log("\n✅ 詳細結果已儲存至 bench-results.json");
    } catch (e) {
      console.error("❌ 儲存結果失敗:", e);
    }
  }
}
