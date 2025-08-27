/**
 * 主程式入口點
 *
 * 資料庫主鍵基準測試：比較 UUID vs. Serial/IDENTITY
 * - PostgreSQL：BIGINT GENERATED ALWAYS AS IDENTITY vs UUID
 * - MySQL：BIGINT AUTO_INCREMENT(clustered) vs BINARY(16) UUID_TO_BIN
 * - SQL Server：BIGINT IDENTITY vs UNIQUEIDENTIFIER
 */
import { MySQLBenchmark } from "./databases/MySQLBenchmark.js";
import { PostgreSQLBenchmark } from "./databases/PostgreSQLBenchmark.js";
import { SQLServerBenchmark } from "./databases/SQLServerBenchmark.js";
import { HTMLReportGenerator } from "./report/HTMLReportGenerator.js";
import { ReportGenerator } from "./report/ReportGenerator.js";
import { displayConfig, parseConfig } from "./utils/config.js";
import { formatNumber } from "./utils/format.js";
/**
 * 主程式執行函數
 */
async function main() {
  try {
    // 解析命令列配置
    const config = parseConfig();

    // 顯示測試配置
    displayConfig(config, formatNumber);

    // 執行三種資料庫的測試
    const pgBenchmark = new PostgreSQLBenchmark(config, formatNumber);
    const myBenchmark = new MySQLBenchmark(config, formatNumber);
    const msBenchmark = new SQLServerBenchmark(config, formatNumber);

    const pgResults = await pgBenchmark.runBenchmark();
    const myResults = await myBenchmark.runBenchmark();
    const msResults = await msBenchmark.runBenchmark();

    // 生成綜合報告（控制台）
    const reportGenerator = new ReportGenerator(config, formatNumber);
    reportGenerator.generateReport(pgResults, myResults, msResults);

    // 生成 HTML 報告
    const htmlReportGenerator = new HTMLReportGenerator(config, formatNumber);
    const htmlReportPath = await htmlReportGenerator.generateHTMLReport(
      pgResults,
      myResults,
      msResults
    );

    console.log(`\n🎉 基準測試完成！HTML 報告已生成：${htmlReportPath}`);
  } catch (e) {
    console.error("\n❌ 測試過程發生錯誤:");
    console.error(e);
    process.exit(1);
  }
}

// 執行主程式
main();
