/**
 * 資料庫基準測試基礎抽象類別
 * 定義所有資料庫測試類別必須實現的介面
 */

/**
 * 基準測試階段定義
 * @typedef {Object} TestPhase
 * @property {string} name - 測試階段名稱
 * @property {string} table - 要測試的資料表名稱
 * @property {string} description - 測試階段描述
 * @property {Function} gen - 生成插入資料的函數
 */

/**
 * 基準測試結果定義
 * @typedef {Object} TestResult
 * @property {Object} results - 各階段的測試結果
 * @property {Array} sizes - 索引大小資訊
 * @property {Array} fragmentation - 碎片分析資訊
 */

/**
 * 資料庫測試抽象基類
 * 提供基本的測試方法結構和共用邏輯
 */
export class DatabaseBenchmark {
  /**
   * 建構函數
   * @param {Object} config - 測試配置
   * @param {number} config.ROWS - 測試資料行數
   * @param {number} config.BATCH - 每批次插入的行數
   * @param {number} config.RUNS - 測試執行輪數
   * @param {number} config.WARMUP - 預熱資料量
   * @param {Function} formatNumber - 數字格式化函數
   */
  constructor(config, formatNumber) {
    this.config = config;
    this.formatNumber = formatNumber;
    this.testName = "AbstractDatabase";
    this.payload = "x".repeat(64);
  }

  /**
   * 通用測量執行時間的方法
   * 重複執行多次並計算平均值，避免測量誤差
   *
   * @param {Function} execFn - 要測量的執行函數
   * @param {Function} preFn - 每次執行前的準備函數（可選）
   * @param {number} repetitions - 重複執行次數（預設 5 次）
   * @returns {number} 平均執行時間（毫秒）
   */
  async measurePerformance(execFn, preFn = null, repetitions = 5) {
    let totalMs = 0;
    const times = [];

    for (let i = 0; i < repetitions; i++) {
      // 執行前置操作（如清除快取）
      if (preFn) {
        await preFn();
      }

      // 使用高精度計時
      const startTime =
        typeof performance !== "undefined" ? performance.now() : Date.now();

      // 執行測量函數
      await execFn();

      // 計算執行時間
      const endTime =
        typeof performance !== "undefined" ? performance.now() : Date.now();

      const iterTime = endTime - startTime;
      times.push(iterTime);
      totalMs += iterTime;
    }

    // 計算平均執行時間（保留小數，不強制最小值）
    const avgTime = totalMs / repetitions;

    // 調試信息
    console.log(
      `      ⏱️  執行時間詳情：${repetitions} 次重複，各次時間 [${times
        .map((t) => t.toFixed(2))
        .join(", ")}] ms，平均 ${avgTime.toFixed(2)} ms`
    );

    return avgTime;
  }

  /**
   * 準確測量範圍查詢的執行時間
   * 重複執行多次並計算平均值，避免測量誤差
   *
   * @param {Function} queryFn - 執行範圍查詢的函數
   * @param {Function} preFn - 每次查詢前執行的函數（可選，用於清除快取等）
   * @returns {number} 範圍查詢的平均執行時間（毫秒）
   */
  async measureRangeQuery(queryFn, preFn = null) {
    return this.measurePerformance(queryFn, preFn);
  }

  /**
   * 測量點查詢效能
   * 對多個 ID 執行點查詢並計算平均時間
   *
   * @param {Function} lookupFn - 對單個 ID 執行點查詢的函數
   * @param {Array} ids - 要查詢的 ID 列表
   * @param {Function} preFn - 每次查詢前執行的函數（可選）
   * @returns {Object} 包含毫秒數和每秒查詢數的結果物件
   */
  async measureLookupQueries(lookupFn, ids, preFn = null) {
    // 對每個 ID 執行查詢的包裝函數
    const queryAllFn = async () => {
      for (const id of ids) {
        await lookupFn(id);
      }
    };

    // 測量執行時間
    const ms = await this.measurePerformance(queryAllFn, preFn, 3);

    // 計算每秒查詢數（使用更精確的時間）
    const queriesPerSec = Math.round(ids.length / (ms / 1000));

    // 調試信息
    console.log(
      `    🔍 調試：查詢 ${ids.length} 個ID，平均耗時 ${ms.toFixed(
        2
      )} ms，每秒 ${queriesPerSec} 查詢`
    );

    return {
      lookupMs: Math.round(ms * 100) / 100, // 保留兩位小數
      lookupPerSec: queriesPerSec,
    };
  }

  /**
   * 測量批次插入效能
   *
   * @param {Function} batchInsertFn - 執行一批次插入的函數
   * @param {number} totalRows - 總行數
   * @param {number} batchSize - 每批次大小
   * @returns {Object} 包含毫秒數和每秒插入行數的結果物件
   */
  async measureBatchInsert(batchInsertFn, totalRows, batchSize) {
    const insertAllFn = async () => {
      for (let i = 0; i < totalRows; i += batchSize) {
        const currentBatchSize = Math.min(batchSize, totalRows - i);
        await batchInsertFn(i, currentBatchSize);
      }
    };

    // 執行一次即可，插入操作較慢，不需要多次測量
    const ms = await this.measurePerformance(insertAllFn, null, 1);

    return {
      insertMs: ms,
      insertRowsPerSec: Math.round(totalRows / (ms / 1000)),
    };
  }

  /**
   * 計算用於點查詢測試的 ID 數量
   * 統一各資料庫的 lookupCount 計算邏輯
   *
   * @returns {number} 查詢測試使用的 ID 數量
   */
  getLookupCount() {
    // 統一設定：使用 BATCH 的 1/10，最少 100 個，最多 1000 個
    return Math.min(1000, Math.max(100, Math.floor(this.config.BATCH / 10)));
  }

  /**
   * 取得範圍查詢的限制
   * 調整為更大的範圍以顯示差異
   * @returns {number} 範圍查詢的行數限制
   */
  getRangeLimit() {
    // 使用較大的範圍來顯示自增 ID vs UUID 的差異
    // 設定為總行數的 20% 或至少 1000 行
    const targetSize = Math.max(Math.floor(this.config.ROWS * 0.2), 1000);
    return Math.min(targetSize, this.config.ROWS);
  }
  /**
   * 取得隨機 ID 樣本的通用方法
   * 子類別可以覆寫此方法以實現資料庫特定的 ID 取得邏輯
   *
   * @param {TestPhase} phase - 當前測試階段
   * @param {number} sampleSize - 需要的樣本大小
   * @returns {Promise<Array>} ID 陣列
   */
  async getRandomIds(phase, sampleSize) {
    throw new Error("子類別必須實現 getRandomIds() 方法");
  }

  /**
   * 取得測試階段定義 (子類別必須覆寫)
   * @returns {Array<TestPhase>} 測試階段定義陣列
   */
  getPhases() {
    throw new Error("子類別必須實現 getPhases() 方法");
  }

  /**
   * 連接到資料庫 (子類別必須覆寫)
   * @returns {Promise<any>} 資料庫連接物件
   */
  async connect() {
    throw new Error("子類別必須實現 connect() 方法");
  }

  /**
   * 初始化資料庫結構 (子類別必須覆寫)
   * @returns {Promise<void>}
   */
  async initialize() {
    throw new Error("子類別必須實現 initialize() 方法");
  }

  /**
   * 執行預熱階段 (子類別必須覆寫)
   * @param {Array<TestPhase>} phases - 測試階段定義陣列
   * @returns {Promise<void>}
   */
  async warmup(phases) {
    throw new Error("子類別必須實現 warmup() 方法");
  }

  /**
   * 執行插入測試 (子類別必須覆寫)
   * @param {TestPhase} phase - 當前測試階段
   * @returns {Promise<Object>} 測試結果
   */
  async testInsert(phase) {
    throw new Error("子類別必須實現 testInsert() 方法");
  }

  /**
   * 執行查詢測試 (子類別必須覆寫)
   * @param {TestPhase} phase - 當前測試階段
   * @param {Object} insertResults - 插入測試的結果
   * @returns {Promise<Object>} 測試結果
   */
  async testQuery(phase, insertResults) {
    throw new Error("子類別必須實現 testQuery() 方法");
  }

  /**
   * 收集空間使用統計 (子類別必須覆寫)
   * @returns {Promise<Object>} 空間使用統計
   */
  async collectStats() {
    throw new Error("子類別必須實現 collectStats() 方法");
  }

  /**
   * 關閉資料庫連接 (子類別必須覆寫)
   * @returns {Promise<void>}
   */
  async close() {
    throw new Error("子類別必須實現 close() 方法");
  }

  /**
   * 執行所有測試
   * @returns {Promise<TestResult>} 測試結果
   */
  async runBenchmark() {
    console.log(`\n===== ${this.testName} 基準測試 =====`);

    try {
      // 連接到資料庫
      await this.connect();

      // 初始化資料庫結構
      await this.initialize();

      // 取得測試階段定義
      const phases = this.getPhases();

      // 預熱階段
      console.log(`📊 進行 ${this.testName} 預熱...`);
      await this.warmup(phases);

      // 執行測試
      const results = {};
      for (const phase of phases) {
        // 插入測試
        console.log(`\n⏱️  測試 ${phase.description} 寫入效能...`);
        results[phase.name] = await this.testInsert(phase);

        // 查詢測試
        console.log(`\n🔍 測試 ${phase.description} 讀取效能...`);
        await this.testQuery(phase, results[phase.name]);
      }

      // 收集統計資訊
      console.log(`\n📊 ${this.testName} 空間使用分析`);
      const stats = await this.collectStats();

      // 關閉資料庫連接
      await this.close();

      console.log(`\n✅ ${this.testName} 測試完成`);

      // 返回測試結果
      return {
        results,
        ...stats,
      };
    } catch (error) {
      console.error(`\n❌ ${this.testName} 測試失敗:`, error);
      throw error;
    }
  }
}
