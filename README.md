# GATE CS & DA Interactive Exam Mastery Platform 🚀

A comprehensive, playful, and interactive exam preparation platform engineered for **GATE Computer Science & Information Technology (CS)** and **Data Science & AI (DA)** aspirants.

Designed with a modern aesthetic, step-by-step verified explanations, interactive first-principles visualizers, official CBT Mock environment, and a contextual AI Tutor powered by live Groq acceleration.

---

## 🌟 Key Features

### 1. 📚 Topic-Wise Question Bank (775+ Verified PYQs)
- Organizes past 35 years of GATE exam questions (1991–2025) strictly by topic rather than raw years:
  - **Operating Systems** (CPU Scheduling, Paging, Virtual Memory, Deadlocks, File Systems)
  - **Databases** (SQL, Normalization, 2PL, Transactions, Indexing, B/B+ Trees)
  - **Computer Networks** (CIDR, Subnetting, TCP/UDP, Flow & Error Control, Protocols)
  - **Theory of Computation** (DFA, NFA, CFG, PDA, Turing Machines, Decidability)
  - **Compiler Design** (Parsing LL/LR/LALR, Syntax Directed Translation, Optimization)
  - **Algorithms** (Asymptotic Analysis, Sorting, Dynamic Programming, Greedy, Graphs)
  - **Programming & Data Structures** (Pointers, Recursion, Binary Search Trees, Heaps)
  - **Computer Organization & Architecture** (Pipelining, Hazards, Cache Mapping, Memory)
  - **Digital Logic** (Boolean Algebra, K-Maps, Combinational & Sequential Circuits)
  - **Discrete Mathematics** (Graph Theory, Propositional Logic, Combinatorics, Relations)
  - **Engineering Mathematics** (Linear Algebra, Calculus, Probability & Distributions)
  - **General Aptitude** (Verbal Ability, Quantitative Reasoning)
  - **Data Science & Artificial Intelligence** (Machine Learning, Search, Optimization)

### 2. 🎮 Playful & Engaging Practice Mode
- **Immediate Feedback:** Instant validation on selection with emerald glow or gentle shake animation.
- **NAT Support:** Numeric answer validation with official tolerance range handling (e.g. `28 to 30`).
- **Strategic Hints:** Pedagogical accordion that guides intuition without spoiling the final answer.
- **Step-by-Step Proofs:** Complete mathematical breakdowns, counter-examples, and distractor analyses.
- **KaTeX Mathematical Rendering:** Clear rendering of Big-O notations, summations, matrices, and state alphabets.
- **Streak & XP Progression:** Level up from *Novice* to *AIR 1 Aspirant* with XP multipliers and streak counters.

### 3. 🔬 5 Interactive CS Concept Visualizers
1. **CPU Scheduling Visualizer:** Interactive Gantt chart for FCFS, Round Robin (dynamic quantum slider), and SJF with real-time turnaround and waiting time tables.
2. **Cache Memory Simulator:** Direct mapped, 2-Way, and 4-Way Set Associative simulator with tag/set/offset bit decomposition and real-time hit/miss tracking.
3. **Binary Search Tree & AVL Explorer:** Interactive SVG node rendering with animated Inorder, Preorder, and Postorder sequence demonstrations.
4. **Subnetting & CIDR Calculator:** Complete IPv4 prefix visualizer displaying Network ID, Broadcast ID, usable host range, and binary bit masks.
5. **5-Stage Pipeline Hazard Visualizer:** Clock cycle matrix illustrating Read-After-Write (RAW) data hazard stalls and forwarding paths.

### 4. ⏱️ Authentic GATE CBT Mock Examination
- Realistic countdown timer (15 min sprint, 30 min sectional, or 60 min full mock).
- Built-in **TCS iON Scientific Calculator** (trigonometric, logarithmic, square root, exponent functions).
- Color-coded question palette: *Answered (Green)*, *Unanswered (Red)*, *Marked for Review (Purple)*, *Not Visited (Gray)*.
- Official GATE negative marking (-0.33 for 1-mark, -0.66 for 2-mark).
- Instant scorecard with accuracy %, marks scored, and topic weakness analysis.

### 5. 🤖 Contextual Groq AI Tutor
- Connects directly to live Groq API models (dynamically auto-detected, defaulting to `qwen/qwen3.8-27b`, with fallback to `openai/gpt-oss-120b`).
- Context-aware: automatically detects the question you are solving.
- Quick prompt chips:
  - *💡 Gentle Hint without giving answer*
  - *🎯 Explain from First Principles*
  - *❌ Distractor Analysis (Why option C is wrong)*
  - *📐 Key Formulas and Theorems*

### 6. 📝 Virtual Scratchpad & Mistake Notebook
- **Rough Sheet Modal:** In-app drawing and calculation board for quick rough work.
- **Mistake Notebook:** Automatically catalogs every missed question and bookmark for spaced repetition.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, KaTeX, Canvas Confetti
- **Backend:** Node.js, Express, HTTPS Groq Integration
- **Data Engineering:** PyMuPDF (`fitz`), Python NLP Syllabus Classifier

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+ (for dataset pipeline)

### Installation
```bash
git clone https://github.com/Anamitra-Sarkar/gate-cs-mastery.git
cd gate-cs-mastery

# Install backend and client dependencies
npm install
cd client && npm install && npm run build
cd ..
```

### Running the App
```bash
# Start backend and serve production client at http://localhost:5000
npm start
```

For live development with hot reload:
```bash
# In terminal 1: start server
node server/index.js

# In terminal 2: start Vite dev client
cd client && npm run dev
```

### Running the Test Suite
```bash
npm test
```

---

## 🌐 Running in GitHub Codespaces
This repository is configured with a ready-to-run `.devcontainer`. Simply open in Codespaces:
- Ports `5000` (Server) and `5173` (Client) are automatically forwarded.
- Run `npm start` to launch the platform immediately.
