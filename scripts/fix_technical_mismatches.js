const fs = require("fs");
const path = require("path");

const masterPath = path.join(__dirname, "../data/gate_master_questions.json");
const data = JSON.parse(fs.readFileSync(masterPath, "utf8"));

const updates = {
  "GATE_2025_CS1_Q52_9466": {
    question: `Refer to the given 3-address code sequence:

\`\`\`text
1001: i = 1
1002: j = 1
1003: t1 = 10 * i
1004: t2 = t1 + j
1005: t3 = 8 * t2
1006: t4 = t3 - 88
1007: a[t4] = 0.0
1008: j = j + 1
1009: if j <= 10 goto 1003
1010: i = i + 1
1011: if i <= 10 goto 1002
1012: i = 1
1013: t5 = i - 1
1014: t6 = 88 * t5
1015: a[t6] = 1.0
1016: i = i + 1
1017: if i <= 10 goto 1013
\`\`\`

This code sequence is split into basic blocks. The number of basic blocks is ________. (Answer in integer)`,
    subject: "Compiler Design",
    topic: "Code Optimization & Basic Blocks",
    answer: "6 to 6",
    type: "NAT",
    explanation: `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Compiler Design\` ➔ **Topic:** \`Code Optimization & Basic Blocks\`

#### 1. Standard Algorithm for Finding Leaders
In compiler intermediate code optimization, a basic block is a sequence of consecutive statements with a single entry and single exit. We partition the code into basic blocks by identifying **leaders**:
1. **Rule 1:** The first three-address instruction is always a leader.
   - Line **1001** is the first instruction $\\implies$ **1001 is a leader**.
2. **Rule 2:** Any statement that is the target of a conditional or unconditional goto is a leader.
   - Line 1009 jumps to line **1003** $\\implies$ **1003 is a leader**.
   - Line 1011 jumps to line **1002** $\\implies$ **1002 is a leader**.
   - Line 1017 jumps to line **1013** $\\implies$ **1013 is a leader**.
3. **Rule 3:** Any statement that immediately follows a conditional or unconditional goto is a leader.
   - Statement immediately following line 1009 is **1010** $\\implies$ **1010 is a leader**.
   - Statement immediately following line 1011 is **1012** $\\implies$ **1012 is a leader**.

#### 2. Complete Set of Leaders
Sorting the identified leaders in instruction sequence:
$$\\text{Leaders} = \\{1001, 1002, 1003, 1010, 1012, 1013\\}$$

#### 3. Partitioning into Basic Blocks
Each basic block starts at a leader and includes all statements up to, but not including, the next leader or the end of the program:
- **Block $B_1$:** Line 1001 (\`i = 1\`)
- **Block $B_2$:** Line 1002 (\`j = 1\`)
- **Block $B_3$:** Lines 1003 through 1009 (Loop body for \`j\`, terminating at \`if j <= 10 goto 1003\`)
- **Block $B_4$:** Lines 1010 through 1011 (Increment \`i\`, terminating at \`if i <= 10 goto 1002\`)
- **Block $B_5$:** Line 1012 (\`i = 1\`)
- **Block $B_6$:** Lines 1013 through 1017 (Loop body for \`i\`, terminating at \`if i <= 10 goto 1013\`)

#### 4. Conclusion
There are exactly **6** basic blocks.

**Official Verified Answer:** **6**`
  },

  "GATE_2024_CS1_Q34_2393": {
    question: `The number of spanning trees in a complete graph of 4 vertices labelled A, B, C, and D is ________. (Answer in integer)`,
    subject: "Discrete Mathematics",
    topic: "Graph Theory & Trees",
    answer: "16 to 16",
    type: "NAT",
    explanation: `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Discrete Mathematics\` ➔ **Topic:** \`Graph Theory & Trees\`

#### 1. Cayley's Tree Formula
For any complete labeled graph $K_n$ on $n$ distinct vertices, **Cayley's Formula** states that the total number of distinct labeled spanning trees is given by:
$$T(K_n) = n^{n - 2}$$

#### 2. Evaluation for $n = 4$
Here, the graph has $n = 4$ vertices (labeled A, B, C, D):
$$T(K_4) = 4^{4 - 2} = 4^2 = 16$$

#### 3. Prüfer Sequence Verification
Each labeled tree on $n$ vertices uniquely corresponds to a Prüfer sequence of length $n - 2$ over the alphabet of $n$ vertex labels. For $n = 4$, the length of the Prüfer sequence is $4 - 2 = 2$.
The number of such sequences is $4^2 = 16$, which confirms the result.

**Official Verified Answer:** **16**`
  },

  "GATE_2022_CS_Q30_8163": {
    question: `Consider a simple undirected graph of 10 vertices. If the graph is disconnected, then the maximum number of edges it can have is ________. (Answer in integer)`,
    subject: "Discrete Mathematics",
    topic: "Graph Theory",
    answer: "36 to 36",
    type: "NAT",
    explanation: `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Discrete Mathematics\` ➔ **Topic:** \`Graph Theory\`

#### 1. Maximum Edges in Disconnected Graphs
For an undirected graph with $n$ vertices to be disconnected, it must contain at least 2 connected components.
To maximize the number of edges, one component must be as large as possible (a complete graph on $n - 1$ vertices, $K_{n-1}$), and the remaining component consists of a single isolated vertex ($K_1$).

#### 2. Calculation
Here $n = 10$:
- Component 1 has $10 - 1 = 9$ vertices, forming complete graph $K_9$.
- Component 2 has 1 isolated vertex with 0 edges.

The number of edges in $K_9$ is:
$$E_{\\max} = \\binom{n - 1}{2} = \\binom{9}{2} = \\frac{9 \\times 8}{2} = 36$$

Adding any further edge would connect the isolated vertex, rendering the graph connected. Hence, the maximum number of edges is **36**.

**Official Verified Answer:** **36**`
  },

  "GATE_2018_CS_Q20_7708": {
    question: `The postorder traversal of a binary tree is 8, 9, 6, 7, 4, 5, 2, 3, 1. The inorder traversal of the same tree is 8, 6, 9, 4, 7, 2, 5, 1, 3. The height of a tree is the length of the longest path from the root to any leaf (number of edges). The height of the binary tree is ________. (Answer in integer)`,
    subject: "Programming & Data Structures",
    topic: "Binary Trees & Traversals",
    answer: "4 to 4",
    type: "NAT",
    explanation: `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Programming & Data Structures\` ➔ **Topic:** \`Binary Trees & Traversals\`

#### 1. Reconstructing the Tree from Traversals
- In Postorder, the root is the last element visited: **Root = 1**.
- In Inorder, elements to the left of 1 belong to the left subtree, and elements to the right belong to the right subtree:
  - **Left Subtree Inorder:** \`8, 6, 9, 4, 7, 2, 5\`
  - **Right Subtree Inorder:** \`3\`
- The right child of 1 is simply \`3\` (height 1).
- For the left subtree with elements \`{8, 6, 9, 4, 7, 2, 5}\`:
  - From postorder, the root of this subtree is **\`3\`'s predecessor $\\implies 2$**.
  - Inorder splits at 2: Left = \`8, 6, 9, 4, 7\`, Right = \`5\`.
  - Continuing recursively, the path to the deepest leaf \`8\` is:
    $$1 \\to 2 \\to 4 \\to 6 \\to 8$$

#### 2. Height Computation
The path $1 \\to 2 \\to 4 \\to 6 \\to 8$ contains 5 nodes and **4 edges**.
Thus, the height of the tree is **4**.

**Official Verified Answer:** **4**`
  },

  "GATE_2014_CS1_Q5_3593": {
    question: `The value of the dot product of the eigenvectors corresponding to any pair of different eigenvalues of a $4 \\times 4$ symmetric positive definite matrix is:`,
    options: [
      { label: "A", text: "positive" },
      { label: "B", text: "negative" },
      { label: "C", text: "1" },
      { label: "D", text: "0" }
    ],
    subject: "Engineering Mathematics",
    topic: "Linear Algebra",
    answer: "D",
    explanation: `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Engineering Mathematics\` ➔ **Topic:** \`Linear Algebra\`

#### 1. Orthogonality of Eigenvectors of Symmetric Matrices
A fundamental theorem of linear algebra states that for any real symmetric matrix $A$ (where $A = A^T$):
Eigenvectors corresponding to distinct (different) eigenvalues are always **mutually orthogonal**.

#### 2. Proof
Let $v_1, v_2$ be eigenvectors corresponding to distinct eigenvalues $\\lambda_1 \\neq \\lambda_2$:
$$A v_1 = \\lambda_1 v_1, \\quad A v_2 = \\lambda_2 v_2$$
Consider $v_1^T A v_2$:
$$v_1^T (A v_2) = \\lambda_2 (v_1^T v_2)$$
Also, using symmetry $A = A^T$:
$$(v_1^T A) v_2 = (A^T v_1)^T v_2 = (A v_1)^T v_2 = (\\lambda_1 v_1)^T v_2 = \\lambda_1 (v_1^T v_2)$$
Subtracting the two equations:
$$(\\lambda_1 - \\lambda_2)(v_1^T v_2) = 0$$
Since $\\lambda_1 \\neq \\lambda_2$, we must have:
$$v_1^T v_2 = v_1 \\cdot v_2 = 0$$

Therefore, the dot product is always **0**.

**Official Verified Answer:** **Option (D)**`
  },

  "GATE_2013_CS_Q9_0718": {
    question: `What is the maximum number of reduce moves that can be taken by a bottom-up parser for a grammar with no epsilon-productions to parse a string with $n$ tokens?`,
    options: [
      { label: "A", text: "n/2" },
      { label: "B", text: "n - 1" },
      { label: "C", text: "2n - 1" },
      { label: "D", text: "2^n" }
    ],
    subject: "Compiler Design",
    topic: "Bottom-Up Parsing & Shift-Reduce",
    answer: "B",
    explanation: `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Compiler Design\` ➔ **Topic:** \`Bottom-Up Parsing\`

#### 1. Derivation and Reductions in Shift-Reduce Parsing
In a bottom-up shift-reduce parser:
- Shift moves push tokens onto the stack (exactly $n$ shifts for a string of $n$ tokens).
- Reduce moves replace a right-hand side handle with a non-terminal.

When a grammar contains no $\\epsilon$-productions and no single unit productions ($A \\to B$) that can loop infinitely, each reduction combines at least two symbols into one. 
For a binary parse tree with $n$ leaf tokens, the number of internal reduction nodes is at most $n - 1$.
Therefore, the maximum number of reductions is bounded by **$n - 1$**.

**Official Verified Answer:** **Option (B)**`
  }
};

let count = 0;
data.forEach(q => {
  if (updates[q.id]) {
    Object.assign(q, updates[q.id]);
    count++;
  }
});

console.log(`Updated ${count} questions with authentic technical content.`);
fs.writeFileSync(masterPath, JSON.stringify(data, null, 2), "utf8");

// Re-generate topics.json to reflect the updated subjects and counts
const topicsObj = {};
data.forEach(q => {
  const subj = q.subject || "General Aptitude";
  const top = q.topic || "Core Concepts";
  if (!topicsObj[subj]) {
    topicsObj[subj] = {
      total: 0,
      subtopics: {}
    };
  }
  topicsObj[subj].total++;
  topicsObj[subj].subtopics[top] = (topicsObj[subj].subtopics[top] || 0) + 1;
});
fs.writeFileSync(path.join(__dirname, "../data/topics.json"), JSON.stringify(topicsObj, null, 2), "utf8");
console.log("topics.json updated.");
