# 合約檔案查詢系統

一個快速搜尋和篩選 Google Sheet 中合約資料的網站。

## 功能

✅ **關鍵字搜尋** — 按合約名稱、對象、編碼搜尋  
✅ **標籤分類** — 按性質篩選合約  
✅ **排序功能** — 按日期、名稱、申請人排序  
✅ **詳細資訊** — 展開查看完整合約資訊  
✅ **自動同步** — 5分鐘自動更新 Sheet 資料  
✅ **PDF 下載** — 直接下載合約 PDF 檔案  

## 快速開始

### 前置條件

- Node.js 18+ 
- npm 或 yarn

### 本地開發

1. **安裝依賴**
```bash
npm install
```

2. **配置環境變數**
```bash
cp .env.example .env.local
```

編輯 `.env.local` 檔案，確保 `GOOGLE_SHEET_ID` 是正確的：
```
GOOGLE_SHEET_ID=1itd22cfFXkzydebKDMK3WT_ZeQWMU9eQyDc5tmAtnUY
```

3. **啟動開發伺服器**
```bash
npm run dev
```

在瀏覽器打開 [http://localhost:3000](http://localhost:3000)

## 部署到 Vercel

### 方式 1：使用 Vercel CLI（推薦）

```bash
# 1. 全域安裝 Vercel CLI
npm install -g vercel

# 2. 登入 Vercel
vercel login

# 3. 在專案目錄部署
vercel
```

### 方式 2：使用 GitHub + Vercel

1. 將專案推到 GitHub
2. 在 [vercel.com](https://vercel.com) 登入
3. 點擊「New Project」，選擇你的 GitHub repo
4. 設定環境變數：
   - `GOOGLE_SHEET_ID`: `1itd22cfFXkzydebKDMK3WT_ZeQWMU9eQyDc5tmAtnUY`
5. 點擊「Deploy」

部署完成後，Vercel 會自動分配一個 URL。

## 技術棧

- **前端**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **資料源**: Google Sheets API (公開共享)
- **部署**: Vercel
- **狀態管理**: SWR (資料快取和同步)

## 架構

```
contract-finder/
├── app/
│   ├── api/contracts/       # API 路由 (獲取合約資料)
│   ├── layout.tsx           # 根佈局
│   ├── page.tsx             # 主頁面
│   └── globals.css          # 全域樣式
├── components/
│   ├── SearchBar.tsx        # 搜尋元件
│   ├── FilterTags.tsx       # 標籤篩選元件
│   └── ContractTable.tsx    # 合約表格元件
├── lib/
│   ├── types.ts             # TypeScript 類型
│   └── googleSheets.ts      # Google Sheets 工具函數
├── package.json
├── tsconfig.json
└── next.config.js
```

## API 端點

### GET `/api/contracts`

查詢合約資料

**查詢參數:**
- `sheet`: 工作表名稱 (預設: "合約1")
- `q`: 搜尋關鍵字
- `category`: 性質分類
- `sort`: 排序欄位 (date|name|applicant，預設: date)
- `order`: 排序順序 (asc|desc，預設: desc)

**例子:**
```
/api/contracts?sheet=合約1&q=採購&category=勞務&sort=date&order=desc
```

**回應:**
```json
{
  "success": true,
  "data": [
    {
      "id": "合約1-1",
      "用印日期": "2024-01-15",
      "合約名稱": "...",
      ...
    }
  ],
  "count": 10
}
```

## 環境變數

| 變數 | 說明 | 範例 |
|------|------|------|
| `GOOGLE_SHEET_ID` | Google Sheet ID | `1itd22cfFXkzydebKDMK3WT_ZeQWMU9eQyDc5tmAtnUY` |
| `GOOGLE_DRIVE_FOLDER_ID` | Google Drive 資料夾 ID (可選) | `1aRxEd4xQ0ewdnbXkyyqb7rL7CoSPZnrx` |

## 常見問題

### Q: 如何更新合約資料？
A: 直接在 Google Sheet 中編輯資料。網站會每 5 分鐘自動檢查更新。

### Q: 支援多少個工作表？
A: 目前支援 3 個工作表 (合約1、合約2、合約3)。如需修改，編輯 `app/page.tsx` 中的工作表選擇部分。

### Q: 如何添加 PDF 下載功能？
A: 在 Google Sheet 中添加一個「PDF URL」欄位，儲存 Google Drive 檔案連結。然後修改 `ContractTable.tsx` 中的下載按鈕。

## 授權

MIT
