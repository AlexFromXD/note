/**
 * 設定解析模組 - 處理命令列參數
 */

/**
 * 從命令列參數解析設定
 * @returns {Object} 包含測試設定的物件
 */
export function parseConfig() {
  const ROWS = parseInt(
    (
      process.argv.find((a) => a.startsWith("--rows=")) || "--rows=200000"
    ).split("=")[1],
    10
  );
  const BATCH = parseInt(
    (
      process.argv.find((a) => a.startsWith("--batch=")) || "--batch=1000"
    ).split("=")[1],
    10
  );
  const RUNS = parseInt(
    (process.argv.find((a) => a.startsWith("--runs=")) || "--runs=3").split(
      "="
    )[1],
    10
  );
  const WARMUP = parseInt(
    (
      process.argv.find((a) => a.startsWith("--warmup=")) || "--warmup=1000"
    ).split("=")[1],
    10
  );

  return {
    ROWS,
    BATCH,
    RUNS,
    WARMUP,
  };
}

/**
 * 顯示測試配置資訊
 * @param {Object} config - 測試配置物件
 * @param {function} formatNumber - 數字格式化函數
 */
export function displayConfig(config, formatNumber) {
  const { ROWS, BATCH, RUNS, WARMUP } = config;

  console.log("\n🚀 開始 UUID vs. Serial 基準測試");
  console.log(`📋 測試配置：`);
  console.log(`  • 資料量: ${formatNumber(ROWS)} 行`);
  console.log(`  • 批次大小: ${formatNumber(BATCH)} 行`);
  console.log(`  • 測試輪數: ${RUNS} 輪`);
  console.log(`  • 預熱資料量: ${formatNumber(WARMUP)} 行`);
}
