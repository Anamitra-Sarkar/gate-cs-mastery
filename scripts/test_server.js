const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING GATE CS MASTERY COMPREHENSIVE TEST SUITE ===');

// 1. Data Integrity Tests
const dataFile = path.join(__dirname, '..', 'data', 'gate_master_questions.json');
assert(fs.existsSync(dataFile), 'Questions data file must exist');

const questions = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
console.log(`[PASS] Loaded master question bank: ${questions.length} questions`);
assert(questions.length >= 1200, `Must have at least 1200 questions, found ${questions.length}`);

// Verify question schema
let checked = 0;
const yearsFound = new Set();
for (const q of questions) {
  assert(q.id, 'Question must have id');
  assert(q.subject, `Question ${q.id} must have subject`);
  assert(q.topic, `Question ${q.id} must have topic`);
  assert(q.question, `Question ${q.id} must have text`);
  assert(q.answer !== undefined, `Question ${q.id} must have answer`);
  assert(q.explanation, `Question ${q.id} must have explanation`);
  assert(q.hint, `Question ${q.id} must have hint`);
  if (q.year) yearsFound.add(q.year);
  checked++;
}
console.log(`[PASS] Verified strict schema on all ${checked} questions across ${yearsFound.size} exam years.`);

// 2. Unit Test: Evaluation Logic for MCQ, MSQ, and NAT
function evaluateGATEAnswer(userAns, officialAnswer, qType = 'MCQ') {
  if (!userAns && userAns !== 0) return false;
  const cleanUser = String(userAns).trim().toUpperCase();
  const cleanKey = String(officialAnswer).trim().toUpperCase();

  // 1. MSQ handling
  if (qType === 'MSQ' || cleanKey.includes(',')) {
    const userChoices = (Array.isArray(userAns) ? userAns : cleanUser.split(','))
      .map(s => String(s).trim().toUpperCase())
      .filter(Boolean);
    const keyChoices = cleanKey.split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);
    
    userChoices.sort();
    keyChoices.sort();
    return userChoices.length === keyChoices.length && 
           userChoices.every((val, idx) => val === keyChoices[idx]);
  }

  // 2. NAT handling
  if (qType === 'NAT' || (!cleanKey.match(/^[A-D]$/) && !cleanKey.includes(','))) {
    const rangeMatch = cleanKey.match(/([-+]?[0-9]*\.?[0-9]+)\s*(?:TO|to|–|-|:)\s*([-+]?[0-9]*\.?[0-9]+)/);
    const numUser = parseFloat(cleanUser);
    if (!isNaN(numUser)) {
      if (rangeMatch) {
        const minVal = parseFloat(rangeMatch[1]);
        const maxVal = parseFloat(rangeMatch[2]);
        if (!isNaN(minVal) && !isNaN(maxVal)) {
          return numUser >= Math.min(minVal, maxVal) && numUser <= Math.max(minVal, maxVal);
        }
      }
      const numKey = parseFloat(cleanKey);
      if (!isNaN(numKey)) {
        return Math.abs(numUser - numKey) <= 0.01;
      }
    }
  }

  // 3. Standard MCQ direct match
  return cleanUser === cleanKey;
}

// Unit test cases:
// A) MSQ multi-select
assert.strictEqual(evaluateGATEAnswer(['A', 'C'], 'A, C', 'MSQ'), true);
assert.strictEqual(evaluateGATEAnswer(['C', 'A'], 'A, C', 'MSQ'), true); // order independent
assert.strictEqual(evaluateGATEAnswer(['A'], 'A, C', 'MSQ'), false); // partial answer rejected
assert.strictEqual(evaluateGATEAnswer(['A', 'B', 'C'], 'A, C', 'MSQ'), false); // extra choice rejected
// B) NAT numerical tolerance & range
assert.strictEqual(evaluateGATEAnswer('29', '28 to 30', 'NAT'), true);
assert.strictEqual(evaluateGATEAnswer('28.0', '28 to 30', 'NAT'), true);
assert.strictEqual(evaluateGATEAnswer('31', '28 to 30', 'NAT'), false);
assert.strictEqual(evaluateGATEAnswer('5', '5.0', 'NAT'), true);
assert.strictEqual(evaluateGATEAnswer('0.5', '.50', 'NAT'), true);
// C) MCQ
assert.strictEqual(evaluateGATEAnswer('B', 'B', 'MCQ'), true);
assert.strictEqual(evaluateGATEAnswer('b', 'B', 'MCQ'), true);
assert.strictEqual(evaluateGATEAnswer('A', 'B', 'MCQ'), false);
console.log(`[PASS] Evaluator Unit Tests: MCQ, MSQ multi-select, and NAT ranges pass.`);

// 3. Start server and run HTTP API Tests
const server = require('../server/index.js');

function req(method, pathUrl, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: pathUrl,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    };

    const r = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}

async function runTests() {
  try {
    await new Promise(r => setTimeout(r, 1000));

    // Test GET /api/topics
    const topicsRes = await req('GET', '/api/topics');
    assert.strictEqual(topicsRes.status, 200);
    const topics = Object.keys(topicsRes.data);
    console.log(`[PASS] GET /api/topics returned ${topics.length} core CS subjects`);
    assert(topics.includes('Operating Systems'), 'Must contain Operating Systems');
    assert(topics.includes('Databases'), 'Must contain Databases');
    assert(topics.includes('Computer Networks'), 'Must contain Computer Networks');
    assert(topics.includes('Theory of Computation'), 'Must contain Theory of Computation');
    assert(topics.includes('Algorithms'), 'Must contain Algorithms');

    // Test GET /api/questions (paginated)
    const qRes = await req('GET', '/api/questions?limit=10&page=1');
    assert.strictEqual(qRes.status, 200);
    assert.strictEqual(qRes.data.questions.length, 10);
    console.log(`[PASS] GET /api/questions pagination: returned 10 of ${qRes.data.total}`);

    // Test GET /api/questions filtered by subject
    const osRes = await req('GET', '/api/questions?subject=Operating%20Systems');
    assert.strictEqual(osRes.status, 200);
    assert(osRes.data.questions.every(q => q.subject === 'Operating Systems'));
    console.log(`[PASS] GET /api/questions subject filter: returned ${osRes.data.total} OS questions`);

    // Test GET /api/questions filtered by Year
    const yRes = await req('GET', '/api/questions?year=2024');
    assert.strictEqual(yRes.status, 200);
    assert(yRes.data.questions.every(q => String(q.year) === '2024'));
    console.log(`[PASS] GET /api/questions year filter (2024): returned ${yRes.data.total} questions`);

    // Test GET /api/questions/:id
    const targetQ = qRes.data.questions[0];
    const singleQ = await req('GET', `/api/questions/${targetQ.id}`);
    assert.strictEqual(singleQ.status, 200);
    assert.strictEqual(singleQ.data.id, targetQ.id);
    console.log(`[PASS] GET /api/questions/:id for ${targetQ.id}`);

    // Test POST /api/stats/attempt
    const attemptRes = await req('POST', '/api/stats/attempt', {
      questionId: targetQ.id,
      selected: 'A',
      isCorrect: true,
      timeSpent: 12
    });
    assert.strictEqual(attemptRes.status, 200);
    assert(attemptRes.data.xp > 0, 'XP should have increased');
    console.log(`[PASS] POST /api/stats/attempt recorded attempt, XP: ${attemptRes.data.xp}`);

    // Test POST /api/bookmarks/toggle
    const testBookmarkId = `TEST_Q_${Date.now()}`;
    const bMarkRes1 = await req('POST', '/api/bookmarks/toggle', { questionId: testBookmarkId });
    assert.strictEqual(bMarkRes1.status, 200);
    assert(bMarkRes1.data.bookmarks.includes(testBookmarkId), 'Should add bookmark');
    const bMarkRes2 = await req('POST', '/api/bookmarks/toggle', { questionId: testBookmarkId });
    assert(!bMarkRes2.data.bookmarks.includes(testBookmarkId), 'Should toggle off bookmark');
    console.log(`[PASS] POST /api/bookmarks/toggle successfully toggles on/off`);

    // Test GET /api/ai/models
    const modelsRes = await req('GET', '/api/ai/models');
    assert.strictEqual(modelsRes.status, 200);
    assert(modelsRes.data.available.length > 0, 'Should return available models');
    console.log(`[PASS] GET /api/ai/models returned models: ${modelsRes.data.available.join(', ')}`);

    // Test POST /api/ai/chat
    const aiRes = await req('POST', '/api/ai/chat', {
      prompt: 'What is the difference between a mutex and a binary semaphore in 1 sentence?',
      model: modelsRes.data.active || 'qwen/qwen3.8-27b'
    });
    assert.strictEqual(aiRes.status, 200);
    assert(aiRes.data.reply && aiRes.data.reply.length > 10, 'Should return valid AI explanation');
    console.log(`[PASS] POST /api/ai/chat returned response (${aiRes.data.reply.length} chars)`);

    // Test Static Frontend Serving
    const htmlRes = await req('GET', '/');
    assert.strictEqual(htmlRes.status, 200);
    assert(htmlRes.raw.includes('<!doctype html>'), 'Root URL must serve built HTML client');
    console.log(`[PASS] GET / serves compiled client bundle`);

    console.log('\n🌟 ALL 12 TEST SUITES PASSED FLAWLESSLY! 🌟\n');
    process.exit(0);
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exit(1);
  }
}

runTests();
