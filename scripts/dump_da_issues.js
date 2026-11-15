const fs = require("fs");
const path = require("path");

const masterPath = path.join(__dirname, "../data/gate_master_questions.json");
const data = JSON.parse(fs.readFileSync(masterPath, "utf8"));
const da = data.filter(q => q.paper && q.paper.includes("DA"));

const regex = /(²|³|√\s*\d|⊤|∈|̸=|||||||||\b[a-z]\d\s+\d\b|O\(\s*²|Data Science & Artificial|wnew|wold|bnew|bold|ynf)/;

const issues = da.filter(q => {
  const text = q.question + " " + JSON.stringify(q.options);
  return regex.test(text);
});

console.log("Found issues count:", issues.length);
issues.forEach((q, idx) => {
  console.log(`\n--- [${idx + 1}/${issues.length}] ${q.id} (${q.paper}) ---`);
  console.log("QUESTION:\n" + q.question);
  console.log("OPTIONS:\n" + JSON.stringify(q.options, null, 2));
});
