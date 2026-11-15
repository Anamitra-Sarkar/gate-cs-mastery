const fs = require("fs");
const path = require("path");

const masterPath = path.join(__dirname, "../data/gate_master_questions.json");
const data = JSON.parse(fs.readFileSync(masterPath, "utf8"));

// Let us inspect the exact text of DA questions that have math notation
const targetIds = [
  "GATE_2025_DA_Q22_3173",
  "GATE_2025_DA_Q19_2695",
  "GATE_2025_DA_Q39_1508",
  "GATE_2025_DA_Q53_0289",
  "GATE_2025_DA_Q12_1868",
  "GATE_2025_DA_Q13_3512",
  "GATE_2025_DA_Q14_5353",
  "GATE_2025_DA_Q28_7346",
  "GATE_2025_DA_Q30_6754",
  "GATE_2025_DA_Q32_5845",
  "GATE_2025_DA_Q37_9413",
  "GATE_2025_DA_Q38_3143",
  "GATE_2025_DA_Q40_6286",
  "GATE_2025_DA_Q41_9400",
  "GATE_2025_DA_Q48_5126",
  "GATE_2025_DA_Q49_1361",
  "GATE_2025_DA_Q50_5704",
  "GATE_2025_DA_Q51_8907",
  "GATE_2025_DA_Q52_2009",
  "GATE_2025_DA_Q55_2654",
  "GATE_2025_DA_Q59_7396",
  "GATE_2025_DA_Q60_5584",
  "GATE_2024_DA_Q15_1000",
  "GATE_2024_DA_Q22_8163",
  "GATE_2024_DA_Q37_7537",
  "GATE_2024_DA_Q43_9339",
  "GATE_2024_DA_Q47_8062",
  "GATE_2024_DA_Q48_9369",
  "GATE_2024_DA_Q49_2934",
  "GATE_2013_CS_Q22_5787"
];

const found = data.filter(q => targetIds.includes(q.id));
found.forEach(q => {
  console.log("==========================================");
  console.log("ID:", q.id);
  console.log("QUESTION:\n" + q.question);
  console.log("OPTIONS:\n" + JSON.stringify(q.options, null, 2));
});
