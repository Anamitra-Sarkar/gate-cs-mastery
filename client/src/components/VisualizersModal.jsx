import React, { useState } from 'react';
import { Play, RotateCcw, Cpu, HardDrive, Network, Binary, GitFork, X, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function VisualizersModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('cpu'); // 'cpu' | 'cache' | 'bst' | 'subnet' | 'pipeline'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl h-[92vh] sm:h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-indigo-500/20 text-indigo-400 rounded-lg shrink-0">
              <Cpu className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-bold text-white">GATE CS Concept Visualizers</h2>
              <p className="text-[11px] sm:text-xs text-slate-400 hidden xs:block">Playful first-principles interactive models for high-yield GATE topics</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-3 sm:px-6 py-2 bg-slate-900 border-b border-slate-800 overflow-x-auto text-xs sm:text-sm">
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
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg font-medium transition whitespace-nowrap text-xs sm:text-sm ${
                  active 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-950/40">
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
    { id: 'P1', at: 0, bt: 5, color: '#3b82f6' },
    { id: 'P2', at: 1, bt: 3, color: '#10b981' },
    { id: 'P3', at: 2, bt: 8, color: '#f59e0b' },
    { id: 'P4', at: 3, bt: 6, color: '#8b5cf6' },
  ]);

  // Compute Gantt Chart
  const computeSchedule = () => {
    let timeline = [];
    let currentTime = 0;
    
    if (algo === 'FCFS') {
      let sorted = [...processes].sort((a, b) => a.at - b.at);
      sorted.forEach(p => {
        if (currentTime < p.at) {
          timeline.push({ id: 'IDLE', start: currentTime, end: p.at, color: '#475569' });
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
          timeline.push({ id: 'IDLE', start: currentTime, end: nextAt, color: '#475569' });
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
      
      // push initial arrivals
      pPool.forEach(p => {
        if (p.at <= currentTime && !visited.has(p.id)) {
          queue.push(p);
          visited.add(p.id);
        }
      });

      while (queue.length > 0 || pPool.some(p => remBurst[p.id] > 0)) {
        if (queue.length === 0) {
          let nextP = pPool.find(p => remBurst[p.id] > 0);
          timeline.push({ id: 'IDLE', start: currentTime, end: nextP.at, color: '#475569' });
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

        // Check arrivals during this slice
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

    // Compute metrics
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
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-300">Scheduling Algorithm:</span>
          <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {['FCFS', 'SJF', 'RR'].map(m => (
              <button
                key={m}
                onClick={() => setAlgo(m)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  algo === m ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {algo === 'RR' && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-300">Time Quantum ($q$):</span>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={quantum}
              onChange={(e) => setQuantum(parseInt(e.target.value))}
              className="w-24 accent-indigo-500 cursor-pointer" 
            />
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded">
              {quantum} ms
            </span>
          </div>
        )}
      </div>

      {/* Gantt Chart Visualizer */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">Execution Gantt Chart (Time axis in ms)</h3>
          <span className="text-xs text-slate-400">Total Makespan: {totalDuration} ms</span>
        </div>

        <div className="relative w-full h-14 bg-slate-950 rounded-lg overflow-hidden flex border border-slate-800">
          {timeline.map((item, idx) => {
            const widthPct = ((item.end - item.start) / totalDuration) * 100;
            return (
              <div
                key={idx}
                style={{ width: `${widthPct}%`, backgroundColor: item.color }}
                className="h-full flex flex-col items-center justify-center text-white border-r border-slate-900/40 relative group transition-all"
                title={`${item.id} [${item.start} - ${item.end}]`}
              >
                <span className="text-xs font-bold truncate px-1">{item.id}</span>
                <span className="text-[10px] opacity-75">{item.end - item.start}m</span>
              </div>
            );
          })}
        </div>

        {/* Time markers */}
        <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
          <span>0</span>
          {timeline.map((t, idx) => (
            <span key={idx}>{t.end}</span>
          ))}
        </div>
      </div>

      {/* Process Metrics Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950/80 text-xs font-semibold text-slate-300 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Process</th>
              <th className="py-3 px-4">Arrival Time (AT)</th>
              <th className="py-3 px-4">Burst Time (BT)</th>
              <th className="py-3 px-4">Completion Time (CT)</th>
              <th className="py-3 px-4">Turnaround Time (TAT = CT - AT)</th>
              <th className="py-3 px-4">Waiting Time (WT = TAT - BT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {metrics.map(m => (
              <tr key={m.id} className="hover:bg-slate-800/40 transition">
                <td className="py-2.5 px-4 font-bold text-indigo-400">{m.id}</td>
                <td className="py-2.5 px-4 text-slate-300">{m.at}</td>
                <td className="py-2.5 px-4 text-slate-300">{m.bt}</td>
                <td className="py-2.5 px-4 text-emerald-400">{m.ct}</td>
                <td className="py-2.5 px-4 text-amber-400">{m.tat}</td>
                <td className="py-2.5 px-4 text-purple-400">{m.wt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
          <div className="text-xs text-slate-400">Average Turnaround Time</div>
          <div className="text-lg font-bold text-amber-400">{avgTat} ms</div>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
          <div className="text-xs text-slate-400">Average Waiting Time</div>
          <div className="text-lg font-bold text-purple-400">{avgWt} ms</div>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
          <div className="text-xs text-slate-400">CPU Throughput</div>
          <div className="text-lg font-bold text-emerald-400">{(processes.length / totalDuration).toFixed(3)} p/ms</div>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
          <div className="text-xs text-slate-400">Active Mode</div>
          <div className="text-lg font-bold text-indigo-400">{algo}</div>
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

  // Total lines = (Cache Size / Block Size)
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
    
    // Check hit in history
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Cache Capacity:</label>
          <select 
            value={cacheSizeKB} 
            onChange={e => setCacheSizeKB(parseInt(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 text-sm rounded-lg p-2 text-white"
          >
            <option value={8}>8 KB</option>
            <option value={16}>16 KB</option>
            <option value={32}>32 KB</option>
            <option value={64}>64 KB</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Block (Line) Size:</label>
          <select 
            value={blockSizeB} 
            onChange={e => setBlockSizeB(parseInt(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 text-sm rounded-lg p-2 text-white"
          >
            <option value={32}>32 Bytes</option>
            <option value={64}>64 Bytes</option>
            <option value={128}>128 Bytes</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Associativity:</label>
          <select 
            value={assoc} 
            onChange={e => setAssoc(parseInt(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 text-sm rounded-lg p-2 text-white"
          >
            <option value={1}>Direct Mapped (1-Way)</option>
            <option value={2}>2-Way Set Associative</option>
            <option value={4}>4-Way Set Associative</option>
            <option value={8}>8-Way Set Associative</option>
          </select>
        </div>
      </div>

      {/* Bit Allocation Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
        <h4 className="text-xs font-semibold text-slate-300">32-Bit Memory Address Decomposition:</h4>
        <div className="flex h-12 rounded-lg overflow-hidden border border-slate-700 text-xs font-mono font-bold">
          <div 
            style={{ width: `${(tagBits/32)*100}%` }} 
            className="bg-indigo-600/80 flex flex-col items-center justify-center text-white p-1"
          >
            <span>Tag ({tagBits} bits)</span>
          </div>
          <div 
            style={{ width: `${(setBits/32)*100}%` }} 
            className="bg-cyan-600/80 flex flex-col items-center justify-center text-white p-1 border-x border-slate-900"
          >
            <span>Set Index ({setBits} bits)</span>
          </div>
          <div 
            style={{ width: `${(offsetBits/32)*100}%` }} 
            className="bg-emerald-600/80 flex flex-col items-center justify-center text-white p-1"
          >
            <span>Offset ({offsetBits} bits)</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 flex justify-between">
          <span>Number of Sets: <strong className="text-slate-200">{numSets}</strong></span>
          <span>Lines per Set: <strong className="text-slate-200">{assoc}</strong></span>
          <span>Total Lines: <strong className="text-slate-200">{totalLines}</strong></span>
        </div>
      </div>

      {/* Test Memory Access Input */}
      <div className="flex gap-2">
        <input 
          type="text" 
          value={inputAddr}
          onChange={e => setInputAddr(e.target.value)}
          placeholder="Hex address (e.g. 0x2048)"
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
        />
        <button 
          onClick={handleSimulateAccess}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition"
        >
          Check Access
        </button>
      </div>

      {/* Recent Access History Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
        <table className="w-full text-left text-sm font-mono">
          <thead className="bg-slate-950/80 text-xs text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-4">Address</th>
              <th className="py-2.5 px-4">Tag</th>
              <th className="py-2.5 px-4">Set #</th>
              <th className="py-2.5 px-4">Offset</th>
              <th className="py-2.5 px-4">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-xs">
            {accessHistory.map((acc, i) => (
              <tr key={i} className="hover:bg-slate-800/30">
                <td className="py-2 px-4 text-white font-bold">{acc.addr}</td>
                <td className="py-2 px-4 text-indigo-300">{acc.tag}</td>
                <td className="py-2 px-4 text-cyan-300">{acc.set}</td>
                <td className="py-2 px-4 text-emerald-300">{acc.offset}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    acc.hit ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {acc.hit ? 'CACHE HIT' : 'CACHE MISS'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
        <span className="text-slate-400">Observed Cache Hit Ratio:</span>
        <span className="font-bold text-emerald-400 text-sm">{hitRate}% ({hitCount} / {accessHistory.length} hits)</span>
      </div>
    </div>
  );
}

// 3. Binary Search Tree Visualizer
function BSTVisualizer() {
  const [nodes, setNodes] = useState([50, 30, 70, 20, 40, 60, 80]);
  const [newVal, setNewVal] = useState('');
  const [traversalType, setTraversalType] = useState('inorder');

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

  // Traversal calculations
  const sorted = [...nodes].sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input 
          type="number"
          value={newVal}
          onChange={e => setNewVal(e.target.value)}
          placeholder="Enter integer key (e.g. 25)"
          className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 w-64"
        />
        <button 
          onClick={insertNode}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition"
        >
          Insert Key
        </button>
        <button 
          onClick={resetTree}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-sm transition"
        >
          Reset Sample
        </button>
      </div>

      {/* SVG Tree Visualizer */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-center min-h-[260px]">
        <svg viewBox="0 0 600 240" className="w-full max-w-xl text-white">
          {/* Branch lines */}
          <line x1="300" y1="40" x2="180" y2="100" stroke="#475569" strokeWidth="2" />
          <line x1="300" y1="40" x2="420" y2="100" stroke="#475569" strokeWidth="2" />
          <line x1="180" y1="100" x2="110" y2="170" stroke="#475569" strokeWidth="2" />
          <line x1="180" y1="100" x2="240" y2="170" stroke="#475569" strokeWidth="2" />
          <line x1="420" y1="100" x2="360" y2="170" stroke="#475569" strokeWidth="2" />
          <line x1="420" y1="100" x2="480" y2="170" stroke="#475569" strokeWidth="2" />

          {/* Root node */}
          <circle cx="300" cy="40" r="20" fill="#6366f1" />
          <text x="300" y="45" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff">50</text>

          {/* Level 1 */}
          <circle cx="180" cy="100" r="18" fill="#3b82f6" />
          <text x="180" y="105" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff">30</text>
          
          <circle cx="420" cy="100" r="18" fill="#3b82f6" />
          <text x="420" y="105" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff">70</text>

          {/* Level 2 */}
          <circle cx="110" cy="170" r="16" fill="#10b981" />
          <text x="110" y="174" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fff">20</text>

          <circle cx="240" cy="170" r="16" fill="#10b981" />
          <text x="240" y="174" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fff">40</text>

          <circle cx="360" cy="170" r="16" fill="#10b981" />
          <text x="360" y="174" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fff">60</text>

          <circle cx="480" cy="170" r="16" fill="#10b981" />
          <text x="480" y="174" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fff">80</text>
        </svg>
      </div>

      {/* Inorder Traversal Property Note */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
        <div className="text-xs font-semibold text-slate-300">Key GATE Theorem:</div>
        <p className="text-xs text-slate-400">
          The <strong>Inorder Traversal</strong> of a Binary Search Tree always yields elements in strictly monotonically increasing sorted order:
        </p>
        <div className="p-3 bg-slate-950 font-mono text-emerald-400 text-sm rounded-lg">
          Inorder Sequence: [ {sorted.join(', ')} ]
        </div>
      </div>
    </div>
  );
}

// 4. Subnetting & CIDR Visualizer
function SubnetVisualizer() {
  const [ip, setIp] = useState('192.168.10.68');
  const [cidr, setCidr] = useState(26);

  // Compute CIDR mask
  const maskInt = (0xFFFFFFFF << (32 - cidr)) >>> 0;
  const maskOctets = [
    (maskInt >>> 24) & 255,
    (maskInt >>> 16) & 255,
    (maskInt >>> 8) & 255,
    maskInt & 255,
  ];

  const ipOctets = ip.split('.').map(Number);
  const ipInt = ((ipOctets[0] << 24) | (ipOctets[1] << 16) | (ipOctets[2] << 8) | ipOctets[3]) >>> 0;

  const netInt = (ipInt & maskInt) >>> 0;
  const netOctets = [
    (netInt >>> 24) & 255,
    (netInt >>> 16) & 255,
    (netInt >>> 8) & 255,
    netInt & 255,
  ];

  const bcastInt = (netInt | (~maskInt >>> 0)) >>> 0;
  const bcastOctets = [
    (bcastInt >>> 24) & 255,
    (bcastInt >>> 16) & 255,
    (bcastInt >>> 8) & 255,
    bcastInt & 255,
  ];

  const usableHosts = Math.max(0, Math.pow(2, 32 - cidr) - 2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">Host IPv4 Address:</label>
          <input 
            type="text" 
            value={ip} 
            onChange={e => setIp(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-sm font-mono text-white rounded-lg p-2.5 focus:border-indigo-500" 
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-400">Prefix Length (/{cidr}):</label>
            <span className="text-xs font-mono text-indigo-400 font-bold">{maskOctets.join('.')}</span>
          </div>
          <input 
            type="range" 
            min="16" 
            max="30" 
            value={cidr} 
            onChange={e => setCidr(parseInt(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer mt-2" 
          />
        </div>
      </div>

      {/* Bit allocation bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
        <h4 className="text-xs font-semibold text-slate-300">IPv4 Bit Split (Total 32 Bits):</h4>
        <div className="flex h-10 rounded-lg overflow-hidden border border-slate-700 font-mono text-xs font-bold">
          <div 
            style={{ width: `${(cidr/32)*100}%` }}
            className="bg-indigo-600 flex items-center justify-center text-white"
          >
            Network / Subnet ({cidr} bits)
          </div>
          <div 
            style={{ width: `${((32-cidr)/32)*100}%` }}
            className="bg-emerald-600 flex items-center justify-center text-white"
          >
            Host ({32-cidr} bits)
          </div>
        </div>
      </div>

      {/* Computed Subnet Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Network Address:</span>
            <span className="font-bold text-indigo-400">{netOctets.join('.')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Subnet Mask:</span>
            <span className="font-bold text-slate-200">{maskOctets.join('.')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Broadcast Address:</span>
            <span className="font-bold text-rose-400">{bcastOctets.join('.')}</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">First Usable Host:</span>
            <span className="font-bold text-emerald-400">{netOctets[0]}.{netOctets[1]}.{netOctets[2]}.{netOctets[3]+1}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Last Usable Host:</span>
            <span className="font-bold text-emerald-400">{bcastOctets[0]}.{bcastOctets[1]}.{bcastOctets[2]}.{bcastOctets[3]-1}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Usable Hosts ($2^{32-n} - 2$):</span>
            <span className="font-bold text-amber-400">{usableHosts.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. 5-Stage CPU Pipeline Hazard Visualizer
function PipelineVisualizer() {
  const [forwarding, setForwarding] = useState(true);

  // Instructions:
  // I1: ADD R1, R2, R3 (writes R1 in WB)
  // I2: SUB R4, R1, R5 (reads R1 in ID)
  // I3: AND R6, R1, R7 (reads R1 in ID)
  // I4: OR  R8, R9, R10

  const stages = ['IF', 'ID', 'EX', 'MEM', 'WB'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <h4 className="text-sm font-bold text-white">Classic 5-Stage RISC Pipeline Execution Matrix</h4>
          <p className="text-xs text-slate-400">Demonstrating Read-After-Write (RAW) Data Hazard on Register R1</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-medium">Operand Forwarding:</span>
          <button
            onClick={() => setForwarding(!forwarding)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              forwarding ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {forwarding ? 'ENABLED (Zero Stalls)' : 'DISABLED (2 Stalls)'}
          </button>
        </div>
      </div>

      {/* Grid of Cycles */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="min-w-[650px] space-y-2">
          {/* Cycle Headers */}
          <div className="grid grid-cols-9 gap-1 text-center font-mono text-xs text-slate-400 font-bold pb-2 border-b border-slate-800">
            <div className="text-left text-slate-300">Instruction</div>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(c => (
              <div key={c}>CC{c}</div>
            ))}
          </div>

          {/* I1 */}
          <div className="grid grid-cols-9 gap-1 text-center font-mono text-xs items-center">
            <div className="text-left font-bold text-indigo-400 truncate">I1: ADD R1, R2, R3</div>
            <div className="bg-indigo-600/80 p-2 rounded text-white font-bold">IF</div>
            <div className="bg-blue-600/80 p-2 rounded text-white font-bold">ID</div>
            <div className="bg-amber-600/80 p-2 rounded text-white font-bold">EX</div>
            <div className="bg-purple-600/80 p-2 rounded text-white font-bold">MEM</div>
            <div className="bg-emerald-600/80 p-2 rounded text-white font-bold">WB</div>
            <div>-</div>
            <div>-</div>
            <div>-</div>
          </div>

          {/* I2 */}
          <div className="grid grid-cols-9 gap-1 text-center font-mono text-xs items-center">
            <div className="text-left font-bold text-amber-400 truncate">I2: SUB R4, R1, R5</div>
            <div>-</div>
            <div className="bg-indigo-600/80 p-2 rounded text-white font-bold">IF</div>
            {forwarding ? (
              <>
                <div className="bg-blue-600/80 p-2 rounded text-white font-bold">ID</div>
                <div className="bg-amber-600/80 p-2 rounded text-white font-bold ring-2 ring-emerald-400">EX*</div>
                <div className="bg-purple-600/80 p-2 rounded text-white font-bold">MEM</div>
                <div className="bg-emerald-600/80 p-2 rounded text-white font-bold">WB</div>
                <div>-</div>
                <div>-</div>
              </>
            ) : (
              <>
                <div className="bg-rose-900/60 p-2 rounded text-rose-400 font-bold border border-rose-500/40">STALL</div>
                <div className="bg-rose-900/60 p-2 rounded text-rose-400 font-bold border border-rose-500/40">STALL</div>
                <div className="bg-blue-600/80 p-2 rounded text-white font-bold">ID</div>
                <div className="bg-amber-600/80 p-2 rounded text-white font-bold">EX</div>
                <div className="bg-purple-600/80 p-2 rounded text-white font-bold">MEM</div>
                <div className="bg-emerald-600/80 p-2 rounded text-white font-bold">WB</div>
              </>
            )}
          </div>

          {/* I3 */}
          <div className="grid grid-cols-9 gap-1 text-center font-mono text-xs items-center">
            <div className="text-left font-bold text-emerald-400 truncate">I3: AND R6, R1, R7</div>
            <div>-</div>
            <div>-</div>
            <div className="bg-indigo-600/80 p-2 rounded text-white font-bold">IF</div>
            {forwarding ? (
              <>
                <div className="bg-blue-600/80 p-2 rounded text-white font-bold">ID</div>
                <div className="bg-amber-600/80 p-2 rounded text-white font-bold">EX</div>
                <div className="bg-purple-600/80 p-2 rounded text-white font-bold">MEM</div>
                <div className="bg-emerald-600/80 p-2 rounded text-white font-bold">WB</div>
                <div>-</div>
              </>
            ) : (
              <>
                <div className="bg-rose-900/60 p-2 rounded text-rose-400 font-bold border border-rose-500/40">STALL</div>
                <div className="bg-rose-900/60 p-2 rounded text-rose-400 font-bold border border-rose-500/40">STALL</div>
                <div className="bg-blue-600/80 p-2 rounded text-white font-bold">ID</div>
                <div className="bg-amber-600/80 p-2 rounded text-white font-bold">EX</div>
                <div className="bg-purple-600/80 p-2 rounded text-white font-bold">MEM</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
        <h5 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          GATE Formula Insight:
        </h5>
        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          Speedup (S) = (Clock cycles without pipelining) / (Clock cycles with pipelining) = (n * k) / (k + (n-1) + stalls)
        </p>
      </div>
    </div>
  );
}
