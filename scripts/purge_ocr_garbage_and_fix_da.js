const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'gate_master_questions.json');
const topicsPath = path.join(__dirname, '..', 'data', 'topics.json');
const questions = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log(`Starting master dataset audit on ${questions.length} questions...`);

// 1. Reconstruct GATE_2004_CS_Q26_2592 (Symmetric Matrices)
const q26 = questions.find(q => q.id === 'GATE_2004_CS_Q26_2592');
if (q26) {
  q26.subject = 'Engineering Mathematics';
  q26.topic = 'Linear Algebra & Combinatorics';
  q26.question = 'The number of different $n \\times n$ symmetric matrices with each element being either $0$ or $1$ is: (Note: $\\text{power}(2, x)$ is denoted as $2^x$)';
  q26.options = [
    { label: 'A', text: '2^n' },
    { label: 'B', text: '2^(n^2)' },
    { label: 'C', text: '2^((n^2 + n) / 2)' },
    { label: 'D', text: '2^((n^2 - n) / 2)' }
  ];
  q26.answer = 'C';
  q26.core_concept = 'An n x n symmetric matrix satisfies M = M^T. The elements on the main diagonal (n) and the elements strictly above the diagonal (n(n-1)/2) can be independently chosen. Elements below the diagonal are completely determined by symmetry.';
  q26.example = 'For a 2x2 matrix: independent elements are M11, M22, and M12 (total 3 = (4+2)/2). With 2 choices each, total symmetric matrices = 2^3 = 8.';
  q26.pitfall = 'Do not count all n^2 entries independently, because symmetry enforces M[j][i] = M[i][j].';
  q26.explanation = `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Engineering Mathematics\` ➔ **Topic:** \`Linear Algebra & Combinatorics\`

#### 1. Core Principle & Theory
A matrix $M \\in \\mathbb{R}^{n \\times n}$ is **symmetric** if and only if $M = M^T$, meaning:
$$M_{ij} = M_{ji} \\quad \\forall \\; 1 \\le i, j \\le n$$

#### 2. Step-by-Step Derivation
1. **Total Entries in $n \\times n$ Matrix:** $n^2$ total entries.
2. **Diagonal Entries:** There are $n$ entries along the main diagonal ($M_{11}, M_{22}, \\dots, M_{nn}$).
3. **Off-Diagonal Entries:** There are $n^2 - n$ off-diagonal entries, split symmetrically:
   - Strictly above the diagonal: $\\frac{n(n - 1)}{2}$ entries
   - Strictly below the diagonal: $\\frac{n(n - 1)}{2}$ entries
4. **Independent Choices:**
   Due to the symmetry constraint $M_{ji} = M_{ij}$, choosing any entry for $M_{ij}$ ($i < j$) automatically fixes $M_{ji}$. Only the diagonal and strictly upper-triangular entries are independent:
   $$\\text{Independent Entries} = n + \\frac{n(n - 1)}{2} = \\frac{2n + n^2 - n}{2} = \\frac{n(n + 1)}{2} = \\frac{n^2 + n}{2}$$
5. **Counting Configurations:**
   Each independent position can be filled with either $0$ or $1$ ($2$ possible choices):
   $$\\text{Total Symmetric Matrices} = 2^{\\frac{n^2 + n}{2}}$$

This corresponds to **Option (C)**: \`2^((n^2 + n) / 2)\`.

**Official Verified Answer:** **C** (\`2^((n^2 + n) / 2)\`)`;
  console.log('Reconstructed GATE_2004_CS_Q26_2592 successfully!');
}

// 2. Identify unreadable legacy OCR garbage (< 2012)
function isUnreadableOCR(q) {
  if (q.id === 'GATE_2004_CS_Q26_2592') return false; // keep our reconstructed question!
  if (q.year >= 2012) return false; // All 2012-2025 papers are pristine digital PDFs

  const t = q.question || '';
  const optStr = (q.options || []).map(o => o.text).join(' ');
  const full = t + ' ' + optStr;

  // Question has more than 5 options with mashed question numbers
  if (q.options && q.options.length > 5) return true;

  // Unreadable OCR gibberish markers
  const gibberishWords = [
    'TI1o', 'dlff', 'matri~es', 'svmmetrio', 'powcr', 'clement beong',
    'Oonbn~', 'Reprt$Cn.l', 'pQinL', 'wluclt', 'sroup', 'tbe- followmg',
    'stntk-', 'rut- assocmtivc', 'goto- statemcnt', 'tjmc', 'flc:lchcr',
    'f~tutlan', 'likt;ll', 'unilll', 't6nnils', 'pipol in', 'doc~ cyc',
    'wluclt', 'rel.atloo', 'prnces,~a~', 'a ot m"kes', 'Reamslmd',
    'onglnnl', 'Xollli', 'rutassocmtivc'
  ];
  for (const word of gibberishWords) {
    if (full.toLowerCase().includes(word.toLowerCase())) return true;
  }

  // Double tildes or mashed question numbers in options
  if (/~{2,}/.test(full)) return true;
  if (/\b\d{2}\s+(What is|Consider|The value|Let A|Which one)\b/.test(optStr)) return true;

  // Short broken fragments
  if (t.length < 30 && (!q.options || q.options.length === 0)) return true;

  return false;
}

// 3. Reclassify all DA Questions cleanly according to official syllabus
function reclassifyDA(q) {
  if (!q.paper || !q.paper.includes('DA')) return;

  const t = q.question.toLowerCase();

  // General Aptitude
  if (q.q_no <= 10) {
    q.subject = 'General Aptitude';
    q.topic = 'Verbal & Quantitative Aptitude';
    return;
  }

  // Machine Learning
  if (/k-means|clustering|classifier|naive bayes|regression|pca|svm|support vector|neural network|loss function|decision tree|logistic|perceptron|gradient descent|roc|precision|recall|f1-score|relu|activation function|dissimilarity|linkage|class labels|binary classifier|two-class|training data/.test(t)) {
    q.subject = 'Data Science & AI';
    q.topic = 'Machine Learning & Pattern Recognition';
    return;
  }

  // Artificial Intelligence
  if (/adversarial|alpha.beta|pruning|heuristic|a\*|state graph|game tree|proposition|tautology|predicate|first-order|resolution|unification|state space|successor function/.test(t)) {
    q.subject = 'Data Science & AI';
    q.topic = 'Artificial Intelligence & Heuristic Search';
    return;
  }

  // Data Warehousing & OLAP
  if (/olap|cube|fact table|data warehouse|star schema|snowflake|dimension attribute/.test(t)) {
    q.subject = 'Data Science & AI';
    q.topic = 'Data Warehousing & Multidimensional OLAP';
    return;
  }

  // Feature Engineering & Data Mining
  if (/standard deviation|z-score|min-max|normalization|attribute income|dissimilarity|sample average/.test(t)) {
    q.subject = 'Data Science & AI';
    q.topic = 'Data Mining & Feature Engineering';
    return;
  }

  // Probability & Statistics for Data Science
  if (/random variable|probability|bayes|distribution|variance|expectation|poisson|binomial|exponential|hypothesis|p-value|fair dice|fair coin|bernoulli|conditional probability/.test(t)) {
    q.subject = 'Data Science & AI';
    q.topic = 'Probability Distributions & Bayes Reasoning';
    return;
  }

  // Python & Data Structures
  if (/python|def |dict\(|child_dict|fun\(d|hash table|queue|binary tree|inorder|preorder|postorder|hashing|stack|double-ended/.test(t)) {
    q.subject = 'Programming & Data Structures';
    q.topic = 'Python Programming & Data Structures';
    return;
  }

  // Databases & SQL
  if (/sql|relation|foreign key|primary key|dependency|decomposition|join|normalization|b\+ tree|table|schema/.test(t)) {
    q.subject = 'Databases';
    q.topic = 'Relational Databases & SQL';
    return;
  }

  // Searching, Sorting & Graph Algorithms
  if (/sort|quicksort|insertion sort|bubble sort|binary search|dfs|depth-first|dag|topological|graph|unweighted|shortest path/.test(t)) {
    q.subject = 'Algorithms';
    q.topic = 'Searching, Sorting & Graph Algorithms';
    return;
  }

  // Linear Algebra & Calculus
  if (/limit|derivative|integral|differentiable|matrix|rank|nullity|subspace|eigen|row of a|f\(1\) −f\(0\)|critical point/.test(t)) {
    q.subject = 'Engineering Mathematics';
    q.topic = 'Linear Algebra & Calculus';
    return;
  }

  // Fallback for DA: assign to Data Science & AI
  q.subject = 'Data Science & AI';
  q.topic = 'Applied Data Science Concepts';
}

// Process questions
const cleanQuestions = [];
let purgedCount = 0;

for (let i = 0; i < questions.length; i++) {
  const q = questions[i];
  if (isUnreadableOCR(q)) {
    purgedCount++;
    continue;
  }
  reclassifyDA(q);
  cleanQuestions.push(q);
}

console.log(`Purged ${purgedCount} unreadable OCR junk questions.`);
console.log(`Pristine questions remaining: ${cleanQuestions.length}`);

// Write cleaned database
fs.writeFileSync(dbPath, JSON.stringify(cleanQuestions, null, 2), 'utf8');

// Regenerate topics.json
const topicsMap = {};
for (const q of cleanQuestions) {
  const subj = q.subject || 'General Aptitude';
  const top = q.topic || 'General';
  if (!topicsMap[subj]) topicsMap[subj] = {};
  topicsMap[subj][top] = (topicsMap[subj][top] || 0) + 1;
}

fs.writeFileSync(topicsPath, JSON.stringify(topicsMap, null, 2), 'utf8');
console.log('Successfully regenerated topics.json with authentic syllabus counts!');

// Print subject summary
const subjCounts = {};
for (const q of cleanQuestions) {
  subjCounts[q.subject] = (subjCounts[q.subject] || 0) + 1;
}
console.log('\nFinal Subject Breakdown across platform:');
console.log(subjCounts);
