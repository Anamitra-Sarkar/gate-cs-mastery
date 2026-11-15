const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'gate_master_questions.json');
const questions = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('Applying targeted mathematical fixes...');

// Fix Q33: Sigmoid derivative
const q33 = questions.find(q => q.id === 'GATE_2024_DA_Q33_7621');
if (q33) {
  q33.subject = 'Machine Learning & AI';
  q33.topic = 'Neural Networks & Activation Functions';
  q33.question = `Let $f: \\mathbb{R} \\to \\mathbb{R}$ be the standard logistic sigmoid function:
$$f(x) = \\frac{1}{1 + e^{-x}}$$

The value of the derivative of $f$ at $x$ where $f(x) = 0.4$ is ______ (rounded off to two decimal places).

*(Note: $\\mathbb{R}$ denotes the set of real numbers.)*`;
  q33.answer = '0.24 to 0.24';
  q33.core_concept = 'The derivative of the standard sigmoid function f(x) = 1 / (1 + e^-x) can be expressed cleanly in terms of its output: f\'(x) = f(x) * (1 - f(x)).';
  q33.example = 'If f(x) = 0.5, f\'(x) = 0.5 * (1 - 0.5) = 0.25. If f(x) = 0.4, f\'(x) = 0.4 * (1 - 0.4) = 0.24.';
  q33.pitfall = 'There is no need to solve for x using logarithms; evaluate the derivative directly using the identity f\'(x) = f(x)(1 - f(x)).';
  q33.explanation = `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Machine Learning & AI\` ➔ **Topic:** \`Neural Networks & Activation Functions\`

#### 1. Core Principle & Theory
For the standard logistic sigmoid activation function:
$$f(x) = \\frac{1}{1 + e^{-x}} = (1 + e^{-x})^{-1}$$
Using the chain rule, its derivative is:
$$f'(x) = - (1 + e^{-x})^{-2} \\cdot (-e^{-x}) = \\frac{e^{-x}}{(1 + e^{-x})^2}$$
Rewriting in terms of $f(x)$:
$$f'(x) = \\left(\\frac{1}{1 + e^{-x}}\\right) \\left(\\frac{e^{-x}}{1 + e^{-x}}\\right) = f(x) \\cdot (1 - f(x))$$

#### 2. Step-by-Step Derivation
1. We are given the functional value at $x$:
   $$f(x) = 0.4$$
2. Substitute directly into the derivative identity:
   $$f'(x) = f(x) \\cdot (1 - f(x))$$
   $$f'(x) = 0.4 \\cdot (1 - 0.4) = 0.4 \\cdot 0.6 = 0.24$$

#### 4. GATE Exam Pitfall Alert
Do not waste time computing $x = -\\ln(1/0.4 - 1)$. Directly evaluate $f'(x) = f(x)(1 - f(x))$ to obtain **0.24**.

**Official Verified Answer:** **0.24** (Range: 0.24 to 0.24)`;
}

// Fix Q64: Bayesian Network Factorization
const q64 = questions.find(q => q.id === 'GATE_2024_DA_Q64_5658');
if (q64) {
  q64.subject = 'Machine Learning & AI';
  q64.topic = 'Probabilistic Graphical Models';
  q64.question = `Given a Bayesian Network consisting of four Bernoulli random variables $U, V, W, Z$ with network topology $U \\to V$, $U \\to W$, and $(V, W) \\to Z$, along with the following conditional probability tables:

- **Prior for $U$:**  
  $P(U = 0) = 0.5$, $P(U = 1) = 0.5$

- **Conditional $P(V | U)$:**  
  $P(V = 0 | U = 0) = 0.5$, $P(V = 1 | U = 0) = 0.5$  
  $P(V = 0 | U = 1) = 0.5$, $P(V = 1 | U = 1) = 0.5$

- **Conditional $P(W | U)$:**  
  $P(W = 0 | U = 0) = 1.0$, $P(W = 1 | U = 0) = 0.0$  
  $P(W = 0 | U = 1) = 0.0$, $P(W = 1 | U = 1) = 1.0$

- **Conditional $P(Z | V, W)$:**  
  $P(Z = 1 | V = 0, W = 0) = 0.5$  
  $P(Z = 1 | V = 0, W = 1) = 0.0$  
  $P(Z = 1 | V = 1, W = 0) = 0.0$  
  $P(Z = 1 | V = 1, W = 1) = 0.5$

The value of the joint probability $P(U = 1, V = 1, W = 1, Z = 1) = \\text{______}$ (rounded off to three decimal places).`;
  q64.answer = '0.125 to 0.125';
  q64.core_concept = 'By the chain rule for Bayesian Networks, the joint distribution factors as the product of each variable conditioned on its parents: P(U, V, W, Z) = P(U) * P(V | U) * P(W | U) * P(Z | V, W).';
  q64.example = 'P(1, 1, 1, 1) = P(U=1) * P(V=1|U=1) * P(W=1|U=1) * P(Z=1|V=1, W=1) = 0.5 * 0.5 * 1.0 * 0.5 = 0.125.';
  q64.pitfall = 'Ensure you look up the correct row in the CPT where V=1 and W=1 for Z=1 (which is 0.5).';
  q64.explanation = `### Conceptual Breakdown & Rigorous Solution

**Subject:** \`Machine Learning & AI\` ➔ **Topic:** \`Probabilistic Graphical Models\`

#### 1. Core Principle & Theory
In a directed acyclic graphical model (Bayesian Network), the joint probability distribution factorizes according to parent relationships:
$$P(X_1, X_2, \\dots, X_n) = \\prod_{i=1}^n P(X_i | \\text{Parents}(X_i))$$
For the variables $(U, V, W, Z)$ where parents are $\\text{Pa}(U) = \\emptyset, \\text{Pa}(V) = \\{U\\}, \\text{Pa}(W) = \\{U\\}, \\text{Pa}(Z) = \\{V, W\\}$:
$$P(U, V, W, Z) = P(U) \\cdot P(V | U) \\cdot P(W | U) \\cdot P(Z | V, W)$$

#### 2. Step-by-Step Derivation
Evaluating for the specific assignment $U = 1, V = 1, W = 1, Z = 1$:
1. $P(U = 1) = 0.5$
2. $P(V = 1 | U = 1) = 0.5$
3. $P(W = 1 | U = 1) = 1.0$ (from table: $P(W=0|U=1)=0, P(W=1|U=1)=1$)
4. $P(Z = 1 | V = 1, W = 1) = 0.5$

Multiply all factor probabilities:
$$P(U=1, V=1, W=1, Z=1) = 0.5 \\times 0.5 \\times 1.0 \\times 0.5 = 0.125$$

#### 4. GATE Exam Pitfall Alert
Be careful reading the CPT table: for $U=1$, $P(W=1|U=1)$ is $1.0$, not $0.5$. The exact product is **0.125**.

**Official Verified Answer:** **0.125** (Range: 0.125 to 0.125)`;
}

fs.writeFileSync(dbPath, JSON.stringify(questions, null, 2), 'utf8');
console.log('Targeted mathematical questions updated successfully!');
