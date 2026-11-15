const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'gate_master_questions.json');
const questions = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('Formatting SQL and Python questions and relational tables...');

const fixes = {
  // GATE 2025 DA Q33: Bank Loan SQL Query
  'GATE_2025_DA_Q33_6738': {
    subject: 'Databases',
    topic: 'Relational Databases & SQL',
    question: `On a relation named **Loan** of a bank:

| loan_number | branch_name | amount |
| :--- | :--- | :--- |
| L11 | Banjara Hills | 90000 |
| L14 | Kondapur | 50000 |
| L15 | SR Nagar | 40000 |
| L22 | SR Nagar | 25000 |
| L23 | Balanagar | 80000 |
| L25 | Kondapur | 70000 |
| L19 | SR Nagar | 65000 |

The following SQL query is executed:

\`\`\`sql
SELECT L1.loan_number 
FROM Loan L1 
WHERE L1.amount > (
    SELECT MAX(L2.amount) 
    FROM Loan L2 
    WHERE L2.branch_name = 'SR Nagar'
);
\`\`\`

The number of rows returned by the query is _______ . (Answer in integer)`,
    answer: '3 to 3',
    core_concept: 'A correlated/uncorrelated subquery in SQL computes a scalar value used by the outer WHERE clause. Here, the subquery calculates the maximum loan amount in branch \'SR Nagar\', and the outer query filters all loans with amounts strictly greater than that maximum.',
    example: 'For branch SR Nagar, loan amounts are 40000, 25000, 65000. MAX is 65000. Outer query finds all loans across ALL branches with amount > 65000: L11 (90000), L23 (80000), L25 (70000). Exactly 3 loans satisfy the condition.',
    pitfall: 'Notice the inequality is strictly greater than (>), not greater than or equal (>=). Therefore L19 (65000) in SR Nagar is NOT selected because 65000 is not strictly greater than 65000.',
    explanation: `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Databases\` ➔ **Topic:** \`Relational Databases & SQL\`

#### 1. Core Principle & Theory
In SQL, a subquery enclosed within parentheses executes to yield a scalar result for comparison with the outer query:
1. **Subquery Execution:** Finds the maximum \`amount\` among all rows where \`branch_name = 'SR Nagar'\`.
2. **Outer Query Filtering:** Compares every tuple in the relation \`Loan\` against the scalar threshold.

#### 2. Step-by-Step Derivation
1. **Evaluate the Inner Subquery:**
   \`\`\`sql
   SELECT MAX(L2.amount) FROM Loan L2 WHERE L2.branch_name = 'SR Nagar'
   \`\`\`
   Filter rows with \`branch_name = 'SR Nagar'\`:
   - L15: amount = 40,000
   - L22: amount = 25,000
   - L19: amount = 65,000
   $$\\text{MAX}(\\{40000, 25000, 65000\\}) = 65000$$

2. **Evaluate the Outer Query:**
   \`\`\`sql
   SELECT L1.loan_number FROM Loan L1 WHERE L1.amount > 65000
   \`\`\`
   Check all 7 tuples in \`Loan\`:
   - **L11:** amount = 90000 > 65000 $\\rightarrow$ **Selected** ✅
   - **L14:** amount = 50000 $\\le$ 65000 $\\rightarrow$ Rejected ❌
   - **L15:** amount = 40000 $\\le$ 65000 $\\rightarrow$ Rejected ❌
   - **L22:** amount = 25000 $\\le$ 65000 $\\rightarrow$ Rejected ❌
   - **L23:** amount = 80000 > 65000 $\\rightarrow$ **Selected** ✅
   - **L25:** amount = 70000 > 65000 $\\rightarrow$ **Selected** ✅
   - **L19:** amount = 65000 $\\ngtr$ 65000 $\\rightarrow$ Rejected (strict inequality) ❌

3. **Total Rows Returned:**
   The output rows are \`L11\`, \`L23\`, and \`L25\`, totaling **3** rows.

#### 4. GATE Exam Pitfall Alert
Watch the strict inequality \`>\` versus \`>=\`. \`L19\` has amount 65000, which equals the maximum; since $65000 > 65000$ evaluates to FALSE, \`L19\` is excluded.

**Official Verified Answer:** **3** (Range: 3 to 3)`
  },

  // GATE 2024 DA Q31: Kabaddi Raider & Team SQL Query
  'GATE_2024_DA_Q31_1861': {
    subject: 'Databases',
    topic: 'Relational Databases & SQL',
    question: `Consider the following two tables named **Raider** and **Team** in a relational database maintained by a Kabaddi league. The attribute \`ID\` in table **Team** references the primary key of the **Raider** table, \`ID\`.

**Table: Raider**
| ID | Name | Raids | RaidPoints |
| :--- | :--- | :--- | :--- |
| 1 | Arjun | 200 | 250 |
| 2 | Ankush | 190 | 219 |
| 3 | Sunil | 150 | 200 |
| 4 | Reza | 150 | 190 |
| 5 | Pratham | 175 | 220 |
| 6 | Gopal | 193 | 215 |

**Table: Team**
| City | ID | BidPoints |
| :--- | :--- | :--- |
| Jaipur | 2 | 200 |
| Patna | 3 | 195 |
| Hyderabad | 5 | 175 |
| Jaipur | 1 | 250 |
| Patna | 4 | 200 |
| Jaipur | 6 | 200 |

The SQL query described below is executed on this database:

\`\`\`sql
SELECT * 
FROM Raider, Team 
WHERE Raider.ID = Team.ID 
  AND City = 'Jaipur' 
  AND RaidPoints > 200;
\`\`\`

The number of rows returned by this query is _______ . (Answer in integer)`,
    answer: '3 to 3',
    core_concept: 'An equi-join query filters records matching join predicate Raider.ID = Team.ID and applies additional boolean filters on City and RaidPoints.',
    example: 'Filter Team for City = Jaipur: IDs 2, 1, 6. Match IDs in Raider: ID 2 has RaidPoints 219 (>200), ID 1 has RaidPoints 250 (>200), ID 6 has RaidPoints 215 (>200). All 3 satisfy RaidPoints > 200.',
    pitfall: 'Do not confuse BidPoints with RaidPoints. The condition filters RaidPoints from the Raider table, not BidPoints from the Team table.',
    explanation: `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Databases\` ➔ **Topic:** \`Relational Databases & SQL\`

#### 1. Core Principle & Theory
The query performs an inner join (via comma syntax with WHERE equality) combined with selection predicates:
$$\\sigma_{\\text{City}=\\text{'Jaipur'} \\wedge \\text{RaidPoints} > 200} (\\text{Raider} \\bowtie_{\\text{Raider.ID} = \\text{Team.ID}} \\text{Team})$$

#### 2. Step-by-Step Derivation
1. **Filter \`Team\` table where \`City = 'Jaipur'\`:**
   - (Jaipur, ID = 2, BidPoints = 200)
   - (Jaipur, ID = 1, BidPoints = 250)
   - (Jaipur, ID = 6, BidPoints = 200)

2. **Join with \`Raider\` table on \`Raider.ID = Team.ID\`:**
   - **ID = 2 (Ankush):** \`RaidPoints = 219\`. Condition $219 > 200$ is **TRUE** ✅
   - **ID = 1 (Arjun):** \`RaidPoints = 250\`. Condition $250 > 200$ is **TRUE** ✅
   - **ID = 6 (Gopal):** \`RaidPoints = 215\`. Condition $215 > 200$ is **TRUE** ✅

3. **Total Rows:**
   All 3 joined tuples satisfy \`RaidPoints > 200\`. The total count is **3**.

**Official Verified Answer:** **3** (Range: 3 to 3)`
  },

  // GATE 2023 CS Q60: Student Table SQL Query
  'GATE_2023_CS_Q60_3772': {
    subject: 'Databases',
    topic: 'Relational Databases & SQL',
    question: `Consider the following table named **Student** in a relational database. The primary key of this table is \`rollNum\`.

| rollNum | name | gender | marks |
| :--- | :--- | :--- | :--- |
| 1 | Naman | M | 62 |
| 2 | Aliya | F | 70 |
| 3 | Aliya | F | 80 |
| 4 | James | M | 82 |
| 5 | Swati | F | 65 |

The SQL query below is executed on this database:

\`\`\`sql
SELECT * 
FROM Student 
WHERE gender = 'F' 
  AND marks > 65;
\`\`\`

The number of rows returned by the query is _______ . (Answer in integer)`,
    answer: '2 to 2',
    core_concept: 'The WHERE clause performs a tuple-by-tuple conjunctive boolean test (AND). Both predicates must evaluate to TRUE for a row to be included in the result.',
    example: 'Rows with gender = \'F\': Roll 2 (70), Roll 3 (80), Roll 5 (65). Filter marks > 65: Roll 2 (70 > 65) is true, Roll 3 (80 > 65) is true. Roll 5 (65 > 65) is false because the inequality is strict.',
    pitfall: 'Do not count Swati (Roll 5, marks = 65) because the condition is marks > 65, which excludes exact equality.',
    explanation: `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Databases\` ➔ **Topic:** \`Relational Databases & SQL\`

#### 1. Core Principle & Theory
The SQL \`WHERE gender = 'F' AND marks > 65\` filters records meeting both criteria simultaneously.

#### 2. Step-by-Step Derivation
Evaluate each record in the \`Student\` table:
1. **Roll 1 (Naman):** \`gender = 'M'\` $\\rightarrow$ False ❌
2. **Roll 2 (Aliya):** \`gender = 'F'\` and \`marks = 70 > 65\` $\\rightarrow$ **True** ✅
3. **Roll 3 (Aliya):** \`gender = 'F'\` and \`marks = 80 > 65\` $\\rightarrow$ **True** ✅
4. **Roll 4 (James):** \`gender = 'M'\` $\\rightarrow$ False ❌
5. **Roll 5 (Swati):** \`gender = 'F'\` but \`marks = 65 > 65\` is False ($65 \\ngtr 65$) ❌

#### Conclusion
Exactly **2** tuples (Roll 2 and Roll 3) satisfy the query.

**Official Verified Answer:** **2** (Range: 2 to 2)`
  },

  // GATE 2019 CS Q51: Student & Performance SQL Query
  'GATE_2019_CS_Q51_7141': {
    subject: 'Databases',
    topic: 'Relational Databases & SQL',
    question: `A relational database contains two tables **Student** and **Performance** as shown below:

**Table: Student**
| Roll_no | Student_name |
| :--- | :--- |
| 1 | Amit |
| 2 | Priya |
| 3 | Vinit |
| 4 | Rohan |
| 5 | Smita |

**Table: Performance**
| Roll_no | Subject_code | Marks |
| :--- | :--- | :--- |
| 1 | A | 86 |
| 1 | B | 95 |
| 1 | C | 90 |
| 2 | A | 89 |
| 2 | C | 92 |
| 3 | C | 80 |

The primary key of the **Student** table is \`Roll_no\`. For the **Performance** table, the columns \`Roll_no\` and \`Subject_code\` together form the primary key.

Consider the SQL query given below:

\`\`\`sql
SELECT S.Student_name, sum(P.Marks) 
FROM Student S, Performance P 
WHERE P.Marks > 84 
GROUP BY S.Student_name;
\`\`\`

The number of rows returned by the above SQL query is _______ . (Answer in integer)`,
    answer: '5 to 5',
    core_concept: 'Notice that there is NO join condition (S.Roll_no = P.Roll_no) in the WHERE clause. The query performs a cross product between Student and the filtered Performance table, then groups by S.Student_name.',
    example: 'Performance has 5 rows where Marks > 84. Since there is no join predicate, each of the 5 students in Student cross-joins with these 5 rows. GROUP BY S.Student_name groups by the 5 distinct student names, outputting exactly 5 rows.',
    pitfall: 'Do not assume a natural join or equi-join on Roll_no. Because there is no S.Roll_no = P.Roll_no in the WHERE clause, all 5 distinct student names produce groups.',
    explanation: `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Databases\` ➔ **Topic:** \`Relational Databases & SQL\`

#### 1. Core Principle & Theory
In SQL, omitting a join predicate in \`FROM Student S, Performance P\` computes the Cartesian cross-product ($S \\times P$). \`WHERE P.Marks > 84\` filters rows from $P$, and \`GROUP BY S.Student_name\` partitions the resulting Cartesian tuples by each distinct \`Student_name\`.

#### 2. Step-by-Step Derivation
1. **Filter \`Performance\` on \`Marks > 84\`:**
   - (1, A, 86)
   - (1, B, 95)
   - (1, C, 90)
   - (2, A, 89)
   - (2, C, 92)
   There are **5 tuples** with \`Marks > 84\`.

2. **Cross-Product with \`Student\`:**
   - The \`Student\` table has 5 distinct names: \`Amit\`, \`Priya\`, \`Vinit\`, \`Rohan\`, \`Smita\`.
   - Without an equality condition (\`S.Roll_no = P.Roll_no\`), every student pairs with all 5 tuples.

3. **Group By Evaluation:**
   - \`GROUP BY S.Student_name\` aggregates over each distinct name.
   - All 5 distinct students form non-empty groups, producing one summary row per student.

4. **Resulting Rows:**
   Exactly **5** rows are returned.

#### 4. GATE Exam Pitfall Alert
This is one of GATE's most famous SQL trap questions! Candidates intuitively assume a join on \`Roll_no\`, which would only produce 2 rows (Amit and Priya). However, because the join condition was omitted, all 5 students are included.

**Official Verified Answer:** **5** (Range: 5 to 5)`
  },

  // GATE 2025 DA Q63: Python Binary Recursion
  'GATE_2025_DA_Q63_0126': {
    subject: 'Programming & Data Structures',
    topic: 'Python Programming & Recursion',
    question: `Consider the following Python code snippet:

\`\`\`python
def f(a, b):
    if (a == 0):
        return b
    if (a % 2 == 1):
        return 2 * f((a - 1) / 2, b)
    return b + f(a - 1, b)

print(f(15, 10))
\`\`\`

The value printed by the code snippet is _______ . (Answer in integer)`,
    answer: '160 to 160',
    core_concept: 'Trace recursive calls systematically. For odd a, f(a, b) = 2 * f((a - 1)/2, b). For a = 0, base case returns b.',
    example: 'f(15, 10) = 2 * f(7, 10) = 4 * f(3, 10) = 8 * f(1, 10) = 16 * f(0, 10) = 16 * 10 = 160.',
    pitfall: 'Notice that 15, 7, 3, 1 are all odd, so the branch (a % 2 == 1) is taken at every recursive level until reaching the base case a == 0.',
    explanation: `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Programming & Data Structures\` ➔ **Topic:** \`Python Programming & Recursion\`

#### 1. Core Principle & Theory
A recursive function evaluates branches based on the parity of parameter \`a\`:
- When $a = 0$: returns $b$.
- When $a$ is odd ($a \\% 2 == 1$): returns $2 \\cdot f((a - 1)/2, b)$.
- When $a$ is even: returns $b + f(a - 1, b)$.

#### 2. Step-by-Step Derivation
1. **$f(15, 10)$:** $15$ is odd $\\rightarrow 2 \\cdot f((15-1)/2, 10) = 2 \\cdot f(7, 10)$
2. **$f(7, 10)$:** $7$ is odd $\\rightarrow 2 \\cdot f((7-1)/2, 10) = 2 \\cdot f(3, 10)$
3. **$f(3, 10)$:** $3$ is odd $\\rightarrow 2 \\cdot f((3-1)/2, 10) = 2 \\cdot f(1, 10)$
4. **$f(1, 10)$:** $1$ is odd $\\rightarrow 2 \\cdot f((1-1)/2, 10) = 2 \\cdot f(0, 10)$
5. **$f(0, 10)$:** $a = 0 \\rightarrow$ Base case returns $b = 10$.

Now unwind the recursive stack:
$$f(0, 10) = 10$$
$$f(1, 10) = 2 \\times 10 = 20$$
$$f(3, 10) = 2 \\times 20 = 40$$
$$f(7, 10) = 2 \\times 40 = 80$$
$$f(15, 10) = 2 \\times 80 = 160$$

**Official Verified Answer:** **160** (Range: 160 to 160)`
  },

  // GATE 2024 DA Q38: Python Tree Recursion
  'GATE_2024_DA_Q38_0103': {
    subject: 'Programming & Data Structures',
    topic: 'Python Programming & Trees',
    question: `Consider the following Python code:

\`\`\`python
def count(child_dict, i):
    if i not in child_dict.keys():
        return 1
    ans = 1
    for j in child_dict[i]:
        ans += count(child_dict, j)
    return ans

child_dict = dict()
child_dict[0] = [1, 2]
child_dict[1] = [3, 4, 5]
child_dict[2] = [6, 7, 8]

print(count(child_dict, 0))
\`\`\`

Which ONE of the following is the output of this code?`,
    options: [
      { label: 'A', text: '7' },
      { label: 'B', text: '8' },
      { label: 'C', text: '10' },
      { label: 'D', text: '9' }
    ],
    answer: 'D',
    core_concept: 'The function traverses an adjacency tree representation and computes the total number of nodes in the subtree rooted at i (including i itself).',
    example: 'Leaves 3, 4, 5, 6, 7, 8 return 1 each. Subtree 1 has size 1 + 1 + 1 + 1 = 4. Subtree 2 has size 1 + 1 + 1 + 1 = 4. Root 0 has size 1 + 4 + 4 = 9.',
    pitfall: 'Do not forget to count the root node itself (ans initialized to 1).',
    explanation: `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Programming & Data Structures\` ➔ **Topic:** \`Python Programming & Trees\`

#### 1. Core Principle & Theory
The recursive function \`count(child_dict, i)\` calculates the total number of nodes in the subtree rooted at $i$:
- If $i$ has no children (is a leaf): returns $1$.
- Otherwise: returns $1 + \\sum_{j \\in \\text{children}(i)} \\text{count}(child\\_dict, j)$.

#### 2. Step-by-Step Derivation
1. **Leaves (3, 4, 5, 6, 7, 8):**
   None of these keys exist in \`child_dict\`.
   $$\\text{count}(3) = \\text{count}(4) = \\text{count}(5) = \\text{count}(6) = \\text{count}(7) = \\text{count}(8) = 1$$
2. **Node 1:**
   $$\\text{count}(1) = 1 + \\text{count}(3) + \\text{count}(4) + \\text{count}(5) = 1 + 1 + 1 + 1 = 4$$
3. **Node 2:**
   $$\\text{count}(2) = 1 + \\text{count}(6) + \\text{count}(7) + \\text{count}(8) = 1 + 1 + 1 + 1 = 4$$
4. **Root Node 0:**
   $$\\text{count}(0) = 1 + \\text{count}(1) + \\text{count}(2) = 1 + 4 + 4 = 9$$

The output printed is **9** (Option D).

**Official Verified Answer:** **D** (9)`
  },

  // GATE 2024 DA Q41: Python Subarray Reversal
  'GATE_2024_DA_Q41_9701': {
    subject: 'Programming & Data Structures',
    topic: 'Python Programming & Algorithms',
    question: `Consider the following Python function:

\`\`\`python
def fun(D, s1, s2):
    if s1 < s2:
        D[s1], D[s2] = D[s2], D[s1]
        fun(D, s1 + 1, s2 - 1)
\`\`\`

What does this Python function \`fun()\` do? Select the ONE appropriate option below.`,
    options: [
      { label: 'A', text: 'Sorts the elements of D between indices s1 and s2' },
      { label: 'B', text: 'Rotates the elements of D between indices s1 and s2' },
      { label: 'C', text: 'Reverses the elements of D between indices s1 and s2' },
      { label: 'D', text: 'Finds the median of elements in D between indices s1 and s2' }
    ],
    answer: 'C',
    core_concept: 'The function implements the two-pointer recursive algorithm for in-place array reversal, swapping opposite elements at s1 and s2 and moving inward.',
    example: 'For D = [1, 2, 3, 4] with s1=0, s2=3: swaps D[0] and D[3] -> [4, 2, 3, 1], then recurses with s1=1, s2=2 -> swaps D[1] and D[2] -> [4, 3, 2, 1]. Base case terminates when s1 >= s2.',
    pitfall: 'Do not confuse in-place two-pointer reversal with sorting or cyclic rotation.',
    explanation: `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Programming & Data Structures\` ➔ **Topic:** \`Python Programming & Algorithms\`

#### 1. Core Principle & Theory
The two-pointer technique uses symmetric indices $s_1$ and $s_2$ starting from the ends of an array segment:
1. Swaps $D[s_1]$ with $D[s_2]$.
2. Advances $s_1$ rightward ($s_1 + 1$) and $s_2$ leftward ($s_2 - 1$).
3. Recursively repeats until the pointers meet or cross ($s_1 \\ge s_2$).
This mirrors the elements symmetrically across the center, which reverses the segment.

#### Conclusion
The function reverses the elements of $D$ between indices $s_1$ and $s_2$ (Option C).

**Official Verified Answer:** **C** (Reverses the elements of D between indices s1 and s2)`
  }
};

let applied = 0;
for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  if (fixes[q.id]) {
    Object.assign(q, fixes[q.id]);
    applied++;
  }
}

fs.writeFileSync(dbPath, JSON.stringify(questions, null, 2), 'utf8');
console.log(`Successfully formatted ${applied} key SQL and Python questions with tables, syntax highlighting, and derivations!`);
