# Linux Shell 練習器

**數位 IC 設計工程師專用的互動式 Linux/Bash 學習平台**

🌐 **線上使用：** https://nolencheng.github.io/linux-shell-practice/

---

## 功能特色

### 虛擬終端機
- 模擬真實 Linux 環境，預載完整 IC 設計專案結構
- 支援 40+ 常用指令：`ls`、`grep`、`awk`、`sed`、`find`、`wc`、`sort`、`git` 等
- 管道 `|`、重導向 `>`/`>>`/`2>`、glob 展開 `*.v`
- 指令歷史（↑↓ 切換）、Tab 補全

### 預載 IC 設計專案
```
design/
├── rtl/          # adder.v, multiplier.v, fsm_ctrl.v, top.v
├── tb/           # tb_adder.sv
├── scripts/      # run_sim.sh, synth.tcl, Makefile
├── reports/      # timing.rpt, area.rpt, power.rpt
└── logs/         # synth.log, sim.log
```

### 教學模式（11 大主題）
| 主題 | 內容 |
|------|------|
| Linux 基礎指令 | 目錄導覽、檔案操作、權限管理 |
| 文字處理核心工具 | grep、awk、sed 三神器 |
| 正則表達式 | 搭配 grep/sed/awk 的模式比對 |
| Shell 腳本撰寫 | 變數、條件、迴圈、函式 |
| 管道與重導向 | 串接指令處理複雜任務 |
| 環境變數設定 | PATH、export、.bashrc 配置 |
| 行程管理 | ps、kill、jobs，管理 EDA 工具 |
| Makefile | 定義 sim/synth/lint 建構規則 |
| Git 版本控制 | 管理 RTL 代碼、追蹤設計歷程 |
| EDA 工具腳本 | VCS 模擬、DC 合成、解析 report |

### 任務練習（20 個情境任務）
- **目錄導覽**：探索專案結構、萬用字元搜尋
- **檔案操作**：建立備份、設定腳本權限
- **文字處理**：找 Error/Warning、解析 Timing Report、提取面積功耗
- **管道組合**：三連擊管道、找最壞 timing path
- **EDA 報告分析**：生成 PPA 摘要、分析合成日誌
- **Shell 腳本**：批次處理、迴圈計算

### 指令參考手冊
- 60+ 指令，含分類篩選與搜尋
- 每個指令附 IC 設計實際應用範例
- 點擊範例直接在終端機執行

---

## 使用方式

直接在瀏覽器開啟，無需安裝任何軟體：
https://nolencheng.github.io/linux-shell-practice/

```bash
# 在虛擬終端機中試試看
ls design/
grep "Error" design/logs/synth.log
awk '/slack/{print $NF}' design/reports/timing.rpt
grep -c "Warning" design/logs/synth.log | wc -l
find design -name "*.v" -type f
```

---

## 相關工具

| 工具 | 說明 | 連結 |
|------|------|------|
| **Linux Shell 練習器** | 本工具：互動式 Linux/Bash 練習環境 | [連結](https://nolencheng.github.io/linux-shell-practice/) |
| **SystemVerilog 練習器** | 教學、測驗、實際編寫，涵蓋 SVA 與 UVM | [連結](https://nolencheng.github.io/SV-practice/) |
| **C 語言練習器** | 從基礎到指標，52 題漸進式練習，含即時編譯 | [連結](https://nolencheng.github.io/C-language-practice/) |
| **EDA TCL Script 產生器** | Synopsys 工具 TCL 腳本一鍵生成 | [連結](https://nolencheng.github.io/TCL-generator/) |
| **SVA 產生器** | SystemVerilog Assertion 自動生成（Cloudflare Workers） | [連結](https://nolen-agent.nolencheng.workers.dev/) |

---

## 技術棧

- 純 HTML/CSS/JavaScript，無框架、無依賴
- GitHub Pages 靜態部署
- 虛擬檔案系統（in-memory JavaScript）
- LocalStorage 進度追蹤
