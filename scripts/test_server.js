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
assert(questions.length >= 600, 'Must have at least 600 questions');

// Verify question schema
let checked = 0;
for (const q of questions) {
  assert(q.id, 'Question must have id');
  assert(q.subject, `Question ${q.id} must have subject`);
  assert(q.topic, `Question ${q.id} must have topic`);
  assert(q.question, `Question ${q.id} must have text`);
  assert(q.answer !== undefined, `Question ${q.id} must have answer`);
  assert(q.explanation, `Question ${q.id} must have explanation`);
  assert(q.hint, `Question ${q.id} must have hint`);
  checked++;
}
console.log(`[PASS] Verified strict schema on all ${checked} questions.`);

// 2. Start server and run HTTP API Tests
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

    console.log('\n🌟 ALL 10 TEST SUITES PASSED FLAWLESSLY! 🌟\n');
    process.exit(0);
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exit(1);
  }
}

runTests();
