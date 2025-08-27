/**
 * HTML 報告生成模組
 * 用於產生格式化的 HTML 測試報告
 */
import fs from "node:fs/promises";
import { formatSize } from "../utils/format.js";

/**
 * HTML 測試報告生成器類別
 */
export class HTMLReportGenerator {
  /**
   * 建構函數
   * @param {Object} config - 測試配置
   * @param {Function} formatNumber - 數字格式化函數
   */
  constructor(config, formatNumber) {
    this.config = config;
    this.formatNumber = formatNumber;
    this.reportPath = "./benchmark-report.html";
  }

  /**
   * 生成 HTML 格式的綜合性能報告
   * @param {Object} pgResults - PostgreSQL 測試結果
   * @param {Object} myResults - MySQL 測試結果
   * @param {Object} msResults - SQL Server 測試結果
   * @returns {Promise<string>} 報告檔案路徑
   */
  async generateHTMLReport(pgResults, myResults, msResults) {
    const { ROWS, BATCH, RUNS, WARMUP } = this.config;

    // 準備 PostgreSQL 表大小分析資料 - 直接從原始數據格式化
    const pgTableAnalysis = pgResults.fragmentation
      ? pgResults.fragmentation.map((row) => ({
          表名稱: row.table_name || "-",
          總大小: formatSize(row.total_bytes),
          資料大小: formatSize(row.table_bytes),
          索引大小: formatSize(row.index_bytes),
          資料佔比: row.table_percent ? `${row.table_percent}%` : "-",
          死元組數: this.formatNumber(row.dead_tuples || 0),
        }))
      : [];

    // 準備 PostgreSQL 索引大小分析資料
    const pgIndexAnalysis = pgResults.sizes
      ? pgResults.sizes.map((row) => ({
          索引名稱: row.index_name || "-",
          大小: formatSize(row.total_bytes),
          位元組數: this.formatNumber(row.total_bytes),
        }))
      : [];

    // 準備 MySQL 表大小分析資料 - 直接從原始數據格式化
    const mysqlTableAnalysis = myResults.sizes
      ? myResults.sizes.map((row) => ({
          表名稱: row.table_name || row.TABLE_NAME || "-",
          資料大小: formatSize(row.data_length || row.DATA_LENGTH),
          索引大小: formatSize(row.index_length || row.INDEX_LENGTH),
          總大小: formatSize(row.total_bytes || row.TOTAL_BYTES),
          行數: this.formatNumber(row.row_count || row.ROW_COUNT),
          平均行大小: formatSize(row.avg_row_length || row.AVG_ROW_LENGTH),
          總位元組數: this.formatNumber(row.total_bytes || row.TOTAL_BYTES),
        }))
      : [];

    // 準備 MySQL 碎片分析資料 - 直接從原始數據格式化
    const mysqlFragAnalysis = myResults.fragmentation
      ? myResults.fragmentation.map((row) => ({
          表名稱: row.table_name || row.TABLE_NAME || "-",
          資料大小: formatSize(row.data_length || row.DATA_LENGTH),
          索引大小: formatSize(row.index_length || row.INDEX_LENGTH),
          空閒空間: formatSize(row.data_free || row.DATA_FREE),
          總分配空間: formatSize(row.total_allocated || row.TOTAL_ALLOCATED),
          碎片百分比: row.fragmentation_pct ? `${row.fragmentation_pct}%` : "-",
          說明:
            (row.data_free || row.DATA_FREE || 0) > 1024 * 1024
              ? "包含預分配空間"
              : "實際碎片",
        }))
      : [];

    // 準備 SQL Server 索引大小分析資料 - 直接從原始數據格式化
    const mssqlSizeAnalysis = msResults.sizes
      ? msResults.sizes.map((row) => ({
          索引名稱: row.index_name || "-",
          表名稱: row.table_name || "-",
          索引類型: row.index_type || "-",
          大小: formatSize(row.bytes),
          位元組數: this.formatNumber(row.bytes),
        }))
      : [];

    // 準備 SQL Server 碎片分析資料 - 直接從原始數據格式化
    const mssqlFragAnalysis = msResults.fragmentation
      ? msResults.fragmentation.map((row) => ({
          表名稱: row.table_name || "-",
          索引ID: row.index_id || "-",
          索引類型: row.index_type_desc || "-",
          碎片百分比: row.avg_fragmentation_in_percent
            ? `${row.avg_fragmentation_in_percent.toFixed(2)}%`
            : "-",
          碎片數量: this.formatNumber(row.fragment_count || 0),
          頁數: this.formatNumber(row.page_count || 0),
          記錄數: this.formatNumber(row.record_count || 0),
        }))
      : [];

    // 插入性能比較數據
    const insertCompare = [
      {
        type: "自增整數 (IDENTITY/AUTO_INCREMENT)",
        pg: pgResults.results.pg_identity.insertRowsPerSec,
        mysql: myResults.results.my_identity.insertRowsPerSec,
        mssql: msResults.results.ms_identity.insertRowsPerSec,
      },
      {
        type: "隨機 UUID (UUIDv4)",
        pg: pgResults.results.pg_uuidv4.insertRowsPerSec,
        mysql: myResults.results.my_uuidv4.insertRowsPerSec,
        mssql: msResults.results.ms_guid_v4.insertRowsPerSec,
      },
      {
        type: "時間序 UUID (UUIDv7)",
        pg: pgResults.results.pg_uuidv7.insertRowsPerSec,
        mysql: myResults.results.my_uuidv7.insertRowsPerSec,
        mssql: msResults.results.ms_guid_v7.insertRowsPerSec,
      },
    ];

    // 查詢性能比較數據
    const lookupCompare = [
      {
        type: "自增整數 (IDENTITY/AUTO_INCREMENT)",
        pg: pgResults.results.pg_identity.lookupPerSec,
        mysql: myResults.results.my_identity.lookupPerSec,
        mssql: msResults.results.ms_identity.lookupPerSec,
      },
      {
        type: "隨機 UUID (UUIDv4)",
        pg: pgResults.results.pg_uuidv4.lookupPerSec,
        mysql: myResults.results.my_uuidv4.lookupPerSec,
        mssql: msResults.results.ms_guid_v4.lookupPerSec,
      },
      {
        type: "時間序 UUID (UUIDv7)",
        pg: pgResults.results.pg_uuidv7.lookupPerSec,
        mysql: myResults.results.my_uuidv7.lookupPerSec,
        mssql: msResults.results.ms_guid_v7.lookupPerSec,
      },
    ];

    // 範圍查詢比較數據
    const rangeCompare = [
      {
        type: "自增整數 (IDENTITY/AUTO_INCREMENT)",
        pg: pgResults.results.pg_identity.rangeMs,
        mysql: myResults.results.my_identity.rangeMs,
        mssql: msResults.results.ms_identity.rangeMs,
      },
      {
        type: "隨機 UUID (UUIDv4)",
        pg: pgResults.results.pg_uuidv4.rangeMs,
        mysql: myResults.results.my_uuidv4.rangeMs,
        mssql: msResults.results.ms_guid_v4.rangeMs,
      },
      {
        type: "時間序 UUID (UUIDv7)",
        pg: pgResults.results.pg_uuidv7.rangeMs,
        mysql: myResults.results.my_uuidv7.rangeMs,
        mssql: msResults.results.ms_guid_v7.rangeMs,
      },
    ];

    // 生成 HTML 內容
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UUID vs. Serial/IDENTITY 基準測試報告</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f8f9fa;
    }
    .metric-description {
      background-color: #f8f9fa;
      border-left: 4px solid #4285f4;
      padding: 10px 15px;
      margin-bottom: 20px;
      border-radius: 0 4px 4px 0;
      font-size: 14px;
    }
    h1, h2, h3 {
      color: #1a73e8;
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e1e4e8;
    }
    .config-section {
      background-color: #f1f8ff;
      border: 1px solid #c8e1ff;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 30px;
    }
    .config-item {
      display: inline-block;
      margin-right: 30px;
      font-weight: 500;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      border-radius: 6px;
      overflow: hidden;
    }
    th, td {
      padding: 12px 15px;
      border-bottom: 1px solid #ddd;
    }
    thead th {
      background-color: #4285f4;
      color: white;
      text-align: left;
      font-weight: 500;
    }
    tbody tr {
      background-color: white;
    }
    tbody tr:hover {
      background-color: #f5f5f5;
    }
    .highlight {
      background-color: #e8f0fe;
      font-weight: bold;
    }
    .charts-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 20px;
    }
    .chart {
      width: 100%;
      margin-bottom: 30px;
      background-color: white;
      border-radius: 6px;
      padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      color: #666;
      font-size: 0.9em;
      border-top: 1px solid #e1e4e8;
      padding-top: 20px;
    }
    @media (max-width: 768px) {
      .chart {
        width: 100%;
      }
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h1>UUID vs. Serial/IDENTITY 基準測試報告</h1>
  
  <div class="config-section">
    <h3>測試配置</h3>
    <div class="config-item">總資料行數: ${this.formatNumber(ROWS)}</div>
    <div class="config-item">批次大小: ${this.formatNumber(BATCH)}</div>
    <div class="config-item">測試次數: ${RUNS}</div>
    <div class="config-item">預熱資料量: ${this.formatNumber(WARMUP)}</div>
    <div class="config-item">測試時間: ${new Date().toLocaleString()}</div>
  </div>

  <h2>1. 插入效能比較 (每秒插入行數，越高越好)</h2>
  <div class="metric-description">
    <p>此指標衡量各種主鍵策略在批次插入操作時的效能。數值越高表示資料庫能夠每秒處理更多資料，代表更好的寫入吞吐量。
    自增ID通常因為順序寫入而效能較佳，而UUID因隨機分佈可能導致較多的頁分裂和碎片，進而影響插入效能。</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>主鍵類型</th>
        <th>PostgreSQL 16</th>
        <th>MySQL 8.4 (InnoDB)</th>
        <th>SQL Server 2022</th>
      </tr>
    </thead>
    <tbody>
      ${insertCompare
        .map(
          (item) => `
        <tr>
          <td>${item.type}</td>
          <td>${this.formatNumber(item.pg)}</td>
          <td>${this.formatNumber(item.mysql)}</td>
          <td>${this.formatNumber(item.mssql)}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <div class="chart">
    <canvas id="insertChart"></canvas>
  </div>

  <h2>2. 主鍵查詢效能比較 (每秒查詢次數，越高越好)</h2>
  <div class="metric-description">
    <p>此指標衡量通過主鍵直接查詢資料的效能。數值越高表示每秒可完成更多的主鍵查詢，代表更好的讀取效能。
    不論是自增ID或UUID，主鍵查詢通常都能維持穩定的效能，因為B-tree索引對點查詢是高效的。
    差異通常來自於索引大小和快取效率，以及主鍵在記憶體中的分佈情況。</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>主鍵類型</th>
        <th>PostgreSQL 16</th>
        <th>MySQL 8.4 (InnoDB)</th>
        <th>SQL Server 2022</th>
      </tr>
    </thead>
    <tbody>
      ${lookupCompare
        .map(
          (item) => `
        <tr>
          <td>${item.type}</td>
          <td>${this.formatNumber(item.pg)}</td>
          <td>${this.formatNumber(item.mysql)}</td>
          <td>${this.formatNumber(item.mssql)}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <div class="chart">
    <canvas id="lookupChart"></canvas>
  </div>

  <h2>3. 範圍查詢效能比較 (毫秒，越低越好)</h2>
  <div class="metric-description">
    <p>此指標衡量批次讀取或範圍掃描的效能表現，數值越低代表範圍查詢速度越快。
    自增ID在範圍查詢上通常有明顯優勢，因為連續值在物理儲存上也是相鄰的，有助於減少磁碟I/O操作。
    相比之下，隨機UUID的範圍查詢效能往往較差，因為數據在物理上不連續，而時間序UUID則介於兩者之間。</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>主鍵類型</th>
        <th>PostgreSQL 16</th>
        <th>MySQL 8.4 (InnoDB)</th>
        <th>SQL Server 2022</th>
      </tr>
    </thead>
    <tbody>
      ${rangeCompare
        .map(
          (item) => `
        <tr>
          <td>${item.type}</td>
          <td>${this.formatNumber(item.pg)}</td>
          <td>${this.formatNumber(item.mysql)}</td>
          <td>${this.formatNumber(item.mssql)}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <div class="chart">
    <canvas id="rangeChart"></canvas>
  </div>

  <h2>4. 資料大小與碎片分析</h2>
  <div class="metric-description">
    <p>此部分分析各主鍵策略對儲存空間使用效率的影響。碎片是指資料庫頁面中未被充分利用的空間，通常由於頻繁的插入、刪除和更新操作造成，
    尤其是使用隨機UUID主鍵時，頁面分裂更為頻繁，導致更高的碎片率。
    高碎片率會導致更多的磁碟空間浪費、較低的緩存命中率，並可能降低整體資料庫性能。</p>
  </div>
  
  <h3>PostgreSQL 表大小分析</h3>
  <div class="metric-description">
    <p><strong>表名稱</strong>：資料表名稱<br>
    <strong>總大小</strong>：包含資料和所有索引的總大小<br>
    <strong>資料大小</strong>：僅資料所佔用的空間<br>
    <strong>索引大小</strong>：所有索引佔用的空間<br>
    <strong>資料佔比</strong>：資料大小佔總大小的百分比<br>
    <strong>死元組數</strong>：已刪除但尚未清理的記錄數，高值表示可能需要VACUUM</p>
  </div>
  <div class="pg-size-table">
    ${
      pgIndexAnalysis.length > 0
        ? `
    <h4>索引大小分析</h4>
    <table>
      <thead>
        <tr>
          <th>索引名稱</th>
          <th>大小</th>
          <th>位元組數</th>
        </tr>
      </thead>
      <tbody>
        ${pgIndexAnalysis
          .map(
            (row) => `
        <tr>
          <td>${row.索引名稱}</td>
          <td>${row.大小}</td>
          <td>${row.位元組數}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    `
        : ""
    }
    ${
      pgTableAnalysis.length > 0
        ? `
    <h4>表大小與空間分析</h4>
    <table>
      <thead>
        <tr>
          <th>表名稱</th>
          <th>總大小</th>
          <th>資料大小</th>
          <th>索引大小</th>
          <th>資料佔比</th>
          <th>死元組數</th>
        </tr>
      </thead>
      <tbody>
        ${pgTableAnalysis
          .map(
            (row) => `
        <tr>
          <td>${row.表名稱}</td>
          <td>${row.總大小}</td>
          <td>${row.資料大小}</td>
          <td>${row.索引大小}</td>
          <td>${row.資料佔比}</td>
          <td>${row.死元組數}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    `
        : "<p>沒有 PostgreSQL 表大小分析數據</p>"
    }
  </div>

  <h3>MySQL 表大小與碎片分析</h3>
  <div class="metric-description">
    <p><strong>表大小分析</strong><br>
    <strong>表名稱</strong>：資料表名稱<br>
    <strong>資料大小</strong>：表中資料所佔空間<br>
    <strong>索引大小</strong>：索引所佔空間<br>
    <strong>總大小</strong>：資料和索引的總大小<br>
    <strong>總位元組數</strong>：總大小的精確位元組計數</p>
    
    <p><strong>碎片分析</strong><br>
    <strong>表名稱</strong>：資料表名稱<br>
    <strong>資料大小</strong>：實際資料佔用的空間<br>
    <strong>索引大小</strong>：索引結構佔用的空間<br>
    <strong>空閒空間</strong>：表中未使用的空間總量（包含 InnoDB 預分配）<br>
    <strong>總分配空間</strong>：資料庫實際分配的總空間<br>
    <strong>碎片百分比</strong>：空閒空間佔總分配空間的比例，較高值表示較低的儲存效率</p>
  </div>
  <div class="mysql-size-table">
    ${
      mysqlTableAnalysis.length > 0
        ? `
    <h4>表大小分析</h4>
    <table>
      <thead>
        <tr>
          <th>表名稱</th>
          <th>資料大小</th>
          <th>索引大小</th>
          <th>總大小</th>
          <th>行數</th>
          <th>平均行大小</th>
          <th>總位元組數</th>
        </tr>
      </thead>
      <tbody>
        ${mysqlTableAnalysis
          .map(
            (row) => `
        <tr>
          <td>${row.表名稱}</td>
          <td>${row.資料大小}</td>
          <td>${row.索引大小}</td>
          <td>${row.總大小}</td>
          <td>${row.行數}</td>
          <td>${row.平均行大小}</td>
          <td>${row.總位元組數}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <h4>碎片分析</h4>
    <table>
      <thead>
        <tr>
          <th>表名稱</th>
          <th>資料大小</th>
          <th>索引大小</th>
          <th>空閒空間</th>
          <th>總分配空間</th>
          <th>碎片百分比</th>
          <th>說明</th>
        </tr>
      </thead>
      <tbody>
        ${mysqlFragAnalysis
          .map(
            (row) => `
        <tr>
          <td>${row.表名稱}</td>
          <td>${row.資料大小}</td>
          <td>${row.索引大小}</td>
          <td>${row.空閒空間}</td>
          <td>${row.總分配空間}</td>
          <td>${row.碎片百分比}</td>
          <td>${row.說明}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    `
        : "<p>沒有 MySQL 表大小與碎片分析數據</p>"
    }
  </div>

  <h3>SQL Server 表大小與碎片分析</h3>
  <div class="metric-description">
    <p><strong>索引大小分析</strong><br>
    <strong>索引名稱</strong>：索引的名稱<br>
    <strong>表名稱</strong>：資料表名稱<br>
    <strong>索引類型</strong>：索引的類型，如叢集索引（CLUSTERED）或非叢集索引（NONCLUSTERED）<br>
    <strong>大小</strong>：索引佔用的空間</p>
    
    <p><strong>碎片分析</strong><br>
    <strong>表名稱</strong>：資料表名稱<br>
    <strong>索引ID</strong>：索引的唯一識別碼<br>
    <strong>索引類型</strong>：索引的類型<br>
    <strong>碎片百分比</strong>：索引中的碎片比例，高值表示索引需要重建或重組</p>
  </div>
  <div class="mssql-size-table">
    ${
      mssqlSizeAnalysis.length > 0
        ? `
    <h4>索引大小分析</h4>
    <table>
      <thead>
        <tr>
          <th>索引名稱</th>
          <th>表名稱</th>
          <th>索引類型</th>
          <th>大小</th>
          <th>位元組數</th>
        </tr>
      </thead>
      <tbody>
        ${mssqlSizeAnalysis
          .map(
            (row) => `
        <tr>
          <td>${row.索引名稱}</td>
          <td>${row.表名稱}</td>
          <td>${row.索引類型}</td>
          <td>${row.大小}</td>
          <td>${row.位元組數}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <h4>碎片分析</h4>
    <table>
      <thead>
        <tr>
          <th>表名稱</th>
          <th>索引ID</th>
          <th>索引類型</th>
          <th>碎片百分比</th>
          <th>碎片數量</th>
          <th>頁數</th>
          <th>記錄數</th>
        </tr>
      </thead>
      <tbody>
        ${mssqlFragAnalysis
          .map(
            (row) => `
        <tr>
          <td>${row.表名稱}</td>
          <td>${row.索引ID}</td>
          <td>${row.索引類型}</td>
          <td>${row.碎片百分比}</td>
          <td>${row.碎片數量}</td>
          <td>${row.頁數}</td>
          <td>${row.記錄數}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    `
        : "<p>沒有 SQL Server 表大小與碎片分析數據</p>"
    }
  </div>
  </div>

  <div class="footer">
    <p>此報告由基準測試框架自動生成 | ${
      new Date().toISOString().split("T")[0]
    }</p>
  </div>

  <script>
    // 插入效能圖表
    new Chart(document.getElementById('insertChart'), {
      type: 'bar',
      data: {
        labels: ['自增整數', '隨機 UUID (v4)', '時間序 UUID (v7)'],
        datasets: [
          {
            label: 'PostgreSQL 16',
            data: [${insertCompare.map((item) => item.pg).join(", ")}],
            backgroundColor: 'rgba(66, 133, 244, 0.7)',
            borderColor: 'rgb(66, 133, 244)',
            borderWidth: 1
          },
          {
            label: 'MySQL 8.4 (InnoDB)',
            data: [${insertCompare.map((item) => item.mysql).join(", ")}],
            backgroundColor: 'rgba(219, 68, 55, 0.7)',
            borderColor: 'rgb(219, 68, 55)',
            borderWidth: 1
          },
          {
            label: 'SQL Server 2022',
            data: [${insertCompare.map((item) => item.mssql).join(", ")}],
            backgroundColor: 'rgba(15, 157, 88, 0.7)',
            borderColor: 'rgb(15, 157, 88)',
            borderWidth: 1
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: '插入效能比較 (每秒插入行數，越高越好)'
          },
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '每秒插入行數'
            }
          },
          x: {
            title: {
              display: true,
              text: '主鍵類型'
            }
          }
        }
      }
    });

    // 主鍵查詢效能圖表
    new Chart(document.getElementById('lookupChart'), {
      type: 'bar',
      data: {
        labels: ['自增整數', '隨機 UUID (v4)', '時間序 UUID (v7)'],
        datasets: [
          {
            label: 'PostgreSQL 16',
            data: [${lookupCompare.map((item) => item.pg).join(", ")}],
            backgroundColor: 'rgba(66, 133, 244, 0.7)',
            borderColor: 'rgb(66, 133, 244)',
            borderWidth: 1
          },
          {
            label: 'MySQL 8.4 (InnoDB)',
            data: [${lookupCompare.map((item) => item.mysql).join(", ")}],
            backgroundColor: 'rgba(219, 68, 55, 0.7)',
            borderColor: 'rgb(219, 68, 55)',
            borderWidth: 1
          },
          {
            label: 'SQL Server 2022',
            data: [${lookupCompare.map((item) => item.mssql).join(", ")}],
            backgroundColor: 'rgba(15, 157, 88, 0.7)',
            borderColor: 'rgb(15, 157, 88)',
            borderWidth: 1
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: '主鍵查詢效能比較 (每秒查詢次數，越高越好)'
          },
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '每秒查詢次數'
            }
          },
          x: {
            title: {
              display: true,
              text: '主鍵類型'
            }
          }
        }
      }
    });

    // 範圍查詢效能圖表
    new Chart(document.getElementById('rangeChart'), {
      type: 'bar',
      data: {
        labels: ['自增整數', '隨機 UUID (v4)', '時間序 UUID (v7)'],
        datasets: [
          {
            label: 'PostgreSQL 16',
            data: [${rangeCompare.map((item) => item.pg).join(", ")}],
            backgroundColor: 'rgba(66, 133, 244, 0.7)',
            borderColor: 'rgb(66, 133, 244)',
            borderWidth: 1
          },
          {
            label: 'MySQL 8.4 (InnoDB)',
            data: [${rangeCompare.map((item) => item.mysql).join(", ")}],
            backgroundColor: 'rgba(219, 68, 55, 0.7)',
            borderColor: 'rgb(219, 68, 55)',
            borderWidth: 1
          },
          {
            label: 'SQL Server 2022',
            data: [${rangeCompare.map((item) => item.mssql).join(", ")}],
            backgroundColor: 'rgba(15, 157, 88, 0.7)',
            borderColor: 'rgb(15, 157, 88)',
            borderWidth: 1
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: '範圍查詢效能比較 (毫秒，越低越好)'
          },
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '查詢時間 (毫秒)'
            }
          },
          x: {
            title: {
              display: true,
              text: '主鍵類型'
            }
          }
        }
      }
    });
  </script>
</body>
</html>`;

    // 寫入 HTML 檔案
    await fs.writeFile(this.reportPath, htmlContent);
    console.log(`\n✅ HTML 報告已生成：${this.reportPath}`);

    return this.reportPath;
  }
}
