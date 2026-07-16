const TUTORIALS = [
  {
    id: 'basics', icon: '📁', name: 'Linux 基礎指令',
    desc: '檔案系統操作、路徑、萬用字元，IC 設計日常必備',
    lessons: [
      {
        id: 'filesystem', title: '檔案系統導覽',
        content: `<h2>Linux 檔案系統結構</h2>
<p class="tut-subtitle">了解 Linux 目錄結構，以及在 IC 設計工作環境中的實際應用</p>
<h3>目錄結構概覽</h3>
<p>Linux 採用樹狀目錄結構，從根目錄 <code>/</code> 出發：</p>
<div class="code-block"><span class="cb-comment">/                    # 根目錄</span>
├── home/
│   └── user/        <span class="cb-comment"># 你的家目錄 (~)</span>
│   └── design/      <span class="cb-comment"># IC 設計專案</span>
│       ├── rtl/     <span class="cb-comment"># RTL 源碼</span>
│       ├── tb/      <span class="cb-comment"># Testbench</span>
│       ├── scripts/ <span class="cb-comment"># 腳本</span>
│       ├── reports/ <span class="cb-comment"># 報告</span>
│       └── logs/    <span class="cb-comment"># 日誌</span>
├── tmp/             <span class="cb-comment"># 暫存檔案</span>
└── usr/local/eda/   <span class="cb-comment"># EDA 工具安裝目錄</span></div>
<h3>核心導覽指令</h3>
<table class="opts-table"><thead><tr><th>指令</th><th>說明</th></tr></thead><tbody>
<tr><td>pwd</td><td>顯示目前所在路徑</td></tr>
<tr><td>ls</td><td>列出目錄內容</td></tr>
<tr><td>cd DIR</td><td>切換到目錄</td></tr>
<tr><td>cd ~</td><td>回到家目錄</td></tr>
<tr><td>cd ..</td><td>回到上一層</td></tr>
</tbody></table>
<h3>互動試試看</h3>
<button class="try-btn" onclick="tryCmdInTerminal('pwd')">pwd</button>
<button class="try-btn" onclick="tryCmdInTerminal('ls -la')">ls -la</button>
<button class="try-btn" onclick="tryCmdInTerminal('ls design/')">ls design/</button>
<button class="try-btn" onclick="tryCmdInTerminal('cd design && pwd')">cd design</button>
<div class="tut-tip">提示：這個練習器預載了一個完整的 IC 設計專案，可以直接在終端機中探索所有目錄和檔案。</div>`
      },
      {
        id: 'file-ops', title: '檔案操作',
        content: `<h2>建立、複製、移動、刪除</h2>
<p class="tut-subtitle">掌握日常檔案管理操作</p>
<h3>建立檔案與目錄</h3>
<div class="code-block"><span class="cb-prompt">$</span> mkdir -p project/rtl/submod   <span class="cb-comment"># 遞迴建立目錄</span>
<span class="cb-prompt">$</span> touch my_module.v              <span class="cb-comment"># 建立空檔案</span></div>
<h3>複製與移動</h3>
<div class="code-block"><span class="cb-prompt">$</span> cp design/rtl/adder.v ./adder_copy.v   <span class="cb-comment"># 複製檔案</span>
<span class="cb-prompt">$</span> cp -r design/ design_backup/            <span class="cb-comment"># 複製目錄</span>
<span class="cb-prompt">$</span> mv old_name.v new_name.v                <span class="cb-comment"># 重新命名</span>
<span class="cb-prompt">$</span> mv *.log logs/                          <span class="cb-comment"># 移動所有 .log 到目錄</span></div>
<h3>刪除（危險！）</h3>
<div class="code-block"><span class="cb-prompt">$</span> rm temp.v                   <span class="cb-comment"># 刪除單一檔案</span>
<span class="cb-prompt">$</span> rm *.log                    <span class="cb-comment"># 刪除所有 .log</span>
<span class="cb-prompt">$</span> rm -rf sim_out/             <span class="cb-comment"># 強制遞迴刪除目錄</span></div>
<div class="tut-warn">警告：<code>rm -rf</code> 不可還原！刪除前請確認路徑正確。在工作環境中，重要檔案應定期備份。</div>
<h3>萬用字元 (Glob)</h3>
<table class="opts-table"><thead><tr><th>符號</th><th>說明</th><th>範例</th></tr></thead><tbody>
<tr><td>*</td><td>任意數量字元</td><td>*.v 匹配所有 .v 檔</td></tr>
<tr><td>?</td><td>單一字元</td><td>?.v 匹配 a.v, b.v</td></tr>
<tr><td>[abc]</td><td>字元集合</td><td>[abc].v 匹配 a.v, b.v, c.v</td></tr>
</tbody></table>
<button class="try-btn" onclick="tryCmdInTerminal('mkdir -p workspace/test')">mkdir -p</button>
<button class="try-btn" onclick="tryCmdInTerminal('cp design/rtl/adder.v workspace/')">cp 檔案</button>
<button class="try-btn" onclick="tryCmdInTerminal('ls design/rtl/*.v')">ls *.v</button>`
      },
      {
        id: 'permissions', title: '檔案權限',
        content: `<h2>Linux 權限管理</h2>
<p class="tut-subtitle">了解 rwx 權限系統，讓腳本可執行</p>
<h3>權限格式解讀</h3>
<div class="code-block"><span class="cb-prompt">$</span> ls -la design/scripts/
-rwxr-xr-x  run_sim.sh    <span class="cb-comment"># 可執行腳本</span>
-rw-r--r--  compile.tcl   <span class="cb-comment"># 唯讀腳本</span>
drwxr-xr-x  reports/      <span class="cb-comment"># 目錄</span>
<span class="cb-comment">
# 格式：[類型][擁有者rwx][群組rwx][其他人rwx]
# d = 目錄, - = 一般檔案
# r = 讀取(4), w = 寫入(2), x = 執行(1)</span></div>
<h3>chmod 修改權限</h3>
<div class="code-block"><span class="cb-comment"># 數字方式（推薦）</span>
<span class="cb-prompt">$</span> chmod 755 run_sim.sh    <span class="cb-comment"># rwxr-xr-x (擁有者全權，其他可讀執行)</span>
<span class="cb-prompt">$</span> chmod 644 config.tcl    <span class="cb-comment"># rw-r--r-- (一般文字檔)</span>
<span class="cb-prompt">$</span> chmod 600 secret.key    <span class="cb-comment"># rw------- (私密檔案)</span>

<span class="cb-comment"># 符號方式</span>
<span class="cb-prompt">$</span> chmod +x run_sim.sh     <span class="cb-comment"># 新增執行權限（所有人）</span>
<span class="cb-prompt">$</span> chmod u+x, go-x script.sh</div>
<div class="tut-tip">IC 設計重點：所有 shell 腳本（.sh）在執行前都要 <code>chmod +x</code>，否則會出現 Permission denied 錯誤。</div>
<button class="try-btn" onclick="tryCmdInTerminal('ls -la design/scripts/')">查看權限</button>
<button class="try-btn" onclick="tryCmdInTerminal('chmod +x design/scripts/run_sim.sh')">chmod +x</button>
<button class="try-btn" onclick="tryCmdInTerminal('chmod 644 design/scripts/synth.tcl')">chmod 644</button>`
      },
    ]
  },
  {
    id: 'text', icon: '🔍', name: '文字處理核心工具',
    desc: 'grep/awk/sed 三神器，解析 timing report 和 log 檔必備',
    lessons: [
      {
        id: 'grep', title: 'grep - 強力搜尋',
        content: `<h2>grep - 行模式搜尋</h2>
<p class="tut-subtitle">IC 設計最常用工具：快速從 log 和 report 中找到關鍵資訊</p>
<h3>基本語法</h3>
<div class="code-block">grep [OPTIONS] PATTERN [FILE...]</div>
<h3>常用選項</h3>
<table class="opts-table"><thead><tr><th>選項</th><th>說明</th></tr></thead><tbody>
<tr><td>-i</td><td>忽略大小寫</td></tr>
<tr><td>-n</td><td>顯示行號</td></tr>
<tr><td>-v</td><td>顯示不符合的行</td></tr>
<tr><td>-r</td><td>遞迴搜尋目錄</td></tr>
<tr><td>-c</td><td>只顯示符合行數</td></tr>
<tr><td>-l</td><td>只顯示符合的檔名</td></tr>
<tr><td>-E</td><td>擴展正則（可用 | + ?）</td></tr>
</tbody></table>
<h3>IC 設計實戰範例</h3>
<div class="code-block"><span class="cb-comment"># 找合成 log 中的所有錯誤</span>
<span class="cb-prompt">$</span> grep "Error" design/logs/synth.log

<span class="cb-comment"># 找 timing violation（不分大小寫）</span>
<span class="cb-prompt">$</span> grep -i "violated" design/reports/timing.rpt

<span class="cb-comment"># 顯示行號，方便對照</span>
<span class="cb-prompt">$</span> grep -n "Warning" design/logs/synth.log

<span class="cb-comment"># 在所有 RTL 檔中找 always_ff 用法</span>
<span class="cb-prompt">$</span> grep -rn "always_ff" design/rtl/

<span class="cb-comment"># 同時搜尋多個 Pattern（用 -E 和 |）</span>
<span class="cb-prompt">$</span> grep -E "Error|Warning" design/logs/synth.log

<span class="cb-comment"># 統計 Warning 數量</span>
<span class="cb-prompt">$</span> grep -c "Warning" design/logs/synth.log

<span class="cb-comment"># 找不含 'clk' 的 always 區塊</span>
<span class="cb-prompt">$</span> grep -v "clk" design/rtl/adder.v | grep "always"</div>
<h3>搭配管道組合</h3>
<div class="code-block"><span class="cb-comment"># 找所有 Error，然後計數</span>
<span class="cb-prompt">$</span> grep "Error" design/logs/synth.log | wc -l

<span class="cb-comment"># 找 violation 行並去重複</span>
<span class="cb-prompt">$</span> grep "VIOLATED" design/reports/timing.rpt | sort | uniq</div>
<button class="try-btn" onclick="tryCmdInTerminal('grep \"Error\" design/logs/synth.log')">找 Error</button>
<button class="try-btn" onclick="tryCmdInTerminal('grep -n \"Warning\" design/logs/synth.log')">找 Warning（含行號）</button>
<button class="try-btn" onclick="tryCmdInTerminal('grep -E \"Error|Warning\" design/logs/synth.log | wc -l')">統計問題總數</button>
<button class="try-btn" onclick="tryCmdInTerminal('grep \"VIOLATED\" design/reports/timing.rpt')">找 timing violation</button>`
      },
      {
        id: 'awk', title: 'awk - 欄位處理',
        content: `<h2>awk - 結構化文字處理</h2>
<p class="tut-subtitle">解析 timing report、area report 中的數值資料</p>
<h3>基本結構</h3>
<div class="code-block">awk 'PATTERN { ACTION }' FILE
<span class="cb-comment">
# 常用內建變數：
#   $0  = 整行
#   $1, $2, ... = 第1, 2, ...欄位
#   NR  = 目前行號
#   NF  = 目前行欄位數
#   FS  = 欄位分隔字元（預設空白）</span></div>
<h3>IC 設計實戰範例</h3>
<div class="code-block"><span class="cb-comment"># 印出 timing report 含 slack 的行的最後一欄</span>
<span class="cb-prompt">$</span> awk '/slack/{print $NF}' design/reports/timing.rpt

<span class="cb-comment"># 從 area report 提取 Total area 數值</span>
<span class="cb-prompt">$</span> awk '/Total area/{print $NF}' design/reports/area.rpt

<span class="cb-comment"># 加行號印出</span>
<span class="cb-prompt">$</span> awk '{print NR": "$0}' design/logs/synth.log

<span class="cb-comment"># 以冒號為分隔，取第3欄</span>
<span class="cb-prompt">$</span> awk -F: '{print $3}' design/logs/synth.log

<span class="cb-comment"># 統計 Warning 出現次數（BEGIN/END）</span>
<span class="cb-prompt">$</span> awk '/Warning/{count++} END{print "Total warnings:", count}' design/logs/synth.log

<span class="cb-comment"># 印出第2和第3欄</span>
<span class="cb-prompt">$</span> awk '{print $2, $3}' design/reports/area.rpt</div>
<button class="try-btn" onclick="tryCmdInTerminal('awk \'/slack/{print $NF}\' design/reports/timing.rpt')">提取 slack 值</button>
<button class="try-btn" onclick="tryCmdInTerminal('awk \'/Total area/{print $NF}\' design/reports/area.rpt')">提取面積</button>
<button class="try-btn" onclick="tryCmdInTerminal('awk \'{print NR\": \"$0}\' design/logs/synth.log')">加行號</button>`
      },
      {
        id: 'sed', title: 'sed - 串流編輯',
        content: `<h2>sed - Stream Editor</h2>
<p class="tut-subtitle">從大量 log 和 report 中提取特定段落，或批次替換文字</p>
<h3>核心語法</h3>
<div class="code-block"><span class="cb-comment"># 取代（substitute）</span>
sed 's/舊字串/新字串/'    <span class="cb-comment"># 每行第一個</span>
sed 's/舊字串/新字串/g'   <span class="cb-comment"># 全部取代</span>
sed 's/舊字串/新字串/gi'  <span class="cb-comment"># 不分大小寫全部取代</span>

<span class="cb-comment"># 行選取與刪除</span>
sed -n '/PATTERN/p'       <span class="cb-comment"># 只印出符合行</span>
sed '/PATTERN/d'          <span class="cb-comment"># 刪除符合行</span>
sed -n '5,10p'            <span class="cb-comment"># 印出第 5-10 行</span>
sed '/^$/d'               <span class="cb-comment"># 刪除空行</span></div>
<h3>IC 設計實戰範例</h3>
<div class="code-block"><span class="cb-comment"># 只印出 timing report 中含 slack 的行</span>
<span class="cb-prompt">$</span> sed -n '/slack/p' design/reports/timing.rpt

<span class="cb-comment"># 只印出 VIOLATED 的路徑</span>
<span class="cb-prompt">$</span> sed -n '/VIOLATED/p' design/reports/timing.rpt

<span class="cb-comment"># 從 log 中刪除以 # 開頭的行</span>
<span class="cb-prompt">$</span> sed '/^#/d' design/scripts/synth.tcl

<span class="cb-comment"># 取代 IP 名稱（批次更新）</span>
<span class="cb-prompt">$</span> sed 's/u_adder/u_add_unit/g' design/reports/timing.rpt

<span class="cb-comment"># 只印第 1 到 20 行（快速看報告頭部）</span>
<span class="cb-prompt">$</span> sed -n '1,20p' design/reports/timing.rpt</div>
<button class="try-btn" onclick="tryCmdInTerminal('sed -n \"/slack/p\" design/reports/timing.rpt')">提取 slack 行</button>
<button class="try-btn" onclick="tryCmdInTerminal('sed -n \"/VIOLATED/p\" design/reports/timing.rpt')">找 violation</button>
<button class="try-btn" onclick="tryCmdInTerminal('sed \"/^#/d\" design/scripts/synth.tcl')">去除注釋行</button>`
      },
    ]
  },
  {
    id: 'regex', icon: '🔧', name: '正則表達式',
    desc: '搭配 grep/sed/awk 使用的強力模式比對語法',
    lessons: [
      {
        id: 'regex-basics', title: '基本 Regex 語法',
        content: `<h2>正則表達式基礎</h2>
<p class="tut-subtitle">正則表達式（Regex）讓文字搜尋更強大精確</p>
<h3>基本符號</h3>
<table class="opts-table"><thead><tr><th>符號</th><th>說明</th><th>範例</th></tr></thead><tbody>
<tr><td>.</td><td>任意單一字元</td><td>a.c 匹配 abc, axc</td></tr>
<tr><td>*</td><td>前一個字元零次或多次</td><td>ab* 匹配 a, ab, abb</td></tr>
<tr><td>+</td><td>前一個字元一次或多次</td><td>ab+ 匹配 ab, abb（需 -E）</td></tr>
<tr><td>?</td><td>前一個字元零次或一次</td><td>colou?r（需 -E）</td></tr>
<tr><td>^</td><td>行首</td><td>^Warning 行首為 Warning</td></tr>
<tr><td>$</td><td>行尾</td><td>\.v$ 以 .v 結尾</td></tr>
<tr><td>[abc]</td><td>字元集合</td><td>[0-9] 數字</td></tr>
<tr><td>[^abc]</td><td>排除字元集合</td><td>[^0-9] 非數字</td></tr>
<tr><td>\</td><td>轉義特殊字元</td><td>\\. 實際的點</td></tr>
</tbody></table>
<h3>進階：-E 擴展 Regex</h3>
<div class="code-block"><span class="cb-comment"># | 或運算</span>
<span class="cb-prompt">$</span> grep -E "Error|Warning" design/logs/synth.log

<span class="cb-comment"># () 群組</span>
<span class="cb-prompt">$</span> grep -E "(Error|Warning):.*ELAB" design/logs/synth.log

<span class="cb-comment"># 搜尋有括號的錯誤碼</span>
<span class="cb-prompt">$</span> grep -E "\\([A-Z]+-[0-9]+\\)" design/logs/synth.log

<span class="cb-comment"># 找以 Warning: 開頭的行</span>
<span class="cb-prompt">$</span> grep "^Warning" design/logs/synth.log

<span class="cb-comment"># 找以 .v 結尾的模組名稱</span>
<span class="cb-prompt">$</span> grep -E "^module [a-zA-Z_]+" design/rtl/adder.v</div>
<button class="try-btn" onclick="tryCmdInTerminal('grep -E \"Error|Warning\" design/logs/synth.log')">Error 或 Warning</button>
<button class="try-btn" onclick="tryCmdInTerminal('grep \"^Warning\" design/logs/synth.log')">行首 Warning</button>
<button class="try-btn" onclick="tryCmdInTerminal('grep -E \"\\\\([A-Z]+-[0-9]+\\\\)\" design/logs/synth.log')">找錯誤碼</button>`
      },
    ]
  },
  {
    id: 'shell', icon: '📜', name: 'Shell 腳本撰寫',
    desc: '變數、條件、迴圈、函式，自動化 IC 設計流程',
    lessons: [
      {
        id: 'vars', title: '變數與引號',
        content: `<h2>Shell 變數與字串</h2>
<p class="tut-subtitle">Shell 腳本的基礎：變數定義、展開和引號規則</p>
<h3>變數定義與使用</h3>
<div class="code-block"><span class="cb-comment"># 定義（= 兩邊不能有空格！）</span>
DESIGN=top
SRCDIR=./rtl
VERSION="v1.2.3"

<span class="cb-comment"># 使用變數</span>
echo $DESIGN
echo \${DESIGN}_netlist.v   <span class="cb-comment"># {} 避免歧義</span>
echo "Design: \${DESIGN}"

<span class="cb-comment"># 命令替換</span>
TODAY=$(date +%Y%m%d)
FILE_COUNT=$(ls *.v | wc -l)

<span class="cb-comment"># 算術運算</span>
N=5
echo $((N * 2))    <span class="cb-comment"># 輸出 10</span></div>
<h3>引號差異</h3>
<div class="code-block"><span class="cb-comment"># 雙引號：展開變數</span>
echo "Design: $DESIGN"   <span class="cb-comment"># 輸出：Design: top</span>

<span class="cb-comment"># 單引號：字面字串</span>
echo 'Design: $DESIGN'   <span class="cb-comment"># 輸出：Design: $DESIGN</span></div>
<h3>特殊變數</h3>
<table class="opts-table"><thead><tr><th>變數</th><th>說明</th></tr></thead><tbody>
<tr><td>$0</td><td>腳本名稱</td></tr>
<tr><td>$1, $2</td><td>第1、2個參數</td></tr>
<tr><td>$@</td><td>所有參數</td></tr>
<tr><td>$#</td><td>參數個數</td></tr>
<tr><td>$?</td><td>上一個指令的退出碼（0=成功）</td></tr>
<tr><td>$$</td><td>目前 shell 的 PID</td></tr>
</tbody></table>
<button class="try-btn" onclick="tryCmdInTerminal('DESIGN=top && echo \"Design: \${DESIGN}\"')">定義變數</button>
<button class="try-btn" onclick="tryCmdInTerminal('TODAY=$(date) && echo "Today: $TODAY"')">命令替換</button>
<button class="try-btn" onclick="tryCmdInTerminal('echo $((8 * 8)) bytes')">算術運算</button>`
      },
      {
        id: 'conditionals', title: '條件判斷',
        content: `<h2>if/elif/else 條件判斷</h2>
<p class="tut-subtitle">根據執行結果決定下一步，讓腳本更智慧</p>
<h3>基本語法</h3>
<div class="code-block">if [ CONDITION ]; then
    # 成立時執行
elif [ CONDITION2 ]; then
    # 第二條件
else
    # 都不成立
fi</div>
<h3>常用條件</h3>
<table class="opts-table"><thead><tr><th>條件</th><th>說明</th></tr></thead><tbody>
<tr><td>-f FILE</td><td>檔案存在且為一般檔案</td></tr>
<tr><td>-d DIR</td><td>目錄存在</td></tr>
<tr><td>-e PATH</td><td>路徑存在（不限類型）</td></tr>
<tr><td>-z "$VAR"</td><td>字串為空</td></tr>
<tr><td>"$A" = "$B"</td><td>字串相等</td></tr>
<tr><td>$A -eq $B</td><td>數字相等</td></tr>
<tr><td>$A -lt $B</td><td>數字小於</td></tr>
</tbody></table>
<h3>IC 設計實戰腳本</h3>
<div class="code-block">#!/bin/bash
<span class="cb-comment"># 檢查合成 log 是否有 Error</span>

LOG="design/logs/synth.log"

if [ ! -f "$LOG" ]; then
    echo "ERROR: Log file not found: $LOG"
    exit 1
fi

ERROR_COUNT=$(grep -c "Error" "$LOG" 2>/dev/null || echo 0)
WARN_COUNT=$(grep -c "Warning" "$LOG" 2>/dev/null || echo 0)

if [ "$ERROR_COUNT" -gt 0 ]; then
    echo "SYNTHESIS FAILED: $ERROR_COUNT errors found"
    grep "Error" "$LOG"
    exit 1
elif [ "$WARN_COUNT" -gt 0 ]; then
    echo "SYNTHESIS PASSED with $WARN_COUNT warnings"
else
    echo "SYNTHESIS CLEAN: No errors or warnings"
fi</div>
<button class="try-btn" onclick="tryCmdInTerminal('[ -f design/logs/synth.log ] && echo "exists" || echo "not found"')">檢查檔案</button>
<button class="try-btn" onclick="tryCmdInTerminal('[ -d design/rtl ] && echo "dir exists"')">檢查目錄</button>`
      },
      {
        id: 'loops', title: '迴圈',
        content: `<h2>for 和 while 迴圈</h2>
<p class="tut-subtitle">批次處理多個設計檔案、自動化 regression</p>
<h3>for 迴圈</h3>
<div class="code-block"><span class="cb-comment"># 遍歷清單</span>
for MODULE in adder multiplier fsm_ctrl; do
    echo "Checking: $MODULE"
    grep "module $MODULE" design/rtl/\${MODULE}.v
done

<span class="cb-comment"># 遍歷所有 .v 檔</span>
for FILE in design/rtl/*.v; do
    LINES=$(wc -l < "$FILE")
    echo "$FILE: $LINES lines"
done

<span class="cb-comment"># 數字範圍</span>
for i in $(seq 1 5); do
    echo "Run $i"
done</div>
<h3>while 迴圈</h3>
<div class="code-block"><span class="cb-comment"># 讀取 log 每一行</span>
while IFS= read -r line; do
    if echo "$line" | grep -q "Error"; then
        echo "Found error: $line"
    fi
done < design/logs/synth.log

<span class="cb-comment"># 等待模擬完成</span>
TIMEOUT=60
while [ $TIMEOUT -gt 0 ] && [ ! -f sim.done ]; do
    sleep 1
    TIMEOUT=$((TIMEOUT - 1))
done</div>
<h3>IC Regression 腳本範例</h3>
<div class="code-block">#!/bin/bash
PASS=0; FAIL=0

for TESTCASE in tc_basic tc_overflow tc_reset tc_boundary; do
    echo -n "Running $TESTCASE... "
    vcs -f \${TESTCASE}.f -o simv && ./simv > \${TESTCASE}.log 2>&1

    if grep -q "PASS" \${TESTCASE}.log; then
        echo "PASS"; PASS=$((PASS+1))
    else
        echo "FAIL"; FAIL=$((FAIL+1))
    fi
done

echo "Result: $PASS PASS, $FAIL FAIL"
[ $FAIL -eq 0 ] && exit 0 || exit 1</div>
<button class="try-btn" onclick="tryCmdInTerminal('for f in design/rtl/*.v; do echo "File: $f"; done')">遍歷 RTL 檔</button>
<button class="try-btn" onclick="tryCmdInTerminal('for i in 1 2 3; do echo "Step $i"; done')">數字迴圈</button>`
      },
      {
        id: 'functions', title: '函式與參數',
        content: `<h2>Shell 函式</h2>
<p class="tut-subtitle">封裝可重複使用的邏輯，讓腳本更模組化</p>
<h3>定義與呼叫</h3>
<div class="code-block">check_log() {
    local log_file="$1"
    local err_count

    if [ ! -f "$log_file" ]; then
        echo "ERROR: $log_file not found"
        return 1
    fi

    err_count=$(grep -c "Error" "$log_file")

    if [ "$err_count" -gt 0 ]; then
        echo "FAIL: $err_count errors in $log_file"
        return 1
    fi

    echo "PASS: $log_file is clean"
    return 0
}

<span class="cb-comment"># 呼叫函式</span>
check_log "design/logs/synth.log"
check_log "design/logs/sim.log"</div>
<h3>完整的 IC 流程腳本範例</h3>
<div class="code-block">#!/bin/bash
set -e   <span class="cb-comment"># 任何錯誤立即退出</span>

log() { echo "[$(date +%H:%M:%S)] $@"; }

run_lint() {
    log "Running lint check..."
    verilator --lint-only design/rtl/*.v 2>&1 | tee reports/lint.log
    grep -q "Error" reports/lint.log && return 1 || return 0
}

run_synth() {
    log "Running synthesis..."
    dc_shell -f design/scripts/synth.tcl | tee design/logs/synth.log
    check_log "design/logs/synth.log"
}

<span class="cb-comment"># 主流程</span>
log "IC Design Flow Started"
run_lint  || { log "Lint FAILED"; exit 1; }
run_synth || { log "Synthesis FAILED"; exit 1; }
log "All steps PASSED"</div>`
      },
    ]
  },
  {
    id: 'pipes', icon: '⚡', name: '管道與重導向',
    desc: '組合指令的核心技術，串接 grep/awk/sed 處理複雜任務',
    lessons: [
      {
        id: 'pipe-basic', title: '管道 | 的使用',
        content: `<h2>管道 (Pipe) |</h2>
<p class="tut-subtitle">將多個指令串接，每個指令的輸出成為下一個的輸入</p>
<h3>基本概念</h3>
<div class="code-block">CMD1 | CMD2 | CMD3
<span class="cb-comment">
# CMD1 的 stdout → CMD2 的 stdin → CMD3 的 stdin</span></div>
<h3>IC 設計常用管道組合</h3>
<div class="code-block"><span class="cb-comment"># 找 Error 並計算數量</span>
<span class="cb-prompt">$</span> grep "Error" design/logs/synth.log | wc -l

<span class="cb-comment"># 找所有 Warning，去重複，排序</span>
<span class="cb-prompt">$</span> grep "Warning" design/logs/synth.log | sort | uniq

<span class="cb-comment"># 找 timing violation，取得 slack 值</span>
<span class="cb-prompt">$</span> grep "slack" design/reports/timing.rpt | awk '{print $NF}' | sort -n

<span class="cb-comment"># 找面積 > 100 的 cell，取名稱欄</span>
<span class="cb-prompt">$</span> cat design/reports/area.rpt | grep "area" | awk '$NF > 100 {print $1}'

<span class="cb-comment"># 統計各類型 Warning 出現頻率</span>
<span class="cb-prompt">$</span> grep "Warning" design/logs/synth.log | awk '{print $NF}' | sort | uniq -c | sort -rn

<span class="cb-comment"># 找所有 .v 檔，計算各檔行數，排序</span>
<span class="cb-prompt">$</span> find design/rtl -name "*.v" | xargs wc -l | sort -n</div>
<button class="try-btn" onclick="tryCmdInTerminal('grep \"Warning\" design/logs/synth.log | sort | uniq -c')">統計 Warning 類型</button>
<button class="try-btn" onclick="tryCmdInTerminal('grep \"slack\" design/reports/timing.rpt | awk \'{print $NF}\'')">提取 slack 值</button>
<button class="try-btn" onclick="tryCmdInTerminal('grep -E \"Error|Warning\" design/logs/synth.log | wc -l')">統計問題總數</button>`
      },
      {
        id: 'redirect', title: '輸入輸出重導向',
        content: `<h2>重導向 > >> < 2></h2>
<p class="tut-subtitle">將輸出儲存到檔案，或從檔案讀取輸入</p>
<h3>重導向符號</h3>
<table class="opts-table"><thead><tr><th>符號</th><th>說明</th></tr></thead><tbody>
<tr><td>&gt;</td><td>輸出到檔案（覆蓋）</td></tr>
<tr><td>&gt;&gt;</td><td>輸出到檔案（追加）</td></tr>
<tr><td>&lt;</td><td>從檔案讀取輸入</td></tr>
<tr><td>2&gt;</td><td>重導向錯誤輸出</td></tr>
<tr><td>2&gt;&amp;1</td><td>將錯誤合併到標準輸出</td></tr>
</tbody></table>
<h3>實戰範例</h3>
<div class="code-block"><span class="cb-comment"># 儲存 Warning 到檔案</span>
<span class="cb-prompt">$</span> grep "Warning" design/logs/synth.log > warnings.txt

<span class="cb-comment"># 追加 Error 到同一檔案</span>
<span class="cb-prompt">$</span> grep "Error" design/logs/synth.log >> warnings.txt

<span class="cb-comment"># 同時顯示和儲存（用 tee）</span>
<span class="cb-prompt">$</span> make synth 2>&1 | tee build.log

<span class="cb-comment"># 把 stderr 丟掉</span>
<span class="cb-prompt">$</span> grep "pattern" file.txt 2>/dev/null

<span class="cb-comment"># 從檔案讀取</span>
<span class="cb-prompt">$</span> sort < design/reports/timing.rpt</div>
<button class="try-btn" onclick="tryCmdInTerminal('grep \"Warning\" design/logs/synth.log > /tmp/warnings.txt && cat /tmp/warnings.txt')">存 Warning 到檔案</button>
<button class="try-btn" onclick="tryCmdInTerminal('grep \"slack\" design/reports/timing.rpt | tee /tmp/slack.txt')">tee 同時顯示和存檔</button>`
      },
    ]
  },
  {
    id: 'env', icon: '⚙️', name: '環境變數設定',
    desc: 'PATH、export、.bashrc，配置 EDA 工具環境',
    lessons: [
      {
        id: 'env-basics', title: '環境變數基礎',
        content: `<h2>環境變數</h2>
<p class="tut-subtitle">控制程式行為的全域設定，EDA 工具依賴正確的環境設定才能運作</p>
<h3>常用 EDA 環境變數</h3>
<div class="code-block"><span class="cb-comment"># 查看所有環境變數</span>
<span class="cb-prompt">$</span> env
<span class="cb-prompt">$</span> printenv

<span class="cb-comment"># 查看特定變數</span>
<span class="cb-prompt">$</span> echo $PATH
<span class="cb-prompt">$</span> printenv SYNOPSYS

<span class="cb-comment"># 設定並匯出環境變數</span>
<span class="cb-prompt">$</span> export SYNOPSYS=/usr/local/synopsys
<span class="cb-prompt">$</span> export VCS_HOME=$SYNOPSYS/vcs
<span class="cb-prompt">$</span> export PATH=$PATH:$SYNOPSYS/bin:$VCS_HOME/bin

<span class="cb-comment"># 只為單次指令設定</span>
<span class="cb-prompt">$</span> DISPLAY=:0 vcs -gui ...</div>
<h3>.bashrc 持久設定</h3>
<div class="code-block"><span class="cb-comment"># ~/.bashrc 內容範例</span>
export SYNOPSYS=/usr/local/synopsys
export VCS_HOME=$SYNOPSYS/vcs
export DC_HOME=$SYNOPSYS/syn
export PATH=$PATH:$VCS_HOME/bin:$DC_HOME/bin

<span class="cb-comment"># Alias 快捷</span>
alias ll='ls -la'
alias gs='git status'
alias dcs='dc_shell -f'

<span class="cb-comment"># 載入後生效</span>
<span class="cb-prompt">$</span> source ~/.bashrc</div>
<button class="try-btn" onclick="tryCmdInTerminal('env | grep PATH')">查看 PATH</button>
<button class="try-btn" onclick="tryCmdInTerminal('export MYVAR=hello && echo $MYVAR')">設定並使用變數</button>
<button class="try-btn" onclick="tryCmdInTerminal('source ~/.bashrc && echo "Loaded"')">載入 .bashrc</button>`
      },
    ]
  },
  {
    id: 'process', icon: '🔄', name: '行程管理',
    desc: 'ps/kill/jobs，管理長時間執行的 EDA 工具',
    lessons: [
      {
        id: 'process-mgmt', title: '行程管理基礎',
        content: `<h2>行程（Process）管理</h2>
<p class="tut-subtitle">EDA 工具（VCS、DC）執行時間長，需要掌握行程管理</p>
<h3>查看行程</h3>
<div class="code-block"><span class="cb-comment"># 查看目前 shell 的行程</span>
<span class="cb-prompt">$</span> ps

<span class="cb-comment"># 查看所有使用者的所有行程</span>
<span class="cb-prompt">$</span> ps aux

<span class="cb-comment"># 找特定行程（如 vcs 模擬）</span>
<span class="cb-prompt">$</span> ps aux | grep vcs

<span class="cb-comment"># 互動式行程監控</span>
<span class="cb-prompt">$</span> top</div>
<h3>背景執行</h3>
<div class="code-block"><span class="cb-comment"># 在背景執行（加 &）</span>
<span class="cb-prompt">$</span> vcs -full64 design/*.v &

<span class="cb-comment"># 查看背景任務</span>
<span class="cb-prompt">$</span> jobs

<span class="cb-comment"># 把背景任務拉回前台</span>
<span class="cb-prompt">$</span> fg %1

<span class="cb-comment"># Ctrl+Z 暫停，bg 推回背景</span>
<span class="cb-prompt">$</span> bg %1

<span class="cb-comment"># 關閉 terminal 後繼續執行</span>
<span class="cb-prompt">$</span> nohup make synth > synth.log 2>&1 &</div>
<h3>終止行程</h3>
<div class="code-block"><span class="cb-comment"># 正常終止</span>
<span class="cb-prompt">$</span> kill 12345

<span class="cb-comment"># 強制終止（SIGKILL）</span>
<span class="cb-prompt">$</span> kill -9 12345

<span class="cb-comment"># 終止所有 vcs 行程</span>
<span class="cb-prompt">$</span> pkill vcs</div>
<button class="try-btn" onclick="tryCmdInTerminal('ps')">查看行程</button>
<button class="try-btn" onclick="tryCmdInTerminal('ps aux | grep bash')">找 bash 行程</button>`
      },
    ]
  },
  {
    id: 'makefile', icon: '🏗️', name: 'Makefile 建構系統',
    desc: '定義 IC 設計流程的建構規則，管理 sim/synth/lint 目標',
    lessons: [
      {
        id: 'make-basics', title: 'Makefile 基礎',
        content: `<h2>Makefile</h2>
<p class="tut-subtitle">自動化 IC 設計流程的標準工具，管理 sim/synth/lint 相依關係</p>
<h3>基本結構</h3>
<div class="code-block">TARGET: DEPENDENCIES
<span style="color:#ff0">	</span>COMMAND   <span class="cb-comment"># 必須用 TAB 縮排！</span></div>
<h3>IC 設計 Makefile 範例</h3>
<div class="code-block"><span class="cb-comment"># 變數定義</span>
DESIGN  = top
VCS     = vcs
VFLAGS  = -full64 -sverilog
DC      = dc_shell
RPTDIR  = reports

<span class="cb-comment"># 自動變數</span>
<span class="cb-comment"># $@ = 目標名稱</span>
<span class="cb-comment"># $^ = 所有相依</span>
<span class="cb-comment"># $< = 第一個相依</span>

.PHONY: all sim synth clean help

all: sim synth

sim: rtl/$(DESIGN).v tb/tb_$(DESIGN).sv
	$(VCS) $(VFLAGS) $^ -o simv
	./simv | tee $(RPTDIR)/sim.log

synth: rtl/$(DESIGN).v
	$(DC) -f scripts/synth.tcl | tee $(RPTDIR)/synth.log

clean:
	rm -rf simv simv.daidir *.log

help:
	@echo "Targets: sim synth clean"</div>
<h3>使用方式</h3>
<div class="code-block"><span class="cb-prompt">$</span> make           <span class="cb-comment"># 執行第一個 target（all）</span>
<span class="cb-prompt">$</span> make sim        <span class="cb-comment"># 執行 sim</span>
<span class="cb-prompt">$</span> make synth      <span class="cb-comment"># 執行 synth</span>
<span class="cb-prompt">$</span> make clean      <span class="cb-comment"># 清理</span>
<span class="cb-prompt">$</span> make -n sim     <span class="cb-comment"># 只顯示命令，不執行</span>
<span class="cb-prompt">$</span> make -j4 sim    <span class="cb-comment"># 4 個並行任務</span></div>
<button class="try-btn" onclick="tryCmdInTerminal('cat design/scripts/Makefile')">查看 Makefile</button>
<button class="try-btn" onclick="tryCmdInTerminal('make -n sim')">試跑（不執行）</button>`
      },
    ]
  },
  {
    id: 'git', icon: '🌿', name: 'Git 版本控制',
    desc: '管理 RTL 代碼、追蹤設計歷程、團隊協作',
    lessons: [
      {
        id: 'git-basics', title: 'Git 基礎工作流程',
        content: `<h2>Git 版本控制</h2>
<p class="tut-subtitle">追蹤 RTL 修改歷史，管理多版本設計，團隊協作必備</p>
<h3>基本工作流程</h3>
<div class="code-block"><span class="cb-comment"># 初始化 repository</span>
<span class="cb-prompt">$</span> git init

<span class="cb-comment"># 查看狀態</span>
<span class="cb-prompt">$</span> git status

<span class="cb-comment"># 加入追蹤</span>
<span class="cb-prompt">$</span> git add design/rtl/adder.v
<span class="cb-prompt">$</span> git add design/rtl/        <span class="cb-comment"># 加入整個目錄</span>
<span class="cb-prompt">$</span> git add -A                 <span class="cb-comment"># 加入所有變更</span>

<span class="cb-comment"># 提交</span>
<span class="cb-prompt">$</span> git commit -m "Add 8-bit adder module"

<span class="cb-comment"># 查看歷史</span>
<span class="cb-prompt">$</span> git log --oneline --graph</div>
<h3>IC 設計 .gitignore</h3>
<div class="code-block"><span class="cb-comment"># .gitignore - 不追蹤的檔案類型</span>
simv
simv.daidir/
csrc/
DVEfiles/
*.log
*.vcd
*.fsdb
*.db
*.mr
netlist/
reports/</div>
<h3>分支管理</h3>
<div class="code-block"><span class="cb-prompt">$</span> git branch feature/alu     <span class="cb-comment"># 建立分支</span>
<span class="cb-prompt">$</span> git checkout feature/alu   <span class="cb-comment"># 切換分支</span>
<span class="cb-prompt">$</span> git merge feature/alu      <span class="cb-comment"># 合併回主分支</span>
<span class="cb-prompt">$</span> git stash                  <span class="cb-comment"># 暫存未完成的修改</span>
<span class="cb-prompt">$</span> git stash pop              <span class="cb-comment"># 還原暫存</span></div>
<button class="try-btn" onclick="tryCmdInTerminal('git status')">git status</button>
<button class="try-btn" onclick="tryCmdInTerminal('git log --oneline')">git log</button>
<button class="try-btn" onclick="tryCmdInTerminal('git branch')">查看分支</button>`
      },
    ]
  },
  {
    id: 'eda', icon: '🔬', name: 'EDA 工具腳本',
    desc: 'VCS 模擬、DC 合成、解析 report，IC 設計自動化流程',
    lessons: [
      {
        id: 'vcs-flow', title: 'VCS 模擬腳本',
        content: `<h2>VCS 模擬流程腳本</h2>
<p class="tut-subtitle">自動化模擬、收集結果、判斷 PASS/FAIL</p>
<h3>基本 VCS 執行</h3>
<div class="code-block"><span class="cb-comment"># 單次編譯執行</span>
<span class="cb-prompt">$</span> vcs -full64 -sverilog design/rtl/*.v design/tb/*.sv -o simv
<span class="cb-prompt">$</span> ./simv

<span class="cb-comment"># 加入波形輸出</span>
<span class="cb-prompt">$</span> ./simv -ucli -do "dump -file waves.vcd -type VCD; run; exit"</div>
<h3>完整 Regression 腳本</h3>
<div class="code-block">#!/bin/bash
# run_regression.sh - 自動化 Regression 測試

set -e
PASS=0; FAIL=0; SKIP=0
REPORT="regression_report.txt"

{
echo "Regression Report - $(date)"
echo "=============================="

for TC in design/tb/tb_*.sv; do
    NAME=$(basename $TC .sv)
    LOG="logs/\${NAME}.log"

    echo -n "Testing $NAME... "

    <span class="cb-comment"># 執行模擬</span>
    if vcs -full64 -sverilog design/rtl/*.v "$TC" -o simv > /dev/null 2>&1; then
        ./simv > "$LOG" 2>&1

        if grep -q "PASS" "$LOG"; then
            echo "PASS"; PASS=$((PASS+1))
        else
            echo "FAIL"; FAIL=$((FAIL+1))
            grep "FAIL\|Error" "$LOG"
        fi
    else
        echo "COMPILE_ERROR"; FAIL=$((FAIL+1))
    fi
done

echo ""
echo "Summary: $PASS PASS, $FAIL FAIL, $SKIP SKIP"
} | tee "$REPORT"

echo "Report saved: $REPORT"
[ $FAIL -eq 0 ] && exit 0 || exit 1</div>
<button class="try-btn" onclick="tryCmdInTerminal('cat design/scripts/run_sim.sh')">查看模擬腳本</button>`
      },
      {
        id: 'report-parsing', title: '解析 EDA 報告',
        content: `<h2>解析 EDA 工具報告</h2>
<p class="tut-subtitle">從 timing/area/power report 自動提取關鍵數值</p>
<h3>Timing Report 分析</h3>
<div class="code-block"><span class="cb-comment"># 找所有 timing violation</span>
<span class="cb-prompt">$</span> grep "VIOLATED" design/reports/timing.rpt

<span class="cb-comment"># 找 worst negative slack (WNS)</span>
<span class="cb-prompt">$</span> grep "slack (VIOLATED)" design/reports/timing.rpt | \\
  awk '{print $NF}' | sort -n | head -1

<span class="cb-comment"># 計算 TNS（所有負 slack 之和）</span>
<span class="cb-prompt">$</span> grep "slack (VIOLATED)" design/reports/timing.rpt | \\
  awk '{sum += $NF} END {print "TNS:", sum}'

<span class="cb-comment"># 找有幾條 path 違反</span>
<span class="cb-prompt">$</span> grep -c "VIOLATED" design/reports/timing.rpt</div>
<h3>Area/Power Report 分析</h3>
<div class="code-block"><span class="cb-comment"># 提取 Total area</span>
<span class="cb-prompt">$</span> grep "Total area" design/reports/area.rpt | awk '{print $NF}'

<span class="cb-comment"># 提取 Total power</span>
<span class="cb-prompt">$</span> grep "Total Power" design/reports/power.rpt | awk '{print $3, $4}'

<span class="cb-comment"># 提取 cell count</span>
<span class="cb-prompt">$</span> grep "Number of cells" design/reports/area.rpt | awk '{print $NF}'</div>
<h3>綜合分析腳本</h3>
<div class="code-block">#!/bin/bash
# 一鍵生成 PPA 摘要

echo "=== PPA Summary ==="
printf "Area:  %s um^2\\n" $(grep "Total area" design/reports/area.rpt | awk '{print $NF}')
printf "Power: %s mW\\n"   $(grep "Total Power" design/reports/power.rpt | awk '{print $3}')

WNS=$(grep "slack (VIOLATED)" design/reports/timing.rpt | awk '{print $NF}' | sort -n | head -1)
VIOLS=$(grep -c "VIOLATED" design/reports/timing.rpt 2>/dev/null || echo 0)
printf "WNS:   %s ns\\n" \${WNS:-0}
printf "Violations: %s\\n" $VIOLS</div>
<button class="try-btn" onclick="tryCmdInTerminal('grep \"VIOLATED\" design/reports/timing.rpt')">找 timing violation</button>
<button class="try-btn" onclick="tryCmdInTerminal('grep \"Total area\" design/reports/area.rpt | awk \'{print $NF}\'')">提取面積</button>
<button class="try-btn" onclick="tryCmdInTerminal('grep -c \"VIOLATED\" design/reports/timing.rpt')">統計 violation 數</button>
<button class="try-btn" onclick="tryCmdInTerminal('grep \"Total Power\" design/reports/power.rpt | awk \'{print $3, $4}\'')">提取功耗</button>`
      },
    ]
  },
];
