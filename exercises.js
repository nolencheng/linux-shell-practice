const EXERCISES = {
  categories: [
    { id: 'nav',    name: '目錄導覽', icon: '📁', diff: 'easy' },
    { id: 'file',   name: '檔案操作', icon: '📄', diff: 'easy' },
    { id: 'text',   name: '文字處理', icon: '🔍', diff: 'med' },
    { id: 'pipe',   name: '管道組合', icon: '⚡', diff: 'med' },
    { id: 'script', name: '腳本撰寫', icon: '📜', diff: 'hard' },
    { id: 'eda',    name: 'EDA 報告分析', icon: '🔬', diff: 'hard' },
  ],
  missions: [
    // ===== 目錄導覽 =====
    {
      id: 'm01', cat: 'nav', diff: 'easy',
      title: '探索專案目錄',
      desc: '找出 design 目錄下有哪些子目錄和檔案',
      objectives: [
        { id: 'o1', desc: '使用 ls 列出 design 目錄', check: (cmd) => /ls.*design/.test(cmd) || (cmd === 'ls' && true) },
        { id: 'o2', desc: '使用 ls -la 顯示詳細資訊', check: (cmd) => /ls\s+.*-[a-zA-Z]*l[a-zA-Z]*/.test(cmd) || /ls\s+.*-[a-zA-Z]*a[a-zA-Z]*/.test(cmd) },
        { id: 'o3', desc: '進入 design/rtl 目錄', check: (cmd, state) => /cd.*rtl/.test(cmd) || state.cwd.includes('rtl') },
      ],
      hints: [
        'ls design/ 可以列出 design 目錄的內容',
        'ls -la design/ 會顯示隱藏檔案和詳細資訊（權限、大小、時間）',
        'cd design/rtl 然後 ls 看看 RTL 目錄有哪些 .v 檔',
      ]
    },
    {
      id: 'm02', cat: 'nav', diff: 'easy',
      title: '路徑的絕對與相對',
      desc: '練習使用絕對路徑和相對路徑切換目錄',
      objectives: [
        { id: 'o1', desc: '使用 pwd 顯示目前路徑', check: (cmd) => /^pwd/.test(cmd) },
        { id: 'o2', desc: '使用相對路徑 cd design', check: (cmd) => /^cd\s+design/.test(cmd) },
        { id: 'o3', desc: '使用 cd ~ 或 cd 回到家目錄', check: (cmd) => /^cd(\s+~)?$/.test(cmd) },
      ],
      hints: [
        'pwd 顯示你目前的完整路徑',
        'cd design 是相對路徑，cd /home/user/design 是絕對路徑',
        'cd ~ 或直接 cd 都可以回到家目錄 /home/user',
      ]
    },
    {
      id: 'm03', cat: 'nav', diff: 'easy',
      title: '萬用字元搜尋',
      desc: '使用萬用字元列出特定類型的檔案',
      objectives: [
        { id: 'o1', desc: '列出所有 .v 檔', check: (cmd) => /ls.*\*\.v/.test(cmd) || /find.*\.v/.test(cmd) },
        { id: 'o2', desc: '列出所有 .log 檔', check: (cmd) => /ls.*\*\.log/.test(cmd) || /find.*\.log/.test(cmd) },
        { id: 'o3', desc: '使用 find 在 design 下尋找 .v 檔', check: (cmd) => /find.*design.*\.v/.test(cmd) || /find.*\.v.*design/.test(cmd) },
      ],
      hints: [
        'ls design/rtl/*.v 列出 rtl 目錄下所有 .v 檔',
        'ls design/logs/*.log 列出所有 log 檔',
        'find design -name "*.v" 遞迴搜尋所有 .v 檔',
      ]
    },

    // ===== 檔案操作 =====
    {
      id: 'm04', cat: 'file', diff: 'easy',
      title: '建立備份目錄',
      desc: '建立一個 backup 目錄，並把 timing.rpt 複製進去',
      objectives: [
        { id: 'o1', desc: '建立 backup 目錄', check: (cmd, state) => /mkdir.*backup/.test(cmd) },
        { id: 'o2', desc: '複製 timing.rpt 到 backup', check: (cmd) => /cp.*timing\.rpt.*backup/.test(cmd) },
        { id: 'o3', desc: '確認複製成功（ls backup）', check: (cmd) => /ls.*backup/.test(cmd) },
      ],
      hints: [
        'mkdir backup 建立 backup 目錄',
        'cp design/reports/timing.rpt backup/ 複製檔案',
        'ls backup/ 確認複製成功',
      ]
    },
    {
      id: 'm05', cat: 'file', diff: 'easy',
      title: '腳本加上執行權限',
      desc: '讓 run_sim.sh 可以被執行',
      objectives: [
        { id: 'o1', desc: '查看 run_sim.sh 的權限', check: (cmd) => /ls\s+.*-[a-zA-Z]*l/.test(cmd) && /run_sim/.test(cmd) },
        { id: 'o2', desc: '使用 chmod +x 加執行權限', check: (cmd) => /chmod.*\+x.*run_sim/.test(cmd) || /chmod.*755.*run_sim/.test(cmd) },
        { id: 'o3', desc: '確認權限已更改', check: (cmd) => /ls\s+.*-[a-zA-Z]*l/.test(cmd) },
      ],
      hints: [
        'ls -la design/scripts/run_sim.sh 查看目前權限',
        'chmod +x design/scripts/run_sim.sh 加上執行權限（等同 chmod 755）',
        '再次 ls -la 確認權限已變更為 -rwxr-xr-x',
      ]
    },
    {
      id: 'm06', cat: 'file', diff: 'med',
      title: '整理輸出檔案',
      desc: '建立 archive 目錄，將所有 .log 和 .rpt 移入，並壓縮',
      objectives: [
        { id: 'o1', desc: '建立 archive 目錄', check: (cmd, state) => /mkdir.*archive/.test(cmd) },
        { id: 'o2', desc: '複製或移動 log 檔到 archive', check: (cmd) => /cp.*\.log.*archive|mv.*\.log.*archive/.test(cmd) },
        { id: 'o3', desc: '使用 tar 壓縮 archive 目錄', check: (cmd) => /tar.*-c.*archive|tar.*archive.*\.tar/.test(cmd) },
      ],
      hints: [
        'mkdir archive 建立目錄',
        'cp design/logs/*.log archive/ 複製所有 log 檔',
        'tar -czf archive.tar.gz archive/ 壓縮整個目錄',
      ]
    },

    // ===== 文字處理 =====
    {
      id: 'm07', cat: 'text', diff: 'easy',
      title: '找出所有 Error',
      desc: '從 synth.log 中找出所有包含 "Error" 的行',
      objectives: [
        { id: 'o1', desc: '使用 grep 搜尋 Error', check: (cmd, state, out) => /grep.*[Ee]rror.*synth\.log/.test(cmd) || (/grep.*[Ee]rror/.test(cmd) && out.includes('Error')) },
        { id: 'o2', desc: '顯示 Error 行的行號', check: (cmd) => /grep.*-n.*[Ee]rror/.test(cmd) || /grep.*[Ee]rror.*-n/.test(cmd) },
        { id: 'o3', desc: '統計 Error 數量', check: (cmd) => /grep.*-c.*[Ee]rror/.test(cmd) || (/grep.*[Ee]rror/.test(cmd) && /wc.*-l/.test(cmd)) },
      ],
      hints: [
        'grep "Error" design/logs/synth.log',
        'grep -n "Error" design/logs/synth.log 顯示行號',
        'grep -c "Error" design/logs/synth.log 只顯示符合行數',
      ]
    },
    {
      id: 'm08', cat: 'text', diff: 'med',
      title: '解析 Timing Report',
      desc: '從 timing.rpt 中找出所有 timing violation（slack VIOLATED）',
      objectives: [
        { id: 'o1', desc: '找出含 VIOLATED 的行', check: (cmd, state, out) => /grep.*VIOLATED.*timing/.test(cmd) || (/grep.*VIOLATED/.test(cmd) && out.includes('VIOLATED')) },
        { id: 'o2', desc: '使用 awk 提取 slack 數值', check: (cmd) => /awk.*slack|awk.*\$NF/.test(cmd) && /timing/.test(cmd) },
        { id: 'o3', desc: '統計有幾條 path 違反', check: (cmd) => /grep.*-c.*VIOLATED/.test(cmd) || (/grep.*VIOLATED/.test(cmd) && /wc.*-l/.test(cmd)) },
      ],
      hints: [
        'grep "VIOLATED" design/reports/timing.rpt',
        "awk '/slack/{print $NF}' design/reports/timing.rpt 提取 slack 值",
        'grep -c "VIOLATED" design/reports/timing.rpt 計算違反路徑數',
      ]
    },
    {
      id: 'm09', cat: 'text', diff: 'med',
      title: '提取關鍵設計數據',
      desc: '從 area.rpt 和 power.rpt 中分別提取 Total area 和 Total Power',
      objectives: [
        { id: 'o1', desc: '從 area.rpt 提取 Total area 數值', check: (cmd, state, out) => /grep.*[Tt]otal\s+area.*area\.rpt/.test(cmd) || (/awk.*area/.test(cmd) && /area\.rpt/.test(cmd)) },
        { id: 'o2', desc: '從 power.rpt 提取 Total Power', check: (cmd, state, out) => /grep.*[Tt]otal.*power\.rpt/.test(cmd) || (/awk.*power/.test(cmd) && /power\.rpt/.test(cmd)) },
        { id: 'o3', desc: '用 awk 精確取出數字欄位', check: (cmd) => /awk.*\{print.*\}/.test(cmd) },
      ],
      hints: [
        "grep 'Total area' design/reports/area.rpt",
        "grep 'Total area' design/reports/area.rpt | awk '{print $NF}'",
        "awk '/Total Power/{print $3, $4}' design/reports/power.rpt",
      ]
    },
    {
      id: 'm10', cat: 'text', diff: 'med',
      title: '分析 Warning 分佈',
      desc: '統計 synth.log 中各類型 Warning 的出現次數',
      objectives: [
        { id: 'o1', desc: '找出所有 Warning 行', check: (cmd, state, out) => /grep.*[Ww]arning.*synth/.test(cmd) || (out.includes('Warning') && /grep.*Warning/.test(cmd)) },
        { id: 'o2', desc: '排序 Warning 行', check: (cmd) => /grep.*Warning.*sort|sort.*Warning/.test(cmd) || (cmd.includes('sort') && cmd.includes('Warning')) },
        { id: 'o3', desc: '統計各類型數量（uniq -c）', check: (cmd) => /uniq.*-c/.test(cmd) },
      ],
      hints: [
        'grep "Warning" design/logs/synth.log',
        '利用管道：grep "Warning" design/logs/synth.log | sort',
        'grep "Warning" design/logs/synth.log | sort | uniq -c | sort -rn',
      ]
    },
    {
      id: 'm11', cat: 'text', diff: 'med',
      title: 'sed 文字替換',
      desc: '使用 sed 從 timing report 中只顯示 slack 相關行，並將 MET 替換為 PASS',
      objectives: [
        { id: 'o1', desc: '用 sed 只印出含 slack 的行', check: (cmd, state, out) => /sed.*-n.*slack.*p/.test(cmd) || /sed.*\/slack\/p/.test(cmd) },
        { id: 'o2', desc: '用 sed 將 MET 替換為 PASS', check: (cmd) => /sed.*s.*MET.*PASS/.test(cmd) },
        { id: 'o3', desc: '組合 grep + sed 管道', check: (cmd) => /grep.*\|.*sed|sed.*\|.*grep/.test(cmd) },
      ],
      hints: [
        "sed -n '/slack/p' design/reports/timing.rpt 只印含 slack 的行",
        "sed 's/MET/PASS/g' design/reports/timing.rpt 替換 MET 為 PASS",
        "grep 'slack' design/reports/timing.rpt | sed 's/MET/PASS/g'",
      ]
    },

    // ===== 管道組合 =====
    {
      id: 'm12', cat: 'pipe', diff: 'med',
      title: '管道三連擊',
      desc: '用一行命令找出 synth.log 中的 Warning，去重複後計算種類數',
      objectives: [
        { id: 'o1', desc: '使用管道 |', check: (cmd) => (cmd.match(/\|/g) || []).length >= 1 },
        { id: 'o2', desc: '使用至少兩個管道', check: (cmd) => (cmd.match(/\|/g) || []).length >= 2 },
        { id: 'o3', desc: '組合 grep | sort | uniq', check: (cmd) => /grep/.test(cmd) && /sort/.test(cmd) && /uniq/.test(cmd) },
      ],
      hints: [
        '先用 grep "Warning" 過濾',
        '再用 sort 排序（uniq 需要排序後才有效）',
        'grep "Warning" design/logs/synth.log | sort | uniq | wc -l',
      ]
    },
    {
      id: 'm13', cat: 'pipe', diff: 'med',
      title: '找最壞的 timing path',
      desc: '找出 timing.rpt 中所有 VIOLATED 路徑的 slack 值，並找出最小值（WNS）',
      objectives: [
        { id: 'o1', desc: '過濾出含 VIOLATED 的 slack 行', check: (cmd, state, out) => /grep.*VIOLATED.*timing/.test(cmd) || (out.includes('VIOLATED') && /grep/.test(cmd)) },
        { id: 'o2', desc: '用 awk 提取數字', check: (cmd) => /awk/.test(cmd) && /\$NF/.test(cmd) },
        { id: 'o3', desc: '用 sort 排序，head 取最小值', check: (cmd) => /sort/.test(cmd) && (/head/.test(cmd) || /-n.*1/.test(cmd)) },
      ],
      hints: [
        "grep 'slack (VIOLATED)' design/reports/timing.rpt",
        "grep 'slack (VIOLATED)' design/reports/timing.rpt | awk '{print $NF}'",
        "grep 'slack (VIOLATED)' design/reports/timing.rpt | awk '{print $NF}' | sort -n | head -1",
      ]
    },
    {
      id: 'm14', cat: 'pipe', diff: 'hard',
      title: '統計 RTL 總行數',
      desc: '計算 design/rtl 下所有 .v 檔的總行數',
      objectives: [
        { id: 'o1', desc: '找到所有 .v 檔', check: (cmd) => /find.*\.v|ls.*\*\.v/.test(cmd) },
        { id: 'o2', desc: '計算每個檔案的行數', check: (cmd) => /wc.*-l/.test(cmd) },
        { id: 'o3', desc: '計算所有 .v 檔的行數', check: (cmd, state, out) => /wc.*-l.*\*\.v|find.*wc/.test(cmd) || (/wc/.test(cmd) && /\*\.v/.test(cmd)) },
      ],
      hints: [
        'ls design/rtl/*.v 列出所有 .v 檔',
        'wc -l design/rtl/*.v 計算每個檔案行數',
        'wc -l design/rtl/*.v | tail -1 只看總計',
      ]
    },
    {
      id: 'm15', cat: 'pipe', diff: 'hard',
      title: '儲存分析結果',
      desc: '找出所有 Warning 並儲存到 warning_report.txt，同時顯示在終端機',
      objectives: [
        { id: 'o1', desc: '使用 grep 找 Warning', check: (cmd) => /grep.*Warning/.test(cmd) },
        { id: 'o2', desc: '使用 tee 同時儲存', check: (cmd) => /tee/.test(cmd) },
        { id: 'o3', desc: '確認檔案已建立（cat 或 ls）', check: (cmd) => /cat.*warning|ls.*warning/.test(cmd) },
      ],
      hints: [
        'grep "Warning" design/logs/synth.log 找 Warning',
        '加上 | tee warning_report.txt 同時顯示和儲存',
        'cat warning_report.txt 確認內容',
      ]
    },

    // ===== EDA 報告分析 =====
    {
      id: 'm16', cat: 'eda', diff: 'hard',
      title: '生成 PPA 摘要',
      desc: '從三個 report 分別提取：總面積、總功耗、timing violation 數量',
      objectives: [
        { id: 'o1', desc: '提取 Total area 數值', check: (cmd, state, out) => /grep.*[Tt]otal.*area.*area\.rpt/.test(cmd) || (/awk.*area/.test(cmd) && out.match(/[0-9]+\.[0-9]+/)) },
        { id: 'o2', desc: '提取 Total Power 數值', check: (cmd, state, out) => /grep.*[Pp]ower.*power\.rpt/.test(cmd) || (/awk.*power/.test(cmd) && out.match(/[0-9]+\.[0-9]+/)) },
        { id: 'o3', desc: '統計 timing violation 數量', check: (cmd) => /grep.*-c.*VIOLATED|grep.*VIOLATED.*wc/.test(cmd) },
      ],
      hints: [
        "awk '/Total area/{print $NF}' design/reports/area.rpt",
        "grep 'Total Power' design/reports/power.rpt | awk '{print $3, $4}'",
        "grep -c 'VIOLATED' design/reports/timing.rpt",
      ]
    },
    {
      id: 'm17', cat: 'eda', diff: 'hard',
      title: '分析合成日誌',
      desc: '從 synth.log 提取：Error 數量、Warning 數量、合成狀態（PASSED/FAILED）',
      objectives: [
        { id: 'o1', desc: '計算 Error 數量', check: (cmd, state, out) => /grep.*-c.*[Ee]rror.*synth|grep.*[Ee]rror.*synth.*wc/.test(cmd) },
        { id: 'o2', desc: '計算 Warning 數量', check: (cmd) => /grep.*-c.*[Ww]arning.*synth/.test(cmd) },
        { id: 'o3', desc: '找出合成最終狀態', check: (cmd, state, out) => /grep.*COMPLETED|tail.*synth\.log|sed.*-n.*[0-9]+p/.test(cmd) || out.includes('COMPLETED') },
      ],
      hints: [
        'grep -c "Error" design/logs/synth.log',
        'grep -c "Warning" design/logs/synth.log',
        'tail -3 design/logs/synth.log 或 grep "COMPLETED" design/logs/synth.log',
      ]
    },
    {
      id: 'm18', cat: 'eda', diff: 'hard',
      title: '找出 RTL 模組',
      desc: '從所有 .v 檔中找出所有 module 宣告的名稱',
      objectives: [
        { id: 'o1', desc: '在 RTL 檔中搜尋 module 關鍵字', check: (cmd, state, out) => /grep.*module.*\.v/.test(cmd) || /grep.*-r.*module.*rtl/.test(cmd) },
        { id: 'o2', desc: '用 -r 遞迴搜尋所有 .v 檔', check: (cmd) => /grep.*-r.*module|grep.*module.*\*\.v/.test(cmd) },
        { id: 'o3', desc: '用 awk 或 sed 只取模組名稱', check: (cmd) => /awk.*module|sed.*module/.test(cmd) && /grep.*module/.test(cmd) },
      ],
      hints: [
        'grep "^module" design/rtl/*.v 找 module 宣告',
        "grep -rn '^module' design/rtl/ 遞迴搜尋並顯示行號",
        "grep '^module' design/rtl/*.v | awk '{print $2}' 只取模組名稱",
      ]
    },

    // ===== Shell 腳本 =====
    {
      id: 'm19', cat: 'script', diff: 'hard',
      title: '撰寫 Log 分析腳本',
      desc: '撰寫腳本（.sh）自動判斷合成是否成功，並輸出 ERROR/WARNING 數量',
      objectives: [
        { id: 'o1', desc: '建立 .sh 腳本檔', check: (cmd, state) => /touch.*\.sh/.test(cmd) || state.lastCreatedSh },
        { id: 'o2', desc: '在腳本中使用 grep 搜尋 Error', check: (cmd) => /echo.*grep.*Error|grep.*Error/.test(cmd) },
        { id: 'o3', desc: '在腳本中使用條件判斷', check: (cmd) => /if\s+\[|if\s+grep/.test(cmd) },
      ],
      hints: [
        'touch check_log.sh 建立腳本（再用 cat > check_log.sh 寫入內容）',
        '用 echo 命令或 cat >> 將腳本內容寫入',
        '試試：if [ $(grep -c "Error" design/logs/synth.log) -gt 0 ]; then echo "FAIL"; fi',
      ]
    },
    {
      id: 'm20', cat: 'script', diff: 'hard',
      title: '使用迴圈批次處理',
      desc: '用 for 迴圈統計每個 .v 檔的行數，並找出最大的檔案',
      objectives: [
        { id: 'o1', desc: '用 for 迴圈遍歷 .v 檔', check: (cmd) => /for.*\.v|for.*rtl/.test(cmd) },
        { id: 'o2', desc: '在迴圈中計算行數', check: (cmd) => /wc.*-l/.test(cmd) && /for/.test(cmd) },
        { id: 'o3', desc: '使用排序找出最大的檔案', check: (cmd) => /wc.*-l.*sort|sort.*wc/.test(cmd) },
      ],
      hints: [
        'for f in design/rtl/*.v; do wc -l "$f"; done',
        '加上 sort -n 排序：for f in design/rtl/*.v; do wc -l "$f"; done | sort -n',
        '或者直接：wc -l design/rtl/*.v | sort -n',
      ]
    },
  ]
};
