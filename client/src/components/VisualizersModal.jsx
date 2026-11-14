import React, { useState } from 'react';
import { Play, RotateCcw, Cpu, HardDrive, Network, Binary, GitFork, X, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function VisualizersModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('cpu'); // 'cpu' | 'cache' | 'bst' | 'subnet' | 'pipeline'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#fdfbf7] dark:bg-[#0f1117] border border-slate-300 dark:border-slate-800 rounded-3xl w-full max-w-5xl h-[92vh] sm:h-[88vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 rounded-xl border border-blue-200/60 dark:border-blue-800/60 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-slate-950 dark:text-white tracking-tight">GATE CS Concept Visualizers</h2>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 hidden xs:block">Interactive models for first-principles reasoning on high-yield GATE topics</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1.5 px-3 sm:px-6 py-2.5 bg-slate-100/70 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs sm:text-sm">
          {[
            { id: 'cpu', label: 'CPU Scheduling', icon: Cpu },
            { id: 'cache', label: 'Cache Simulator', icon: HardDrive },
            { id: 'bst', label: 'BST Traversals', icon: GitFork },
            { id: 'subnet', label: 'CIDR Subnetting', icon: Network },
            { id: 'pipeline', label: 'Pipeline Hazards', icon: Binary },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl font-medium transition whitespace-nowrap text-xs sm:text-sm ${
                  active 
                    ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-sm font-semibold' 
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#fdfbf7] dark:bg-[#0b0d13]">
          {activeTab === 'cpu' && <CPUSchedulerVisualizer />}
          {activeTab === 'cache' && <CacheSimulator />}
          {activeTab === 'bst' && <BSTVisualizer />}
          {activeTab === 'subnet' && <SubnetVisualizer />}
          {activeTab === 'pipeline' && <PipelineVisualizer />}
        </div>
      </div>
    </div>
  );
}

// 1. CPU Scheduling Visualizer
function CPUSchedulerVisualizer() {
  const [algo, setAlgo] = useState('RR'); // 'FCFS', 'SJF', 'RR'
  const [quantum, setQuantum] = useState(2);
  const [processes, setProcesses] = useState([
    { id: 'P1', at: 0, bt: 5, color: '#2563eb' },
    { id: 'P2', at: 1, bt: 3, color: '#059669' },
    { id: 'P3', at: 2, bt: 8, color: '#d97706' },
    { id: 'P4', at: 3, bt: 6, color: '#7c3aed' },
  ]);

  // Compute Gantt Chart
  const computeSchedule = () => {
    let timeline = [];
    let currentTime = 0;
    
    if (algo === 'FCFS') {
      let sorted = [...processes].sort((a, b) => a.at - b.at);
      sorted.forEach(p => {
        if (currentTime < p.at) {
          timeline.push({ id: 'IDLE', start: currentTime, end: p.at, color: '#64748b' });
          currentTime = p.at;
        }
        timeline.push({ id: p.id, start: currentTime, end: currentTime + p.bt, color: p.color });
        currentTime += p.bt;
      });
    } else if (algo === 'SJF') {
      let remaining = processes.map(p => ({ ...p, done: false }));
      while (remaining.some(p => !p.done)) {
        let available = remaining.filter(p => !p.done && p.at <= currentTime);
        if (available.length === 0) {
          let nextAt = Math.min(...remaining.filter(p => !p.done).map(p => p.at));
          timeline.push({ id: 'IDLE', start: currentTime, end: nextAt, color: '#64748b' });
          currentTime = nextAt;
          continue;
        }
        available.sort((a, b) => a.bt - b.bt);
        let chosen = available[0];
        timeline.push({ id: chosen.id, start: currentTime, end: currentTime + chosen.bt, color: chosen.color });
        currentTime += chosen.bt;
        chosen.done = true;
      }
    } else { // Round Robin
      let queue = [];
      let remBurst = {};
      processes.forEach(p => remBurst[p.id] = p.bt);
      let pPool = [...processes].sort((a, b) => a.at - b.at);
      let visited = new Set();
      
      pPool.forEach(p => {
        if (p.at <= currentTime && !visited.has(p.id)) {
          queue.push(p);
          visited.add(p.id);
        }
      });

      while (queue.length > 0 || pPool.some(p => remBurst[p.id] > 0)) {
        if (queue.length === 0) {
          let nextP = pPool.find(p => remBurst[p.id] > 0);
          timeline.push({ id: 'IDLE', start: currentTime, end: nextP.at, color: '#64748b' });
          currentTime = nextP.at;
          queue.push(nextP);
          visited.add(nextP.id);
          continue;
        }

        let curr = queue.shift();
        let exec = Math.min(quantum, remBurst[curr.id]);
        timeline.push({ id: curr.id, start: currentTime, end: currentTime + exec, color: curr.color });
        currentTime += exec;
        remBurst[curr.id] -= exec;

        pPool.forEach(p => {
          if (p.at <= currentTime && !visited.has(p.id) && remBurst[p.id] > 0) {
            queue.push(p);
            visited.add(p.id);
          }
        });

        if (remBurst[curr.id] > 0) {
          queue.push(curr);
        }
      }
    }

    let metrics = processes.map(p => {
      let processExecs = timeline.filter(t => t.id === p.id);
      let ct = processExecs.length ? processExecs[processExecs.length - 1].end : 0;
      let tat = ct - p.at;
      let wt = tat - p.bt;
      return { id: p.id, at: p.at, bt: p.bt, ct, tat, wt };
    });

    return { timeline, metrics };
  };

  const { timeline, metrics } = computeSchedule();
  const avgTat = (metrics.reduce((acc, m) => acc + m.tat, 0) / metrics.length).toFixed(2);
  const avgWt = (metrics.reduce((acc, m) => acc + m.wt, 0) / metrics.length).toFixed(2);
  const totalDuration = timeline.length ? timeline[timeline.length - 1].end : 1;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Algorithm:</span>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {['FCFS', 'SJF', 'RR'].map(m => (
              <button
                key={m}
                onClick={() => setAlgo(m)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  algo === m 
                    ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {algo === 'RR' && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Time Quantum ($q$):</span>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={quantum}
              onChange={(e) => setQuantum(parseInt(e.target.value))}
              className="w-24 accent-blue-600 cursor-pointer" 
            />
            <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-bold rounded-lg border border-blue-200 dark:border-blue-800">
              {quantum} ms
            </span>
          </div>
        )}
      </div>

      {/* Gantt Chart Visualizer */}
      <div className="p-5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-slate-950 dark:text-slate-100">Execution Gantt Chart</h3>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">Makespan: {totalDuration} ms</span>
        </div>

        <div className="relative w-full h-14 bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden flex border border-slate-300 dark:border-slate-800 shadow-inner">
          {timeline.map((item, idx) => {
            const widthPct = ((item.end - item.start) / totalDuration) * 100;
            return (
              <div
                key={idx}
                style={{ width: `${widthPct}%`, backgroundColor: item.color }}
                className="h-full flex flex-col items-center justify-center text-white border-r border-black/20 relative group transition-all"
                title={`${item.id} [${item.start} - ${item.end}]`}
              >
                <span className="text-xs font-bold truncate px-1 drop-shadow-sm">{item.id}</span>
                <span className="text-[10px] font-mono opacity-90">{item.end - item.start}m</span>
              </div>
            );
          })}
        </div>

        {/* Time markers */}
        <div className="flex justify-between text-xs font-mono font-bold text-slate-700 dark:text-slate-400 px-1">
          <span>0</span>
          {timeline.map((t, idx) => (
            <span key={idx}>{t.end}</span>
          ))}
        </div>
      </div>

      {/* Process Metrics Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#13161f] shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4">Process</th>
              <th className="py-3 px-4">Arrival Time (AT)</th>
              <th className="py-3 px-4">Burst Time (BT)</th>
              <th className="py-3 px-4">Completion Time (CT)</th>
              <th className="py-3 px-4">Turnaround Time (TAT = CT - AT)</th>
              <th className="py-3 px-4">Waiting Time (WT = TAT - BT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-xs">
            {metrics.map(m => (
              <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                <td className="py-2.5 px-4 font-bold text-blue-700 dark:text-blue-400">{m.id}</td>
                <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">{m.at}</td>
                <td className="py-2.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">{m.bt}</td>
                <td className="py-2.5 px-4 text-emerald-700 dark:text-emerald-400 font-bold">{m.ct}</td>
                <td className="py-2.5 px-4 text-amber-700 dark:text-amber-400 font-bold">{m.tat}</td>
                <td className="py-2.5 px-4 text-purple-700 dark:text-purple-400 font-bold">{m.wt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-xl text-center shadow-sm">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Average Turnaround</div>
          <div className="text-xl font-serif font-bold text-amber-700 dark:text-amber-400">{avgTat} ms</div>
        </div>
        <div className="p-3.5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-xl text-center shadow-sm">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Average Waiting</div>
          <div className="text-xl font-serif font-bold text-purple-700 dark:text-purple-400">{avgWt} ms</div>
        </div>
        <div className="p-3.5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-xl text-center shadow-sm">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Throughput</div>
          <div className="text-xl font-serif font-bold text-emerald-700 dark:text-emerald-400">{(processes.length / totalDuration).toFixed(3)} p/ms</div>
        </div>
        <div className="p-3.5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-xl text-center shadow-sm">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Active Policy</div>
          <div className="text-xl font-serif font-bold text-blue-700 dark:text-blue-400">{algo}</div>
        </div>
      </div>
    </div>
  );
}

// 2. Cache Simulator
function CacheSimulator() {
  const [cacheSizeKB, setCacheSizeKB] = useState(16); // 16 KB
  const [blockSizeB, setBlockSizeB] = useState(64); // 64 B
  const [assoc, setAssoc] = useState(2); // 2-way
  const [accessHistory, setAccessHistory] = useState([
    { addr: '0x1000', hit: false, tag: '0x00010', set: 0, offset: 0 },
    { addr: '0x1004', hit: true, tag: '0x00010', set: 0, offset: 4 },
    { addr: '0x2000', hit: false, tag: '0x00020', set: 0, offset: 0 },
    { addr: '0x1008', hit: true, tag: '0x00010', set: 0, offset: 8 },
  ]);
  const [inputAddr, setInputAddr] = useState('0x3000');

  const totalLines = (cacheSizeKB * 1024) / blockSizeB;
  const numSets = totalLines / assoc;
  const offsetBits = Math.log2(blockSizeB);
  const setBits = Math.log2(numSets);
  const tagBits = 32 - setBits - offsetBits;

  const handleSimulateAccess = () => {
    const dec = parseInt(inputAddr, 16);
    if (isNaN(dec)) return;

    const offset = dec % blockSizeB;
    const setIdx = Math.floor(dec / blockSizeB) % numSets;
    const tag = Math.floor(dec / (blockSizeB * numSets));
    
    const isHit = accessHistory.some(a => a.tag === `0x${tag.toString(16)}` && a.set === setIdx);

    const record = {
      addr: inputAddr,
      hit: isHit,
      tag: `0x${tag.toString(16).padStart(5, '0')}`,
      set: setIdx,
      offset
    };

    setAccessHistory([record, ...accessHistory.slice(0, 7)]);
  };

  const hitCount = accessHistory.filter(a => a.hit).length;
  const hitRate = accessHistory.length ? Math.round((hitCount / accessHistory.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div>
          <label className="text-xs font-bold text-slate-800 dark:text-slate-300 block mb-1">Cache Capacity:</label>
          <select 
            value={cacheSizeKB} 
            onChange={e => setCacheSizeKB(parseInt(e.target.value))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm font-semibold rounded-xl p-2.5 text-slate-900 dark:text-white"
          >
            <option value={8}>8 KB</option>
            <option value={16}>16 KB</option>
            <option value={32}>32 KB</option>
            <option value={64}>64 KB</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-800 dark:text-slate-300 block mb-1">Block (Line) Size:</label>
          <select 
            value={blockSizeB} 
            onChange={e => setBlockSizeB(parseInt(e.target.value))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm font-semibold rounded-xl p-2.5 text-slate-900 dark:text-white"
          >
            <option value={32}>32 Bytes</option>
            <option value={64}>64 Bytes</option>
            <option value={128}>128 Bytes</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-800 dark:text-slate-300 block mb-1">Associativity:</label>
          <select 
            value={assoc} 
            onChange={e => setAssoc(parseInt(e.target.value))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm font-semibold rounded-xl p-2.5 text-slate-900 dark:text-white"
          >
            <option value={1}>Direct Mapped (1-Way)</option>
            <option value={2}>2-Way Set Associative</option>
            <option value={4}>4-Way Set Associative</option>
            <option value={8}>8-Way Set Associative</option>
          </select>
        </div>
      </div>

      {/* Bit Allocation Bar */}
      <div className="p-5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">32-Bit Memory Address Decomposition:</h4>
        <div className="flex h-12 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold shadow-inner">
          <div 
            style={{ width: `${(tagBits/32)*100}%` }} 
            className="bg-blue-600 flex flex-col items-center justify-center text-white p-1"
          >
            <span>Tag ({tagBits} bits)</span>
          </div>
          <div 
            style={{ width: `${(setBits/32)*100}%` }} 
            className="bg-teal-600 flex flex-col items-center justify-center text-white p-1 border-x border-white/20"
          >
            <span>Set Index ({setBits} bits)</span>
          </div>
          <div 
            style={{ width: `${(offsetBits/32)*100}%` }} 
            className="bg-emerald-600 flex flex-col items-center justify-center text-white p-1"
          >
            <span>Offset ({offsetBits} bits)</span>
          </div>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap justify-between font-mono pt-1">
          <span>Number of Sets: <strong className="text-slate-950 dark:text-slate-100">{numSets}</strong></span>
          <span>Lines per Set: <strong className="text-slate-950 dark:text-slate-100">{assoc}</strong></span>
          <span>Total Lines: <strong className="text-slate-950 dark:text-slate-100">{totalLines}</strong></span>
        </div>
      </div>

      {/* Test Memory Access Input */}
      <div className="flex gap-2">
        <input 
          type="text" 
          value={inputAddr}
          onChange={e => setInputAddr(e.target.value)}
          placeholder="Hex address (e.g. 0x2048)"
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-950 dark:text-white focus:outline-none focus:border-blue-600 shadow-sm"
        />
        <button 
          onClick={handleSimulateAccess}
          className="px-5 py-2.5 bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-sm"
        >
          Check Cache Hit
        </button>
      </div>

      {/* Recent Access History Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#13161f] shadow-sm">
        <table className="w-full text-left text-sm font-mono">
          <thead className="bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-4">Address</th>
              <th className="py-2.5 px-4">Tag</th>
              <th className="py-2.5 px-4">Set #</th>
              <th className="py-2.5 px-4">Offset</th>
              <th className="py-2.5 px-4">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {accessHistory.map((acc, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                <td className="py-2.5 px-4 text-slate-950 dark:text-white font-bold">{acc.addr}</td>
                <td className="py-2.5 px-4 text-blue-700 dark:text-blue-400 font-bold">{acc.tag}</td>
                <td className="py-2.5 px-4 text-teal-700 dark:text-teal-400 font-bold">{acc.set}</td>
                <td className="py-2.5 px-4 text-emerald-700 dark:text-emerald-400 font-bold">{acc.offset}</td>
                <td className="py-2.5 px-4">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                    acc.hit 
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700' 
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-700'
                  }`}>
                    {acc.hit ? 'CACHE HIT' : 'CACHE MISS'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between text-xs shadow-sm">
        <span className="text-slate-700 dark:text-slate-400 font-medium">Observed Cache Hit Ratio:</span>
        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">{hitRate}% ({hitCount} / {accessHistory.length} hits)</span>
      </div>
    </div>
  );
}

// 3. Binary Search Tree Visualizer
function BSTVisualizer() {
  const [nodes, setNodes] = useState([50, 30, 70, 20, 40, 60, 80]);
  const [newVal, setNewVal] = useState('');

  const insertNode = () => {
    const val = parseInt(newVal);
    if (!isNaN(val) && !nodes.includes(val)) {
      setNodes([...nodes, val]);
      setNewVal('');
    }
  };

  const resetTree = () => {
    setNodes([50, 30, 70, 20, 40, 60, 80]);
  };

  const sorted = [...nodes].sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <input 
          type="number"
          value={newVal}
          onChange={e => setNewVal(e.target.value)}
          placeholder="Enter integer key (e.g. 25)"
          className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-blue-600 w-64 shadow-sm"
        />
        <button 
          onClick={insertNode}
          className="px-4 py-2 bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-sm"
        >
          Insert Key
        </button>
        <button 
          onClick={resetTree}
          className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 font-bold rounded-xl text-sm transition"
        >
          Reset Sample
        </button>
      </div>

      {/* SVG Tree Visualizer */}
      <div className="p-6 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center min-h-[260px] shadow-sm">
        <svg viewBox="0 0 600 240" className="w-full max-w-xl text-white">
          <line x1="300" y1="40" x2="180" y2="100" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="300" y1="40" x2="420" y2="100" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="180" y1="100" x2="110" y2="170" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="180" y1="100" x2="240" y2="170" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="420" y1="100" x2="360" y2="170" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="420" y1="100" x2="480" y2="170" stroke="#94a3b8" strokeWidth="2.5" />

          {/* Root node */}
          <circle cx="300" cy="40" r="22" fill="#2563eb" />
          <text x="300" y="46" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">50</text>

          {/* Level 1 */}
          <circle cx="180" cy="100" r="20" fill="#0d9488" />
          <text x="180" y="106" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff">30</text>
          
          <circle cx="420" cy="100" r="20" fill="#0d9488" />
          <text x="420" y="106" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff">70</text>

          {/* Level 2 */}
          <circle cx="110" cy="170" r="18" fill="#d97706" />
          <text x="110" y="175" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff">20</text>

          <circle cx="240" cy="170" r="18" fill="#d97706" />
          <text x="240" y="175" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff">40</text>

          <circle cx="360" cy="170" r="18" fill="#d97706" />
          <text x="360" y="175" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff">60</text>

          <circle cx="480" cy="170" r="18" fill="#d97706" />
          <text x="480" y="175" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff">80</text>
        </svg>
      </div>

      {/* Inorder Traversal Property Note */}
      <div className="p-5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 shadow-sm">
        <div className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Key GATE Theorem:</div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          The <strong>Inorder Traversal</strong> of a Binary Search Tree always yields elements in strictly monotonically increasing sorted order:
        </p>
        <div className="p-3 bg-slate-100 dark:bg-slate-950 font-mono text-emerald-800 dark:text-emerald-400 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-800">
          Inorder Sequence: [ {sorted.join(', ')} ]
        </div>
      </div>
    </div>
  );
}

// 4. Subnetting & CIDR Visualizer (Full First-Principles Engine)
function SubnetVisualizer() {
  const [ipInput, setIpInput] = useState('192.168.10.68/26');
  const [cidr, setCidr] = useState(26);
  const [subnetsDivCount, setSubnetsDivCount] = useState(4); // 2, 4, 8, 16
  const [testDstIp, setTestDstIp] = useState('192.168.10.85');
  const [routeResult, setRouteResult] = useState(null);

  // Helper functions
  const ipToLong = (ipStr) => {
    const clean = (ipStr || '').split('/')[0].trim();
    const parts = clean.split('.').map(p => {
      const n = parseInt(p.trim(), 10);
      return isNaN(n) ? 0 : Math.max(0, Math.min(255, n));
    });
    while (parts.length < 4) parts.push(0);
    return (((parts[0] & 255) << 24) | ((parts[1] & 255) << 16) | ((parts[2] & 255) << 8) | (parts[3] & 255)) >>> 0;
  };

  const longToIp = (num) => {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');
  };

  const cidrToMask = (c) => {
    if (c <= 0) return 0;
    if (c >= 32) return 0xFFFFFFFF >>> 0;
    return ((0xFFFFFFFF << (32 - c)) >>> 0);
  };

  const toBinaryOctets = (num) => {
    return [
      ((num >>> 24) & 255).toString(2).padStart(8, '0'),
      ((num >>> 16) & 255).toString(2).padStart(8, '0'),
      ((num >>> 8) & 255).toString(2).padStart(8, '0'),
      (num & 255).toString(2).padStart(8, '0')
    ];
  };

  // Synchronize input
  const handleIpInputChange = (val) => {
    setIpInput(val);
    if (val.includes('/')) {
      const parts = val.split('/');
      const parsedCidr = parseInt(parts[1], 10);
      if (!isNaN(parsedCidr) && parsedCidr >= 1 && parsedCidr <= 32) {
        setCidr(parsedCidr);
      }
    }
  };

  const handleCidrChange = (newCidr) => {
    const clamped = Math.max(1, Math.min(32, newCidr));
    setCidr(clamped);
    const baseIp = ipInput.split('/')[0].trim();
    setIpInput(`${baseIp}/${clamped}`);
  };

  const applyPreset = (presetIp, presetCidr) => {
    setIpInput(`${presetIp}/${presetCidr}`);
    setCidr(presetCidr);
    setRouteResult(null);
  };

  // Calculations
  const cleanIp = ipInput.split('/')[0].trim() || '192.168.10.68';
  const ipLong = ipToLong(cleanIp);
  const maskLong = cidrToMask(cidr);
  const netLong = (ipLong & maskLong) >>> 0;
  const wildcardLong = (~maskLong) >>> 0;
  const bcastLong = (netLong | wildcardLong) >>> 0;

  const totalAddresses = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : Math.max(0, totalAddresses - 2);

  const firstUsableLong = cidr >= 31 ? netLong : (usableHosts > 0 ? (netLong + 1) >>> 0 : netLong);
  const lastUsableLong = cidr >= 31 ? bcastLong : (usableHosts > 0 ? (bcastLong - 1) >>> 0 : bcastLong);

  const ipOctets = [(ipLong >>> 24) & 255, (ipLong >>> 16) & 255, (ipLong >>> 8) & 255, ipLong & 255];
  const maskOctets = [(maskLong >>> 24) & 255, (maskLong >>> 16) & 255, (maskLong >>> 8) & 255, maskLong & 255];
  const netOctets = [(netLong >>> 24) & 255, (netLong >>> 16) & 255, (netLong >>> 8) & 255, netLong & 255];
  const bcastOctets = [(bcastLong >>> 24) & 255, (bcastLong >>> 16) & 255, (bcastLong >>> 8) & 255, bcastLong & 255];
  const wildcardOctets = [(wildcardLong >>> 24) & 255, (wildcardLong >>> 16) & 255, (wildcardLong >>> 8) & 255, wildcardLong & 255];

  // Classful classification
  const firstOctet = ipOctets[0];
  let ipClass = 'Class A';
  let defaultMask = 8;
  if (firstOctet >= 128 && firstOctet <= 191) {
    ipClass = 'Class B';
    defaultMask = 16;
  } else if (firstOctet >= 192 && firstOctet <= 223) {
    ipClass = 'Class C';
    defaultMask = 24;
  } else if (firstOctet >= 224 && firstOctet <= 239) {
    ipClass = 'Class D (Multicast)';
    defaultMask = 0;
  } else if (firstOctet >= 240) {
    ipClass = 'Class E (Experimental)';
    defaultMask = 0;
  }

  // RFC 1918 Scope
  let scope = 'Public Internet';
  if (firstOctet === 10) scope = 'Private (RFC 1918 Class A)';
  else if (firstOctet === 172 && ipOctets[1] >= 16 && ipOctets[1] <= 31) scope = 'Private (RFC 1918 Class B)';
  else if (firstOctet === 192 && ipOctets[1] === 168) scope = 'Private (RFC 1918 Class C)';
  else if (firstOctet === 127) scope = 'Loopback Host';

  // Subnet borrowed bits from classful boundary
  const borrowedBits = defaultMask > 0 ? Math.max(0, cidr - defaultMask) : 0;
  const numSubnetsFromClass = defaultMask > 0 ? Math.pow(2, borrowedBits) : 1;

  // VLSM Subnet partition list
  const borrowBits = Math.round(Math.log2(subnetsDivCount));
  const newPartitionCidr = cidr + borrowBits;
  const canPartition = newPartitionCidr <= 32;
  const partitionSubnetSize = canPartition ? Math.pow(2, 32 - newPartitionCidr) : 0;
  
  const partitionsList = [];
  if (canPartition) {
    for (let i = 0; i < subnetsDivCount; i++) {
      const sNet = (netLong + i * partitionSubnetSize) >>> 0;
      const sMask = cidrToMask(newPartitionCidr);
      const sBcast = (sNet | ((~sMask) >>> 0)) >>> 0;
      const sUsable = newPartitionCidr >= 31 ? (newPartitionCidr === 31 ? 2 : 1) : Math.max(0, partitionSubnetSize - 2);
      const sFirst = newPartitionCidr >= 31 ? sNet : (sNet + 1) >>> 0;
      const sLast = newPartitionCidr >= 31 ? sBcast : (sBcast - 1) >>> 0;
      const isTargetInSubnet = ipLong >= sNet && ipLong <= sBcast;
      partitionsList.push({
        index: i,
        network: longToIp(sNet) + `/${newPartitionCidr}`,
        firstHost: longToIp(sFirst),
        lastHost: longToIp(sLast),
        broadcast: longToIp(sBcast),
        usable: sUsable,
        isActive: isTargetInSubnet
      });
    }
  }

  // Route test handler
  const handleTestRoute = () => {
    const dstLong = ipToLong(testDstIp);
    const matches = (dstLong & maskLong) >>> 0 === netLong;
    setRouteResult({
      dst: testDstIp,
      matches,
      dstNet: longToIp((dstLong & maskLong) >>> 0)
    });
  };

  const binaryIp = toBinaryOctets(ipLong);
  const binaryMask = toBinaryOctets(maskLong);
  const binaryNet = toBinaryOctets(netLong);

  return (
    <div className="space-y-6">
      {/* 1. Header Controls & GATE Presets */}
      <div className="p-5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-serif font-bold text-slate-950 dark:text-white">CIDR Subnetting & Supernetting Engine</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">First-principles bitwise decomposition, VLSM partitioning, and Longest Prefix Match</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-500 text-[11px] mr-1">GATE Presets:</span>
            {[
              { label: 'GATE 2024 (DA)', ip: '192.168.10.68', cidr: 26 },
              { label: 'GATE 2020 (CS)', ip: '172.16.10.25', cidr: 20 },
              { label: 'GATE 2017 (CS)', ip: '200.10.0.0', cidr: 21 },
              { label: 'GATE 2015 (CS)', ip: '203.10.24.0', cidr: 28 },
            ].map(p => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.ip, p.cidr)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-[11px] font-bold transition border border-slate-200 dark:border-slate-700"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-1">
          <div className="md:col-span-5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-300 block mb-1">
              Host / Network IPv4 Address with CIDR:
            </label>
            <input 
              type="text" 
              value={ipInput} 
              onChange={e => handleIpInputChange(e.target.value)}
              placeholder="e.g. 192.168.10.68/26"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm font-mono font-bold text-slate-950 dark:text-white rounded-xl p-3 focus:outline-none focus:border-blue-600 shadow-inner" 
            />
          </div>

          <div className="md:col-span-7 space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-300">
                Prefix Length (/{cidr}) — Mask: <span className="font-mono text-blue-700 dark:text-blue-400">{longToIp(maskLong)}</span>
              </label>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                {cidr} Net bits / {32 - cidr} Host bits
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="32" 
              value={cidr} 
              onChange={e => handleCidrChange(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg" 
            />
            {/* Quick prefix chips */}
            <div className="flex flex-wrap gap-1 pt-1">
              {[8, 16, 20, 22, 24, 26, 27, 28, 29, 30].map(c => (
                <button
                  key={c}
                  onClick={() => handleCidrChange(c)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition ${
                    cidr === c 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  /{c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual 32-Bit Allocation Bar & 4-Octet Binary Map */}
      <div className="p-5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
            32-Bit Binary IPv4 Octet Decomposition:
          </h4>
          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Network ({Math.min(defaultMask, cidr)}b)</span>
            {borrowedBits > 0 && (
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Subnet ({borrowedBits}b)</span>
            )}
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Host ({32 - cidr}b)</span>
          </div>
        </div>

        {/* 32-Bit Split Ribbon */}
        <div className="flex h-11 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold shadow-inner">
          <div 
            style={{ width: `${(Math.min(defaultMask, cidr) / 32) * 100}%` }}
            className="bg-blue-600 flex items-center justify-center text-white px-2 truncate"
          >
            Network ({Math.min(defaultMask, cidr)})
          </div>
          {borrowedBits > 0 && (
            <div 
              style={{ width: `${(borrowedBits / 32) * 100}%` }}
              className="bg-amber-500 flex items-center justify-center text-slate-950 px-2 truncate"
            >
              Subnet ({borrowedBits})
            </div>
          )}
          <div 
            style={{ width: `${((32 - cidr) / 32) * 100}%` }}
            className="bg-emerald-600 flex items-center justify-center text-white px-2 truncate"
          >
            Host ({32 - cidr})
          </div>
        </div>

        {/* 4-Octet Binary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map(octIdx => {
            const startBit = octIdx * 8;
            const endBit = startBit + 8;
            return (
              <div key={octIdx} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1.5 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-500 text-[11px] font-bold">
                  <span>Octet {octIdx + 1}</span>
                  <span className="text-slate-900 dark:text-white font-extrabold text-sm">{ipOctets[octIdx]}</span>
                </div>
                {/* 8 Bits visual display */}
                <div className="flex gap-0.5 justify-center py-1">
                  {binaryIp[octIdx].split('').map((bit, bitIdx) => {
                    const globalBitIdx = startBit + bitIdx;
                    let color = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
                    if (globalBitIdx < defaultMask) {
                      color = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
                    } else if (globalBitIdx < cidr) {
                      color = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
                    }
                    return (
                      <span key={bitIdx} className={`w-5 h-6 rounded flex items-center justify-center font-bold border text-[11px] ${color}`}>
                        {bit}
                      </span>
                    );
                  })}
                </div>
                <div className="text-[10px] text-slate-500 text-center font-mono">
                  Mask: {maskOctets[octIdx]} ({binaryMask[octIdx]})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Core Computed Subnet Parameters Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Addressing Parameters */}
        <div className="p-5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 font-mono text-xs shadow-sm">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider font-sans mb-1">
            GATE Network Address Properties:
          </h4>
          <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Network Address (Subnet ID):</span>
            <span className="font-bold text-blue-700 dark:text-blue-400 text-sm">{longToIp(netLong)}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Subnet Mask:</span>
            <span className="font-bold text-slate-950 dark:text-slate-200 text-sm">{longToIp(maskLong)}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Wildcard / Inverted Mask:</span>
            <span className="font-bold text-teal-700 dark:text-teal-400 text-sm">{longToIp(wildcardLong)}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Directed Broadcast (DBA):</span>
            <span className="font-bold text-rose-700 dark:text-rose-400 text-sm">{longToIp(bcastLong)}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Address Class & Scope:</span>
            <span className="font-bold text-slate-900 dark:text-white font-sans text-xs">
              {ipClass} • <span className="text-blue-600 dark:text-blue-400">{scope}</span>
            </span>
          </div>
        </div>

        {/* Right Column: Capacity & Host Ranges */}
        <div className="p-5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 font-mono text-xs shadow-sm">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider font-sans mb-1">
            Host Allocation & Capacity:
          </h4>
          <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">First Usable Host IP:</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
              {usableHosts > 0 ? longToIp(firstUsableLong) : 'N/A (Host Route)'}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Last Usable Host IP:</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
              {usableHosts > 0 ? longToIp(lastUsableLong) : 'N/A (Host Route)'}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Usable Host Capacity (2^(32-n) - 2):</span>
            <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">{usableHosts.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Total Block Addresses (2^(32-n)):</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{totalAddresses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Borrowed Bits from Class:</span>
            <span className="font-bold text-indigo-700 dark:text-indigo-400 font-sans text-xs">
              {borrowedBits} bits ({numSubnetsFromClass.toLocaleString()} subnets possible)
            </span>
          </div>
        </div>
      </div>

      {/* 4. Interactive VLSM Subnet Partitioning Table */}
      <div className="p-5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-serif font-bold text-slate-950 dark:text-white">
              Subnet Partitioning & VLSM Division (GATE Question Solver)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Divide current block into equal subnets (borrowing {borrowBits} bit{borrowBits !== 1 ? 's' : ''} $\to$ /{newPartitionCidr})
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Divide into:</span>
            {[2, 4, 8, 16].map(num => (
              <button
                key={num}
                onClick={() => setSubnetsDivCount(num)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  subnetsDivCount === num 
                    ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-sm' 
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {num} Subnets
              </button>
            ))}
          </div>
        </div>

        {canPartition ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Subnet Network ID</th>
                  <th className="py-2.5 px-3">Usable Host Range</th>
                  <th className="py-2.5 px-3">Directed Broadcast</th>
                  <th className="py-2.5 px-3">Hosts</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {partitionsList.map(sub => (
                  <tr 
                    key={sub.index} 
                    className={`transition ${sub.isActive ? 'bg-blue-50/80 dark:bg-blue-950/40 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-850/50'}`}
                  >
                    <td className="py-2.5 px-3 text-slate-500">Subnet {sub.index}</td>
                    <td className="py-2.5 px-3 text-blue-700 dark:text-blue-400 font-bold">{sub.network}</td>
                    <td className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400 font-medium">
                      {sub.firstHost} – {sub.lastHost}
                    </td>
                    <td className="py-2.5 px-3 text-rose-700 dark:text-rose-400">{sub.broadcast}</td>
                    <td className="py-2.5 px-3 text-slate-900 dark:text-slate-100 font-bold">{sub.usable}</td>
                    <td className="py-2.5 px-3 text-center">
                      {sub.isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-blue-600 text-white">
                          Contains Host IP
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px] font-sans">Available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs text-amber-800 dark:text-amber-300">
            Cannot partition further: new prefix length (/{newPartitionCidr}) exceeds 32 bits.
          </div>
        )}
      </div>

      {/* 5. Packet Route Matching / Longest Prefix Match (LPM) Tester */}
      <div className="p-5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-sm">
        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
          Destination Packet Route Match Tester:
        </h4>
        <div className="flex flex-wrap gap-2 items-center">
          <input 
            type="text" 
            value={testDstIp}
            onChange={e => { setTestDstIp(e.target.value); setRouteResult(null); }}
            placeholder="Enter destination IP (e.g. 192.168.10.85)"
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-950 dark:text-white focus:outline-none focus:border-blue-600 shadow-inner"
          />
          <button 
            onClick={handleTestRoute}
            className="px-5 py-2.5 bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-sm"
          >
            Check Route Match
          </button>
        </div>

        {routeResult && (
          <div className={`p-4 rounded-2xl border text-xs font-mono space-y-1 ${
            routeResult.matches 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-300' 
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700/60 text-rose-900 dark:text-rose-300'
          }`}>
            <div className="font-bold text-sm">
              {routeResult.matches ? 'MATCH: Packet belongs to this Subnet!' : 'NO MATCH: Forwarded to Default Gateway / Next Hop'}
            </div>
            <div>
              Bitwise Operation: ({routeResult.dst} & {longToIp(maskLong)}) = <strong className="font-extrabold">{routeResult.dstNet}</strong>
            </div>
            <div className="text-[11px] opacity-90">
              {routeResult.matches 
                ? `Resulting Network ID (${routeResult.dstNet}) matches this interface subnet (${longToIp(netLong)}). Packet will be directly delivered via ARP.` 
                : `Resulting Network ID (${routeResult.dstNet}) does not match this subnet (${longToIp(netLong)}). Router must lookup routing table for next hop.`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 5. 5-Stage CPU Pipeline Hazard Visualizer
function PipelineVisualizer() {
  const [forwarding, setForwarding] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div>
          <h4 className="text-sm font-serif font-bold text-slate-950 dark:text-white">Classic 5-Stage RISC Pipeline Execution Matrix</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">Demonstrating Read-After-Write (RAW) Data Hazard on Register R1</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">Operand Forwarding:</span>
          <button
            onClick={() => setForwarding(!forwarding)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
              forwarding ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {forwarding ? 'ENABLED (Zero Stalls)' : 'DISABLED (2 Stalls)'}
          </button>
        </div>
      </div>

      {/* Grid of Cycles */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#13161f] p-4 shadow-sm">
        <div className="min-w-[650px] space-y-2">
          {/* Cycle Headers */}
          <div className="grid grid-cols-9 gap-1 text-center font-mono text-xs text-slate-700 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="text-left text-slate-900 dark:text-slate-200 font-bold">Instruction</div>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(c => (
              <div key={c}>CC{c}</div>
            ))}
          </div>

          {/* I1 */}
          <div className="grid grid-cols-9 gap-1 text-center font-mono text-xs items-center">
            <div className="text-left font-bold text-blue-700 dark:text-blue-400 truncate">I1: ADD R1, R2, R3</div>
            <div className="bg-blue-600 p-2 rounded-lg text-white font-bold">IF</div>
            <div className="bg-sky-600 p-2 rounded-lg text-white font-bold">ID</div>
            <div className="bg-amber-600 p-2 rounded-lg text-white font-bold">EX</div>
            <div className="bg-purple-600 p-2 rounded-lg text-white font-bold">MEM</div>
            <div className="bg-emerald-600 p-2 rounded-lg text-white font-bold">WB</div>
            <div className="text-slate-400">-</div>
            <div className="text-slate-400">-</div>
            <div className="text-slate-400">-</div>
          </div>

          {/* I2 */}
          <div className="grid grid-cols-9 gap-1 text-center font-mono text-xs items-center">
            <div className="text-left font-bold text-amber-700 dark:text-amber-400 truncate">I2: SUB R4, R1, R5</div>
            <div className="text-slate-400">-</div>
            <div className="bg-blue-600 p-2 rounded-lg text-white font-bold">IF</div>
            {forwarding ? (
              <>
                <div className="bg-sky-600 p-2 rounded-lg text-white font-bold">ID</div>
                <div className="bg-amber-600 p-2 rounded-lg text-white font-bold ring-2 ring-emerald-400">EX*</div>
                <div className="bg-purple-600 p-2 rounded-lg text-white font-bold">MEM</div>
                <div className="bg-emerald-600 p-2 rounded-lg text-white font-bold">WB</div>
                <div className="text-slate-400">-</div>
                <div className="text-slate-400">-</div>
              </>
            ) : (
              <>
                <div className="bg-rose-100 dark:bg-rose-950/80 p-2 rounded-lg text-rose-800 dark:text-rose-400 font-bold border border-rose-300 dark:border-rose-700">STALL</div>
                <div className="bg-rose-100 dark:bg-rose-950/80 p-2 rounded-lg text-rose-800 dark:text-rose-400 font-bold border border-rose-300 dark:border-rose-700">STALL</div>
                <div className="bg-sky-600 p-2 rounded-lg text-white font-bold">ID</div>
                <div className="bg-amber-600 p-2 rounded-lg text-white font-bold">EX</div>
                <div className="bg-purple-600 p-2 rounded-lg text-white font-bold">MEM</div>
                <div className="bg-emerald-600 p-2 rounded-lg text-white font-bold">WB</div>
              </>
            )}
          </div>

          {/* I3 */}
          <div className="grid grid-cols-9 gap-1 text-center font-mono text-xs items-center">
            <div className="text-left font-bold text-emerald-700 dark:text-emerald-400 truncate">I3: AND R6, R1, R7</div>
            <div className="text-slate-400">-</div>
            <div className="text-slate-400">-</div>
            <div className="bg-blue-600 p-2 rounded-lg text-white font-bold">IF</div>
            {forwarding ? (
              <>
                <div className="bg-sky-600 p-2 rounded-lg text-white font-bold">ID</div>
                <div className="bg-amber-600 p-2 rounded-lg text-white font-bold">EX</div>
                <div className="bg-purple-600 p-2 rounded-lg text-white font-bold">MEM</div>
                <div className="bg-emerald-600 p-2 rounded-lg text-white font-bold">WB</div>
                <div className="text-slate-400">-</div>
              </>
            ) : (
              <>
                <div className="bg-rose-100 dark:bg-rose-950/80 p-2 rounded-lg text-rose-800 dark:text-rose-400 font-bold border border-rose-300 dark:border-rose-700">STALL</div>
                <div className="bg-rose-100 dark:bg-rose-950/80 p-2 rounded-lg text-rose-800 dark:text-rose-400 font-bold border border-rose-300 dark:border-rose-700">STALL</div>
                <div className="bg-sky-600 p-2 rounded-lg text-white font-bold">ID</div>
                <div className="bg-amber-600 p-2 rounded-lg text-white font-bold">EX</div>
                <div className="bg-purple-600 p-2 rounded-lg text-white font-bold">MEM</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-[#13161f] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 shadow-sm">
        <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          GATE Formula Insight:
        </h5>
        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono font-medium">
          Speedup (S) = (Clock cycles without pipelining) / (Clock cycles with pipelining) = (n * k) / (k + (n-1) + stalls)
        </p>
      </div>
    </div>
  );
}