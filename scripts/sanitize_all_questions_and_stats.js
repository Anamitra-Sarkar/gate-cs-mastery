const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const questionsFile = path.join(DATA_DIR, 'gate_master_questions.json');
const statsFile = path.join(DATA_DIR, 'user_stats.json');

// 1. Reset user_stats.json to 0 (No dummy stats!)
const freshStats = {
  xp: 0,
  streak: 1,
  level: 1,
  totalAttempted: 0,
  totalCorrect: 0,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  subjectStats: {},
  attempts: {},
  bookmarks: []
};
fs.writeFileSync(statsFile, JSON.stringify(freshStats, null, 2), 'utf8');
console.log('user_stats.json has been reset to 0 (No dummy data)!');

// 2. Load questions
const qs = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));
console.log('Loaded', qs.length, 'questions to sanitize.');

// Fix Question 1 (Analogy)
const q1 = qs.find(q => q.id === 'GATE_2025_DA_Q1_2216');
if (q1) {
  q1.explanation = `### Conceptual Breakdown & Rigorous Solution

**Subject:** General Aptitude ➔ **Topic:** Verbal Ability & Grammar

#### 1. Core Principle & Theory
In word analogy problems, identify the exact semantic relationship between the first pair of words:
$$\\text{Courage} \\longleftrightarrow \\text{Bravery}$$
Both words are direct **synonyms** expressing the mental or moral strength to venture, persevere, and withstand danger, fear, or difficulty.

#### 2. Concrete Example & Mental Model
To preserve the established relationship:
$$\\text{Word 1} : \\text{Synonym 1} :: \\text{Word 2} : \\text{Synonym 2}$$
The word **Yearning** denotes a feeling of intense longing or desire for someone or something.

#### 3. Step-by-Step Derivation
1. Analyze each option in relation to "Yearning":
   - **Option (A) Longing:** An eager desire or yearning (exact synonym).
   - **Option (B) Yelling:** Shouting in a loud, sharp way (unrelated auditory action).
   - **Option (C) Yawning:** Involuntary reflex opening of the mouth (unrelated physiological action).
   - **Option (D) Glaring:** Staring in an angry, fierce manner (unrelated visual action).
2. The word that completes the synonymous analogy is **Longing**.

Therefore, the correct choice is **Option (A)**.

#### 4. GATE Exam Pitfall Alert
Do not get distracted by phonetic rhymes or words starting with the same letter (Yelling, Yawning). Focus exclusively on the semantic definition.

**Official Verified Answer:** **Option (A)**`;
  q1.core_concept = 'Semantic analogies require identifying the exact relationship (e.g. synonymy, degree of intensity, antonymy) connecting the base pair and mapping it to the target word.';
  q1.example = 'Courage is a synonym of Bravery; Yearning is an exact synonym of Longing.';
  q1.pitfall = 'Choosing options that sound phonetically similar (Yawning, Yelling) instead of matching the synonymous semantic meaning.';
}

// Fix Question 2 (Myopic)
const q2 = qs.find(q => q.id === 'GATE_2025_CS1_Q2_4903');
if (q2) {
  q2.explanation = `### Conceptual Breakdown & Rigorous Solution

**Subject:** General Aptitude ➔ **Topic:** Verbal Ability & Grammar

#### 1. Core Principle & Theory
In contextual vocabulary questions, determine the literal and figurative meaning of the target word:
- **Myopic:** Derived from the medical term for nearsightedness (inability to see distant objects clearly). Figuratively, it signifies **lacking foresight, narrow-minded, or shortsighted** in planning or judgment.

#### 2. Concrete Example & Mental Model
- Sentence Context: *"The CEO's decision was considered myopic because it sacrificed long-term stability to accommodate short-term gains."*
- Sacrificing the future for immediate gain is the textbook definition of **shortsightedness**.

#### 3. Step-by-Step Derivation
1. Evaluate each alternative:
   - **Option (A) visionary:** Having foresight or imagination regarding future developments (antonym).
   - **Option (B) shortsighted:** Lacking foresight or considering only immediate circumstances (exact synonym).
   - **Option (C) progressive:** Favoring progress, change, or improvement (unrelated positive attribute).
   - **Option (D) innovative:** Introducing new ideas or methods (unrelated attribute).
2. Replacing "myopic" with "shortsighted" retains the identical meaning of the sentence.

Therefore, the correct choice is **Option (B)**.

#### 4. GATE Exam Pitfall Alert
Do not select words that sound sophisticated (like visionary or progressive) without verifying whether their tone and definition match the critical context of the sentence.

**Official Verified Answer:** **Option (B)**`;
  q2.core_concept = 'Contextual vocabulary requires matching both the literal denotation and the tone of the sentence. "Myopic" means lacking long-term foresight (shortsighted).';
  q2.example = 'A decision that ignores future consequences for quick profits is myopic, i.e., shortsighted.';
  q2.pitfall = 'Selecting antonyms like "visionary" because they are commonly associated with corporate leadership.';
}

// Fix Question 3 (Tenses)
const q3 = qs.find(q => q.id === 'GATE_2025_DA_Q2_0415');
if (q3) {
  q3.explanation = `### Conceptual Breakdown & Rigorous Solution

**Subject:** General Aptitude ➔ **Topic:** Verbal Ability & Grammar

#### 1. Core Principle & Theory
When an ongoing past activity is interrupted by another specific event in the past (*"when it suddenly started to rain"*), English syntax requires the past continuous or past perfect continuous tense:
- **Past Perfect Continuous:** Formed by $\\text{had been} + \\text{present participle (-ing)}$. It emphasizes an ongoing action that was in progress before or up to another past action.

#### 2. Concrete Example & Mental Model
- *"We had been playing tennis in the lawn when it suddenly started to rain."*
- Both events occurred in the past: the playing of tennis was already in progress when the rain began.

#### 3. Step-by-Step Derivation
1. Analyze the verb tense in the dependent clause: *"when it suddenly started to rain"* (Simple Past: *started*).
2. The main clause requires a past tense form to maintain temporal agreement:
   - **Option (A) have been playing:** Present perfect continuous (incompatible with past *started*).
   - **Option (B) had been playing:** Past perfect continuous (correctly aligns with the past timeline).
   - **Option (C) would have been playing:** Conditional perfect (requires an unfulfilled hypothetical condition).
   - **Option (D) could be playing:** Present/future modal continuous (incompatible).
3. Therefore, the grammatical sequence is completed by **had been playing**.

Hence, the correct choice is **Option (B)**.

#### 4. GATE Exam Pitfall Alert
Mixing present perfect forms (*have been*) with past temporal markers (*started to rain*). Always ensure tense concord throughout compound and complex sentences.

**Official Verified Answer:** **Option (B)**`;
  q3.core_concept = 'Tense concord: an ongoing action interrupted by a past event requires past aspect agreement (had been playing).';
  q3.example = 'They had been studying for two hours when the power went out.';
  q3.pitfall = 'Using present perfect "have been playing" with the past-tense indicator "started".';
}

// Fix Question 4 (Average Calculation)
const q4 = qs.find(q => q.id === 'GATE_2025_CS1_Q3_4462');
if (q4) {
  q4.explanation = `### Conceptual Breakdown & Rigorous Solution

**Subject:** General Aptitude ➔ **Topic:** Quantitative Aptitude

#### 1. Core Principle & Theory
The arithmetic mean (average) $\\bar{A}$ of $N$ observations is:
$$\\bar{A} = \\frac{\\sum X}{N} \\implies \\sum X = N \\times \\bar{A}$$
When an individual observation is corrected by $\\Delta = X_{\\text{correct}} - X_{\\text{incorrect}}$, the new average becomes:
$$\\bar{A}_{\\text{new}} = \\bar{A}_{\\text{old}} + \\frac{\\Delta}{N} \\implies N = \\frac{\\Delta}{\\bar{A}_{\\text{new}} - \\bar{A}_{\\text{old}}}$$

#### 2. Concrete Example & Mental Model
- Initial calculated average: $\\bar{A}_{\\text{old}} = 30.8$
- Corrected average: $\\bar{A}_{\\text{new}} = 31.4$
- Change in average: $\\Delta \\bar{A} = 31.4 - 30.8 = 0.6$
- Error in marks: entered as $24$ instead of $42$, so the total sum was understated by:
$$\\Delta = 42 - 24 = 18$$

#### 3. Step-by-Step Derivation
1. The entire increase of $+18$ marks is distributed equally across all $N$ students:
$$N \\times 0.6 = 18$$
2. Solve for $N$:
$$N = \\frac{18}{0.6} = \\frac{180}{6} = 30$$
3. Thus, there are exactly **30 students** in the class.

Therefore, the correct choice is **Option (C)**.

#### 4. GATE Exam Pitfall Alert
Do not set up cumbersome multi-variable simultaneous equations when the net differential formula directly yields $N = \\Delta / \\Delta \\bar{A}$.

**Official Verified Answer:** **Option (C)**`;
  q4.core_concept = 'Net average shift formula: the number of observations equals the total change in sum divided by the change in average, N = Delta / Delta(A).';
  q4.example = 'If 18 marks increase the class average by 0.6, N = 18 / 0.6 = 30 students.';
  q4.pitfall = 'Subtracting 24 from 42 incorrectly, or dividing 0.6 by 18 instead of 18 by 0.6.';
}

// Fix Question 5 (Digital Image 4x4)
const q5 = qs.find(q => q.id === 'GATE_2025_DA_Q3_0270');
if (q5) {
  q5.visual = `<div class="my-4 flex justify-center">
<svg viewBox="0 0 380 240" class="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
  <text x="190" y="22" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="14" font-weight="bold" fill="#050811">4 × 4 Digital Image Pixels (U)</text>
  
  <!-- Row 0: 0, 1, 0, 2 (all <= 4) -->
  <rect x="50" y="40" width="65" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
  <text x="82.5" y="65" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#15803d">0</text>
  
  <rect x="120" y="40" width="65" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
  <text x="152.5" y="65" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#15803d">1</text>
  
  <rect x="190" y="40" width="65" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
  <text x="222.5" y="65" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#15803d">0</text>
  
  <rect x="260" y="40" width="65" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
  <text x="292.5" y="65" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#15803d">2</text>
  
  <!-- Row 1: 4, 7, 3, 3 (4, 3, 3 are <= 4) -->
  <rect x="50" y="85" width="65" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
  <text x="82.5" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#15803d">4</text>
  
  <rect x="120" y="85" width="65" height="40" rx="4" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5" />
  <text x="152.5" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#b91c1c">7</text>
  
  <rect x="190" y="85" width="65" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
  <text x="222.5" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#15803d">3</text>
  
  <rect x="260" y="85" width="65" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
  <text x="292.5" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#15803d">3</text>
  
  <!-- Row 2: 5, 5, 4, 4 (4, 4 are <= 4) -->
  <rect x="50" y="130" width="65" height="40" rx="4" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5" />
  <text x="82.5" y="155" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#b91c1c">5</text>
  
  <rect x="120" y="130" width="65" height="40" rx="4" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5" />
  <text x="152.5" y="155" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#b91c1c">5</text>
  
  <rect x="190" y="130" width="65" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
  <text x="222.5" y="155" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#15803d">4</text>
  
  <rect x="260" y="130" width="65" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
  <text x="292.5" y="155" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#15803d">4</text>
  
  <!-- Row 3: 6, 7, 3, 2 (3, 2 are <= 4) -->
  <rect x="50" y="175" width="65" height="40" rx="4" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5" />
  <text x="82.5" y="200" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#b91c1c">6</text>
  
  <rect x="120" y="175" width="65" height="40" rx="4" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5" />
  <text x="152.5" y="200" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#b91c1c">7</text>
  
  <rect x="190" y="175" width="65" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
  <text x="222.5" y="200" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#15803d">3</text>
  
  <rect x="260" y="175" width="65" height="40" rx="4" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
  <text x="292.5" y="200" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" font-weight="bold" fill="#15803d">2</text>
  
  <!-- Legend -->
  <text x="190" y="232" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="bold" fill="#15803d">■ Green Cells: U ≤ 4 (11 total) | ■ Red Cells: U > 4</text>
</svg>
</div>`;

  q5.explanation = `### Conceptual Breakdown & Rigorous Solution

**Subject:** General Aptitude ➔ **Topic:** Quantitative & Spatial Aptitude

#### 1. Core Principle & Theory
A digital image of size $M \\times N$ contains $M \\times N$ discrete pixels, each characterized by an intensity value $U(x, y)$. To find the count of pixels satisfying the predicate $U(x, y) \\le 4$, perform element-wise evaluation across all cells in the matrix.

#### 2. Concrete Example & Mental Model
The $4 \\times 4$ pixel intensity matrix is:
$$\\begin{bmatrix}
0 & 1 & 0 & 2 \\\\
4 & 7 & 3 & 3 \\\\
5 & 5 & 4 & 4 \\\\
6 & 7 & 3 & 2
\\end{bmatrix}$$

#### 3. Step-by-Step Derivation
Evaluate each row for pixel intensities $\\le 4$:
- **Row 1:** $[0, 1, 0, 2] \\implies$ all $4$ pixels satisfy $U \\le 4$ (**Count = 4**).
- **Row 2:** $[4, 7, 3, 3] \\implies 4, 3, 3$ satisfy $U \\le 4$; $7 > 4$ fails (**Count = 3**).
- **Row 3:** $[5, 5, 4, 4] \\implies 4, 4$ satisfy $U \\le 4$; $5, 5 > 4$ fail (**Count = 2**).
- **Row 4:** $[6, 7, 3, 2] \\implies 3, 2$ satisfy $U \\le 4$; $6, 7 > 4$ fail (**Count = 2**).

Summing the counts across all rows:
$$\\text{Total Valid Pixels} = 4 + 3 + 2 + 2 = 11$$

Therefore, exactly **11 pixels** have intensity $U \\le 4$, which corresponds to **Option (C)**.

#### 4. GATE Exam Pitfall Alert
Carefully note the inequality condition $\\le 4$ includes pixels with intensity equal to $4$. Omitting the equality boundary would erroneously exclude the three pixels with $U = 4$.

**Official Verified Answer:** **Option (C)**`;
  q5.core_concept = 'Digital image pixel evaluation: counting the frequency of elements in a matrix meeting a threshold condition U <= threshold.';
  q5.example = 'Row 1 has 4, Row 2 has 3, Row 3 has 2, Row 4 has 2. Total = 4 + 3 + 2 + 2 = 11.';
  q5.pitfall = 'Excluding the boundary value 4 by treating <= 4 as strictly < 4.';
}

// Fix Question 6 (Blood Relations)
const q6 = qs.find(q => q.id === 'GATE_2025_CS1_Q4_4358');
if (q6) {
  q6.explanation = `### Conceptual Breakdown & Rigorous Solution

**Subject:** General Aptitude ➔ **Topic:** Logical Reasoning

#### 1. Core Principle & Theory
In logical blood relations, build a generational pedigree tree based on defined relationships:
- Generation 1 (Grandparents): $R$ (Mother of $Q$)
- Generation 2 (Parents / Siblings): $P$ (Brother), $Q$ (Parent)
- Generation 3 (Children): $S$ (Daughter), $T$ (Sister of $S$)

#### 2. Concrete Example & Mental Model
- $R$ is female (Mother).
- $P$ is male (Brother of $Q$).
- $S$ and $T$ are sisters and both are children of $Q$.
- The gender of $Q$ is not specified (could be mother or father).

#### 3. Step-by-Step Derivation
1. Analyze statement (1): *"R is the grandmother of S."*
   - $R$ is the mother of $Q$, and $Q$ is the parent of $S$. Therefore, $R$ is unequivocally the grandmother of $S$. **Statement (1) is TRUE.**
2. Analyze statement (2): *"P is the uncle of S and T."*
   - $P$ is the brother of parent $Q$. Hence, whether $Q$ is male (paternal uncle) or female (maternal uncle), $P$ is the uncle of $S$ and $T$. **Statement (2) is TRUE.**
3. Analyze statement (3): *"R has only one son."*
   - We know $P$ is male, but the gender of $Q$ is undetermined. If $Q$ is male, $R$ has two sons. We cannot assert statement (3) is definitely true.
4. Analyze statement (4): *"Q has only one daughter."*
   - $S$ is a daughter and $T$ is her sister, so $Q$ has at least two daughters. Statement (4) is false.
5. Consequently, **Both (1) and (2) are true**.

Therefore, the correct choice is **Option (A)**.

#### 4. GATE Exam Pitfall Alert
Assuming the gender of an individual based on their name or role without an explicit textual indicator. Here, $Q$'s gender is unknown, which invalidates statements (3) and (4).

**Official Verified Answer:** **Option (A)**`;
  q6.core_concept = 'Blood relation logic: tracing generational relationships (Grandmother -> Parent -> Children) while avoiding unverified gender assumptions for unspecified nodes.';
  q6.example = 'Mother of parent = Grandmother. Brother of parent = Uncle. Thus both (1) and (2) are true.';
  q6.pitfall = 'Assuming Q must be male or female when no gender is specified for Q.';
}

// Fix Question 8 (Campus Map)
const q8 = qs.find(q => q.id === 'GATE_2025_CS1_Q5_9500');
if (q8) {
  q8.visual = `<div class="my-4 flex justify-center">
<svg viewBox="0 0 380 230" class="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
  <text x="190" y="20" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="13" font-weight="bold" fill="#050811">Campus Directional Map</text>
  
  <!-- Compass Rose -->
  <g transform="translate(325, 55)">
    <circle cx="0" cy="0" r="18" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2 2" />
    <line x1="0" y1="-16" x2="0" y2="16" stroke="#475569" stroke-width="1.5" />
    <line x1="-16" y1="0" x2="16" y2="0" stroke="#475569" stroke-width="1.5" />
    <polygon points="0,-18 -3,-6 0,-10 3,-6" fill="#dc2626" />
    <text x="0" y="-21" text-anchor="middle" font-size="9" font-weight="bold" fill="#dc2626">N</text>
    <text x="21" y="3" text-anchor="middle" font-size="8" font-weight="bold" fill="#475569">E</text>
    <text x="0" y="27" text-anchor="middle" font-size="8" font-weight="bold" fill="#475569">S</text>
    <text x="-21" y="3" text-anchor="middle" font-size="8" font-weight="bold" fill="#475569">W</text>
  </g>

  <!-- Physics Lab (North-West) -->
  <rect x="40" y="45" width="105" height="50" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2" />
  <text x="92.5" y="74" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#1d4ed8">Physics Lab</text>

  <!-- Library (North-East) -->
  <rect x="180" y="45" width="95" height="50" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" />
  <text x="227.5" y="74" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#475569">Library</text>

  <!-- Main Building (Center) -->
  <rect x="110" y="115" width="110" height="45" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" />
  <text x="165" y="142" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#475569">Main Building</text>

  <!-- Chemistry Lab (South-East relative to Physics Lab) -->
  <rect x="195" y="170" width="115" height="50" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="2" />
  <text x="252.5" y="199" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#047857">Chemistry Lab</text>

  <!-- Direction Vector from Physics Lab to Chemistry Lab -->
  <line x1="92.5" y1="95" x2="252.5" y2="170" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrow)" />
  <text x="185" y="132" font-size="10" font-weight="bold" fill="#b45309" transform="rotate(25, 185, 132)">Southeast ➔</text>
</svg>
</div>`;

  q8.explanation = `### Conceptual Breakdown & Rigorous Solution

**Subject:** General Aptitude ➔ **Topic:** Spatial Aptitude & Map Reading

#### 1. Core Principle & Theory
Cardinal directions on standard 2D cartographic maps follow:
- **Upward:** North ($N$)
- **Downward:** South ($S$)
- **Rightward:** East ($E$)
- **Leftward:** West ($W$)
- **Diagonal Directions:**
  - Down and Right $\\implies$ **Southeast ($SE$)**
  - Up and Left $\\implies$ **Northwest ($NW$)**

#### 2. Concrete Example & Mental Model
To establish the relative direction of object $B$ from reference point $A$:
1. Place the origin of the compass rose $(0, 0)$ at reference point $A$ (Physics Lab).
2. Observe the coordinate vector pointing to target $B$ (Chemistry Lab).

#### 3. Step-by-Step Derivation
1. Locate the **Physics Lab**: situated in the upper-left quadrant (North-West).
2. Locate the **Chemistry Lab**: situated in the lower-right quadrant (South-East).
3. The displacement vector from Physics Lab to Chemistry Lab moves downward (South) and to the right (East).
4. Therefore, the Chemistry Lab is located to the **Southeast** of the Physics Lab.

Hence, the statement *"The chemistry lab is to the southeast of physics lab"* is undeniably true, matching the official key.

#### 4. GATE Exam Pitfall Alert
Confusing the reference point: asking "Direction of B from A" requires setting the compass at A, not B.

**Official Verified Answer:** **Option (C)**`;
}

// 3. Remove "conservation laws" boilerplate across ALL remaining questions
let boilerplateRemoved = 0;
qs.forEach(q => {
  if (q.explanation && q.explanation.includes('conservation laws')) {
    q.explanation = q.explanation.replace(/- Conflicting options violate boundary cases, conservation laws, or standard definitions\.\n?/g, '');
    q.explanation = q.explanation.replace(/Applying the governing theorems and axioms of `[^`]+`, systematically analyze each alternative\.\n?/g, '');
    boilerplateRemoved++;
  }
});
console.log('Removed synthetic boilerplate from', boilerplateRemoved, 'questions.');

// Save updated questions
fs.writeFileSync(questionsFile, JSON.stringify(qs, null, 2), 'utf8');
console.log('Dataset successfully sanitized and saved!');
