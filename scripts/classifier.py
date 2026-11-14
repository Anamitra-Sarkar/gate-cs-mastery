import re

SUBJECT_RULES = {
    'Operating Systems': {
        'keywords': ['process', 'thread', 'semaphore', 'mutex', 'deadlock', 'paging', 'virtual memory',
                     'page fault', 'round robin', 'fcfs', 'scheduling', 'banker', 'inode', 'fork()',
                     'critical section', 'turnaround', 'thrashing', 'belady', 'tlb', 'disk scheduling',
                     'sstf', 'scan', 'c-scan', 'page replacement', 'lru', 'fifo', 'context switch', 'system call',
                     'segmentation', 'multithreading', 'preemptive', 'non-preemptive', 'waiting time', 'ready queue',
                     'kernel', 'user mode', 'kernel mode', 'i/o burst', 'cpu burst', 'device driver'],
        'subtopics': ['CPU Scheduling', 'Concurrency & Synchronization', 'Deadlocks', 'Memory Management & Paging',
                      'Virtual Memory & Page Replacement', 'File Systems & Disk Scheduling', 'Processes & Threads']
    },
    'Databases': {
        'keywords': ['sql', 'relational', 'functional dependency', 'bcnf', '3nf', '2nf', '1nf', 'transaction',
                     'serializab', 'b+ tree', 'b-tree', 'foreign key', 'primary key', 'query', 'tuple calculus',
                     'acid', 'schedule', 'conflict serializable', 'view serializable', 'lossless', 'dependency preserving',
                     'relational algebra', 'er model', 'cardinality', 'aggregation', 'inner join', 'natural join',
                     'select', 'from', 'where', 'group by', 'having', 'schema', 'attribute', 'candidate key', 'superkey',
                     'index', 'clustering index', 'dense index', 'sparse index', 'isolation level', 'dirty read',
                     'phantom read', 'two phase locking', '2pl', 'timestamp ordering'],
        'subtopics': ['Relational Algebra & Tuple Calculus', 'SQL Queries', 'Functional Dependencies & Normalization',
                      'Transactions & Concurrency Control', 'Indexing & B/B+ Trees', 'ER Modeling & Integrity Constraints']
    },
    'Computer Networks': {
        'keywords': ['tcp', 'udp', 'ip address', 'subnet', 'cidr', 'router', 'ethernet', 'sliding window',
                     'congestion', 'bandwidth', 'packet', 'socket', 'dns', 'http', 'mac address', 'crc',
                     'stop-and-wait', 'go-back-n', 'selective repeat', 'round trip time', 'rtt', 'propagation delay',
                     'transmission delay', 'ipv4', 'ipv6', 'arp', 'bgp', 'ospf', 'distance vector', 'link state',
                     'electronic mail', 'smtp', 'pop3', 'imap', 'ftp', 'framing', 'bit stuffing', 'byte stuffing',
                     'carrier sense', 'csma/cd', 'csma/ca', 'collision', 'flow control', 'error control', 'checksum',
                     'hammin', 'parity', 'fragmentation', 'mtu', 'ttl', 'port number', 'three-way handshake', 'syn', 'ack', 'fin'],
        'subtopics': ['Data Link Layer & Flow Control', 'Network Layer & Subnetting (CIDR)', 'Routing Protocols',
                      'Transport Layer (TCP/UDP)', 'Application Layer Protocols', 'Error Detection & LANs']
    },
    'Theory of Computation': {
        'keywords': ['dfa', 'nfa', 'automata', 'context-free', 'cfg', 'regular expression', 'regular language',
                     'turing machine', 'decidable', 'undecidable', 'pumping lemma', 'grammar', 'parse tree',
                     'recursively enumerable', 'halting problem', 'chomsky', 'ambiguous grammar', 'pda',
                     'pushdown', 'myhill-nerode', 'closure properties', 'string', 'alphabet', 'language l =',
                     'l*', 'empty string', 'accept', 'transition', 'state', 'derivation', 'unrestricted grammar',
                     'context-sensitive', 'deterministic finite', 'nondeterministic'],
        'subtopics': ['Regular Languages & Finite Automata', 'Context-Free Languages & Pushdown Automata',
                      'Turing Machines & Computability', 'Decidability & Undecidability', 'Grammars & Chomsky Hierarchy']
    },
    'Compiler Design': {
        'keywords': ['lexical', 'parser', 'parsing', 'll(1)', 'lr(0)', 'slr', 'lalr', 'syntax directed',
                     'intermediate code', 'three-address', 'basic block', 'liveness', 'constant propagation',
                     'dag', 'activation record', 'lex', 'yacc', 'first and follow', 'operator precedence',
                     'code optimization', 'target code generation', 'register allocation', 'shift-reduce',
                     'reduce-reduce', 'handle', 'token', 'lexer', 'attribute grammar', 'inherited attribute',
                     'synthesized attribute', 'static single assignment', 'ssa', 'flow graph', 'peephole optimization'],
        'subtopics': ['Lexical Analysis & Tokens', 'Parsing Techniques (LL, LR, SLR, LALR)', 'Syntax Directed Translation (SDT)',
                      'Intermediate Code & Three-Address Code', 'Code Optimization & Data Flow Analysis', 'Runtime Environments']
    },
    'Algorithms': {
        'keywords': ['asymptotic', 'o(n', 'theta(', 'omega(', 'sorting', 'quicksort', 'mergesort', 'heapsort',
                     'dijkstra', 'bellman-ford', 'dynamic programming', 'greedy', 'minimum spanning tree',
                     'kruskal', 'prim', 'knapsack', 'binary search', 'hashing', 'hash table', 'time complexity',
                     'divide and conquer', 'recurrence', 'master theorem', 'floyd-warshall', 'topological sort',
                     'strongly connected', 'longest common subsequence', 'matrix chain', 'worst case', 'average case',
                     'running time', 'algorithm', 'lower bound', 'upper bound', 'optimal', 'greedy choice',
                     'memoization', 'np-complete', 'np-hard', 'polynomial time', 'traveling salesman', 'clique'],
        'subtopics': ['Asymptotic Analysis & Recurrences', 'Sorting & Searching Algorithms', 'Greedy Strategy',
                      'Dynamic Programming', 'Graph Algorithms (MST, Shortest Paths)', 'Hashing & Complexity Classes']
    },
    'Programming & Data Structures': {
        'keywords': ['pointer', 'recursion', 'binary search tree', 'bst', 'heap', 'linked list', 'stack', 'queue',
                     'array', 'preorder', 'inorder', 'postorder', 'avl tree', 'struct', 'malloc', 'c program',
                     'call by value', 'call by reference', 'sizeof', 'static int', 'tree traversal', 'breadth first',
                     'depth first', 'double pointer', 'null pointer', 'infix', 'postfix', 'balanced parentheses',
                     'node', 'push', 'pop', 'dequeue', 'enqueue', 'leaf node', 'height of tree', 'complete binary tree',
                     'circular queue', 'doubly linked', 'singly linked', 'function', 'return', 'printf', 'while (', 'for ('],
        'subtopics': ['C Programming & Pointers', 'Recursion & Function Stacks', 'Linear Data Structures (Arrays, Lists, Stacks)',
                      'Trees & Binary Search Trees', 'Heaps & Priority Queues', 'Graph Representations']
    },
    'Computer Organization & Architecture': {
        'keywords': ['cache', 'pipelining', 'pipeline', 'hazard', 'branch prediction', 'direct mapped',
                     'set associative', 'addressing mode', 'instruction', 'alu', 'microprogram', 'dma',
                     'interrupt', 'clock cycle', 'cpi', 'speedup', 'ieee 754', 'floating point',
                     'bus', 'memory hierarchy', 'cache hit', 'cache miss', 'write through', 'write back',
                     'rom', 'ram', 'memory capacity', 'tag bits', 'block size', 'instruction register', 'program counter',
                     'operand', 'opcode', 'control unit', 'hardwired', 'microprogrammed', 'multiplier',
                     'booth', 'restoring division', 'data hazard', 'structural hazard', 'control hazard'],
        'subtopics': ['Instruction Set & Addressing Modes', 'Instruction Pipelining & Hazards', 'Cache Memory & Hierarchy',
                      'ALU, Arithmetic & Floating Point', 'I/O Organization & Interrupts']
    },
    'Digital Logic': {
        'keywords': ['boolean', 'k-map', 'flip-flop', 'counter', 'multiplexer', 'decoder', 'logic gate',
                     'sop', 'pos', '2\'s complement', 'carry lookahead', 'full adder', 'demultiplexer',
                     'jk flip-flop', 'd flip-flop', 't flip-flop', 'synchronous counter', 'shift register',
                     'prime implicant', 'essential prime', 'nand', 'nor', 'xor', 'half adder', 'ripple carry',
                     'truth table', 'canonical', 'minterm', 'maxterm', 'propagation delay', 'setup time', 'hold time',
                     'combinational circuit', 'sequential circuit', 'hazard', 'multiplex', 'de-multiplex', 'encoder', 'priority encoder'],
        'subtopics': ['Boolean Algebra & Logic Gates', 'Combinational Circuits (MUX, Decoders, Adders)',
                      'Sequential Circuits (Flip-Flops & Counters)', 'Number Representations & Minimization']
    },
    'Discrete Mathematics': {
        'keywords': ['vertex', 'vertices', 'edge', 'edges', 'chromatic', 'planar', 'proposition', 'predicate',
                     'relation', 'lattice', 'partial order', 'combinatorics', 'permutation', 'pigeonhole',
                     'generating function', 'recurrence relation', 'equivalence relation', 'poset', 'hasse diagram',
                     'hamiltonian', 'eulerian', 'tree', 'bipartite', 'graph isomorphism', 'quantifier', 'isomorphic',
                     'degree', 'clique', 'cut vertex', 'spanning tree', 'reflexive', 'symmetric', 'transitive',
                     'tautology', 'contradiction', 'modus ponens', 'logical equivalence', 'set theory', 'power set',
                     'cardinality', 'inclusion-exclusion'],
        'subtopics': ['Propositional & First-Order Logic', 'Sets, Relations & Functions', 'Combinatorics & Counting',
                      'Graph Theory & Connectivity', 'Partial Orders & Lattices', 'Recurrence Relations']
    },
    'Engineering Mathematics': {
        'keywords': ['matrix', 'matrices', 'eigenvalue', 'eigenvector', 'rank', 'determinant', 'calculus',
                     'integral', 'derivative', 'continuous', 'differentiable', 'probability', 'poisson',
                     'normal distribution', 'expectation', 'variance', 'bayes', 'system of linear equations',
                     'definite integral', 'maxima', 'minima', 'limit', 'taylor series', 'random variable',
                     'cauchy', 'mean value theorem', 'exponential distribution', 'binomial distribution',
                     'uniform distribution', 'covariance', 'correlation', 'differential equation', 'laplace'],
        'subtopics': ['Linear Algebra (Matrices, Eigenvalues, Rank)', 'Calculus (Limits, Continuity, Integrals)',
                      'Probability & Distributions', 'Statistics & Bayes Theorem']
    },
    'General Aptitude': {
        'keywords': ['sentence', 'grammatical', 'blank', 'word', 'passage', 'conclude', 'triangle', 'percentage',
                     'ratio', 'clock', 'calendar', 'speed', 'distance', 'train', 'statement', 'infer', 'analogy',
                     'vocabulary', 'comprehension', 'logical deduction', 'venn diagram', 'work and time', 'perimeter',
                     'area', 'profit', 'loss', 'discount', 'interest', 'spelling', 'idiom', 'synonym', 'antonym'],
        'subtopics': ['Verbal Ability & Grammar', 'Numerical Ability & Quantitative Aptitude',
                      'Logical Reasoning & Data Interpretation', 'Spatial Aptitude']
    },
    'Data Science & AI': {
        'keywords': ['machine learning', 'regression', 'gradient descent', 'cross-entropy', 'neural network',
                     'supervised', 'unsupervised', 'clustering', 'k-means', 'pca', 'svm', 'support vector',
                     'decision tree', 'random forest', 'bayes classifier', 'loss function', 'activation function',
                     'heuristic', 'a* search', 'alpha-beta', 'data science', 'precision', 'recall', 'f1 score',
                     'confusion matrix', 'overfitting', 'regularization', 'bias-variance'],
        'subtopics': ['Machine Learning (Supervised & Unsupervised)', 'Neural Networks & Deep Learning',
                      'Optimization & Gradient Descent', 'AI Search & Heuristics']
    }
}

def classify_text(text):
    text_lower = text.lower()
    scores = {}
    for subject, info in SUBJECT_RULES.items():
        score = 0
        for kw in info['keywords']:
            if kw in text_lower:
                score += 3 if len(kw) > 6 else 1
        scores[subject] = score
    
    best_subject = max(scores, key=scores.get)
    if scores[best_subject] == 0:
        best_subject = 'Programming & Data Structures'
        subtopic = 'C Programming & Pointers'
    else:
        subtopics = SUBJECT_RULES[best_subject]['subtopics']
        subtopic = subtopics[0]
        for st in subtopics:
            st_words = [w.lower() for w in re.findall(r'\w+', st) if len(w) > 3]
            if any(w in text_lower for w in st_words):
                subtopic = st
                break
                
    return best_subject, subtopic
