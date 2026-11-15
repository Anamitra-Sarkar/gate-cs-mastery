const fs = require("fs");
const path = require("path");

const masterPath = path.join(__dirname, "../data/gate_master_questions.json");
const data = JSON.parse(fs.readFileSync(masterPath, "utf8"));

const fixes = {
  "GATE_2025_DA_Q7_3749": {
    options: [
      { label: "A", text: "$a_1 < a_2 < 50$" },
      { label: "B", text: "$a_1 < 50 < a_2$" },
      { label: "C", text: "$50 < a_1 < a_2$" },
      { label: "D", text: "Either $a_1 = 50$ or $a_2 = 50$" }
    ]
  },
  "GATE_2025_DA_Q12_1868": {
    options: [
      { label: "A", text: "$O(n)$" },
      { label: "B", text: "$O(n^2)$" },
      { label: "C", text: "$O(n^3)$" },
      { label: "D", text: "$O(n^4)$" }
    ]
  },
  "GATE_2025_DA_Q13_3512": {
    question: "The sum of the elements in each row of $A \\in \\mathbb{R}^{n \\times n}$ is 1. If $B = A^3 - 2A^2 + A$, which one of the following statements is correct (for $x \\in \\mathbb{R}^n$)?"
  },
  "GATE_2025_DA_Q14_5353": {
    question: "Let $f(x) = \\frac{e^x - e^{-x}}{2}, x \\in \\mathbb{R}$. Let $f^{(k)}(a)$ denote the $k$-th derivative of $f$ evaluated at $a$. What is the value of $f^{(10)}(0)$? (Note: ! denotes factorial)",
    options: [
      { label: "A", text: "0" },
      { label: "B", text: "1" },
      { label: "C", text: "$\\frac{1}{10!}$" },
      { label: "D", text: "$\\frac{2}{10!}$" }
    ]
  },
  "GATE_2025_DA_Q15_0275": {
    question: "Let $p$ and $q$ be any two propositions. Consider the following propositional statements:\n- $S_1: p \\to q$\n- $S_2: \\neg p \\wedge q$\n- $S_3: \\neg p \\vee q$\n- $S_4: \\neg p \\vee \\neg q$\n\nwhere $\\wedge$ denotes conjunction (AND operation), $\\vee$ denotes disjunction (OR operation), and $\\neg$ denotes negation (NOT operation). Which one of the following options is correct? (Note: $\\equiv$ denotes logical equivalence)",
    options: [
      { label: "A", text: "$S_1 \\equiv S_3$" },
      { label: "B", text: "$S_2 \\equiv S_3$" },
      { label: "C", text: "$S_2 \\equiv S_4$" },
      { label: "D", text: "$S_1 \\equiv S_4$" }
    ]
  },
  "GATE_2025_DA_Q19_2695": {
    question: "Let $X$ be a continuous random variable whose cumulative distribution function (CDF) $F_X(x)$, for some parameter $t$, is given as follows:\n\n$$F_X(x) = \\begin{cases} 0, & x \\le t \\\\[6pt] \\frac{x - t}{4 - t}, & t \\le x \\le 4 \\\\[6pt] 1, & x \\ge 4 \\end{cases}$$\n\nIf the median of $X$ is $3$, then what is the value of $t$?",
    options: [
      { label: "A", text: "2" },
      { label: "B", text: "1" },
      { label: "C", text: "-1" },
      { label: "D", text: "0" }
    ],
    explanation: "### Conceptual Breakdown & Rigorous Solution\n\n**Subject:** `Data Science & AI` ➔ **Topic:** `Probability & Statistics`\n\n#### 1. Core Principle & Definition of Median\nFor any continuous random variable $X$ with cumulative distribution function $F_X(x)$, the median $m$ is defined by the property:\n$$F_X(m) = 0.5 = \\frac{1}{2}$$\n\n#### 2. Step-by-Step Derivation\n1. We are given that the median of $X$ is $m = 3$.\n2. For $t \\le 3 \\le 4$, the CDF evaluates to:\n   $$F_X(3) = \\frac{3 - t}{4 - t}$$\n3. Setting $F_X(3) = 0.5$:\n   $$\\frac{3 - t}{4 - t} = \\frac{1}{2}$$\n4. Cross-multiplying:\n   $$2(3 - t) = 4 - t \\implies 6 - 2t = 4 - t \\implies t = 2$$\n\n#### 3. Verification & Domain Check\nSubstituting $t = 2$:\n$$F_X(x) = \\frac{x - 2}{4 - 2} = \\frac{x - 2}{2} \\quad \\text{for } 2 \\le x \\le 4$$\nAt $x = 3$, $F_X(3) = \\frac{3 - 2}{2} = 0.5$, which precisely matches the definition of median.\n\n**Official Verified Answer:** **Option (A)** (Value of $t = 2$)"
  },
  "GATE_2025_DA_Q22_3173": {
    question: "Consider designing a linear classifier $y = \\operatorname{sign}(f(x; w, b))$, where $f(x; w, b) = w^T x + b$, on a dataset $\\mathcal{D} = \\{(x_1, y_1), (x_2, y_2), \\dots, (x_N, y_N)\\}$, with $x_i \\in \\mathbb{R}^d$ and $y_i \\in \\{+1, -1\\}$ for $i = 1, 2, \\dots, N$.\n\nRecall that the sign function outputs $+1$ if the argument is positive, and $-1$ if the argument is non-positive. The parameters $w$ and $b$ are updated as per the following Perceptron training algorithm:\n$$w_{\\text{new}} = w_{\\text{old}} + y_n x_n$$\n$$b_{\\text{new}} = b_{\\text{old}} + y_n$$\nwhenever $\\operatorname{sign}(f(x_n; w_{\\text{old}}, b_{\\text{old}})) \\neq y_n$. In other words, whenever the classifier wrongly predicts a sample $(x_n, y_n)$ from the dataset, $w_{\\text{old}}$ gets updated to $w_{\\text{new}}$, and likewise $b_{\\text{old}}$ gets updated to $b_{\\text{new}}$.\n\nConsider the misclassified sample $(x_n, +1)$ where $f(x_n; w_{\\text{old}}, b_{\\text{old}}) < 0$. Then:",
    options: [
      { label: "A", text: "$f(x_n; w_{\\text{new}}, b_{\\text{new}}) > f(x_n; w_{\\text{old}}, b_{\\text{old}})$" },
      { label: "B", text: "$f(x_n; w_{\\text{new}}, b_{\\text{new}}) < f(x_n; w_{\\text{old}}, b_{\\text{old}})$" },
      { label: "C", text: "$f(x_n; w_{\\text{new}}, b_{\\text{new}}) = f(x_n; w_{\\text{old}}, b_{\\text{old}})$" },
      { label: "D", text: "$y_n f(x_n; w_{\\text{old}}, b_{\\text{old}}) > 1$" }
    ],
    explanation: "### Conceptual Breakdown & Rigorous Solution\n\n**Subject:** `Data Science & AI` ➔ **Topic:** `Machine Learning & Data Science`\n\n#### 1. Perceptron Update Rule Analysis\nThe classifier model is $f(x; w, b) = w^T x + b$.\nWhen a sample $(x_n, y_n)$ is misclassified, the weights and bias update according to:\n$$w_{\\text{new}} = w_{\\text{old}} + y_n x_n$$\n$$b_{\\text{new}} = b_{\\text{old}} + y_n$$\n\n#### 2. Step-by-Step Algebraic Evaluation\nWe are given $(x_n, y_n) = (x_n, +1)$ and $f(x_n; w_{\\text{old}}, b_{\\text{old}}) < 0$.\nSubstituting $y_n = +1$ into the update equations:\n$$w_{\\text{new}} = w_{\\text{old}} + x_n$$\n$$b_{\\text{new}} = b_{\\text{old}} + 1$$\n\nNow evaluate the classifier score on $x_n$ using the updated parameters:\n$$f(x_n; w_{\\text{new}}, b_{\\text{new}}) = w_{\\text{new}}^T x_n + b_{\\text{new}}$$\n$$= (w_{\\text{old}} + x_n)^T x_n + (b_{\\text{old}} + 1)$$\n$$= w_{\\text{old}}^T x_n + x_n^T x_n + b_{\\text{old}} + 1$$\n$$= (w_{\\text{old}}^T x_n + b_{\\text{old}}) + \\|x_n\\|^2 + 1$$\n$$= f(x_n; w_{\\text{old}}, b_{\\text{old}}) + \\|x_n\\|^2 + 1$$\n\n#### 3. Strict Inequality Deduction\nSince the Euclidean norm squared $\\|x_n\\|^2 \\ge 0$, we have:\n$$\\|x_n\\|^2 + 1 \\ge 1 > 0$$\nTherefore:\n$$f(x_n; w_{\\text{new}}, b_{\\text{new}}) = f(x_n; w_{\\text{old}}, b_{\\text{old}}) + (\\|x_n\\|^2 + 1) > f(x_n; w_{\\text{old}}, b_{\\text{old}})$$\n\nThis strictly proves that the decision score strictly increases towards the correct positive class label $+1$.\n\n**Official Verified Answer:** **Option (A)**"
  },
  "GATE_2025_DA_Q28_7346": {
    question: "Let $A = I_n + x x^T$, where $I_n$ is the $n \\times n$ identity matrix and $x \\in \\mathbb{R}^n$ with $x^T x = 1$. Which of the following options is/are correct?"
  },
  "GATE_2025_DA_Q30_6754": {
    question: "Let $C_1$ and $C_2$ be two sets of objects. Let $D(x, y)$ be a measure of dissimilarity between two objects $x$ and $y$. Consider the following definitions of dissimilarity between $C_1$ and $C_2$:\n$$\\operatorname{DIS-1}(C_1, C_2) = \\max_{x \\in C_1, y \\in C_2} D(x, y)$$\n$$\\operatorname{DIS-2}(C_1, C_2) = \\min_{x \\in C_1, y \\in C_2} D(x, y)$$\n\nWhich of the following statements is/are correct?"
  },
  "GATE_2025_DA_Q32_5845": {
    question: "Evaluate the limit:\n$$\\lim_{t \\to +\\infty} \\left(\\sqrt{t^2 + t} - t\\right) = \\text{___}$$\n(Round off to one decimal place)",
    explanation: "### Rigorous Mathematical Solution\n\nRationalize by multiplying numerator and denominator by $\\sqrt{t^2 + t} + t$:\n$$\\lim_{t \\to +\\infty} \\frac{(\\sqrt{t^2 + t} - t)(\\sqrt{t^2 + t} + t)}{\\sqrt{t^2 + t} + t} = \\lim_{t \\to +\\infty} \\frac{(t^2 + t) - t^2}{\\sqrt{t^2 + t} + t} = \\lim_{t \\to +\\infty} \\frac{t}{t\\sqrt{1 + 1/t} + t} = \\lim_{t \\to +\\infty} \\frac{1}{\\sqrt{1 + 1/t} + 1} = \\frac{1}{1 + 1} = 0.5$$\n\n**Official Verified Answer:** **0.5**"
  },
  "GATE_2025_DA_Q37_9413": {
    question: "Let $A \\in \\mathbb{R}^{n \\times n}$ be such that $A^3 = A$. Which one of the following statements is ALWAYS correct?",
    options: [
      { label: "A", text: "$A$ is invertible" },
      { label: "B", text: "Determinant of $A$ is 0" },
      { label: "C", text: "The sum of the diagonal elements of $A$ is 1" },
      { label: "D", text: "$A$ and $A^2$ have the same rank" }
    ]
  },
  "GATE_2025_DA_Q38_3143": {
    question: "Let $\\{x_1, x_2, \\dots, x_n\\}$ be a set of linearly independent vectors in $\\mathbb{R}^n$. Let the $(i, j)$-th element of matrix $A \\in \\mathbb{R}^{n \\times n}$ be given by $A_{ij} = x_i^T x_j$, for $1 \\le i, j \\le n$. Which one of the following statements is correct?",
    options: [
      { label: "A", text: "$A$ is invertible" },
      { label: "B", text: "0 is a singular value of $A$" },
      { label: "C", text: "Determinant of $A$ is 0" },
      { label: "D", text: "$z^T A z = 0$ for some non-zero $z \\in \\mathbb{R}^n$" }
    ]
  },
  "GATE_2025_DA_Q39_1508": {
    question: "Consider the cumulative distribution function (CDF) of a random variable $X$:\n\n$$F_X(x) = \\begin{cases} 0, & x \\le -1 \\\\[6pt] \\frac{1}{4}(x + 1)^2, & -1 \\le x \\le 1 \\\\[6pt] 1, & x \\ge 1 \\end{cases}$$\n\nThe value of $P(X^2 \\le 0.25)$ is:",
    options: [
      { label: "A", text: "0.625" },
      { label: "B", text: "0.25" },
      { label: "C", text: "0.5" },
      { label: "D", text: "0.5625" }
    ],
    explanation: "### Conceptual Breakdown & Rigorous Solution\n\n**Subject:** `Data Science & AI` ➔ **Topic:** `Probability & Statistics`\n\n#### 1. Core Principle\nFor a random variable $X$ with cumulative distribution function $F_X(x)$:\n$$P(X^2 \\le 0.25) = P(-\\sqrt{0.25} \\le X \\le \\sqrt{0.25}) = P(-0.5 \\le X \\le 0.5) = F_X(0.5) - F_X(-0.5)$$\n\n#### 2. Evaluation\nUsing the CDF formula for $-1 \\le x \\le 1$:\n- $F_X(0.5) = \\frac{1}{4}(0.5 + 1)^2 = \\frac{1}{4}(1.5)^2 = \\frac{2.25}{4} = 0.5625$\n- $F_X(-0.5) = \\frac{1}{4}(-0.5 + 1)^2 = \\frac{1}{4}(0.5)^2 = \\frac{0.25}{4} = 0.0625$\n\n#### 3. Final Probability\n$$P(X^2 \\le 0.25) = 0.5625 - 0.0625 = 0.5$$\n\n**Official Verified Answer:** **Option (C)** (0.5)"
  },
  "GATE_2025_DA_Q40_6286": {
    question: "A random variable $X$ is distributed as $\\operatorname{Bernoulli}(\\theta)$, denoted by $X \\sim \\operatorname{Bernoulli}(\\theta)$, where $P(X = 1) = \\theta, P(X = 0) = 1 - \\theta$ for $0 < \\theta < 1$. Let $Y = \\sum_{i=1}^{300} X_i$, where $X_i \\sim \\operatorname{Bernoulli}(\\theta), i = 1, 2, \\dots, 300$ are independent and identically distributed random variables with $\\theta = 0.25$.\n\nThe value of $P(60 \\le Y \\le 90)$, after approximation through Central Limit Theorem, is given by (where $\\Phi(x) = \\frac{1}{\\sqrt{2\\pi}} \\int_{-\\infty}^x e^{-t^2/2} dt$):",
    options: [
      { label: "A", text: "$\\Phi(2) - \\Phi(-2)$" },
      { label: "B", text: "$\\Phi(1) - \\Phi(-1)$" },
      { label: "C", text: "$\\Phi(3) - \\Phi(-3)$" },
      { label: "D", text: "$\\Phi(90) - \\Phi(60)$" }
    ]
  },
  "GATE_2025_DA_Q41_9400": {
    question: "For $x \\in \\mathbb{R}$, the floor function is denoted by $f(x) = \\lfloor x \\rfloor$ and defined as $\\lfloor x \\rfloor = k$ for $k \\le x < k + 1$, where $k$ is an integer. Let $Y = \\lfloor X \\rfloor$, where $X$ is an exponentially distributed random variable with mean $\\frac{1}{\\ln 10}$, where $\\ln$ denotes the natural logarithm. For any positive integer $\\ell$, the probability of the event $Y = \\ell$ can be written as:\n$$P(Y = \\ell) = q^\\ell (1 - q)$$\nThe value of $q$ is:"
  },
  "GATE_2025_DA_Q49_1361": {
    question: "Consider the function $f(x) = \\frac{x^3}{3} + \\frac{7}{2}x^2 + 10x + \\frac{133}{2}$, for $x \\in [-8, 0]$. Which of the following statements is/are correct?",
    options: [
      { label: "A", text: "The maximum value of $f$ is attained at $x = -5$" },
      { label: "B", text: "The minimum value of $f$ is attained at $x = -2$" },
      { label: "C", text: "The maximum value of $f$ is $\\frac{133}{2}$" },
      { label: "D", text: "The minimum value of the derivative of $f$ is attained at $x = -\\frac{7}{2}$" }
    ]
  },
  "GATE_2025_DA_Q50_5704": {
    question: "Let $x_1, x_2, x_3, x_4, x_5$ be a system of orthonormal vectors in $\\mathbb{R}^{10}$. Consider the matrix $A = x_1 x_1^T + \\dots + x_5 x_5^T$. Which of the following statements is/are correct?"
  },
  "GATE_2025_DA_Q51_8907": {
    question: "Let $f : \\mathbb{R} \\to \\mathbb{R}$ be a twice-differentiable function and suppose its second derivative satisfies $f''(x) > 0$ for all $x \\in \\mathbb{R}$. Which of the following statements is/are ALWAYS correct?",
    options: [
      { label: "A", text: "$f$ has a local minima" },
      { label: "B", text: "There does not exist $x \\neq y$ such that $f'(x) = f'(y) = 0$" },
      { label: "C", text: "$f$ has at most one global minimum" },
      { label: "D", text: "$f$ has at most one local minimum" }
    ]
  },
  "GATE_2025_DA_Q52_2009": {
    question: "An $n \\times n$ matrix $A$ with real entries satisfies the property: $\\|Ax\\|_2 = \\|x\\|_2$, for all $x \\in \\mathbb{R}^n$, where $\\|\\cdot\\|_2$ denotes the Euclidean norm. Which of the following statements is/are ALWAYS correct?"
  },
  "GATE_2025_DA_Q53_0289": {
    question: "Consider designing a linear binary classifier $f(x) = \\operatorname{sign}(w^T x + b)$, where $x \\in \\mathbb{R}^2$, on the following training data:\n- Class-1 ($y = +1$): $\\left\\{ \\begin{pmatrix} 2 \\\\ 0 \\end{pmatrix}, \\begin{pmatrix} 0 \\\\ 2 \\end{pmatrix}, \\begin{pmatrix} 2 \\\\ 2 \\end{pmatrix} \\right\\}$\n- Class-2 ($y = -1$): $\\left\\{ \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix} \\right\\}$\n\nA hard-margin support vector machine (SVM) formulation is solved to obtain $w$ and $b$. Which of the following options is/are correct?",
    options: [
      { label: "A", text: "$w = \\begin{pmatrix} 4 \\\\ 4 \\end{pmatrix}$ and $b = 1$" },
      { label: "B", text: "The number of support vectors is 3" },
      { label: "C", text: "The margin is $\\sqrt{2}$" },
      { label: "D", text: "Training accuracy is 98%" }
    ],
    explanation: "### Conceptual Breakdown & Rigorous Solution\n\n**Subject:** `Data Science & AI` ➔ **Topic:** `Machine Learning & Data Science`\n\n#### 1. SVM Margin & Hyperplane Analysis\n- Class $+1$ points: $(2, 0), (0, 2), (2, 2)$.\n- Class $-1$ points: $(0, 0)$.\n- The separating line passes midway between $(0, 0)$ and the boundary of Class $+1$.\n- The support vectors are:\n  - From Class $+1$: $(2, 0)$ and $(0, 2)$\n  - From Class $-1$: $(0, 0)$\n- Total support vectors = **3** (Option B is correct).\n\n#### 2. Margin Calculation\nThe distance between the parallel hyperplanes bounding Class $+1$ and Class $-1$ along the normal vector $(1, 1)$ is $\\gamma = \\sqrt{2}$.\nHence the margin is $\\sqrt{2}$ (Option C is correct).\n\n**Official Verified Answer:** **B, C**"
  },
  "GATE_2025_DA_Q55_2654": {
    question: "Consider a two-class problem in $\\mathbb{R}^d$ with class labels `red` and `green`. Let $\\mu_{\\text{red}}$ and $\\mu_{\\text{green}}$ be the means of the two classes. Given test sample $x \\in \\mathbb{R}^d$, a classifier calculates the squared Euclidean distance (denoted by $\\|\\cdot\\|^2$) between $x$ and the means of the two classes and assigns the class label that the sample $x$ is closest to. That is, the classifier computes:\n$$f(x) = \\|\\mu_{\\text{red}} - x\\|^2 - \\|\\mu_{\\text{green}} - x\\|^2$$\nand assigns the label `red` to $x$ if $f(x) < 0$, and `green` otherwise. Which of the following statements is/are correct?",
    options: [
      { label: "A", text: "The sample $x = 0$ is assigned the label `green` if $\\|\\mu_{\\text{red}}\\| < \\|\\mu_{\\text{green}}\\|$" },
      { label: "B", text: "$f$ is a linear function of $x$" },
      { label: "C", text: "$f(x) = w^T x + b$, where $w$ and $b$ are functions of $\\mu_{\\text{red}}$ and $\\mu_{\\text{green}}$" },
      { label: "D", text: "$f$ is a quadratic polynomial in $x$" }
    ]
  },
  "GATE_2025_DA_Q59_7396": {
    question: "Let $f : \\mathbb{R} \\to \\mathbb{R}$ be such that $|f(x) - f(y)| \\le (x - y)^2$ for all $x, y \\in \\mathbb{R}$. Then $f(1) - f(0) = \\text{___}$ (Answer in integer)",
    explanation: "### Rigorous Mathematical Proof\nDividing both sides by $|x - y|$ for $x \\neq y$:\n$$\\left|\\frac{f(x) - f(y)}{x - y}\\right| \\le |x - y|$$\nTaking the limit as $y \\to x$:\n$$|f'(x)| \\le 0 \\implies f'(x) = 0 \\quad \\forall x \\in \\mathbb{R}$$\nSince the derivative is zero everywhere on $\\mathbb{R}$, $f(x)$ is a constant function.\nTherefore:\n$$f(1) - f(0) = 0$$\n\n**Official Verified Answer:** **0**"
  },
  "GATE_2025_DA_Q60_5584": {
    question: "Let $\\mathcal{D} = \\{x^{(1)}, \\dots, x^{(n)}\\}$ be a dataset of $n$ observations where each $x^{(i)} \\in \\mathbb{R}^{100}$. It is given that $\\sum_{i=1}^n x^{(i)} = 0$. The covariance matrix computed from $\\mathcal{D}$ has eigenvalues $\\lambda_i = 1002 - i$, for $1 \\le i \\le 100$. Let $u \\in \\mathbb{R}^{100}$ be the direction of maximum variance with $u^T u = 1$. The value of $\\frac{1}{n} \\sum_{i=1}^n (u^T x^{(i)})^2 = \\text{___}$ (Answer in integer)",
    explanation: "### Rigorous Mathematical Solution\nThe sample covariance matrix is $\\Sigma = \\frac{1}{n} \\sum_{i=1}^n x^{(i)} (x^{(i)})^T$ since the sample mean is zero.\nThe variance along unit direction $u$ is given by:\n$$\\frac{1}{n} \\sum_{i=1}^n (u^T x^{(i)})^2 = u^T \\Sigma u$$\nBy Rayleigh-Ritz theorem, the maximum variance is the largest eigenvalue $\\lambda_1$ of $\\Sigma$:\n$$\\max_{u^T u = 1} u^T \\Sigma u = \\lambda_1 = 1002 - 1 = 1001$$\n\n**Official Verified Answer:** **1001**"
  },
  "GATE_2025_DA_Q62_8366": {
    question: "Consider the following tables, `Loan` and `Borrower`, of a bank:\n\n**Loan Table:**\n\n| loan_num | branch_name | amount |\n| :--- | :--- | :--- |\n| L11 | Banjara Hills | 90000 |\n| L14 | Kondapur | 50000 |\n| L15 | SR Nagar | 40000 |\n| L22 | SR Nagar | 25000 |\n| L23 | Balanagar | 80000 |\n| L25 | Kondapur | 70000 |\n| L19 | SR Nagar | 65000 |\n\n**Borrower Table:**\n\n| customer_name | loan_num |\n| :--- | :--- |\n| Anand | L11 |\n| Karteek | L11 |\n| Karteek | L14 |\n| Ankita | L15 |\n| Gopal | L19 |\n| Karteek | L22 |\n| Karteek | L23 |\n| Sunil | L23 |\n| Sunil | L25 |\n\nConsider the following Relational Algebra query:\n$$\\pi_{\\text{branch\\_name}, \\text{customer\\_name}}(\\text{Loan} \\bowtie \\text{Borrower}) \\div \\pi_{\\text{branch\\_name}}(\\text{Loan})$$\nwhere $\\bowtie$ denotes natural join and $\\div$ denotes relational division.\n\nThe number of tuples returned by the above query is (Answer in integer)"
  },
  "GATE_2024_DA_Q20_9341": {
    question: "Given a dataset with $K$ binary-valued attributes (where $K > 2$) for a two-class classification task, the number of parameters to be estimated for learning a naïve Bayes classifier is:",
    options: [
      { label: "A", text: "$2K + 1$" },
      { label: "B", text: "$2K$" },
      { label: "C", text: "$2^{K+1} + 1$" },
      { label: "D", text: "$K^2 + 1$" }
    ]
  },
  "GATE_2024_DA_Q22_8163": {
    question: "For any binary classification dataset, let $S_B \\in \\mathbb{R}^{d \\times d}$ and $S_W \\in \\mathbb{R}^{d \\times d}$ be the between-class and within-class scatter (covariance) matrices, respectively. The Fisher linear discriminant is defined by $u^* \\in \\mathbb{R}^d$ that maximizes:\n$$J(u) = \\frac{u^T S_B u}{u^T S_W u}$$\nIf $\\lambda = J(u^*)$, $S_W$ is non-singular and $S_B \\neq 0$, then $(u^*, \\lambda)$ must satisfy which ONE of the following equations? (Note: $\\mathbb{R}$ denotes the set of real numbers)",
    options: [
      { label: "A", text: "$S_W^{-1} S_B u^* = \\lambda u^*$" },
      { label: "B", text: "$S_W u^* = \\lambda S_B u^*$" },
      { label: "C", text: "$S_B S_W u^* = \\lambda u^*$" },
      { label: "D", text: "$(u^*)^T u^* = \\lambda^2$" }
    ]
  },
  "GATE_2024_DA_Q37_7537": {
    question: "Let $f : \\mathbb{R} \\to \\mathbb{R}$ be a function defined as:\n\n$$f(x) = \\begin{cases} -x, & x < -2 \\\\[6pt] ax^2 + bx + c, & x \\in [-2, 2] \\\\[6pt] x, & x > 2 \\end{cases}$$\n\nWhich ONE of the following choices gives the values of $a, b, c$ that make the function $f$ continuous and differentiable?",
    options: [
      { label: "A", text: "$a = \\frac{1}{4}, b = 0, c = 1$" },
      { label: "B", text: "$a = \\frac{1}{2}, b = 0, c = 0$" },
      { label: "C", text: "$a = 0, b = 0, c = 0$" },
      { label: "D", text: "$a = 1, b = 1, c = -4$" }
    ],
    explanation: "### Rigorous Mathematical Derivation\n1. For continuity at $x = -2$:\n   $$\\lim_{x \\to -2^-} (-x) = 2$$\n   $$f(-2) = a(-2)^2 + b(-2) + c = 4a - 2b + c = 2$$\n2. For continuity at $x = 2$:\n   $$\\lim_{x \\to 2^+} x = 2$$\n   $$f(2) = 4a + 2b + c = 2$$\n   Subtracting the two equations: $4b = 0 \\implies b = 0$.\n   Therefore: $4a + c = 2$.\n3. For differentiability at $x = 2$:\n   Right derivative: $\\frac{d}{dx}(x) = 1$.\n   Left derivative: $\\frac{d}{dx}(ax^2 + bx + c) = 2ax + b = 4a + 0 = 4a$.\n   Equating derivatives: $4a = 1 \\implies a = \\frac{1}{4}$.\n4. Substituting $a = \\frac{1}{4}$ into $4a + c = 2$:\n   $$4(1/4) + c = 2 \\implies 1 + c = 2 \\implies c = 1$$\n\nThus, $a = \\frac{1}{4}, b = 0, c = 1$.\n\n**Official Verified Answer:** **Option (A)**"
  },
  "GATE_2024_DA_Q47_8062": {
    question: "Select all choices that are subspaces of $\\mathbb{R}^3$:",
    options: [
      { label: "A", text: "$\\left\\{ \\mathbf{x} = \\begin{bmatrix} x_1 \\\\ x_2 \\\\ x_3 \\end{bmatrix} \\in \\mathbb{R}^3 : \\mathbf{x} = \\alpha \\begin{bmatrix} 1 \\\\ 1 \\\\ 0 \\end{bmatrix} + \\beta \\begin{bmatrix} 1 \\\\ 0 \\\\ 0 \\end{bmatrix}, \\alpha, \\beta \\in \\mathbb{R} \\right\\}$" },
      { label: "B", text: "$\\left\\{ \\mathbf{x} = \\begin{bmatrix} x_1 \\\\ x_2 \\\\ x_3 \\end{bmatrix} \\in \\mathbb{R}^3 : \\mathbf{x} = \\alpha^2 \\begin{bmatrix} 1 \\\\ 2 \\\\ 0 \\end{bmatrix} + \\beta^2 \\begin{bmatrix} 1 \\\\ 0 \\\\ 1 \\end{bmatrix}, \\alpha, \\beta \\in \\mathbb{R} \\right\\}$" },
      { label: "C", text: "$\\left\\{ \\mathbf{x} = \\begin{bmatrix} x_1 \\\\ x_2 \\\\ x_3 \\end{bmatrix} \\in \\mathbb{R}^3 : 5x_1 + 2x_3 = 0, 4x_1 - 2x_2 + 3x_3 = 0 \\right\\}$" },
      { label: "D", text: "$\\left\\{ \\mathbf{x} = \\begin{bmatrix} x_1 \\\\ x_2 \\\\ x_3 \\end{bmatrix} \\in \\mathbb{R}^3 : 5x_1 + 2x_3 + 4 = 0 \\right\\}$" }
    ]
  },
  "GATE_2024_DA_Q48_9369": {
    question: "Which of the following statements is/are TRUE? (Note: $\\mathbb{R}$ denotes the set of real numbers)",
    options: [
      { label: "A", text: "There exist $M \\in \\mathbb{R}^{3 \\times 3}, p \\in \\mathbb{R}^3$, and $q \\in \\mathbb{R}^3$ such that $Mx = p$ has a unique solution and $Mx = q$ has infinite solutions." },
      { label: "B", text: "There exist $M \\in \\mathbb{R}^{3 \\times 3}, p \\in \\mathbb{R}^3$, and $q \\in \\mathbb{R}^3$ such that $Mx = p$ has no solutions and $Mx = q$ has infinite solutions." },
      { label: "C", text: "There exist $M \\in \\mathbb{R}^{2 \\times 3}, p \\in \\mathbb{R}^2$, and $q \\in \\mathbb{R}^2$ such that $Mx = p$ has a unique solution and $Mx = q$ has infinite solutions." },
      { label: "D", text: "There exist $M \\in \\mathbb{R}^{3 \\times 2}, p \\in \\mathbb{R}^3$, and $q \\in \\mathbb{R}^3$ such that $Mx = p$ has a unique solution and $Mx = q$ has no solutions." }
    ]
  },
  "GATE_2024_DA_Q49_2934": {
    question: "Let $\\mathbb{R}$ be the set of real numbers, $U$ be a subspace of $\\mathbb{R}^3$ and $M \\in \\mathbb{R}^{3 \\times 3}$ be the matrix corresponding to the orthogonal projection onto the subspace $U$. Which of the following statements is/are TRUE?",
    options: [
      { label: "A", text: "If $U$ is a 1-dimensional subspace of $\\mathbb{R}^3$, then the null space of $M$ is a 1-dimensional subspace." },
      { label: "B", text: "If $U$ is a 2-dimensional subspace of $\\mathbb{R}^3$, then the null space of $M$ is a 1-dimensional subspace." },
      { label: "C", text: "$M^2 = M$" },
      { label: "D", text: "$M^3 = M$" }
    ]
  },
  "GATE_2024_DA_Q54_0218": {
    question: "Let $\\text{game}(b, \\text{rugby})$ be true if the ball $b$ is used in rugby and false otherwise. Let $\\text{shape}(b, \\text{round})$ be true if the ball $b$ is round and false otherwise. Consider the following logical sentences:\n- $s_1: \\forall b \\; (\\neg \\text{game}(b, \\text{rugby}) \\implies \\text{shape}(b, \\text{round}))$\n- $s_2: \\forall b \\; (\\neg \\text{shape}(b, \\text{round}) \\implies \\text{game}(b, \\text{rugby}))$\n- $s_3: \\forall b \\; (\\text{game}(b, \\text{rugby}) \\implies \\neg \\text{shape}(b, \\text{round}))$\n- $s_4: \\forall b \\; (\\text{shape}(b, \\text{round}) \\implies \\neg \\text{game}(b, \\text{rugby}))$\n\nWhich of the following choices is/are logical representations of the assertion, \"All balls are round except balls used in rugby\"?",
    options: [
      { label: "A", text: "$s_1 \\wedge s_3$" },
      { label: "B", text: "$s_1 \\wedge s_2$" },
      { label: "C", text: "$s_2 \\wedge s_3$" },
      { label: "D", text: "$s_3 \\wedge s_4$" }
    ]
  },
  "GATE_2013_CS_Q22_5787": {
    question: "Which one of the following functions is continuous at $x = 3$?",
    options: [
      {
        label: "A",
        text: "$$f(x) = \\begin{cases} 2, & x = 3 \\\\[4pt] x - 1, & x > 3 \\\\[4pt] \\frac{x + 3}{3}, & x < 3 \\end{cases}$$"
      },
      {
        label: "B",
        text: "$$f(x) = \\begin{cases} 4, & x = 3 \\\\[4pt] 8 - x, & x \\neq 3 \\end{cases}$$"
      },
      {
        label: "C",
        text: "$$f(x) = \\begin{cases} x + 3, & x \\le 3 \\\\[4pt] x - 4, & x > 3 \\end{cases}$$"
      },
      {
        label: "D",
        text: "$$f(x) = \\frac{x^3 - 27}{x - 3}, \\quad x \\neq 3$$"
      }
    ],
    explanation: "### Conceptual Breakdown & Rigorous Solution\n\n**Subject:** `Engineering Mathematics` ➔ **Topic:** `Calculus & Real Analysis`\n\n#### Definition of Continuity\nA function $f(x)$ is continuous at $x = c$ if and only if:\n$$\\lim_{x \\to c^-} f(x) = \\lim_{x \\to c^+} f(x) = f(c)$$\n\n#### Testing Option (A) at $x = 3$:\n- $f(3) = 2$\n- Left-hand limit: $\\lim_{x \\to 3^-} \\frac{x + 3}{3} = \\frac{3 + 3}{3} = 2$\n- Right-hand limit: $\\lim_{x \\to 3^+} (x - 1) = 3 - 1 = 2$\n- Since LHL = RHL = $f(3) = 2$, $f(x)$ is continuous at $x = 3$.\n\n**Official Verified Answer:** **Option (A)**"
  }
};

let updatedCount = 0;
data.forEach(q => {
  if (fixes[q.id]) {
    const f = fixes[q.id];
    if (f.question) q.question = f.question;
    if (f.options) q.options = f.options;
    if (f.explanation) q.explanation = f.explanation;
    updatedCount++;
  }
});

console.log(`Updated ${updatedCount} specific questions.`);

// Now purge any pre-2012 unreadable questions except the manually reconstructed GATE_2004_CS_Q26_2592
const cleanQuestions = data.filter(q => {
  const m = q.id.match(/GATE_(?:MERGED_)?(\d{4})/) || (q.paper && q.paper.match(/(\d{4})/));
  const year = m ? parseInt(m[1]) : 2025;
  if (year >= 2012) return true;
  if (q.id === "GATE_2004_CS_Q26_2592") return true; // Reconstructed symmetric matrix
  return false;
});

console.log(`Kept ${cleanQuestions.length} pristine questions (purged ${data.length - cleanQuestions.length} pre-2012 scanned noise).`);

fs.writeFileSync(masterPath, JSON.stringify(cleanQuestions, null, 2), "utf8");
console.log("Master questions database written successfully.");
