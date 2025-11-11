# React-2025 架構設計文件

## 專案概述

`React-2025` 是一個基於 React + TypeScript + Vite 的前端應用程式，採用現代化的前端開發架構，支援國際化、資料查詢管理、以及模組化的功能開發。

## 技術棧

### 核心框架

- **React 19.2.0** - UI 框架
- **TypeScript 5.9.3** - 型別安全
- **Vite 7.1.7** - 建置工具與開發伺服器

### 路由與導航

- **react-router-dom 6.30.1** - 路由管理，支援 lazy loading

### 狀態管理與資料查詢

- **@tanstack/react-query 5.90.5** - 伺服器狀態管理、快取、重試機制
- **axios 1.12.2** - HTTP 客戶端

### UI 框架與樣式

- **Tailwind CSS 4.1.14** - 原子化 CSS 框架
- **shadcn/ui** - UI 元件庫（基於 Radix UI，包含無障礙支援、變體管理、圖標等）

### 國際化

- **i18next 25.6.0** - 國際化框架
- **react-i18next 16.1.0** - React 整合

### 其他工具

- **react-helmet-async** - SEO 與 meta 標籤管理
- **zod 4.1.12** - 執行時期型別驗證與 schema 定義

## 目錄結構

```
frontend-frontstage/
├── src/
│   ├── apis/                    # API 層
│   │   ├── api-client.ts        # Axios 實例與攔截器
│   │   └── example-user.ts      # API 端點範例（使用 React Query）
│   ├── assets/                  # 靜態資源
│   ├── components/              # 共用元件
│   │   └── ui/                  # UI 基礎元件（shadcn/ui）
│   │       ├── button.tsx
│   │       ├── Select.tsx
│   │       └── Switch.tsx
│   ├── features/                # 功能模組（Feature-based）
│   │   └── settings/            # 設定功能模組
│   │       ├── components/      # 功能專屬元件
│   │       ├── hooks/          # 功能專屬 hooks
│   │       ├── types.ts        # 功能型別定義
│   │       ├── index.tsx       # 功能入口
│   │       └── utlis/          # 功能工具函數
│   ├── layouts/                 # 佈局元件
│   │   └── BasicLayout.tsx     # 基礎佈局（側邊欄 + 主內容區）
│   ├── lib/                     # 共用工具函數
│   ├── locales/                 # 國際化資源
│   │   ├── en/
│   │   └── zh-TW/
│   ├── pages/                   # 頁面元件
│   │   ├── Chat.tsx
│   │   └── SettingsPage.tsx
│   ├── routes/                  # 路由配置
│   │   └── index.tsx           # 路由定義
│   ├── App.tsx                  # 根元件
│   ├── main.tsx                 # 應用程式入口
│   ├── i18n.ts                  # i18n 設定
│   └── globals.css              # 全域樣式
├── public/                      # 公開靜態資源
├── docker/                      # Docker 配置
├── vite.config.ts               # Vite 設定
├── tsconfig.json                # TypeScript 設定
└── components.json              # shadcn/ui 配置
```

## 核心架構設計

### 1. 應用程式初始化流程

```
main.tsx
  ├── QueryClientProvider (React Query)
  ├── HelmetProvider (SEO)
  └── App
      └── RouterProvider (React Router)
          └── BasicLayout
              └── Pages (lazy loaded)
```

### 2. API 層設計

#### API Client (`apis/api-client.ts`)

- 統一的 Axios 實例，設定 `baseURL` 和 `withCredentials`
- **請求攔截器**：自動附加認證資訊
- **回應攔截器**：
  - 自動處理 401 未授權（導向登入頁）
  - 標準化錯誤格式為 `AppError`
  - 自動提取 `response.data`

#### API 端點設計模式

每個 API 端點模組包含：

- **Schema 定義**：使用 Zod 定義回應資料結構
- **API 函數**：純函數，執行 API 呼叫並驗證回應
- **React Query Hook**：封裝資料查詢邏輯（快取、重試等）

範例：`apis/example-user.ts`

```typescript
// Schema 定義
const schema = z.object({ ... })

// API 函數
const getUserInfo = async () => { ... }

// React Query Hook
const useUserInfo = () => useQuery({ ... })
```

### 3. 路由設計

- 使用 `react-router-dom` 的 `createBrowserRouter`
- 支援 **lazy loading** 降低初始載入時間
- 路由結構：
  - `/` → 重導向至 `/chat`
  - `/chat` → Chat 頁面
  - `/settings` → 設定頁面
- 所有路由包裹在 `BasicLayout` 中

### 4. 頁面元件設計（Pages）

`pages/` 資料夾存放路由對應的頁面元件，每個頁面元件負責：

- **路由層級狀態管理**：使用 React Context 管理頁面層級的狀態（如頁面特定的 UI 狀態、表單狀態等）
- **功能模組組合**：整合多個 `features/` 中的功能模組

設計原則：

- 頁面元件應保持輕量，主要作為功能模組的組合層
- 頁面專屬的 Context Provider 應放在對應的頁面元件中
- 頁面元件直接對應路由，可被 `routes/index.tsx` 中的路由配置 lazy load

範例：`pages/SettingsPage.tsx`

- 引入 `features/settings` 功能模組
- 可在此處放置設定頁面的 Context Provider（如需頁面層級狀態管理）

### 5. 功能模組設計（Feature-based Architecture）

採用 **Feature-based** 架構，每個功能模組獨立管理：

- `components/` - 功能專屬元件
- `hooks/` - 功能專屬 hooks
- `types.ts` - 功能型別定義
- `index.tsx` - 功能入口（可被多個頁面重用）

範例：`features/settings/`

- 獨立的設定功能模組
- 可被 `pages/SettingsPage.tsx` 直接引入使用
- 模組內包含多個子元件（如 `ExecutionPreferencesSwitch`、`ResponsePreferencesSwitch`）

### 6. 佈局系統

#### BasicLayout

- **側邊欄**：固定寬度 252px，可透過 `sidebar` prop 自訂內容
- **主內容區**：使用 `Outlet` 渲染子路由頁面
- 響應式設計，使用 Tailwind CSS 的 flexbox 佈局

### 7. 國際化設計

- 使用 `i18next` + `react-i18next`
- 支援語言：
  - `en` (英文)
  - `zh-TW` (繁體中文)
- 預設語言從 `localStorage.getItem('userLanguage')` 讀取，預設為 `zh-TW`
- 翻譯檔案位於 `locales/{lang}/common.json`

### 8. 狀態管理策略

#### 伺服器狀態

- 使用 **React Query** 管理所有伺服器狀態
- 自動處理快取、重試、背景更新
- 支援開發工具 `ReactQueryDevtools`

#### 客戶端狀態

- 簡單狀態使用 React `useState`
- 複雜狀態使用 Context API

### 9. 型別安全設計

- **TypeScript** 提供編譯時期型別檢查
- **Zod** 提供執行時期型別驗證
- API 回應使用 Zod schema 驗證，確保資料結構正確
- 型別從 schema 推導，保持型別與驗證邏輯一致

## 設計模式與最佳實踐

### 1. 元件設計模式

#### UI 基礎元件

- 使用 **shadcn/ui** 作為 UI 元件庫，基於 Radix UI 提供無障礙支援
- 使用 `cn()` 函數（`lib/utils.ts`）合併 Tailwind 類別

#### 功能元件

- 每個功能模組的元件放在 `features/{feature}/components/`
- 共用元件放在 `components/ui/`

### 2. 路徑別名

使用 TypeScript path mapping：

- `@/*` → `./src/*`
- 在 Vite 設定中對應 `resolve.alias`

### 3. 環境變數

- `VITE_API_URL` - API 基礎 URL
- `VITE_TITLE_NAME` - 應用程式標題

### 4. 錯誤處理

- API 層統一錯誤處理（`api-client.ts`）
- 標準化錯誤格式 `AppError`
- 401 錯誤自動導向登入頁

### 5. 開發工具整合

- **ESLint** - 程式碼檢查
- **Prettier** - 程式碼格式化，有加入 `prettier-plugin-tailwindcss` 自動排序 Tailwind CSS 類別
- **React Query Devtools** - 開發時狀態除錯
- **TypeScript** - 型別檢查

## 開發規範

### 檔案命名

- 元件(Component)檔案：PascalCase（如 `BasicLayout.tsx`）
- 工具函數：camelCase（如 `utils.ts`）
- API 檔案：camelCase（如 `api-client.ts`）

## 未來擴展方向

1. 狀態管理：考慮引入 Zustand 處理複雜客戶端狀態
2. 表單處理：考慮引入 React Hook Form + Zod
3. 測試：加入 Vitest + React Testing Library
4. nuqs：考慮導入 nuqs 處理 URL 查詢參數，同步組件狀態與 URL，實現狀態可分享與持久化

## 相關檔案

- `package.json` - 依賴套件清單
- `vite.config.ts` - Vite 建置設定
- `tsconfig.json` - TypeScript 設定
- `components.json` - UI 元件庫配置
