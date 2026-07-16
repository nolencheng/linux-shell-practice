const COMMANDS_REF = [
  // ===== 基礎操作 =====
  { cmd:'ls', cat:'基礎操作', desc:'列出目錄內容',
    syntax:'ls [OPTIONS] [FILE...]',
    opts:[{f:'-l',d:'詳細格式（權限、大小、時間）'},{f:'-a',d:'顯示隱藏檔案（.開頭）'},{f:'-h',d:'人類可讀的檔案大小'},{f:'-R',d:'遞迴列出子目錄'},{f:'-t',d:'依修改時間排序'},{f:'-S',d:'依檔案大小排序'}],
    examples:[
      { desc:'列出詳細資訊含隱藏檔', cmd:'ls -la' },
      { desc:'列出 RTL 目錄所有 .v 檔', cmd:'ls design/rtl/*.v' },
      { desc:'依時間排序（最新在前）', cmd:'ls -lt reports/' },
    ]},
  { cmd:'cd', cat:'基礎操作', desc:'切換工作目錄',
    syntax:'cd [DIR]',
    opts:[{f:'cd ~',d:'回到家目錄'},{f:'cd -',d:'切換到上一個目錄'},{f:'cd ..',d:'切換到父目錄'}],
    examples:[
      { desc:'進入 design 目錄', cmd:'cd design' },
      { desc:'回到家目錄', cmd:'cd ~' },
      { desc:'進入兩層子目錄', cmd:'cd design/rtl' },
    ]},
  { cmd:'pwd', cat:'基礎操作', desc:'顯示目前工作目錄完整路徑',
    syntax:'pwd',
    opts:[],
    examples:[{ desc:'顯示目前路徑', cmd:'pwd' }]},
  { cmd:'mkdir', cat:'基礎操作', desc:'建立目錄',
    syntax:'mkdir [OPTIONS] DIR...',
    opts:[{f:'-p',d:'同時建立中間目錄，若已存在不報錯'}],
    examples:[
      { desc:'建立新目錄', cmd:'mkdir sim_results' },
      { desc:'遞迴建立多層目錄', cmd:'mkdir -p project/rtl/submod' },
    ]},
  { cmd:'touch', cat:'基礎操作', desc:'建立空檔案或更新時間戳記',
    syntax:'touch FILE...',
    opts:[],
    examples:[
      { desc:'建立新的腳本檔', cmd:'touch my_script.sh' },
      { desc:'同時建立多個檔案', cmd:'touch a.v b.v c.v' },
    ]},
  { cmd:'cp', cat:'基礎操作', desc:'複製檔案或目錄',
    syntax:'cp [OPTIONS] SRC DST',
    opts:[{f:'-r',d:'遞迴複製目錄'},{f:'-p',d:'保留原始權限和時間戳'},{f:'-v',d:'顯示複製過程'}],
    examples:[
      { desc:'複製報告檔', cmd:'cp reports/timing.rpt backup/' },
      { desc:'遞迴複製整個目錄', cmd:'cp -r design/ design_backup/' },
    ]},
  { cmd:'mv', cat:'基礎操作', desc:'移動或重新命名檔案',
    syntax:'mv [OPTIONS] SRC DST',
    opts:[{f:'-v',d:'顯示移動過程'},{f:'-n',d:'不覆蓋已存在的檔案'}],
    examples:[
      { desc:'重新命名檔案', cmd:'mv old_name.v new_name.v' },
      { desc:'移動到另一個目錄', cmd:'mv *.log logs/' },
    ]},
  { cmd:'rm', cat:'基礎操作', desc:'刪除檔案或目錄',
    syntax:'rm [OPTIONS] FILE...',
    opts:[{f:'-r',d:'遞迴刪除目錄'},{f:'-f',d:'強制刪除，不提示錯誤'},{f:'-i',d:'刪除前確認'}],
    examples:[
      { desc:'刪除所有 log 檔', cmd:'rm *.log' },
      { desc:'遞迴刪除目錄', cmd:'rm -rf sim_out/' },
    ]},

  // ===== 文字處理 =====
  { cmd:'cat', cat:'文字處理', desc:'顯示或合併檔案內容',
    syntax:'cat [OPTIONS] [FILE...]',
    opts:[{f:'-n',d:'顯示行號'},{f:'-A',d:'顯示不可見字元'}],
    examples:[
      { desc:'顯示合成 log', cmd:'cat design/logs/synth.log' },
      { desc:'顯示並加上行號', cmd:'cat -n design/reports/timing.rpt' },
      { desc:'合併多個 RTL 檔', cmd:'cat design/rtl/adder.v design/rtl/top.v' },
    ]},
  { cmd:'head', cat:'文字處理', desc:'顯示檔案開頭幾行',
    syntax:'head [-n NUM] [FILE...]',
    opts:[{f:'-n N',d:'顯示前 N 行（預設10）'}],
    examples:[
      { desc:'顯示 timing report 前20行', cmd:'head -n 20 design/reports/timing.rpt' },
    ]},
  { cmd:'tail', cat:'文字處理', desc:'顯示檔案結尾幾行',
    syntax:'tail [-n NUM] [-f] [FILE...]',
    opts:[{f:'-n N',d:'顯示後 N 行'},{f:'-f',d:'即時追蹤新增內容（監控 log）'}],
    examples:[
      { desc:'顯示 synth log 最後10行', cmd:'tail design/logs/synth.log' },
      { desc:'監控 simulation log（按 Ctrl+C 停止）', cmd:'tail -f design/logs/sim.log' },
    ]},
  { cmd:'grep', cat:'文字處理', desc:'搜尋符合模式的行',
    syntax:'grep [OPTIONS] PATTERN [FILE...]',
    opts:[{f:'-i',d:'忽略大小寫'},{f:'-n',d:'顯示行號'},{f:'-v',d:'顯示不符合的行'},{f:'-r',d:'遞迴搜尋目錄'},{f:'-c',d:'只顯示符合行數'},{f:'-l',d:'只顯示符合的檔名'},{f:'-E',d:'使用擴展正則表達式'}],
    examples:[
      { desc:'在 log 中找所有 Error', cmd:'grep "Error" design/logs/synth.log' },
      { desc:'找所有 timing violation（不分大小寫）', cmd:'grep -i "violated" design/reports/timing.rpt' },
      { desc:'在所有檔案中遞迴搜尋', cmd:'grep -r "always_ff" design/rtl/' },
      { desc:'找 Error 和 Warning 的行號', cmd:'grep -n "Error\\|Warning" design/logs/synth.log' },
      { desc:'統計 Warning 數量', cmd:'grep -c "Warning" design/logs/synth.log' },
    ]},
  { cmd:'awk', cat:'文字處理', desc:'強大的文字處理和資料提取工具',
    syntax:"awk [-F FS] 'PROGRAM' [FILE...]",
    opts:[{f:'-F sep',d:'設定欄位分隔字元'},{f:'NR',d:'目前行號'},{f:'NF',d:'目前行的欄位數'},{f:'$1,$2',d:'第1、第2欄位'},{f:'$0',d:'整行內容'}],
    examples:[
      { desc:'印出第1和第4欄', cmd:"awk '{print $1, $4}' design/reports/timing.rpt" },
      { desc:'印出含 slack 的行的最後一欄', cmd:"awk '/slack/{print $NF}' design/reports/timing.rpt" },
      { desc:'計算總 cell 數', cmd:"awk '/Total cell/{print $NF}' design/reports/area.rpt" },
      { desc:'以冒號為分隔符取第二欄', cmd:"awk -F: '{print $2}' /etc/passwd" },
      { desc:'印出行數和每行內容', cmd:"awk '{print NR\": \"$0}' design/logs/synth.log" },
    ]},
  { cmd:'sed', cat:'文字處理', desc:'串流編輯器，可取代、刪除、提取文字',
    syntax:"sed [OPTIONS] 'SCRIPT' [FILE...]",
    opts:[{f:'-n',d:'不自動印出，配合 /p 使用'},{f:'-e',d:'多個運算式'},{f:'-i',d:'就地修改檔案'}],
    examples:[
      { desc:'取代文字（第一個）', cmd:"sed 's/Error/ERROR/' design/logs/synth.log" },
      { desc:'全域取代', cmd:"sed 's/Warning/WARN/g' design/logs/synth.log" },
      { desc:'只印出含 VIOLATED 的行', cmd:"sed -n '/VIOLATED/p' design/reports/timing.rpt" },
      { desc:'刪除空行', cmd:"sed '/^$/d' design/logs/synth.log" },
      { desc:'印出第3到第10行', cmd:"sed -n '3,10p' design/reports/timing.rpt" },
    ]},
  { cmd:'cut', cat:'文字處理', desc:'按欄位或字元位置截取文字',
    syntax:'cut -d DELIM -f FIELDS [FILE...]',
    opts:[{f:'-d',d:'指定分隔字元'},{f:'-f',d:'選取欄位（例如 1,3 或 2-4）'},{f:'-c',d:'按字元位置截取'}],
    examples:[
      { desc:'取冒號分隔的第1欄', cmd:"cut -d: -f1 design/logs/synth.log" },
      { desc:'取第1到第3欄', cmd:"cut -d' ' -f1-3 design/reports/area.rpt" },
    ]},
  { cmd:'sort', cat:'文字處理', desc:'排序文字行',
    syntax:'sort [OPTIONS] [FILE...]',
    opts:[{f:'-n',d:'按數字排序'},{f:'-r',d:'反向排序'},{f:'-u',d:'去重複，只留唯一行'},{f:'-k N',d:'按第 N 欄排序'}],
    examples:[
      { desc:'依字母排序', cmd:'sort design/logs/synth.log' },
      { desc:'按第3欄數字排序', cmd:'sort -k3 -n design/reports/area.rpt' },
      { desc:'反向排序並去重', cmd:'sort -ru design/logs/synth.log' },
    ]},
  { cmd:'uniq', cat:'文字處理', desc:'過濾或報告重複行（需先排序）',
    syntax:'uniq [OPTIONS] [FILE...]',
    opts:[{f:'-c',d:'在行前顯示出現次數'},{f:'-d',d:'只顯示重複的行'},{f:'-u',d:'只顯示唯一的行'}],
    examples:[
      { desc:'計算重複的警告類型', cmd:'grep "Warning" design/logs/synth.log | sort | uniq -c' },
      { desc:'找只出現一次的錯誤', cmd:'sort design/logs/synth.log | uniq -u' },
    ]},
  { cmd:'wc', cat:'文字處理', desc:'計算行數、字數、字元數',
    syntax:'wc [OPTIONS] [FILE...]',
    opts:[{f:'-l',d:'只計算行數'},{f:'-w',d:'只計算字數'},{f:'-c',d:'只計算字元數'}],
    examples:[
      { desc:'計算 RTL 檔的行數', cmd:'wc -l design/rtl/*.v' },
      { desc:'計算 log 中的 Warning 數', cmd:'grep "Warning" design/logs/synth.log | wc -l' },
    ]},
  { cmd:'tr', cat:'文字處理', desc:'轉換或刪除字元',
    syntax:'tr [OPTIONS] SET1 [SET2]',
    opts:[{f:'-d',d:'刪除 SET1 中的字元'},{f:'-s',d:'壓縮連續重複字元'}],
    examples:[
      { desc:'轉換為大寫', cmd:'echo "hello world" | tr a-z A-Z' },
      { desc:'刪除所有數字', cmd:"echo 'abc123def' | tr -d '0-9'" },
      { desc:'將冒號替換為換行', cmd:"echo 'a:b:c' | tr ':' '\\n'" },
    ]},

  // ===== 搜尋 =====
  { cmd:'find', cat:'搜尋', desc:'在目錄中搜尋檔案',
    syntax:'find [PATH] [TESTS] [ACTIONS]',
    opts:[{f:'-name',d:'依檔名搜尋（支援萬用字元）'},{f:'-type f',d:'只找一般檔案'},{f:'-type d',d:'只找目錄'},{f:'-newer FILE',d:'找比 FILE 更新的檔案'},{f:'-exec CMD {} \\;',d:'對每個結果執行命令'}],
    examples:[
      { desc:'找所有 .v 檔', cmd:'find design -name "*.v"' },
      { desc:'找所有目錄', cmd:'find design -type d' },
      { desc:'找所有 log 檔並顯示大小', cmd:'find design -name "*.log" -type f' },
      { desc:'找比 Makefile 更新的 RTL 檔', cmd:'find design/rtl -name "*.v" -newer design/scripts/Makefile' },
    ]},
  { cmd:'which', cat:'搜尋', desc:'找出指令的完整路徑',
    syntax:'which COMMAND',
    opts:[],
    examples:[{ desc:'找 vcs 路徑', cmd:'which vcs' }]},

  // ===== 權限 =====
  { cmd:'chmod', cat:'權限管理', desc:'修改檔案或目錄權限',
    syntax:'chmod [OPTIONS] MODE FILE...',
    opts:[{f:'755',d:'擁有者可讀寫執行，其他人可讀執行'},{f:'644',d:'擁有者可讀寫，其他人唯讀'},{f:'+x',d:'新增執行權限'},{f:'-x',d:'移除執行權限'},{f:'-R',d:'遞迴修改目錄'}],
    examples:[
      { desc:'讓腳本可執行', cmd:'chmod +x design/scripts/run_sim.sh' },
      { desc:'設定成數字權限', cmd:'chmod 755 design/scripts/run_sim.sh' },
      { desc:'遞迴修改目錄權限', cmd:'chmod -R 755 design/scripts/' },
    ]},

  // ===== 管道重導向 =====
  { cmd:'|', cat:'管道重導向', desc:'管道：將前一個指令的輸出傳給下一個指令',
    syntax:'CMD1 | CMD2',
    opts:[],
    examples:[
      { desc:'找 Error 並計算數量', cmd:'grep "Error" design/logs/synth.log | wc -l' },
      { desc:'找 slack 行並排序', cmd:"grep 'slack' design/reports/timing.rpt | sort" },
      { desc:'找警告並去重複', cmd:'grep "Warning" design/logs/synth.log | sort | uniq' },
    ]},
  { cmd:'>', cat:'管道重導向', desc:'重導向：將輸出寫入檔案（覆蓋）',
    syntax:'CMD > FILE',
    opts:[{f:'>>',d:'追加到檔案（不覆蓋）'},{f:'2>',d:'重導向錯誤訊息'},{f:'2>&1',d:'將 stderr 合併到 stdout'}],
    examples:[
      { desc:'將 grep 結果存入檔案', cmd:'grep "Warning" design/logs/synth.log > warnings.txt' },
      { desc:'追加內容到 log', cmd:'echo "Build done" >> design/logs/synth.log' },
      { desc:'同時儲存輸出和錯誤', cmd:'make synth > build.log 2>&1' },
    ]},
  { cmd:'tee', cat:'管道重導向', desc:'同時顯示輸出並寫入檔案',
    syntax:'tee [OPTIONS] FILE',
    opts:[{f:'-a',d:'追加到檔案'}],
    examples:[
      { desc:'邊顯示邊儲存合成 log', cmd:'make synth | tee design/logs/synth.log' },
    ]},

  // ===== 環境變數 =====
  { cmd:'export', cat:'環境變數', desc:'設定並匯出環境變數',
    syntax:'export [NAME=VALUE]',
    opts:[],
    examples:[
      { desc:'設定 EDA 工具路徑', cmd:'export PATH=$PATH:/usr/local/synopsys/bin' },
      { desc:'設定 Synopsys 家目錄', cmd:'export SYNOPSYS=/usr/local/synopsys' },
      { desc:'查看所有環境變數', cmd:'export' },
    ]},
  { cmd:'env', cat:'環境變數', desc:'顯示所有環境變數或設定環境執行指令',
    syntax:'env [NAME=VALUE CMD]',
    opts:[],
    examples:[
      { desc:'顯示所有環境變數', cmd:'env' },
      { desc:'搜尋特定路徑變數', cmd:'env | grep PATH' },
    ]},
  { cmd:'source', cat:'環境變數', desc:'在當前 shell 中執行腳本（套用其設定）',
    syntax:'source FILE   或   . FILE',
    opts:[],
    examples:[
      { desc:'載入 .bashrc 設定', cmd:'source ~/.bashrc' },
      { desc:'載入工具環境設定', cmd:'. /usr/local/synopsys/setup.sh' },
    ]},

  // ===== 行程管理 =====
  { cmd:'ps', cat:'行程管理', desc:'顯示目前執行中的行程',
    syntax:'ps [OPTIONS]',
    opts:[{f:'-e',d:'顯示所有行程'},{f:'-f',d:'完整格式顯示'},{f:'aux',d:'顯示所有使用者的行程詳細資訊'}],
    examples:[
      { desc:'顯示目前行程', cmd:'ps' },
      { desc:'找 vcs 模擬行程', cmd:'ps aux | grep vcs' },
    ]},
  { cmd:'kill', cat:'行程管理', desc:'發送信號給行程',
    syntax:'kill [SIGNAL] PID',
    opts:[{f:'-9',d:'強制終止（SIGKILL）'},{f:'-15',d:'正常終止（SIGTERM，預設）'}],
    examples:[
      { desc:'正常終止行程', cmd:'kill 1234' },
      { desc:'強制終止行程', cmd:'kill -9 5678' },
    ]},

  // ===== 壓縮 =====
  { cmd:'tar', cat:'壓縮封存', desc:'建立或解開封存檔',
    syntax:'tar [OPTIONS] [FILE...]',
    opts:[{f:'-c',d:'建立封存'},{f:'-x',d:'解開封存'},{f:'-z',d:'使用 gzip 壓縮'},{f:'-f FILE',d:'指定封存檔名'},{f:'-v',d:'顯示詳細過程'}],
    examples:[
      { desc:'壓縮整個 design 目錄', cmd:'tar -czf design_backup.tar.gz design/' },
      { desc:'解壓縮', cmd:'tar -xzf design_backup.tar.gz' },
      { desc:'查看壓縮檔內容', cmd:'tar -tzf design_backup.tar.gz' },
    ]},

  // ===== Git =====
  { cmd:'git', cat:'Git版本控制', desc:'版本控制系統',
    syntax:'git COMMAND [OPTIONS]',
    opts:[{f:'init',d:'初始化 repository'},{f:'add',d:'加入追蹤'},{f:'commit',d:'提交變更'},{f:'status',d:'查看狀態'},{f:'log',d:'查看歷史紀錄'},{f:'diff',d:'查看差異'},{f:'branch',d:'管理分支'},{f:'merge',d:'合併分支'},{f:'stash',d:'暫存變更'}],
    examples:[
      { desc:'查看目前狀態', cmd:'git status' },
      { desc:'加入所有變更', cmd:'git add .' },
      { desc:'提交並附上訊息', cmd:'git commit -m "Add timing constraints"' },
      { desc:'查看簡潔的 log', cmd:'git log --oneline --graph' },
      { desc:'查看差異', cmd:'git diff' },
    ]},

  // ===== Makefile =====
  { cmd:'make', cat:'Makefile', desc:'根據 Makefile 執行建構任務',
    syntax:'make [OPTIONS] [TARGET]',
    opts:[{f:'-f FILE',d:'指定不同的 Makefile'},{f:'-j N',d:'並行執行 N 個任務'},{f:'-n',d:'只顯示將執行的命令（不實際執行）'},{f:'-C DIR',d:'切換到目錄再執行'}],
    examples:[
      { desc:'執行預設 target', cmd:'make' },
      { desc:'執行 sim target', cmd:'make sim' },
      { desc:'清理編譯產物', cmd:'make clean' },
      { desc:'只顯示將要執行的命令', cmd:'make -n sim' },
    ]},
];

const REF_CATS = [...new Set(COMMANDS_REF.map(c => c.cat))];
