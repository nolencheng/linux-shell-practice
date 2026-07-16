// ===== VIRTUAL FILESYSTEM =====
function makeDir(children = {}) { return { t: 'd', m: '755', c: children }; }
function makeFile(content = '', mode = '644') { return { t: 'f', m: mode, content }; }

const VFS_INIT = () => ({
  t: 'd', m: '755', c: {
    home: makeDir({ user: makeDir({
      design: makeDir({
        rtl: makeDir({
          'adder.v': makeFile(
`module adder #(parameter WIDTH = 8) (
  input  logic [WIDTH-1:0] a, b,
  input  logic             cin,
  output logic [WIDTH-1:0] sum,
  output logic             cout
);
  assign {cout, sum} = a + b + cin;
endmodule`),
          'multiplier.v': makeFile(
`module multiplier #(parameter WIDTH = 8) (
  input  logic [WIDTH-1:0]   a, b,
  output logic [2*WIDTH-1:0] product
);
  assign product = a * b;
endmodule`),
          'fsm_ctrl.v': makeFile(
`module fsm_ctrl (
  input  logic clk, rst_n, en,
  output logic [1:0] state
);
  typedef enum logic [1:0] { IDLE=0, RUN=1, WAIT=2, DONE=3 } state_t;
  state_t curr, next;
  always_ff @(posedge clk or negedge rst_n)
    if (!rst_n) curr <= IDLE;
    else        curr <= next;
  always_comb begin
    next = curr;
    case (curr)
      IDLE: if (en) next = RUN;
      RUN:  next = WAIT;
      WAIT: next = DONE;
      DONE: next = IDLE;
    endcase
  end
  assign state = curr;
endmodule`),
          'top.v': makeFile(
`module top (
  input  logic       clk, rst_n,
  input  logic [7:0] data_in,
  output logic [7:0] data_out
);
  // TODO: implement top-level module
  always_ff @(posedge clk or negedge rst_n)
    if (!rst_n) data_out <= 8'h00;
    else        data_out <= data_in;
endmodule`)
        }),
        tb: makeDir({
          'tb_adder.sv': makeFile(
`module tb_adder;
  logic [7:0] a, b, sum;
  logic cin, cout;

  adder dut (.a(a), .b(b), .cin(cin), .sum(sum), .cout(cout));

  initial begin
    $dumpfile("tb_adder.vcd");
    $dumpvars(0, tb_adder);
    cin = 0;
    a = 8'h5A; b = 8'h3C; #10;
    $display("[%0t] a=%0d b=%0d sum=%0d cout=%b", $time, a, b, sum, cout);
    a = 8'hFF; b = 8'h01; #10;
    $display("[%0t] a=%0d b=%0d sum=%0d cout=%b", $time, a, b, sum, cout);
    $finish;
  end
endmodule`)
        }),
        scripts: makeDir({
          'run_sim.sh': makeFile(
`#!/bin/bash
# VCS Simulation Script
set -e

DESIGN=top
SRCDIR=../rtl
TBDIR=../tb
OUTDIR=./sim_out

mkdir -p $OUTDIR

echo "[INFO] Compiling design: $DESIGN"
vcs -full64 -sverilog \\
    $SRCDIR/adder.v \\
    $SRCDIR/top.v \\
    $TBDIR/tb_adder.sv \\
    -o $OUTDIR/simv \\
    -l $OUTDIR/compile.log

echo "[INFO] Running simulation..."
$OUTDIR/simv -l $OUTDIR/sim.log

echo "[INFO] Done. Check $OUTDIR/sim.log for results."`, '755'),
          'synth.tcl': makeFile(
`# Synopsys Design Compiler Script
set_app_var target_library "slow.db"
set_app_var link_library   "* slow.db"

# Read RTL
read_verilog [glob ../rtl/*.v]
current_design top
link

# Apply constraints
create_clock -period 2.0 [get_ports clk]
set_input_delay  0.3 -clock clk [all_inputs]
set_output_delay 0.3 -clock clk [all_outputs]

# Compile
compile_ultra

# Reports
report_timing -max_paths 10 > ../reports/timing.rpt
report_area                  > ../reports/area.rpt
report_power                 > ../reports/power.rpt

# Write netlist
write -f verilog -output ../netlist/top_netlist.v
exit`),
          'Makefile': makeFile(
`# IC Design Flow Makefile
DESIGN  = top
SRCDIR  = rtl
TBDIR   = tb
RPTDIR  = reports

VCS     = vcs
VFLAGS  = -full64 -sverilog -timescale=1ns/1ps

DC      = dc_shell
DCFLAGS = -f

.PHONY: sim synth lint clean help

help:
\t@echo "Targets: sim synth lint clean"

sim:
\t$(VCS) $(VFLAGS) $(SRCDIR)/*.v $(TBDIR)/*.sv -o simv
\t./simv | tee $(RPTDIR)/sim.log

synth:
\t$(DC) $(DCFLAGS) scripts/synth.tcl | tee $(RPTDIR)/synth.log

lint:
\tverilator --lint-only -sv $(SRCDIR)/*.v 2>&1 | tee $(RPTDIR)/lint.log

clean:
\trm -rf simv simv.daidir csrc DVEfiles ucli.key`)
        }),
        reports: makeDir({
          'timing.rpt': makeFile(
`Report: timing
        -path full
        -delay max
        -max_paths 10
Design: top
Version: R-2023.12

Operating Conditions: slow   Library: slow

Path 1:
  Startpoint: u_adder/sum_reg[0]
              (rising edge-triggered flip-flop clocked by clk)
  Endpoint:   u_mult/prod_reg[7]
              (rising edge-triggered flip-flop clocked by clk)
  slack (MET)                                         1.56 ns

Path 2:
  Startpoint: u_ctrl/state_reg[1]
  Endpoint:   u_ctrl/next_reg[0]
  slack (MET)                                         0.89 ns

Path 3:
  Startpoint: u_fifo/rptr_reg[3]
  Endpoint:   u_fifo/wptr_reg[3]
  slack (VIOLATED)                                   -0.23 ns

Path 4:
  Startpoint: u_alu/result_reg[15]
  Endpoint:   u_alu/result_reg[15]
  slack (MET)                                         2.11 ns

Path 5:
  Startpoint: u_mem/addr_reg[7]
  Endpoint:   u_mem/data_reg[0]
  slack (VIOLATED)                                   -0.08 ns

Path 6:
  Startpoint: u_core/out_reg[0]
  Endpoint:   u_core/out_reg[1]
  slack (MET)                                         0.42 ns

Slack summary:
  MET:       4 paths
  VIOLATED:  2 paths
  TNS:       -0.31 ns`),
          'area.rpt': makeFile(
`Report: area
Design: top
Version: R-2023.12

Number of ports:                          42
Number of nets:                          318
Number of cells:                         267
Number of combinational cells:           189
Number of sequential cells:               78
Number of references:                     15

Combinational area:              456.780000
Buf/Inv area:                     23.140000
Noncombinational area:           312.000000
Net Interconnect area:            89.230000

Total cell area:                 768.780000
Total area:                      858.010000`),
          'power.rpt': makeFile(
`Report: power
Design: top
Version: R-2023.12

  Cell Internal Power  =  1.2345 mW  (68%)
  Net Switching Power  =  0.5678 mW  (31%)
  Total Dynamic Power  =  1.8023 mW  (99%)
  Cell Leakage Power   =  0.0156 mW   (1%)

Total Power = 1.8179 mW`)
        }),
        logs: makeDir({
          'synth.log': makeFile(
`Starting Synopsys Design Compiler R-2023.12...
Loading target library: slow.db

Reading Verilog file: ../rtl/adder.v ... done
Reading Verilog file: ../rtl/multiplier.v ... done
Reading Verilog file: ../rtl/fsm_ctrl.v ... done
Reading Verilog file: ../rtl/top.v ... done

Warning: Net 'reset_n' has no driver. (ELAB-311)
Warning: Port 'data_in[7:4]' is not connected. (ELAB-321)
Error: Multiple drivers found on net 'bus_out[3]'. (ELAB-399)
Warning: Latch inferred for signal 'state' in module 'fsm_ctrl'. (SYNTH-5)
Warning: Clock 'clk2' has no associated constraints. (OPT-007)
Warning: Unable to optimize hold time. (OPT-114)

Linking design 'top'...
Compiling with compile_ultra...

Total cells: 267
Total area:  858.01 um^2
Worst slack: -0.23 ns (VIOLATED)
TNS:         -0.31 ns

Errors:   1
Warnings: 5
Synthesis COMPLETED with errors.`),
          'sim.log': makeFile(
`VCS Simulator R-2023.12 initialized.
Compiling SystemVerilog files...
  ../rtl/adder.v
  ../tb/tb_adder.sv

Simulation start.
[0]  Reset asserted
[10] a=90 b=60 sum=150 cout=0
[20] a=255 b=1 sum=0 cout=1
PASS: overflow detected correctly
FAIL: Expected sum=42, got sum=41 at time 30ns

Tests: 3 PASS, 1 FAIL
Simulation complete.`)
        }),
        netlist: makeDir({}),
      }),
      workspace: makeDir({
        'notes.txt': makeFile(
`IC Design Flow Notes
====================
1. RTL Coding (SystemVerilog)
2. Lint Check (Spyglass/Verilator)
3. Simulation (VCS/Xcelium)
4. Synthesis (DC/Genus)
5. Formal Verification (JasperGold)
6. Place & Route (ICC2/Innovus)
7. Sign-off (PrimeTime/Calibre)

Clock period: 2.0 ns (500 MHz)
Target library: TSMC 28nm slow corner`),
        'todo.txt': makeFile(
`TODO List
---------
[x] Write RTL for adder module
[x] Write RTL for FSM controller
[ ] Complete top-level integration
[ ] Write comprehensive testbench
[ ] Fix timing violations (2 paths)
[ ] Review lint warnings
[ ] Submit to synthesis team`)
      }),
      '.bashrc': makeFile(
`# ~/.bashrc
export PATH=$PATH:/usr/local/eda/bin:/usr/local/synopsys/bin
export SYNOPSYS=/usr/local/synopsys
export VCS_HOME=$SYNOPSYS/vcs
export DC_HOME=$SYNOPSYS/syn

alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias gs='git status'
alias glog='git log --oneline --graph --decorate'
alias grep='grep --color=auto'

# EDA shortcuts
alias dcs='dc_shell -f'
alias vcs_run='vcs -full64 -sverilog'

# IC design helpers
alias chk_err='grep -E "Error|ERROR" '
alias chk_warn='grep -E "Warning|WARN" '
alias chk_slack='grep -E "slack" '

PS1='\\u@linux-practice:\\w\\$ '`),
      '.bash_history': makeFile(
`ls -la
cd design
ls -la design/rtl/
cat design/logs/synth.log
grep "Error" design/logs/synth.log
grep -c "Warning" design/logs/synth.log
awk '/slack/{print}' design/reports/timing.rpt
sed -n '/VIOLATED/p' design/reports/timing.rpt
find design -name "*.v" -type f
wc -l design/rtl/*.v
chmod +x design/scripts/run_sim.sh
tar -czf backup.tar.gz design/
git status`),
    }) }),
    tmp: { t: 'd', m: '1777', c: {} },
    usr: makeDir({ local: makeDir({ eda: makeDir({ bin: makeDir({}) }) }) }),
  }
});

// ===== VFS OPERATIONS =====
class VirtualFS {
  constructor() { this.root = VFS_INIT(); this.cwd = '/home/user'; }

  normPath(p) {
    if (!p) return this.cwd;
    const abs = p.startsWith('/') ? p : this.cwd + '/' + p;
    const parts = abs.split('/').filter(Boolean);
    const res = [];
    for (const part of parts) {
      if (part === '.') continue;
      else if (part === '..') res.pop();
      else res.push(part);
    }
    return '/' + res.join('/');
  }

  node(path) {
    const p = this.normPath(path);
    if (p === '/') return this.root;
    const parts = p.split('/').filter(Boolean);
    let cur = this.root;
    for (const part of parts) {
      if (!cur || cur.t !== 'd' || !cur.c[part]) return null;
      cur = cur.c[part];
    }
    return cur;
  }

  parentAndName(path) {
    const p = this.normPath(path);
    const i = p.lastIndexOf('/');
    return { parentPath: p.slice(0, i) || '/', name: p.slice(i + 1) };
  }

  ls(path, opts = {}) {
    const n = this.node(path || this.cwd);
    if (!n) return { err: `ls: cannot access '${path}': No such file or directory` };
    if (n.t === 'f') {
      const name = (path || this.cwd).split('/').pop();
      return { items: [{ name, node: n }] };
    }
    let items = Object.entries(n.c).map(([name, node]) => ({ name, node }));
    if (!opts.all) items = items.filter(i => !i.name.startsWith('.'));
    items.sort((a, b) => {
      if (a.node.t !== b.node.t) return a.node.t === 'd' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    return { items };
  }

  formatLs(items, opts) {
    if (!opts.long) {
      const names = items.map(({ name, node }) => {
        const isDir = node.t === 'd';
        return `<span class="${isDir ? 't-cyan' : ''}">${name}${isDir ? '/' : ''}</span>`;
      });
      return names.join('  ');
    }
    return items.map(({ name, node }) => {
      const isDir = node.t === 'd';
      const type = isDir ? 'd' : '-';
      const m = node.m || (isDir ? '755' : '644');
      const perm = this._modeToPerm(type, m);
      const size = node.t === 'f' ? (node.content || '').length : 4096;
      const date = 'Jul 10 14:23';
      const colored = isDir ? `<span class="t-cyan">${name}/</span>` :
                      m.includes('7') || m === '755' ? `<span class="t-success">${name}*</span>` : name;
      return `${perm}  1 user user ${String(size).padStart(6)} ${date} ${colored}`;
    }).join('\n');
  }

  _modeToPerm(type, m) {
    const d = ['---','--x','-w-','-wx','r--','r-x','rw-','rwx'];
    const n = m.padStart(3,'0').split('').map(Number);
    return type + (d[n[0]]||'---') + (d[n[1]]||'---') + (d[n[2]]||'---');
  }

  mkdir(path, parents = false) {
    const { parentPath, name } = this.parentAndName(path);
    const parent = this.node(parentPath);
    if (!parent) {
      if (parents) { this.mkdir(parentPath, true); return this.mkdir(path, false); }
      return { err: `mkdir: cannot create directory '${path}': No such file or directory` };
    }
    if (parent.t !== 'd') return { err: `mkdir: '${parentPath}': Not a directory` };
    if (parent.c[name]) return { err: `mkdir: cannot create directory '${path}': File exists` };
    parent.c[name] = makeDir();
    return {};
  }

  touch(path) {
    const { parentPath, name } = this.parentAndName(path);
    const parent = this.node(parentPath);
    if (!parent || parent.t !== 'd') return { err: `touch: cannot touch '${path}': No such file or directory` };
    if (!parent.c[name]) parent.c[name] = makeFile('');
    return {};
  }

  rm(path, opts = {}) {
    const { parentPath, name } = this.parentAndName(path);
    const parent = this.node(parentPath);
    const target = this.node(path);
    if (!target) {
      if (opts.force) return {};
      return { err: `rm: cannot remove '${path}': No such file or directory` };
    }
    if (target.t === 'd' && !opts.recursive) return { err: `rm: cannot remove '${path}': Is a directory` };
    delete parent.c[name];
    return {};
  }

  cp(src, dst, opts = {}) {
    const srcNode = this.node(src);
    if (!srcNode) return { err: `cp: cannot stat '${src}': No such file or directory` };
    if (srcNode.t === 'd' && !opts.recursive) return { err: `cp: -r not specified; omitting directory '${src}'` };
    const dstNode = this.node(dst);
    const { parentPath, name } = this.parentAndName(dst);
    const dstParent = dstNode && dstNode.t === 'd' ? dstNode : this.node(parentPath);
    if (!dstParent) return { err: `cp: cannot create regular file '${dst}': No such file or directory` };
    const dstName = dstNode && dstNode.t === 'd' ? src.split('/').pop() : name;
    dstParent.c[dstName] = JSON.parse(JSON.stringify(srcNode));
    return {};
  }

  mv(src, dst) {
    const srcNode = this.node(src);
    if (!srcNode) return { err: `mv: cannot stat '${src}': No such file or directory` };
    const dstNode = this.node(dst);
    const { parentPath: sp, name: sname } = this.parentAndName(src);
    const { parentPath: dp, name: dname } = this.parentAndName(dst);
    const srcParent = this.node(sp);
    const dstParent = dstNode && dstNode.t === 'd' ? dstNode : this.node(dp);
    if (!dstParent) return { err: `mv: cannot move '${src}' to '${dst}': No such file or directory` };
    const finalName = dstNode && dstNode.t === 'd' ? sname : dname;
    dstParent.c[finalName] = srcNode;
    delete srcParent.c[sname];
    return {};
  }

  cat(path) {
    const n = this.node(path);
    if (!n) return { err: `cat: ${path}: No such file or directory` };
    if (n.t === 'd') return { err: `cat: ${path}: Is a directory` };
    return { out: n.content || '' };
  }

  readFile(path) { const n = this.node(path); return n && n.t === 'f' ? n.content : null; }
  writeFile(path, content) {
    const { parentPath, name } = this.parentAndName(path);
    const parent = this.node(parentPath);
    if (!parent || parent.t !== 'd') return false;
    if (!parent.c[name]) parent.c[name] = makeFile('');
    parent.c[name].content = content;
    return true;
  }
  appendFile(path, content) {
    const n = this.node(path);
    if (n && n.t === 'f') { n.content += content; return true; }
    return this.writeFile(path, content);
  }
  chmod(path, mode) {
    const n = this.node(path);
    if (!n) return { err: `chmod: cannot access '${path}': No such file or directory` };
    n.m = mode;
    return {};
  }
  find(startPath, tests) {
    const results = [];
    const walk = (p, node) => {
      const name = p.split('/').pop();
      let pass = true;
      for (const t of tests) {
        if (t.type === 'name') { if (!this._globMatch(name, t.val)) pass = false; }
        if (t.type === 'type') { if (t.val === 'f' && node.t !== 'f') pass = false; if (t.val === 'd' && node.t !== 'd') pass = false; }
      }
      if (pass && p !== startPath) results.push(p);
      if (node.t === 'd') Object.entries(node.c).forEach(([n2, ch]) => walk(p + '/' + n2, ch));
    };
    const startNode = this.node(startPath);
    if (startNode) walk(startPath, startNode);
    return results;
  }
  _globMatch(str, pattern) {
    const re = '^' + pattern.replace(/\./g,'\\.')
                            .replace(/\*/g,'.*')
                            .replace(/\?/g,'.') + '$';
    return new RegExp(re).test(str);
  }
}

// ===== BASH INTERPRETER =====
class BashInterpreter {
  constructor() {
    this.vfs = new VirtualFS();
    this.env = {
      HOME: '/home/user', USER: 'user', SHELL: '/bin/bash',
      PATH: '/usr/local/eda/bin:/usr/bin:/bin',
      SYNOPSYS: '/usr/local/synopsys',
      PS1: '\\u@linux-practice:\\w\\$ ',
      TERM: 'xterm-256color', LANG: 'en_US.UTF-8',
    };
    this.vars = {};
    this.history = [];
    this.histIdx = -1;
    this.aliases = { ll: 'ls -la', la: 'ls -A', gs: 'git status' };
  }

  prompt() {
    const cwd = this.vfs.cwd;
    const home = this.env.HOME;
    const display = cwd.startsWith(home) ? '~' + cwd.slice(home.length) : cwd;
    return `<span class="t-ps">user@linux-practice</span>:<span class="t-cyan">${display}</span>$ `;
  }

  expandVars(str) {
    // $((expr)) arithmetic
    str = str.replace(/\$\(\(([^)]+)\)\)/g, (_, expr) => {
      try { return String(Function('"use strict";return (' + expr.replace(/\$/g,'') + ')')()) }
      catch { return '0'; }
    });
    // $(cmd) command substitution
    str = str.replace(/\$\(([^)]+)\)/g, (_, cmd) => {
      const r = this.execute(cmd.trim()); return r.stdout.trimEnd();
    });
    // ${VAR} and $VAR
    str = str.replace(/\$\{([^}]+)\}/g, (_, v) => this.getVar(v));
    str = str.replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_, v) => this.getVar(v));
    str = str.replace(/\$\?/g, String(this._lastExit || 0));
    str = str.replace(/\$\$/g, '1234');
    return str;
  }

  getVar(name) { return this.vars[name] ?? this.env[name] ?? ''; }

  tokenize(line) {
    const tokens = [];
    let cur = '';
    let inSQ = false, inDQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inSQ) { if (ch === "'") inSQ = false; else cur += ch; }
      else if (inDQ) { if (ch === '"') inDQ = false; else if (ch === '\\' && line[i+1]) { cur += line[++i]; } else cur += ch; }
      else if (ch === "'") inSQ = true;
      else if (ch === '"') inDQ = true;
      else if (ch === '\\' && line[i+1]) { cur += line[++i]; }
      else if (ch === ' ' || ch === '\t') { if (cur) { tokens.push(cur); cur = ''; } }
      else cur += ch;
    }
    if (cur) tokens.push(cur);
    return tokens;
  }

  execute(line) {
    line = line.trim();
    if (!line || line.startsWith('#')) return { stdout: '', stderr: '', code: 0 };

    // Handle VAR=value assignment
    const assignMatch = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (assignMatch && !line.startsWith(' ')) {
      this.vars[assignMatch[1]] = this.expandVars(assignMatch[2].replace(/^["']|["']$/g, ''));
      return { stdout: '', stderr: '', code: 0 };
    }

    // Check aliases
    const firstWord = line.split(/\s+/)[0];
    if (this.aliases[firstWord]) {
      line = this.aliases[firstWord] + line.slice(firstWord.length);
    }

    // Parse pipeline
    const pipeline = this.splitPipeline(line);
    let stdin = '';
    let lastResult = { stdout: '', stderr: '', code: 0 };
    for (let i = 0; i < pipeline.length; i++) {
      const { cmd, redirect } = pipeline[i];
      const result = this.runCmd(cmd, stdin);
      stdin = result.stdout;
      // Handle redirections
      for (const r of redirect) {
        if (r.type === '>') { this.vfs.writeFile(this.vfs.normPath(r.file), result.stdout); result.stdout = ''; }
        else if (r.type === '>>') { this.vfs.appendFile(this.vfs.normPath(r.file), result.stdout); result.stdout = ''; }
        else if (r.type === '2>') { /* discard stderr */ result.stderr = ''; }
      }
      lastResult = result;
    }
    this._lastExit = lastResult.code;
    return lastResult;
  }

  splitPipeline(line) {
    const segments = [];
    let cur = '';
    let inSQ = false, inDQ = false;
    let i = 0;
    while (i < line.length) {
      const ch = line[i];
      if (inSQ) { if (ch === "'") inSQ = false; else cur += ch; }
      else if (inDQ) { if (ch === '"') inDQ = false; else cur += ch; }
      else if (ch === "'") inSQ = true;
      else if (ch === '"') inDQ = true;
      else if (ch === '|' && line[i+1] !== '|') {
        segments.push(cur.trim()); cur = ''; i++; continue;
      } else cur += ch;
      i++;
    }
    if (cur.trim()) segments.push(cur.trim());
    return segments.map(seg => this.parseRedirects(seg));
  }

  parseRedirects(seg) {
    const redirect = [];
    seg = seg.replace(/2>&1/g, '').replace(/([>]{1,2})\s*(\S+)/g, (_, op, file) => {
      redirect.push({ type: op, file }); return '';
    }).replace(/2>\s*(\S+)/g, (_, file) => {
      redirect.push({ type: '2>', file }); return '';
    });
    return { cmd: seg.trim(), redirect };
  }

  globExpand(tokens) {
    const result = [];
    for (const tok of tokens) {
      if (!/[*?]/.test(tok)) { result.push(tok); continue; }
      const lastSlash = tok.lastIndexOf('/');
      const dir = lastSlash >= 0 ? this.vfs.normPath(tok.slice(0, lastSlash)) : this.vfs.cwd;
      const pat = lastSlash >= 0 ? tok.slice(lastSlash + 1) : tok;
      const prefix = lastSlash >= 0 ? tok.slice(0, lastSlash + 1) : '';
      const node = this.vfs.node(dir);
      if (!node || node.t !== 'd') { result.push(tok); continue; }
      const matches = Object.keys(node.c)
        .filter(n => this.vfs._globMatch(n, pat))
        .sort()
        .map(n => prefix + n);
      if (matches.length) result.push(...matches);
      else result.push(tok);
    }
    return result;
  }

  runCmd(rawCmd, stdin = '') {
    rawCmd = this.expandVars(rawCmd);
    let tokens = this.tokenize(rawCmd);
    if (!tokens.length) return { stdout: '', stderr: '', code: 0 };
    const cmd = tokens[0];
    const args = this.globExpand(tokens.slice(1));
    const dispatch = {
      pwd: () => this.cmdPwd(),
      cd: () => this.cmdCd(args),
      ls: () => this.cmdLs(args),
      ll: () => this.cmdLs(['-la', ...args]),
      mkdir: () => this.cmdMkdir(args),
      touch: () => this.cmdTouch(args),
      rm: () => this.cmdRm(args),
      cp: () => this.cmdCp(args),
      mv: () => this.cmdMv(args),
      cat: () => this.cmdCat(args, stdin),
      echo: () => this.cmdEcho(args),
      printf: () => this.cmdPrintf(args),
      head: () => this.cmdHead(args, stdin),
      tail: () => this.cmdTail(args, stdin),
      grep: () => this.cmdGrep(args, stdin),
      awk: () => this.cmdAwk(args, stdin),
      sed: () => this.cmdSed(args, stdin),
      cut: () => this.cmdCut(args, stdin),
      sort: () => this.cmdSort(args, stdin),
      uniq: () => this.cmdUniq(args, stdin),
      wc: () => this.cmdWc(args, stdin),
      tr: () => this.cmdTr(args, stdin),
      find: () => this.cmdFind(args),
      chmod: () => this.cmdChmod(args),
      env: () => this.cmdEnv(args),
      export: () => this.cmdExport(args),
      unset: () => this.cmdUnset(args),
      printenv: () => this.cmdPrintenv(args),
      source: () => this.cmdSource(args),
      '.': () => this.cmdSource(args),
      history: () => this.cmdHistory(args),
      clear: () => ({ stdout: '\x1bc', stderr: '', code: 0 }),
      which: () => this.cmdWhich(args),
      man: () => this.cmdMan(args),
      alias: () => this.cmdAlias(args),
      date: () => ({ stdout: new Date().toString(), stderr: '', code: 0 }),
      whoami: () => ({ stdout: 'user', stderr: '', code: 0 }),
      hostname: () => ({ stdout: 'linux-practice', stderr: '', code: 0 }),
      uname: () => this.cmdUname(args),
      ps: () => this.cmdPs(args),
      kill: () => this.cmdKill(args),
      tee: () => this.cmdTee(args, stdin),
      xargs: () => this.cmdXargs(args, stdin),
      tar: () => this.cmdTar(args),
      gzip: () => ({ stdout: '', stderr: 'gzip: (simulated, no actual compression)', code: 0 }),
      git: () => this.cmdGit(args),
      make: () => this.cmdMake(args),
      diff: () => this.cmdDiff(args),
      wdiff: () => ({ stdout: 'wdiff: not available in simulator', stderr: '', code: 1 }),
      less: () => this.cmdCat(args, stdin),
      more: () => this.cmdCat(args, stdin),
      tac: () => { const r = this.cmdCat(args, stdin); r.stdout = r.stdout.split('\n').reverse().join('\n'); return r; },
      nl: () => this.cmdNl(args, stdin),
      true: () => ({ stdout: '', stderr: '', code: 0 }),
      false: () => ({ stdout: '', stderr: '', code: 1 }),
      test: () => this.cmdTest(args),
      '[': () => this.cmdTest(args.slice(0, -1)),
      basename: () => ({ stdout: args[0] ? args[0].split('/').pop() : '', stderr: '', code: 0 }),
      dirname: () => { const p = args[0] || '.'; const d = p.includes('/') ? p.slice(0, p.lastIndexOf('/')) || '/': '.'; return { stdout: d, stderr: '', code: 0 }; },
      sleep: () => ({ stdout: '', stderr: '(sleep simulated)', code: 0 }),
      exit: () => ({ stdout: '', stderr: '', code: parseInt(args[0] || '0') }),
    };
    if (dispatch[cmd]) return dispatch[cmd]();
    if (cmd.startsWith('./') || cmd.startsWith('/')) return this.cmdRunScript(cmd, args);
    return { stdout: '', stderr: `bash: ${cmd}: command not found`, code: 127 };
  }

  cmdPwd() { return { stdout: this.vfs.cwd, stderr: '', code: 0 }; }

  cmdCd(args) {
    const target = args[0] || this.env.HOME;
    const path = this.vfs.normPath(target);
    const n = this.vfs.node(path);
    if (!n) return { stdout: '', stderr: `bash: cd: ${target}: No such file or directory`, code: 1 };
    if (n.t !== 'd') return { stdout: '', stderr: `bash: cd: ${target}: Not a directory`, code: 1 };
    this.vfs.cwd = path;
    return { stdout: '', stderr: '', code: 0 };
  }

  cmdLs(args) {
    const opts = { long: false, all: false, human: false };
    const paths = [];
    for (const a of args) {
      if (a.startsWith('-')) { if (a.includes('l')) opts.long = true; if (a.includes('a')) opts.all = true; if (a.includes('h')) opts.human = true; }
      else paths.push(a);
    }
    if (!paths.length) paths.push(null);
    const outs = [];
    for (const p of paths) {
      const res = this.vfs.ls(p, opts);
      if (res.err) return { stdout: '', stderr: res.err, code: 1 };
      if (paths.length > 1) outs.push((p || '.') + ':');
      outs.push(this.vfs.formatLs(res.items, opts));
    }
    return { stdout: outs.join('\n'), stderr: '', code: 0 };
  }

  cmdMkdir(args) {
    const parents = args.includes('-p');
    const paths = args.filter(a => !a.startsWith('-'));
    for (const p of paths) {
      const r = this.vfs.mkdir(p, parents);
      if (r.err) return { stdout: '', stderr: r.err, code: 1 };
    }
    return { stdout: '', stderr: '', code: 0 };
  }

  cmdTouch(args) {
    for (const p of args.filter(a => !a.startsWith('-'))) {
      const r = this.vfs.touch(p);
      if (r.err) return { stdout: '', stderr: r.err, code: 1 };
    }
    return { stdout: '', stderr: '', code: 0 };
  }

  cmdRm(args) {
    const opts = { recursive: false, force: false };
    const paths = [];
    for (const a of args) {
      if (a.startsWith('-')) { if (a.includes('r') || a.includes('R')) opts.recursive = true; if (a.includes('f')) opts.force = true; }
      else paths.push(a);
    }
    for (const p of paths) {
      const r = this.vfs.rm(p, opts);
      if (r.err) return { stdout: '', stderr: r.err, code: 1 };
    }
    return { stdout: '', stderr: '', code: 0 };
  }

  cmdCp(args) {
    const opts = { recursive: false };
    const paths = [];
    for (const a of args) {
      if (a.startsWith('-')) { if (a.includes('r') || a.includes('R')) opts.recursive = true; }
      else paths.push(a);
    }
    if (paths.length < 2) return { stdout: '', stderr: 'cp: missing destination file operand', code: 1 };
    const dst = paths.pop();
    for (const src of paths) {
      const r = this.vfs.cp(src, dst, opts);
      if (r.err) return { stdout: '', stderr: r.err, code: 1 };
    }
    return { stdout: '', stderr: '', code: 0 };
  }

  cmdMv(args) {
    if (args.length < 2) return { stdout: '', stderr: 'mv: missing destination', code: 1 };
    const dst = args[args.length - 1];
    for (const src of args.slice(0, -1)) {
      const r = this.vfs.mv(src, dst);
      if (r.err) return { stdout: '', stderr: r.err, code: 1 };
    }
    return { stdout: '', stderr: '', code: 0 };
  }

  cmdCat(args, stdin) {
    const paths = args.filter(a => !a.startsWith('-'));
    if (!paths.length) return { stdout: stdin, stderr: '', code: 0 };
    const parts = [];
    for (const p of paths) {
      const r = this.vfs.cat(p);
      if (r.err) return { stdout: '', stderr: r.err, code: 1 };
      parts.push(r.out);
    }
    return { stdout: parts.join('\n'), stderr: '', code: 0 };
  }

  cmdEcho(args) {
    const noNewline = args[0] === '-n';
    const parts = noNewline ? args.slice(1) : args;
    const out = parts.join(' ').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    return { stdout: noNewline ? out : out, stderr: '', code: 0 };
  }

  cmdPrintf(args) {
    if (!args.length) return { stdout: '', stderr: '', code: 0 };
    const fmt = args[0];
    const pargs = args.slice(1);
    let i = 0;
    const out = fmt.replace(/%s/g, () => pargs[i++] || '').replace(/%d/g, () => pargs[i++] || '0').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    return { stdout: out, stderr: '', code: 0 };
  }

  _getInput(args, stdin) {
    const files = args.filter(a => !a.startsWith('-'));
    if (!files.length) return stdin;
    const parts = [];
    for (const f of files) { const c = this.vfs.readFile(this.vfs.normPath(f)); if (c !== null) parts.push(c); }
    return parts.join('\n');
  }

  cmdHead(args, stdin) {
    const nIdx = args.indexOf('-n');
    const n = nIdx >= 0 ? parseInt(args[nIdx + 1]) || 10 : 10;
    const files = args.filter(a => !a.startsWith('-') && isNaN(a));
    const input = files.length ? this._getInput(files, stdin) : stdin;
    return { stdout: input.split('\n').slice(0, n).join('\n'), stderr: '', code: 0 };
  }

  cmdTail(args, stdin) {
    const nIdx = args.indexOf('-n');
    const n = nIdx >= 0 ? parseInt(args[nIdx + 1]) || 10 : 10;
    const files = args.filter(a => !a.startsWith('-') && isNaN(a));
    const input = files.length ? this._getInput(files, stdin) : stdin;
    const lines = input.split('\n');
    return { stdout: lines.slice(-n).join('\n'), stderr: '', code: 0 };
  }

  cmdGrep(args, stdin) {
    const opts = { ignoreCase: false, invert: false, lineNum: false, count: false, files: false, recursive: false, extended: false };
    const rest = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--') { args.slice(i + 1).forEach(a => rest.push(a)); break; }
      if (args[i].startsWith('--')) { /* ignore unknown long options like --color=auto */ }
      else if (args[i].startsWith('-')) {
        const f = args[i].slice(1);
        if (f.includes('i')) opts.ignoreCase = true;
        if (f.includes('v')) opts.invert = true;
        if (f.includes('n')) opts.lineNum = true;
        if (f.includes('c')) opts.count = true;
        if (f.includes('l')) opts.files = true;
        if (f.includes('r') || f.includes('R')) opts.recursive = true;
        if (f.includes('E')) opts.extended = true;
        if (f === 'e') { rest.unshift(args[++i]); }
      } else rest.push(args[i]);
    }
    if (!rest.length) return { stdout: '', stderr: 'grep: missing pattern', code: 2 };
    const pattern = rest[0];
    const filePaths = rest.slice(1);
    const reFlag = (opts.ignoreCase ? 'i' : '') + 'g';
    let re;
    try { re = new RegExp(pattern, reFlag); } catch { return { stdout: '', stderr: `grep: invalid regex '${pattern}'`, code: 2 }; }

    const grepContent = (content, label) => {
      const lines = content.split('\n');
      const matched = [];
      let cnt = 0;
      lines.forEach((line, idx) => {
        re.lastIndex = 0;
        const m = re.test(line);
        if ((!opts.invert && m) || (opts.invert && !m)) {
          cnt++;
          if (!opts.count && !opts.files) {
            let out = '';
            if (label) out += `<span class="t-purple">${label}</span>:`;
            if (opts.lineNum) out += `<span class="t-yellow">${idx + 1}</span>:`;
            out += line.replace(re, s => `<span style="background:#ff0;color:#000">${s}</span>`);
            matched.push(out);
          }
        }
      });
      return { matched, cnt, hasMatch: cnt > 0 };
    };

    let allOut = [], totalCode = 1;
    if (!filePaths.length) {
      const { matched, cnt, hasMatch } = grepContent(stdin, '');
      if (hasMatch) totalCode = 0;
      if (opts.count) allOut.push(String(cnt));
      else allOut.push(...matched);
    } else {
      const multiFile = filePaths.length > 1;
      for (const fp of filePaths) {
        const absPath = this.vfs.normPath(fp);
        const n = this.vfs.node(absPath);
        if (!n) { allOut.push(`grep: ${fp}: No such file or directory`); continue; }
        const contents = n.t === 'd' && opts.recursive
          ? this.vfs.find(absPath, [{type:'type',val:'f'}]).map(p => ({ path: p, content: this.vfs.readFile(p) }))
          : [{ path: absPath, content: this.vfs.readFile(absPath) }];
        for (const { path, content } of contents) {
          if (content === null) continue;
          const label = multiFile || opts.recursive ? path : '';
          const { matched, cnt, hasMatch } = grepContent(content, label);
          if (hasMatch) totalCode = 0;
          if (opts.count) allOut.push((label ? label + ':' : '') + cnt);
          else if (opts.files) { if (hasMatch) allOut.push(path); }
          else allOut.push(...matched);
        }
      }
    }
    return { stdout: allOut.join('\n'), stderr: '', code: totalCode };
  }

  cmdAwk(args, stdin) {
    const fIdx = args.indexOf('-F');
    const fs = fIdx >= 0 ? args[fIdx + 1] : ' ';
    const prog = args.find(a => !a.startsWith('-') && a !== fs) || '';
    const files = args.filter((a, i) => !a.startsWith('-') && a !== prog && a !== fs && (fIdx < 0 || i !== fIdx + 1));
    const input = files.length ? this._getInput(files, stdin) : stdin;
    const lines = input.split('\n');
    const out = [];
    // BEGIN/END blocks
    const beginMatch = prog.match(/BEGIN\s*\{([^}]*)\}/);
    const endMatch = prog.match(/END\s*\{([^}]*)\}/);
    const mainMatch = prog.replace(/BEGIN\s*\{[^}]*\}/, '').replace(/END\s*\{[^}]*\}/, '').trim();
    const awk_vars = { NR: 0, NF: 0, FS: fs, RS: '\n' };
    const evalAwk = (body, fields, lineStr) => {
      if (!body.trim()) return;
      awk_vars.NF = fields.length;
      awk_vars.NR++;
      body = body.replace(/\$NF/g, fields[fields.length - 1] || '');
      body = body.replace(/\$(\d+)/g, (_, n) => fields[parseInt(n) - 1] || '');
      body = body.replace(/\bNR\b/g, awk_vars.NR).replace(/\bNF\b/g, awk_vars.NF);
      body = body.replace(/\bprint\b\s*(.*)/g, (_, expr) => {
        let val = expr.trim();
        if (!val) { out.push(lineStr); return ''; }
        val = val.split(',').map(v => v.trim()).join('\t');
        out.push(val);
        return '';
      });
      try { Function('"use strict";' + body)(); } catch {}
    };
    if (beginMatch) {
      const fields = [];
      evalAwk(beginMatch[1], fields, '');
    }
    for (const line of lines) {
      const fields = line.split(fs === ' ' ? /\s+/ : fs).filter(Boolean);
      if (mainMatch) {
        const condMatch = mainMatch.match(/^\/([^\/]+)\/\s*\{([^}]*)\}/);
        const blockMatch = mainMatch.match(/^\{([^}]*)\}/);
        if (condMatch) {
          const re = new RegExp(condMatch[1]);
          if (re.test(line)) evalAwk(condMatch[2], fields, line);
        } else if (blockMatch) {
          evalAwk(blockMatch[1], fields, line);
        } else if (mainMatch.includes('print')) {
          evalAwk(mainMatch, fields, line);
        }
      }
    }
    if (endMatch) { const fields = []; evalAwk(endMatch[1], fields, ''); }
    return { stdout: out.join('\n'), stderr: '', code: 0 };
  }

  cmdSed(args, stdin) {
    const nFlag = args.includes('-n');
    const exprs = [];
    let i = 0;
    const files = [];
    while (i < args.length) {
      if (args[i] === '-n') { i++; continue; }
      if (args[i] === '-e') { exprs.push(args[++i]); i++; continue; }
      if (!args[i].startsWith('-')) {
        if (!exprs.length) exprs.push(args[i]);
        else files.push(args[i]);
      }
      i++;
    }
    const input = files.length ? this._getInput(files, stdin) : stdin;
    const lines = input.split('\n');
    const out = [];
    for (let ln = 0; ln < lines.length; ln++) {
      let line = lines[ln];
      let print = !nFlag;
      for (const expr of exprs) {
        // s/pat/rep/flags
        const sMatch = expr.match(/^s(.)(.+?)\1(.*?)\1([gimp]*)$/);
        if (sMatch) {
          const [, , pat, rep, flags] = sMatch;
          const reFlags = (flags.includes('i') ? 'i' : '') + (flags.includes('g') ? 'g' : '');
          try { line = line.replace(new RegExp(pat, reFlags), rep.replace(/\\1/g, '$1').replace(/\\2/g, '$2').replace(/&/g, '$&')); }
          catch {}
          if (flags.includes('p') || nFlag) { out.push(line); print = false; }
          continue;
        }
        // /pat/p or /pat/d or line addr
        const addrMatch = expr.match(/^(\d+)?(?:,(\d+))?(?:~(\d+))?\/?(.+?)\/([pd])?/);
        if (addrMatch) {
          const [, a1, a2, , pat, cmd2] = addrMatch;
          let inRange = false;
          if (pat) { try { inRange = new RegExp(pat).test(line); } catch {} }
          if (a1) { const n = parseInt(a1); inRange = (ln + 1) === n; }
          if (inRange) {
            if (cmd2 === 'd') { print = false; continue; }
            if (cmd2 === 'p') { out.push(line); }
          }
        }
        // just /pattern/d or /pattern/p
        const simpleMatch = expr.match(/^\/(.+?)\/(p|d)?$/);
        if (simpleMatch) {
          const [, pat, cmd3] = simpleMatch;
          try {
            if (new RegExp(pat).test(line)) {
              if (cmd3 === 'd') print = false;
              else if (cmd3 === 'p' || nFlag) { out.push(line); print = false; }
            }
          } catch {}
        }
        // {q} quit
        if (expr.trim() === 'q') break;
      }
      if (print) out.push(line);
    }
    return { stdout: out.join('\n'), stderr: '', code: 0 };
  }

  cmdCut(args, stdin) {
    let delim = '\t', fields = [];
    const files = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-d' || args[i] === '--delimiter') delim = args[++i];
      else if (args[i].startsWith('-d')) delim = args[i].slice(2);
      else if (args[i] === '-f' || args[i] === '--fields') {
        fields = args[++i].split(',').map(f => { const p = f.split('-'); return p.length === 2 ? [parseInt(p[0]), parseInt(p[1])] : [parseInt(f), parseInt(f)]; });
      } else if (args[i].startsWith('-f')) {
        const fs = args[i].slice(2);
        fields = fs.split(',').map(f => { const p = f.split('-'); return p.length === 2 ? [parseInt(p[0]), parseInt(p[1])] : [parseInt(f), parseInt(f)]; });
      } else if (!args[i].startsWith('-')) files.push(args[i]);
    }
    const input = files.length ? this._getInput(files, stdin) : stdin;
    const out = input.split('\n').map(line => {
      const cols = line.split(delim);
      const selected = [];
      for (const [s, e] of fields) for (let j = s; j <= e; j++) if (cols[j - 1] !== undefined) selected.push(cols[j - 1]);
      return selected.join(delim);
    });
    return { stdout: out.join('\n'), stderr: '', code: 0 };
  }

  cmdSort(args, stdin) {
    const opts = { numeric: false, reverse: false, unique: false };
    let key = null;
    const files = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i].startsWith('-')) {
        if (args[i].includes('n')) opts.numeric = true;
        if (args[i].includes('r')) opts.reverse = true;
        if (args[i].includes('u')) opts.unique = true;
        if (args[i] === '-k') key = parseInt(args[++i]) - 1;
        else if (args[i].startsWith('-k')) key = parseInt(args[i].slice(2)) - 1;
      } else files.push(args[i]);
    }
    const input = files.length ? this._getInput(files, stdin) : stdin;
    let lines = input.split('\n');
    lines.sort((a, b) => {
      const av = key !== null ? (a.split(/\s+/)[key] || '') : a;
      const bv = key !== null ? (b.split(/\s+/)[key] || '') : b;
      if (opts.numeric) return (parseFloat(av) || 0) - (parseFloat(bv) || 0);
      return av.localeCompare(bv);
    });
    if (opts.reverse) lines.reverse();
    if (opts.unique) lines = [...new Set(lines)];
    return { stdout: lines.join('\n'), stderr: '', code: 0 };
  }

  cmdUniq(args, stdin) {
    const opts = { count: false, dup: false, unique: false };
    const files = [];
    for (const a of args) {
      if (a.startsWith('-')) { if (a.includes('c')) opts.count = true; if (a.includes('d')) opts.dup = true; if (a.includes('u')) opts.unique = true; }
      else files.push(a);
    }
    const input = files.length ? this._getInput(files, stdin) : stdin;
    const lines = input.split('\n');
    const groups = [];
    for (const line of lines) {
      if (!groups.length || groups[groups.length - 1].line !== line) groups.push({ line, cnt: 1 });
      else groups[groups.length - 1].cnt++;
    }
    const out = groups.filter(g => opts.dup ? g.cnt > 1 : opts.unique ? g.cnt === 1 : true)
      .map(g => opts.count ? `   ${String(g.cnt).padStart(2)} ${g.line}` : g.line);
    return { stdout: out.join('\n'), stderr: '', code: 0 };
  }

  cmdWc(args, stdin) {
    const opts = { lines: false, words: false, chars: false };
    const files = [];
    for (const a of args) {
      if (a.startsWith('-')) { if (a.includes('l')) opts.lines = true; if (a.includes('w')) opts.words = true; if (a.includes('c')) opts.chars = true; }
      else files.push(a);
    }
    if (!opts.lines && !opts.words && !opts.chars) { opts.lines = opts.words = opts.chars = true; }
    const processOne = (content, label) => {
      const l = content.split('\n').length - (content.endsWith('\n') ? 1 : 0);
      const w = content.trim().split(/\s+/).filter(Boolean).length;
      const c = content.length;
      const parts = [];
      if (opts.lines) parts.push(String(l).padStart(6));
      if (opts.words) parts.push(String(w).padStart(6));
      if (opts.chars) parts.push(String(c).padStart(6));
      return parts.join('') + (label ? ' ' + label : '');
    };
    if (!files.length) return { stdout: processOne(stdin, ''), stderr: '', code: 0 };
    const out = files.map(f => {
      const c = this.vfs.readFile(this.vfs.normPath(f));
      if (c === null) return `wc: ${f}: No such file or directory`;
      return processOne(c, f);
    });
    return { stdout: out.join('\n'), stderr: '', code: 0 };
  }

  cmdTr(args, stdin) {
    if (args.length < 2) return { stdout: stdin, stderr: '', code: 0 };
    const del = args.includes('-d');
    const from = args[del ? 1 : 0].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    const to = del ? '' : (args[1] || '').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    let out = stdin;
    if (del) { for (const c of from) out = out.split(c).join(''); }
    else { for (let i = 0; i < from.length; i++) out = out.split(from[i]).join(to[i] || ''); }
    return { stdout: out, stderr: '', code: 0 };
  }

  cmdFind(args) {
    const start = args.find(a => !a.startsWith('-')) || '.';
    const tests = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-name') tests.push({ type: 'name', val: args[++i] });
      else if (args[i] === '-type') tests.push({ type: 'type', val: args[++i] });
    }
    const startPath = this.vfs.normPath(start);
    const results = this.vfs.find(startPath, tests);
    const out = results.map(p => {
      const rel = p.replace(startPath, start.replace(/\/$/, ''));
      return rel.startsWith(start) ? rel : start + '/' + rel.split('/').pop();
    });
    return { stdout: [startPath, ...results].join('\n'), stderr: '', code: 0 };
  }

  cmdChmod(args) {
    const mode = args[0];
    const paths = args.slice(1);
    for (const p of paths) {
      const n = this.vfs.node(this.vfs.normPath(p));
      if (!n) return { stdout: '', stderr: `chmod: cannot access '${p}': No such file or directory`, code: 1 };
      if (/^\d+$/.test(mode)) n.m = mode;
      else if (mode.includes('+x')) n.m = '755';
      else if (mode.includes('-x')) n.m = '644';
    }
    return { stdout: '', stderr: '', code: 0 };
  }

  cmdEnv(args) {
    const all = { ...this.env, ...this.vars };
    return { stdout: Object.entries(all).map(([k, v]) => `${k}=${v}`).join('\n'), stderr: '', code: 0 };
  }

  cmdExport(args) {
    for (const a of args) {
      const [k, ...vp] = a.split('=');
      if (vp.length) this.env[k] = this.expandVars(vp.join('='));
      else if (this.vars[k]) this.env[k] = this.vars[k];
    }
    return { stdout: '', stderr: '', code: 0 };
  }

  cmdUnset(args) {
    for (const k of args) { delete this.vars[k]; delete this.env[k]; }
    return { stdout: '', stderr: '', code: 0 };
  }

  cmdPrintenv(args) {
    if (!args.length) return this.cmdEnv([]);
    const out = args.map(k => this.env[k] || this.vars[k] || '').join('\n');
    return { stdout: out, stderr: '', code: 0 };
  }

  cmdSource(args) {
    if (!args.length) return { stdout: '', stderr: 'source: filename argument required', code: 1 };
    const content = this.vfs.readFile(this.vfs.normPath(args[0]));
    if (content === null) return { stdout: '', stderr: `bash: ${args[0]}: No such file or directory`, code: 1 };
    const lines = content.split('\n').filter(l => !l.startsWith('#') && l.trim());
    let lastOut = '';
    for (const line of lines) {
      const r = this.execute(line);
      if (r.stdout) lastOut += r.stdout + '\n';
    }
    return { stdout: lastOut.trimEnd(), stderr: '', code: 0 };
  }

  cmdHistory(args) {
    return { stdout: this.history.map((h, i) => `  ${String(i + 1).padStart(4)}  ${h}`).join('\n'), stderr: '', code: 0 };
  }

  cmdWhich(args) {
    const builtins = ['ls','cd','pwd','mkdir','touch','rm','cp','mv','cat','echo','grep','awk','sed','cut','sort','uniq','wc','find','chmod','env','export','history','man','git','make'];
    const out = args.map(a => builtins.includes(a) ? `/usr/bin/${a}` : `${a} not found`);
    return { stdout: out.join('\n'), stderr: '', code: 0 };
  }

  cmdMan(args) {
    const pages = {
      grep: 'grep - print lines matching a pattern\nUsage: grep [OPTIONS] PATTERN [FILE...]\n  -i  ignore case\n  -n  line numbers\n  -v  invert match\n  -r  recursive\n  -E  extended regex\n  -c  count matches',
      awk:  'awk - pattern scanning and processing\nUsage: awk [-F FS] PROGRAM [FILE...]\n  NR  current record number\n  NF  number of fields\n  $0  whole line, $1 first field, etc.',
      sed:  'sed - stream editor\nUsage: sed [OPTIONS] SCRIPT [FILE...]\n  s/pat/rep/g   substitute\n  /pat/d        delete matching\n  /pat/p        print matching\n  -n            suppress default output',
      find: 'find - search for files\nUsage: find [PATH] [TESTS]\n  -name PAT   match filename\n  -type f|d   file or directory',
      tar:  'tar - archive files\nUsage: tar [OPTIONS] [FILE...]\n  -c  create\n  -x  extract\n  -z  gzip\n  -f  filename\n  -v  verbose',
    };
    const page = args[0];
    if (!page) return { stdout: 'What manual page do you want?', stderr: '', code: 1 };
    if (pages[page]) return { stdout: `MAN PAGE: ${page}\n${'─'.repeat(40)}\n${pages[page]}`, stderr: '', code: 0 };
    return { stdout: '', stderr: `man: ${page}: No manual entry for ${page}`, code: 1 };
  }

  cmdAlias(args) {
    if (!args.length) return { stdout: Object.entries(this.aliases).map(([k, v]) => `alias ${k}='${v}'`).join('\n'), stderr: '', code: 0 };
    for (const a of args) {
      const m = a.match(/^([^=]+)='?(.+?)'?$/);
      if (m) this.aliases[m[1]] = m[2];
    }
    return { stdout: '', stderr: '', code: 0 };
  }

  cmdUname(args) {
    if (args.includes('-a')) return { stdout: 'Linux linux-practice 5.15.0 #1 SMP x86_64 GNU/Linux', stderr: '', code: 0 };
    return { stdout: 'Linux', stderr: '', code: 0 };
  }

  cmdPs(args) {
    const header = 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND';
    const procs = [
      'user      1234  0.0  0.1  12345  1234 pts/0    Ss   09:00   0:00 bash',
      'user      5678  0.0  0.0   8192   512 pts/0    R+   14:23   0:00 ps',
    ];
    return { stdout: [header, ...procs].join('\n'), stderr: '', code: 0 };
  }

  cmdKill(args) {
    const pid = args.find(a => !a.startsWith('-'));
    return { stdout: '', stderr: `(simulated) kill: sent signal to PID ${pid || '?'}`, code: 0 };
  }

  cmdTee(args, stdin) {
    const files = args.filter(a => !a.startsWith('-'));
    for (const f of files) this.vfs.writeFile(this.vfs.normPath(f), stdin);
    return { stdout: stdin, stderr: '', code: 0 };
  }

  cmdXargs(args, stdin) {
    const cmd = args.join(' ') || 'echo';
    const items = stdin.trim().split(/\s+/);
    const out = [];
    for (const item of items) {
      const r = this.execute(cmd + ' ' + item);
      if (r.stdout) out.push(r.stdout);
    }
    return { stdout: out.join('\n'), stderr: '', code: 0 };
  }

  cmdTar(args) {
    const create = args.includes('-c') || args.some(a => a.includes('c'));
    const extract = args.includes('-x') || args.some(a => a.includes('x'));
    const gzip = args.includes('-z') || args.some(a => a.includes('z'));
    const verbose = args.includes('-v') || args.some(a => a.includes('v'));
    const fIdx = args.indexOf('-f');
    const archive = fIdx >= 0 ? args[fIdx + 1] : args.find(a => a.endsWith('.tar') || a.endsWith('.tar.gz') || a.endsWith('.tgz')) || 'archive.tar';
    if (create) {
      return { stdout: verbose ? `(simulated) Creating archive: ${archive}` : '', stderr: '', code: 0 };
    }
    if (extract) {
      return { stdout: verbose ? `(simulated) Extracting archive: ${archive}` : '', stderr: '', code: 0 };
    }
    return { stdout: `tar: ${args.join(' ')} (simulated)`, stderr: '', code: 0 };
  }

  cmdNl(args, stdin) {
    const files = args.filter(a => !a.startsWith('-'));
    const input = files.length ? this._getInput(files, stdin) : stdin;
    const out = input.split('\n').map((line, i) => `${String(i + 1).padStart(6)}\t${line}`);
    return { stdout: out.join('\n'), stderr: '', code: 0 };
  }

  cmdTest(args) {
    if (!args.length) return { stdout: '', stderr: '', code: 1 };
    const a = args[0], b = args[2], op = args[1];
    if (a === '-f') { const n = this.vfs.node(this.vfs.normPath(args[1])); return { stdout: '', stderr: '', code: n && n.t === 'f' ? 0 : 1 }; }
    if (a === '-d') { const n = this.vfs.node(this.vfs.normPath(args[1])); return { stdout: '', stderr: '', code: n && n.t === 'd' ? 0 : 1 }; }
    if (a === '-e') { const n = this.vfs.node(this.vfs.normPath(args[1])); return { stdout: '', stderr: '', code: n ? 0 : 1 }; }
    if (a === '-z') return { stdout: '', stderr: '', code: (b || '').length === 0 ? 0 : 1 };
    if (a === '-n') return { stdout: '', stderr: '', code: (b || '').length > 0 ? 0 : 1 };
    if (op === '==' || op === '=') return { stdout: '', stderr: '', code: a === b ? 0 : 1 };
    if (op === '!=') return { stdout: '', stderr: '', code: a !== b ? 0 : 1 };
    if (op === '-eq') return { stdout: '', stderr: '', code: Number(a) === Number(b) ? 0 : 1 };
    if (op === '-ne') return { stdout: '', stderr: '', code: Number(a) !== Number(b) ? 0 : 1 };
    if (op === '-lt') return { stdout: '', stderr: '', code: Number(a) < Number(b) ? 0 : 1 };
    if (op === '-gt') return { stdout: '', stderr: '', code: Number(a) > Number(b) ? 0 : 1 };
    return { stdout: '', stderr: '', code: 0 };
  }

  cmdGit(args) {
    const sub = args[0];
    const msgs = {
      status: `On branch main\nYour branch is up to date with 'origin/main'.\n\nNothing to commit, working tree clean`,
      log: `commit a1b2c3d (HEAD -> main, origin/main)\nAuthor: user <user@example.com>\nDate:   Fri Jul 10 14:23:45 2026\n\n    Add timing constraints and compile script\n\ncommit 9f8e7d6\nAuthor: user <user@example.com>\nDate:   Thu Jul 9 11:00:00 2026\n\n    Initial RTL implementation`,
      branch: `* main\n  develop\n  feature/alu`,
      diff: `diff --git a/rtl/top.v b/rtl/top.v\n--- a/rtl/top.v\n+++ b/rtl/top.v\n@@ -4,7 +4,7 @@\n-  // TODO: implement top-level module\n+  // Implemented: register output`,
    };
    const cmd = msgs[sub];
    if (cmd) return { stdout: cmd, stderr: '', code: 0 };
    if (sub === 'init') return { stdout: 'Initialized empty Git repository in ' + this.vfs.cwd + '/.git/', stderr: '', code: 0 };
    if (sub === 'add') return { stdout: '', stderr: '(simulated) git add ' + args.slice(1).join(' '), code: 0 };
    if (sub === 'commit') return { stdout: `[main abc1234] ${args.includes('-m') ? args[args.indexOf('-m') + 1] : 'update'}\n 1 file changed`, stderr: '', code: 0 };
    return { stdout: `(simulated) git ${args.join(' ')}`, stderr: '', code: 0 };
  }

  cmdMake(args) {
    const target = args[0] || 'all';
    const mf = this.vfs.readFile(this.vfs.normPath('Makefile')) || this.vfs.readFile(this.vfs.normPath('design/scripts/Makefile'));
    if (!mf) return { stdout: '', stderr: 'make: *** No Makefile found', code: 2 };
    const targetMatch = new RegExp(`^${target}:`, 'm');
    if (targetMatch.test(mf)) return { stdout: `make: '${target}' target executed (simulated)`, stderr: '', code: 0 };
    return { stdout: '', stderr: `make: *** No rule to make target '${target}'`, code: 2 };
  }

  cmdDiff(args) {
    const files = args.filter(a => !a.startsWith('-'));
    if (files.length < 2) return { stdout: '', stderr: 'diff: need two files', code: 1 };
    const a = this.vfs.readFile(this.vfs.normPath(files[0]));
    const b = this.vfs.readFile(this.vfs.normPath(files[1]));
    if (!a) return { stdout: '', stderr: `diff: ${files[0]}: No such file`, code: 2 };
    if (!b) return { stdout: '', stderr: `diff: ${files[1]}: No such file`, code: 2 };
    const aLines = a.split('\n'), bLines = b.split('\n');
    const out = [`--- ${files[0]}`, `+++ ${files[1]}`];
    for (let i = 0; i < Math.max(aLines.length, bLines.length); i++) {
      if (aLines[i] !== bLines[i]) {
        if (aLines[i] !== undefined) out.push(`-${aLines[i]}`);
        if (bLines[i] !== undefined) out.push(`+${bLines[i]}`);
      }
    }
    return { stdout: out.join('\n'), stderr: '', code: out.length > 2 ? 1 : 0 };
  }

  cmdRunScript(path, args) {
    const content = this.vfs.readFile(this.vfs.normPath(path));
    if (content === null) return { stdout: '', stderr: `bash: ${path}: No such file or directory`, code: 127 };
    const lines = content.split('\n').filter(l => !l.startsWith('#') && l.trim());
    const out = [];
    for (const line of lines) {
      const r = this.execute(line);
      if (r.stdout) out.push(r.stdout);
      if (r.stderr) out.push(`<span class="t-err">${r.stderr}</span>`);
    }
    return { stdout: out.join('\n'), stderr: '', code: 0 };
  }
}
