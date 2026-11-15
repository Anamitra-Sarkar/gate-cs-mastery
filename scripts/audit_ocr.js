const fs = require("fs");
const path = require("path");

const masterPath = path.join(__dirname, "../data/gate_master_questions.json");
const data = JSON.parse(fs.readFileSync(masterPath, "utf8"));

const old = data.filter(q => {
  const m = q.id.match(/GATE_(?:MERGED_)?(\d{4})/) || (q.paper && q.paper.match(/(\d{4})/));
  const year = m ? parseInt(m[1]) : 2025;
  return year < 2012;
});

function isGarbled(q) {
  const text = (q.question || "") + " " + (q.options ? q.options.map(o => o.text).join(" ") : "");
  if (text.length < 35) return true;
  if (/[~`_]{2,}/.test(text)) return true;
  if (/(\b[a-z]{1,2}\s+){5,}/i.test(text)) return true; // chopped up single letters
  if (/[•·§¶¤¥¢]/.test(text)) return true;
  if (/[Il1\|]{4,}/.test(text)) return true;
  if (/Before the start of the examination/i.test(text)) return true;
  if (/(\b(clement beong|nlgorilhm|unwcighlcd|detornunistic|irnplc~nentat|tlte|oonvett)\b)/i.test(text)) return true;
  // If options are missing or blank or say "N/A"
  if (!q.options || q.options.length < 2) return true;
  const blankOpts = q.options.filter(o => !o.text || o.text.trim() === "" || o.text.includes("N/A")).length;
  if (blankOpts >= 2) return true;
  return false;
}

const garbled = old.filter(isGarbled);
const clean = old.filter(q => !isGarbled(q));
console.log("Pre-2012 Total:", old.length, "Garbled:", garbled.length, "Clean:", clean.length);

clean.slice(0, 10).forEach(q => {
  console.log(`[${q.id}] ${q.question.substring(0, 80).replace(/\n/g, " ")}`);
});
