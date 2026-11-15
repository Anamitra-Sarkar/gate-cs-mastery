const fs = require("fs");
const path = require("path");

// 1. Load the full 1338 questions dataset from c45e206
const fullData = JSON.parse(fs.readFileSync("/tmp/c45e206_questions.json", "utf8"));
console.log("Full dataset questions count:", fullData.length);

// 2. Load the math fixes from apply_math_and_clean.js
// Let's require the fixes dictionary or define it
const currentMaster = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/gate_master_questions.json"), "utf8"));
const currentMap = new Map();
currentMaster.forEach(q => currentMap.set(q.id, q));

// Apply the fixes from currentMaster to fullData
let appliedFixes = 0;
fullData.forEach(q => {
  if (currentMap.has(q.id)) {
    const updated = currentMap.get(q.id);
    q.question = updated.question;
    q.options = updated.options;
    q.explanation = updated.explanation;
    if (updated.subject) q.subject = updated.subject;
    if (updated.topic) q.topic = updated.topic;
    appliedFixes++;
  }
});
console.log("Applied updated question fixes to:", appliedFixes);

// 3. Ensure DA questions are categorized under Data Science & AI where appropriate
const daSubjectMap = {
  "Machine Learning": "Data Science & AI",
  "Artificial Intelligence": "Data Science & AI",
  "Deep Learning": "Data Science & AI",
  "Pattern Recognition": "Data Science & AI",
  "Data Warehousing & Mining": "Data Science & AI"
};

let daCount = 0;
fullData.forEach(q => {
  if (q.paper && q.paper.includes("DA")) {
    const text = (q.question + " " + (q.topic || "")).toLowerCase();
    if (
      text.includes("classifier") ||
      text.includes("bayes") ||
      text.includes("regression") ||
      text.includes("clustering") ||
      text.includes("svm") ||
      text.includes("neural") ||
      text.includes("relu") ||
      text.includes("activation") ||
      text.includes("loss") ||
      text.includes("gradient") ||
      text.includes("pca") ||
      text.includes("eigen") ||
      text.includes("covariance") ||
      text.includes("alpha-beta") ||
      text.includes("game tree") ||
      text.includes("heuristic") ||
      text.includes("search") ||
      text.includes("warehouse") ||
      text.includes("olap") ||
      text.includes("k-means") ||
      text.includes("linkage") ||
      text.includes("precision") ||
      text.includes("recall") ||
      text.includes("f1")
    ) {
      q.subject = "Data Science & AI";
      daCount++;
    }
  }
});
console.log("Total Data Science & AI questions in full dataset:", fullData.filter(q => q.subject === "Data Science & AI").length);

// 4. Build topics.json with the EXACT OBJECT schema expected by server and client!
const topicsObj = {};
fullData.forEach(q => {
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

// Save gate_master_questions.json with all 1338 questions
fs.writeFileSync(path.join(__dirname, "../data/gate_master_questions.json"), JSON.stringify(fullData, null, 2), "utf8");
console.log("Saved gate_master_questions.json with", fullData.length, "questions.");

// Save topics.json as proper object
fs.writeFileSync(path.join(__dirname, "../data/topics.json"), JSON.stringify(topicsObj, null, 2), "utf8");
console.log("Saved topics.json as proper object with keys:", Object.keys(topicsObj));
