# 部署指南

這份指南將幫你一步步部署「合約檔案查詢系統」到 Vercel（免費）。

## 選項 A：使用 Vercel CLI（最快速）

### 步驟 1：安裝 Vercel CLI

```bash
npm install -g vercel
```

### 步驟 2：登入 Vercel

```bash
vercel login
```

會開啟瀏覽器要求你登入或註冊 Vercel 帳號。

### 步驟 3：部署

在 `contract-finder` 資料夾中執行：

```bash
vercel
```

根據提示：
- 選擇「Y」確認部署
- 選擇「New Project」或繫結現有專案
- 確認設定

部署完成後，你會看到類似的 URL：
```
https://contract-finder-abc123.vercel.app
```

### 步驟 4：添加環境變數（可選）

如果你改變了 Google Sheet ID，需要更新環境變數：

```bash
vercel env add GOOGLE_SHEET_ID
```

然後輸入新的 Sheet ID。

---

## 選項 B：使用 GitHub + Vercel UI（推薦用於團隊）

### 步驟 1：將代碼推到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/contract-finder.git
git push -u origin main
```

### 步驟 2：在 Vercel 連接 GitHub

1. 打開 [vercel.com](https://vercel.com)
2. 登入或註冊帳號
3. 點擊「New Project」
4. 選擇「Import Git Repository」
5. 搜尋 `contract-finder` 並選擇
6. 點擊「Import」

### 步驟 3：配置設定

在「Configure Project」頁面：

**Environment Variables:**
- 添加 `GOOGLE_SHEET_ID`: `1itd22cfFXkzydebKDMK3WT_ZeQWMU9eQyDc5tmAtnUY`

**Framework Preset:** 自動選擇「Next.js」

**Root Directory:** 保持空白

### 步驟 4：部署

點擊「Deploy」按鈕

部署通常需要 2-3 分鐘。完成後，你會獲得一個公開 URL。

---

## 驗證部署

部署完成後，訪問你的 Vercel URL 並測試：

1. **搜尋功能** — 輸入關鍵字搜尋
2. **篩選功能** — 選擇不同的性質分類
3. **排序功能** — 點擊表頭排序
4. **詳情展開** — 點擊「詳情」查看完整資訊

## 後續更新

### 更新代碼（使用 CLI）

```bash
# 修改本地檔案
# 然後執行
vercel --prod
```

### 更新代碼（使用 GitHub）

只需推送到 GitHub，Vercel 會自動重新部署：

```bash
git add .
git commit -m "Update"
git push origin main
```

## 成本

✅ **完全免費！** Vercel 免費層包括：
- 無限帶寬
- 無限部署
- 自動 SSL
- 自動 CI/CD

## 常見問題

### Q: 部署後看不到資料？

**A:** 檢查以下幾點：
1. Google Sheet 是否設為「任何有連結的人都可以查看」
2. 環境變數 `GOOGLE_SHEET_ID` 是否正確
3. 在 Vercel 儀表板檢查「Deployments」和「Functions」日誌

### Q: 如何自訂網域？

**A:** 在 Vercel 專案設定中：
1. 進入「Domains」
2. 添加自訂網域（如 contracts.yourdomain.com）
3. 按照指示更新 DNS 記錄

### Q: 如何更改工作表名稱？

**A:** 編輯 `app/page.tsx`，修改這行：
```typescript
{['合約1', '合約2', '合約3'].map((sheet) => (
```

改成你的工作表名稱。

### Q: 支援 PDF 下載嗎？

**A:** 目前框架已準備好，只需：
1. 在 Google Sheet 添加「PDF URL」或「檔案 ID」欄位
2. 編輯 `components/ContractTable.tsx` 中的下載按鈕
3. 連接到 Google Drive API

詢問我如何實現這部分。

---

## 技術支援

如遇到問題，檢查：

1. **Vercel 儀表板日誌**
   - 進入專案 → Deployments → 點擊最新部署 → 查看日誌

2. **Google Sheet 存取**
   - 確認 Sheet 連結可以公開訪問：右上角「分享」→ 改為「任何有連結的人都可以查看」

3. **環境變數**
   ```bash
   vercel env pull  # 查看當前環境變數
   ```

---

祝部署順利！🚀
