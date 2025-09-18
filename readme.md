# 📊 申請報表系統前端專案

本專案為報表上傳、查詢與審核平台的 **前端專案**，使用 **React + MUI** 開發，並整合後端 API、提供友善的 UX 流程與錯誤處理。

---

## 🛠️ 技術架構

| 技術               | 說明                                     |
| ------------------ | ---------------------------------------- |
| React              | 前端主框架（function component + hooks） |
| React Router       | 管理頁面路                               |
| MUI (Material UI)  | UI 元件庫，統一頁面風格                  |
| JavaScript（可選） | 若專案啟用 JS，可更安全維護型別          |
| Context API        | 管理全域 loading 與錯誤彈窗              |

---

## 📁 專案結構

```bash
src/
├── api/                   # API 方法（封裝 fetch + 錯誤處理）
├── components/            # 可重用元件（如 ErrorPopup, DetailPopup）
├── constants/             # 錯誤代碼對照表等常數
├── context/               # LoadingContext、ErrorContext 等
├── pages/                 # 各個功能頁面
├── assets/                # 圖片、LOGO、loading 動畫等
└── App.js                 # App 進入點（含 context provider 包裝）
```
---

## 🔐錯誤代碼對照表

| 錯誤碼 | 說明                 |
| ------ | -------------------- |
| 0000   | 成功                 |
| 0001   | 查無資料             |
| 0002   | 檢核錯誤             |
| 0003   | 您無此權限           |
| 0004   | 此案件已審核         |
| 0005   | 此案件已駁回         |
| 0006   | 該報表已有待審核案件 |
| 0007   | 申報失敗             |
| 0008   | 申報異常，待批次重送 |
| 9998   | 金鑰驗證失敗         |
| 9999   | 系統異常             |
🔎 對照表定義於：/constants/errorMessages.js

## ▶️開發指令
```javascript
npm install        # 安裝依賴
npm run dev        # 啟動開發伺服器
npm run build      # 打包專案（預設使用 Vite）
```

## 📌 注意事項
所有 API 請求需自動附帶：

empNo（從 sessionStorage 取得）

X-API-KEY（從 sessionStorage 取得）

若缺少這些資訊，將會自動顯示錯誤彈窗

上傳報表僅支援 Excel 檔案格式，且需符合後端檢核規則

## 📌 Maintainer
如需協助或有建議，請都不要聯絡開發者，全部都去找許副科。