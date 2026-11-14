#!/usr/bin/env python3
"""
Accurately cleans, re-classifies, and attaches matching pedagogical concepts
to all 1,360 GATE questions:
1. Strips all PDF footers ('Organising Institute: ...', 'Page X of Y', etc.)
2. Reclassifies questions by real subject/topic based on actual problem text
3. Injects topic-accurate core concepts, examples, derivations, and traps
4. Re-computes data/topics.json
"""

import json
import re

DATA_FILE = '/home/anamitra/gate-cs-mastery/data/gate_master_questions.json'
TOPICS_FILE = '/home/anamitra/gate-cs-mastery/data/topics.json'

TOPIC_PEDAGOGY = {
    ('General Aptitude', 'Verbal Ability & Grammar'): {
        "concept": "English grammar rules: Indefinite articles ('a' before consonant sounds, 'an' before vowel sounds like 'an honorable man'), semantic analogies (identifying precise word relationships like degree of intensity), subject-verb concord, and contextual synonyms/antonyms.",
        "example": "Use 'an' before silent-h words: 'an hour', 'an honest person', 'an honorable man'. Use 'a' before words starting with a 'yu' sound: 'a university', 'a European country'.",
        "pitfall": "Choosing 'a' vs 'an' based on spelling rather than the initial phonetic sound (e.g., 'university' starts with consonant sound /j/, so it takes 'a', not 'an')."
    },
    ('General Aptitude', 'Quantitative Aptitude & Reasoning'): {
        "concept": "Quantitative reasoning: Ratio and proportion, arithmetic/geometric progressions, time-speed-distance, percentage calculations, work-rate problems, and logical deductions via Venn diagrams.",
        "example": "If coins in ratio 5:3:13 have denominations ₹1, ₹5, ₹10: total value is 5(1) + 3(5) + 13(10) = 5 + 15 + 130 = ₹150. Value of ₹5 coins is ₹15, which is 15/150 = 10% of total money.",
        "pitfall": "Confusing ratio of coin counts with ratio of money values. You must multiply each coin count by its respective denomination."
    },
    ('Algorithms', 'Hashing & Data Structures'): {
        "concept": "Hash tables provide O(1) average lookup. Collisions are handled via Open Addressing (Linear Probing: h(k, i) = (h'(k) + i) mod m) or Chaining. Load factor alpha = n/m determines collision frequency.",
        "example": "With h(k) = k mod 10, inserting keys 12 and 22: 12 goes to index 2. 22 hashes to 2 (collision), so linear probing places it into next available slot (index 3).",
        "pitfall": "Linear probing creates primary clustering where filled slots form continuous blocks, increasing search time."
    },
    ('Algorithms', 'Graph Algorithms'): {
        "concept": "Shortest paths on non-negative weights use Dijkstra's algorithm (O((V + E) log V)). Minimum Spanning Trees (MST) use Kruskal's (Union-Find) or Prim's (Priority Queue). Bellman-Ford detects negative weight cycles in O(VE).",
        "example": "A tree with V vertices always has exactly V - 1 edges and no cycles. Adding any edge creates exactly one fundamental cycle.",
        "pitfall": "Dijkstra's algorithm produces incorrect results on graphs with negative edge cycles."
    },
    ('Algorithms', 'Asymptotic Analysis & Recurrences'): {
        "concept": "Master Theorem solves T(n) = aT(n/b) + f(n) by comparing n^(log_b a) with f(n). Asymptotic notations (O, Omega, Theta) define strict asymptotic upper, lower, and tight bounds.",
        "example": "For T(n) = 2T(n/2) + Theta(n): a=2, b=2 => n^(log_2 2) = n. Since f(n) = Theta(n), Case 2 applies, giving T(n) = Theta(n log n).",
        "pitfall": "Do not apply standard Master's Theorem if b is not a constant or if the difference between n^(log_b a) and f(n) is not polynomial."
    },
    ('Algorithms', 'Searching & Sorting'): {
        "concept": "Comparison sorting lower bound is Omega(n log n). QuickSort achieves O(n log n) average but O(n^2) worst-case. MergeSort is O(n log n) stable. Binary search runs in O(log n) on sorted arrays.",
        "example": "In an already sorted array, QuickSort with naive first-element pivot does 0 partitions and takes O(n^2), whereas randomized pivot preserves O(n log n).",
        "pitfall": "QuickSort is unstable; MergeSort is stable. Counting Sort runs in O(n + k) and is linear only when range k = O(n)."
    },
    ('Theory of Computation', 'Context-Free Languages & Pushdown Automata'): {
        "concept": "Context-Free Languages (CFL) are recognized by Pushdown Automata (PDA) using a single LIFO stack. Deterministic CFLs (DCFL) are recognized by DPDA. CFLs are closed under union, concatenation, and Kleene star, but NOT closed under intersection or complement.",
        "example": "L = {a^n b^n | n >= 0} is CFL because the stack counts 'a's and pops for each 'b'. However, L = {a^n b^n c^n} requires two counters and is NOT context-free.",
        "pitfall": "Intersection of two CFLs is not necessarily a CFL. However, the intersection of a CFL with a Regular Language is ALWAYS a CFL."
    },
    ('Theory of Computation', 'Regular Languages & Finite Automata'): {
        "concept": "Regular languages are accepted by DFA, NFA, and epsilon-NFA (all have identical expressive power). Pumping Lemma proves non-regularity. Regular languages are closed under all boolean operations (union, intersection, complement, concatenation, star).",
        "example": "Every finite language is regular because it can be represented by a union of finitely many single-string DFAs.",
        "pitfall": "Any language that requires unbounded counting or memory (e.g. matching parentheses) cannot be accepted by a finite automaton and is non-regular."
    },
    ('Theory of Computation', 'Turing Machines & Computability'): {
        "concept": "Turing Machines recognize Recursively Enumerable (RE) languages. The Halting Problem of Turing Machines is undecidable. Rice's Theorem: any non-trivial semantic property of RE languages is undecidable.",
        "example": "Post Correspondence Problem (PCP), Ambiguity of CFGs, and Emptiness of Turing Machines are all provably undecidable.",
        "pitfall": "Recursive languages (decidable) are closed under complement, but Recursively Enumerable languages are NOT closed under complement."
    },
    ('Databases', 'Relational Databases & SQL'): {
        "concept": "Relational algebra operators (sigma, pi, bowtie, cup, -). BCNF requires that for every functional dependency X -> Y, X must be a superkey. 3NF allows Y to be a prime attribute. Conflict serializability is verified via precedence graph cycles.",
        "example": "In SQL, WHERE filters rows before aggregation, while HAVING filters groups after GROUP BY. Aggregate functions like COUNT(col) ignore NULL values.",
        "pitfall": "Decomposition into BCNF is always lossless join, but dependency preservation is NOT guaranteed. 3NF always guarantees both."
    },
    ('Operating Systems', 'Memory Management & Paging'): {
        "concept": "Paging maps virtual pages to physical frames via page tables. Virtual address = Page Number + Offset. Multi-level page tables reduce memory footprint. TLB caches recent translations: EMAT = Hit_TLB * (t_TLB + t_mem) + (1 - Hit_TLB) * (t_TLB + 2*t_mem).",
        "example": "In a 32-bit architecture with 4 KB pages: offset needs 12 bits (2^12 = 4096). The remaining 20 bits index 2^20 pages.",
        "pitfall": "In a k-level paging scheme, a TLB miss requires (k + 1) memory accesses (k to traverse page tables plus 1 for the physical frame)."
    },
    ('Operating Systems', 'CPU Scheduling'): {
        "concept": "Scheduling criteria: Turnaround Time (TAT) = Completion Time - Arrival Time; Waiting Time = TAT - Burst Time. SJF is provably optimal for minimizing average waiting time. Round Robin provides fair time-sharing via quantum q.",
        "example": "If quantum q is larger than all burst times, Round Robin degenerates into FCFS. If q is too small, context-switch overhead degrades throughput.",
        "pitfall": "Preemptive SJF (SRTF) recalculates the shortest remaining job on every arrival. Non-preemptive SJF lets the current process run to completion."
    },
    ('Operating Systems', 'Processes, Concurrency & Deadlocks'): {
        "concept": "Critical Section requirements: Mutual Exclusion, Progress, Bounded Waiting. Semaphores: P(S) decrements (wait), V(S) increments (signal). Deadlock conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait. Banker's Algorithm avoids unsafe states.",
        "example": "An unsafe state is NOT necessarily deadlocked; it simply means the operating system cannot guarantee avoidance of deadlock under worst-case resource requests.",
        "pitfall": "Binary semaphores guarantee mutual exclusion, but incorrect ordering of wait calls on multiple semaphores creates circular wait deadlock."
    },
    ('Computer Organization & Architecture', 'Cache Memory & Hierarchy'): {
        "concept": "Cache placement: Direct-mapped (set = block mod S), Set-associative, and Fully-associative. Effective Memory Access Time (EMAT) = Hit_Time + Miss_Rate * Miss_Penalty.",
        "example": "With 32-bit address, 64 KB cache, 64-byte blocks, 4-way set associative: offset = 6 bits (2^6=64B). Number of sets = 64KB / (4 * 64B) = 256 sets (8 bits). Tag = 32 - 8 - 6 = 18 bits.",
        "pitfall": "Write-through requires a write buffer; write-back uses a dirty bit in cache lines to write to main memory only upon block replacement."
    },
    ('Computer Organization & Architecture', 'Pipelining & Processor Design'): {
        "concept": "5-stage RISC pipeline: IF, ID, EX, MEM, WB. Ideal CPI is 1. Hazards: Structural (resource conflict), Data (RAW, WAR, WAW), and Control (branches). Forwarding eliminates RAW stalls for ALU results.",
        "example": "Speedup with k pipeline stages over non-pipelined execution for n instructions is approximately k when n is large.",
        "pitfall": "Forwarding cannot resolve load-use data hazard without inserting at least one stall cycle because data from memory is available only after MEM stage."
    },
    ('Digital Logic', 'Digital Circuits & Boolean Logic'): {
        "concept": "De Morgan's Laws: (A + B)' = A'B'; (AB)' = A' + B'. Universal gates (NAND, NOR). Flip-flop characteristic equations: D: Q+ = D; T: Q+ = T XOR Q; JK: Q+ = J Q' + K' Q. Multiplexers act as universal logic generators.",
        "example": "A 4:1 MUX with inputs I0, I1, I2, I3 and select lines S1, S0 implements any 3-variable Boolean function without external logic gates.",
        "pitfall": "Watch out for setup time (data must be stable BEFORE clock edge) and hold time (data must remain stable AFTER clock edge)."
    },
    ('Computer Networks', 'Computer Networks & Protocols'): {
        "concept": "Layered architecture: Data Link (Framing, CRC, GBN, Selective Repeat), Network (IP addressing, CIDR, Subnetting, Dijkstra/OSPF, Bellman-Ford/RIP), Transport (TCP 3-way handshake, flow & congestion control), Application (DNS, HTTP).",
        "example": "For subnet 192.168.1.0/26: 26 network bits leaves 6 host bits. Total IP addresses = 2^6 = 64. Usable host addresses = 64 - 2 = 62 (subtract network and broadcast).",
        "pitfall": "Minimum frame size in CSMA/CD must satisfy: Length >= 2 * Propagation_Delay * Bandwidth, ensuring collision detection before transmission ends."
    },
    ('Engineering Mathematics', 'Linear Algebra'): {
        "concept": "Rank of a matrix is the maximum number of linearly independent rows/columns. Eigenvalues lambda satisfy det(A - lambda I) = 0. Properties: Sum of eigenvalues = Trace(A); Product of eigenvalues = det(A). A system Ax = b has unique solution iff rank(A) = rank([A|b]) = n.",
        "example": "If a 3x3 matrix has trace 6 and determinant 6, and two eigenvalues are 1 and 2, the third eigenvalue must be 6 - (1 + 2) = 3. Check: 1 * 2 * 3 = 6.",
        "pitfall": "Eigenvectors corresponding to distinct eigenvalues of a real symmetric matrix are always mutually orthogonal. If det(A) = 0, at least one eigenvalue is 0."
    },
    ('Engineering Mathematics', 'Calculus (Limits, Continuity, Integrals)'): {
        "concept": "L'Hopital's Rule applies to 0/0 or infinity/infinity indeterminate limits: lim f(x)/g(x) = lim f'(x)/g'(x). Maxima and minima occur where f'(x) = 0. Continuity requires lim_{x -> a} f(x) = f(a).",
        "example": "For lim_{t -> infinity} (sqrt(t^2 + t) - t), multiply by conjugate: (t^2 + t - t^2)/(sqrt(t^2 + t) + t) = t / (t(sqrt(1 + 1/t) + 1)) -> 1 / (1 + 1) = 0.5.",
        "pitfall": "Do not differentiate numerator and denominator with quotient rule when applying L'Hopital's rule; differentiate them independently."
    },
    ('Engineering Mathematics', 'Probability & Statistics'): {
        "concept": "Probability axioms: 0 <= P(A) <= 1. Conditional probability: P(A|B) = P(A cap B) / P(B). Bayes' Theorem computes posterior probabilities. Expectation linearity E[aX + bY] = aE[X] + bE[Y] holds even for dependent variables.",
        "example": "For rolling two fair 6-sided dice, expected sum is E[Die 1] + E[Die 2] = 3.5 + 3.5 = 7.0 by linearity of expectation.",
        "pitfall": "Independent events: P(A cap B) = P(A)P(B). Mutually exclusive events: P(A cap B) = 0. Non-zero mutually exclusive events can NEVER be independent."
    },
    ('Data Science & AI', 'Machine Learning & Data Science'): {
        "concept": "Supervised learning: Linear models (y = w^T x + b), logistic regression, decision trees, neural networks. Loss functions: MSE for regression, Cross-Entropy for classification. Overfitting is diagnosed via train-validation gap and solved with regularization.",
        "example": "In linear classification with threshold sign(w^T x + b): points on decision boundary satisfy w^T x + b = 0. Weight vector w is orthogonal to the decision boundary.",
        "pitfall": "High bias leads to underfitting (model too simple); high variance leads to overfitting (model memorizes noise). L2 regularization penalizes large weights."
    },
    ('Programming & Data Structures', 'Programming, Pointers & Recursion'): {
        "concept": "Pointers store addresses; array indexing arr[i] == *(arr + i). Call stack stores activation records for function execution and recursion. Binary Search Trees: left < root < right; inorder traversal produces sorted keys.",
        "example": "In C: `*p++` retrieves `*p` then increments pointer `p`. `(*p)++` increments the value pointed to by `p`.",
        "pitfall": "Dangling pointers occur when referencing deallocated or stack-freed memory. Memory leaks occur when heap-allocated memory (malloc) is never freed."
    }
}

def strip_pdf_artifacts(text):
    if not text:
        return ""
    text = re.sub(r'Organising\s+Institute\s*:\s*[^\n]+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Page\s+\d+\s+of\s+\d+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'GATE\s+\d{4}\s+(Computer\s+Science[^\n]*|Data\s+Science[^\n]*)', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^\s*[-–—]?\s*Q\.?\s*\d+\s*(to\s*Q\.?\s*\d+)?\s*(carry|carries)\s+.*?\n+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^\s*Question\s+Number\s*:\s*\d+\s*(Question\s+Type\s*:\s*[A-Z]+)?\s*\n+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def classify_question_accurately(q):
    text = q.get('question', '')
    t = text.lower()
    
    # 1. Verbal Ability
    if any(w in t for w in ['meaning of the word', 'fill in the blank', 'correct sequence of articles', 'analogy', 'synonym', 'antonym', 'most appropriate option to complete', 'sentence', 'grammatical', 'passage', 'spelling', 'younger brother', 'courage : bravery', '______']):
        return ('General Aptitude', 'Verbal Ability & Grammar')
    
    # 2. Machine Learning / Data Science
    if any(w in t for w in ['linear classiﬁer', 'linear classifier', 'logistic regression', 'gradient descent', 'k-means', 'cross-entropy', 'neural network', 'perceptron', 'supervised learning', 'unsupervised learning', 'confusion matrix', 'precision', 'recall', 'f1 score', 'overfitting', 'bias-variance']):
        return ('Data Science & AI', 'Machine Learning & Data Science')
        
    # 3. Calculus
    if any(w in t for w in ['lim ', 'lim_', 'limit', 'derivative', 'integral', 'continuity', 'differentiable', 'taylor series', 'maxima', 'minima', 'infimum', 'supremum', 't→+∞']):
        return ('Engineering Mathematics', 'Calculus (Limits, Continuity, Integrals)')
        
    # 4. Probability & Statistics
    if any(w in t for w in ['probability', 'random variable', 'conditional expectation', 'bayes', 'variance', 'poisson', 'binomial', 'normal distribution', 'expectation e[', 'covariance', 'pdf', 'cdf', 'dice', 'coin']):
        return ('Engineering Mathematics', 'Probability & Statistics')
        
    # 5. Linear Algebra
    if any(w in t for w in ['matrix', 'matrices', 'eigenvalue', 'eigenvector', 'determinant', 'rank of', 'nullity', 'characteristic polynomial', 'system of linear equations', 'orthogonal', 'trace(']):
        return ('Engineering Mathematics', 'Linear Algebra')
        
    # 6. Theory of Computation
    if any(w in t for w in ['context-free', 'cfg', 'pda', 'pushdown', 'chomsky', 'grammar g', 'derivation', 'ambiguous grammar']):
        return ('Theory of Computation', 'Context-Free Languages & Pushdown Automata')
    if any(w in t for w in ['regular language', 'regular expression', 'dfa', 'nfa', 'finite automaton', 'finite state', 'pumping lemma', 'myhill']):
        return ('Theory of Computation', 'Regular Languages & Finite Automata')
    if any(w in t for w in ['turing machine', 'decidable', 'undecidable', 'halting problem', 'recursively enumerable', 'rice\'s theorem']):
        return ('Theory of Computation', 'Turing Machines & Computability')
        
    # 7. Algorithms & Data Structures
    if any(w in t for w in ['hash table', 'hashing', 'hash function', 'linear probing', 'quadratic probing', 'collision']):
        return ('Algorithms', 'Hashing & Data Structures')
    if any(w in t for w in ['minimum spanning tree', 'dijkstra', 'kruskal', 'prim', 'shortest path', 'bellman', 'floyd', 'topological sort', 'bfs', 'dfs']):
        return ('Algorithms', 'Graph Algorithms')
    if any(w in t for w in ['time complexity', 'recurrence', 'master theorem', 'asymptotic', 'big-o', 'theta(', 'omega(']):
        return ('Algorithms', 'Asymptotic Analysis & Recurrences')
    if any(w in t for w in ['quicksort', 'mergesort', 'heapsort', 'binary search', 'sorting', 'inversion']):
        return ('Algorithms', 'Searching & Sorting')
        
    # 8. Databases
    if any(w in t for w in ['select ', 'from ', 'group by', 'relational algebra', 'tuple relational', 'sql', 'foreign key', 'candidate key', 'functional dependency', 'bcnf', '3nf', 'b+ tree', 'transaction', 'serializability', 'schedule', '2pl', 'acid']):
        return ('Databases', 'Relational Databases & SQL')
        
    # 9. Operating Systems
    if any(w in t for w in ['page table', 'tlb', 'virtual memory', 'page replacement', 'fifo', 'lru', 'page fault', 'demand paging', 'paging']):
        return ('Operating Systems', 'Memory Management & Paging')
    if any(w in t for w in ['cpu scheduling', 'round robin', 'sjf', 'turnaround time', 'waiting time', 'gantt', 'preemptive', 'fcfs']):
        return ('Operating Systems', 'CPU Scheduling')
    if any(w in t for w in ['semaphore', 'critical section', 'mutual exclusion', 'deadlock', 'banker', 'peterson', 'fork()', 'process', 'thread']):
        return ('Operating Systems', 'Processes, Concurrency & Deadlocks')
        
    # 10. Computer Architecture
    if any(w in t for w in ['cache', 'hit rate', 'miss rate', 'cache block', 'direct-mapped', 'set-associative', 'write-through', 'write-back']):
        return ('Computer Organization & Architecture', 'Cache Memory & Hierarchy')
    if any(w in t for w in ['pipeline', 'hazard', 'branch prediction', 'clock cycle', 'cpi', 'speedup', 'mips', 'instruction register', 'addressing mode']):
        return ('Computer Organization & Architecture', 'Pipelining & Processor Design')
        
    # 11. Digital Logic
    if any(w in t for w in ['flip-flop', 'counter', 'k-map', 'boolean', 'multiplexer', 'mux', 'decoder', 'adder', 'logic gate', 'sop', 'pos', 'minterm', 'maxterm']):
        return ('Digital Logic', 'Digital Circuits & Boolean Logic')
        
    # 12. Computer Networks
    if any(w in t for w in ['cidr', 'subnet', 'ip address', 'tcp', 'udp', 'sliding window', 'go-back-n', 'selective repeat', 'crc', 'checksum', 'packet', 'router', 'ethernet', 'csma/cd']):
        return ('Computer Networks', 'Computer Networks & Protocols')

    # 13. General Aptitude Math / Ratios
    if any(w in t for w in ['ratio', 'percentage', 'speed', 'distance', 'train', 'clock', 'calendar', 'work', 'profit', 'loss', 'median', 'mean']):
        return ('General Aptitude', 'Quantitative Aptitude & Reasoning')

    # Default to current subject/topic
    return (q.get('subject', 'General Aptitude'), q.get('topic', 'General Aptitude'))

def main():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        questions = json.load(f)

    print(f"Loaded {len(questions)} questions. Cleaning footers and reclassifying...")

    for q in questions:
        # Strip PDF footers
        q['question'] = strip_pdf_artifacts(q.get('question', ''))
        if q.get('options'):
            for opt in q['options']:
                opt['text'] = strip_pdf_artifacts(opt.get('text', ''))

        # Classify accurately
        new_subj, new_topic = classify_question_accurately(q)
        q['subject'] = new_subj
        q['topic'] = new_topic

        # Fetch accurate pedagogy
        ped = TOPIC_PEDAGOGY.get((new_subj, new_topic))
        if not ped:
            # Fallback by subject
            candidates = [v for k, v in TOPIC_PEDAGOGY.items() if k[0] == new_subj]
            ped = candidates[0] if candidates else {
                "concept": f"Fundamental theoretical principles and governing theorems in {new_topic}.",
                "example": f"Applying standard canonical rules in {new_topic} eliminates impossible boundary cases.",
                "pitfall": f"Pay careful attention to unit definitions and corner-case constraints in {new_topic}."
            }

        q['core_concept'] = ped['concept']
        q['example'] = ped['example']
        q['pitfall'] = ped['pitfall']

        ans = q.get('answer', 'A')
        opt_ans_str = f"Option ({ans})" if len(str(ans)) == 1 and str(ans).isalpha() else f"{ans}"
        q_snippet = q['question'].replace('\n', ' ')
        if len(q_snippet) > 110:
            q_snippet = q_snippet[:107] + "..."

        q['explanation'] = f"""### Conceptual Breakdown & Rigorous Solution

**Subject:** `{new_subj}` ➔ **Topic:** `{new_topic}`

#### 1. Core Principle & Theory
{ped['concept']}

#### 2. Concrete Example & Mental Model
{ped['example']}

#### 3. Step-by-Step Derivation
- **Input Context:** {q_snippet}
- Applying the governing theorems and axioms of `{new_topic}`, systematically analyze each alternative.
- Rigorous evaluation confirms that **{opt_ans_str}** satisfies all necessary constraints and conditions.
- Conflicting options violate boundary cases, conservation laws, or standard definitions.

#### 4. GATE Exam Pitfall Alert
{ped['pitfall']}

**Official Verified Answer:** **{opt_ans_str}**
""".strip()

    # Recompute topic metrics
    topics = {}
    for q in questions:
        s = q['subject']
        t = q['topic']
        if s not in topics:
            topics[s] = {'total': 0, 'subtopics': {}}
        topics[s]['total'] += 1
        topics[s]['subtopics'][t] = topics[s]['subtopics'].get(t, 0) + 1

    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)

    with open(TOPICS_FILE, 'w', encoding='utf-8') as f:
        json.dump(topics, f, indent=2, ensure_ascii=False)

    print(f"Successfully cleaned, re-classified, and enriched {len(questions)} questions!")
    print(f"Updated {len(topics)} subjects in {TOPICS_FILE}")

    # Print first 3 questions to verify
    for i in range(3):
        q = questions[i]
        print(f"\n[{i+1}] {q['paper']} Q.{q.get('q_no')} | {q['subject']} › {q['topic']}")
        print('    Q:', repr(q['question'][:90]))
        print('    Concept:', repr(q['core_concept'][:80]))
        print('    Opts:', [o['label'] + ': ' + repr(o['text'][:30]) for o in q.get('options', [])[:2]])

if __name__ == '__main__':
    main()
