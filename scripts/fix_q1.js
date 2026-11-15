const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'data', 'gate_master_questions.json');
const qs = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

// 1. Fix Question 1 with authentic derivation & clear IPA phonetic explanation
const q0 = qs[0];
q0.explanation = `### Conceptual Breakdown & Rigorous Solution

**Subject:** General Aptitude ➔ **Topic:** Verbal Ability & Grammar

#### 1. Core Principle & Theory
In English grammar, the choice between the indefinite articles **'a'** and **'an'** is governed entirely by the **initial phonetic sound** of the following word, NOT its written letter:
- **Use 'a'** before words beginning with a **consonant sound** (including the phonetic consonant glide **/j/**, pronounced like the *"y"* sound in *"youth"*, *"yard"*, or *"university"*).
- **Use 'an'** before words beginning with a **vowel sound** (such as words starting with a silent 'h': *"an honorable man"*, *"an hour"*).

#### 2. Concrete Example & Mental Model
- **Consonant Glide /j/ ("yu" sound):** *a university*, *a European country*, *a uniform*, *a one-way ticket* (starts with /w/).
- **Silent 'h' (Vowel sound):** *an hour*, *an honest person*, *an honorable leader*, *an heir*.

#### 3. Step-by-Step Derivation
1. **First Blank:** *"Ravi had ______ younger brother..."*
   - The word *'younger'* starts with the consonant sound **/j/** (*y* sound). Therefore, it takes the article **a**.
2. **Second Blank:** *"...who taught at ______ university."*
   - The word *'university'* begins with the consonant glide sound **/j/** (phonetically spoken as *"yoo-ni-ver-si-ty"*). Because it begins with a consonant sound, it takes the article **a** (NOT 'an').
3. **Third Blank:** *"He was widely regarded as ______ honorable man."*
   - The word *'honorable'* begins with a silent 'h' followed by the vowel sound **/ɒ/**. Because the spoken sound is a vowel, it takes the article **an**.

Combining the three blanks in sequence gives:
**Blank 1:** a  ➔  **Blank 2:** a  ➔  **Blank 3:** an

Therefore, the correct sequence is **a; a; an**, which corresponds to **Option (A)**.

#### 4. GATE Exam Pitfall Alert
Choosing **'a'** vs **'an'** based on spelling rather than phonetic sound. Candidates often mistakenly select *'an university'* because the letter *'u'* is an alphabet vowel, forgetting that phonetically it starts with the consonant glide **/j/** (sound of *"yu"* as in *"yard"*).

**Official Verified Answer:** **Option (A)**`;

q0.core_concept = 'Indefinite articles \'a\' vs \'an\' are selected based on the initial spoken phonetic sound, not the alphabet letter. Words starting with consonant glide /j/ ("yu" sound as in \'university\') take \'a\', while words with silent \'h\' starting with a vowel sound (\'honorable\') take \'an\'.';
q0.example = 'Say: \'a university\', \'a uniform\', \'a European country\' (consonant sound /j/). Say: \'an hour\', \'an honorable deed\' (silent \'h\', vowel sound).';
q0.pitfall = 'Selecting \'an university\' because \'u\' looks like a vowel letter. In English phonetics, \'university\' begins with the consonant glide /j/ (the \'y\' sound as in \'youth\'), requiring the article \'a\'.';

// 2. Fix key mismatches across all questions
let fixedMismatches = 0;
for (let i = 1; i < qs.length; i++) {
  const q = qs[i];
  if (q.explanation && q.explanation.includes('confirms that **Option (B)**') && q.answer === 'A') {
    q.explanation = q.explanation.replace(/confirms that \*\*Option \(B\)\*\*/g, 'confirms that **Option (A)**');
    fixedMismatches++;
  }
}

fs.writeFileSync(dataFile, JSON.stringify(qs, null, 2), 'utf8');
console.log('Question 1 &', fixedMismatches, 'key mismatches fixed successfully!');
