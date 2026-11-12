# 第一次看重訓課表，要看懂哪些數字？

雙擊 [index.html](index.html) 可離線閱讀九頁教材。用上一頁、下一頁或鍵盤左右鍵翻頁，最後點「揭曉答案與理由」。引文指向同一個專案裡的 Wiki 筆記。

## 從專案根目錄重跑

1. 安裝 Node.js 22 或以上，以及 Edge、Chrome 或 Chromium。若瀏覽器在其他位置，把可執行檔完整路徑放進環境變數 `SLIDES_BROWSER`。程式使用 Node 內建模組，無需 npm 套件。
2. 將 OpenAI API 金鑰放進環境變數 `OPENAI_API_KEY`，並把帳號可呼叫、支援 Responses API 和 JSON object 輸出的模型 ID 放進 `OPENAI_MODEL`。正式跑的生成與檢查都用該模型。可先在帳戶的模型清單確認可用 ID。
3. 執行以下命令。每次都會重新讀 Wiki、呼叫模型生成九頁、再呼叫模型逐頁審查。API 會收到當前 Wiki Markdown 和假設教材資料。瀏覽器本機測試需要允許啟動子程序。

```powershell
node slides/build.mjs
```

[OpenAI Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)

## 產物與檢查分工

| 產物 | 內容 |
|---|---|
| `slides/index.html` | 通過發布門檻的版本，內嵌 CSS 和 JavaScript |
| `slides/runs/<執行目錄>/draft.json` | 本次逐頁初稿與共用假設紀錄 |
| 同目錄 `checked.json`、`*-repair-*.json` | 通過頁面和單頁修正草稿 |
| 同目錄 `run.json`、`pending.json` | Wiki 檔案、段落、雜湊、每次檢查理由、瀏覽器結果和待修清單 |

- **程式**核對穩定頁 ID、假設標記、主張欄、引用檔案及段落。用同一份紀錄渲染表格、週組數、頻率與測驗答案，數值由程式計算。
- **AI**逐項查比較組、測量結果、限制與假設情境是否混用，也檢查正文是否有未引用的研究敘述。AI 有足夠證據時只重生出錯的頁，最多兩次。證據不足會暫停該頁，其他頁繼續檢查。
- **瀏覽器**從本機開啟暫存 HTML，執行點擊、左右鍵、頁碼和答案揭曉測試。遇到瀏覽器環境問題，調整 `SLIDES_BROWSER` 或啟動權限後重測。遇到版面或操作問題，修正輸出節點的程式或樣式後重跑。任何未通過的執行都保留現有正式頁。
- `--session` 只用於重現本次對話中的 Codex 草稿及證據審查。它不呼叫模型 API。`--test` 注入不存在的引文，驗證程式擋下單頁、耗盡兩次修正後保留現有版本。

[流程圖](flow.md) · [執行與反思](execution.md)
