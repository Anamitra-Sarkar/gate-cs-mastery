const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load Groq API key
let GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const keyPath = '/home/anamitra/Downloads/API_Keys_and_Secrets/groq_api.txt';
if (!GROQ_API_KEY && fs.existsSync(keyPath)) {
  GROQ_API_KEY = fs.readFileSync(keyPath, 'utf8').trim();
}

// Load Question Bank and Topics
const DATA_DIR = path.join(__dirname, '..', 'data');
const questionsFile = path.join(DATA_DIR, 'gate_master_questions.json');
const topicsFile = path.join(DATA_DIR, 'topics.json');

let questions = [];
let topics = {};

try {
  questions = require('../data/gate_master_questions.json');
  console.log(`Loaded ${questions.length} questions via require.`);
} catch (e1) {
  try {
    if (fs.existsSync(questionsFile)) {
      questions = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));
      console.log(`Loaded ${questions.length} questions via fs.`);
    }
  } catch (err) {
    console.error('Error reading questions:', err);
  }
}

try {
  topics = require('../data/topics.json');
  console.log(`Loaded ${Object.keys(topics).length} topics via require.`);
} catch (e2) {
  try {
    if (fs.existsSync(topicsFile)) {
      topics = JSON.parse(fs.readFileSync(topicsFile, 'utf8'));
      console.log(`Loaded ${Object.keys(topics).length} topics via fs.`);
    }
  } catch (err) {
    console.error('Error reading topics:', err);
  }
}

// In-memory / persistent user state
const statsFile = path.join(DATA_DIR, 'user_stats.json');
let userStats = {
  xp: 140,
  streak: 3,
  level: 2,
  totalAttempted: 14,
  totalCorrect: 12,
  subjectStats: {},
  attempts: {},
  bookmarks: []
};

if (fs.existsSync(statsFile)) {
  try {
    userStats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  } catch (e) {}
}

function saveStats() {
  try {
    fs.writeFileSync(statsFile, JSON.stringify(userStats, null, 2), 'utf8');
  } catch (e) {}
}

// API Routes
app.get('/api/topics', (req, res) => {
  res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  // Enhance topics with user progress
  const enriched = {};
  for (const [subj, data] of Object.entries(topics)) {
    const attemptedInSubj = userStats.subjectStats[subj]?.attempted || 0;
    const correctInSubj = userStats.subjectStats[subj]?.correct || 0;
    enriched[subj] = {
      ...data,
      attempted: attemptedInSubj,
      correct: correctInSubj,
      mastery: data.total > 0 ? Math.round((correctInSubj / data.total) * 100) : 0
    };
  }
  res.json(enriched);
});

app.get('/api/questions', (req, res) => {
  res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
  const { subject, subtopic, difficulty, type, year, search, limit = 50, page = 1, random } = req.query;
  
  let filtered = [...questions];

  if (subject && subject !== 'All') {
    filtered = filtered.filter(q => q.subject === subject);
  }
  if (subtopic && subtopic !== 'All') {
    filtered = filtered.filter(q => q.topic === subtopic);
  }
  if (difficulty && difficulty !== 'All') {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }
  if (type && type !== 'All') {
    filtered = filtered.filter(q => q.type === type);
  }
  if (year && year !== 'All') {
    filtered = filtered.filter(q => String(q.year) === String(year));
  }
  if (search) {
    const qLower = search.toLowerCase();
    filtered = filtered.filter(q => 
      q.question.toLowerCase().includes(qLower) || 
      q.topic.toLowerCase().includes(qLower) ||
      q.id.toLowerCase().includes(qLower)
    );
  }

  if (random === 'true') {
    // Fisher-Yates shuffle
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }
  }

  const l = parseInt(limit, 10);
  const p = parseInt(page, 10);
  const total = filtered.length;
  const start = (p - 1) * l;
  const paginated = filtered.slice(start, start + l);

  res.json({
    total,
    page: p,
    limit: l,
    totalPages: Math.ceil(total / l),
    questions: paginated
  });
});

app.get('/api/questions/:id', (req, res) => {
  const q = questions.find(item => item.id === req.params.id);
  if (!q) {
    return res.status(404).json({ error: 'Question not found' });
  }
  res.json(q);
});

app.get('/api/stats', (req, res) => {
  res.json(userStats);
});

app.post('/api/stats/reset', (req, res) => {
  userStats = {
    xp: 0,
    streak: 1,
    level: 1,
    totalAttempted: 0,
    totalCorrect: 0,
    subjectStats: {},
    attempts: {},
    bookmarks: []
  };
  saveStats();
  res.json(userStats);
});

app.post('/api/stats/attempt', (req, res) => {
  const { questionId, selected, isCorrect, timeSpent } = req.body;
  const q = questions.find(item => item.id === questionId);
  if (!q) return res.status(400).json({ error: 'Question missing' });

  userStats.totalAttempted += 1;
  if (isCorrect) {
    userStats.totalCorrect += 1;
    userStats.xp += (q.marks || 1) * 10;
  }
  
  // Level threshold: Level N = N * 100 XP
  userStats.level = Math.max(1, Math.floor(userStats.xp / 100) + 1);

  if (!userStats.subjectStats[q.subject]) {
    userStats.subjectStats[q.subject] = { attempted: 0, correct: 0 };
  }
  userStats.subjectStats[q.subject].attempted += 1;
  if (isCorrect) {
    userStats.subjectStats[q.subject].correct += 1;
  }

  userStats.attempts[questionId] = {
    selected,
    isCorrect,
    timeSpent,
    timestamp: Date.now()
  };

  saveStats();
  res.json(userStats);
});

app.post('/api/bookmarks/toggle', (req, res) => {
  const { questionId } = req.body;
  if (!userStats.bookmarks) userStats.bookmarks = [];
  const idx = userStats.bookmarks.indexOf(questionId);
  if (idx >= 0) {
    userStats.bookmarks.splice(idx, 1);
  } else {
    userStats.bookmarks.push(questionId);
  }
  saveStats();
  res.json({ bookmarks: userStats.bookmarks });
});

// Dynamic Groq Models Discovery
app.get('/api/ai/models', (req, res) => {
  if (!GROQ_API_KEY) {
    return res.json({
      active: 'openai/gpt-oss-120b',
      available: ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b']
    });
  }

  const options = {
    hostname: 'api.groq.com',
    port: 443,
    path: '/openai/v1/models',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'User-Agent': 'GATE-Mastery-App/1.0'
    }
  };

  const groqReq = https.request(options, (groqRes) => {
    let data = '';
    groqRes.on('data', chunk => data += chunk);
    groqRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        const models = (parsed.data || [])
          .map(m => m.id)
          .filter(id => {
            const lower = id.toLowerCase();
            if (lower.includes('whisper') || lower.includes('guard') || lower.includes('tts') || lower.includes('embed') || lower.includes('arabic') || lower.includes('allam')) {
              return false;
            }
            return lower.includes('gpt-oss') || lower.includes('llama') || lower.includes('qwen') || lower.includes('deepseek') || lower.includes('gemma') || lower.includes('mixtral');
          });
        
        const preferred = models.find(m => m.includes('120b')) || models.find(m => m.includes('llama-3.3-70b')) || models.find(m => m.includes('qwen')) || models[0] || 'openai/gpt-oss-120b';
        res.json({
          active: preferred,
          available: models.length ? models : ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b']
        });
      } catch (err) {
        res.json({
          active: 'openai/gpt-oss-120b',
          available: ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b']
        });
      }
    });
  });

  groqReq.on('error', (e) => {
    res.json({
      active: 'openai/gpt-oss-120b',
      available: ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b']
    });
  });
  groqReq.end();
});

// AI Tutor Chat Endpoint
app.post('/api/ai/chat', (req, res) => {
  const { prompt, questionContext, model = 'openai/gpt-oss-120b', history = [] } = req.body;

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'Groq API Key not configured' });
  }

  const systemMessage = {
    role: 'system',
    content: `You are an elite GATE (Graduate Aptitude Test in Engineering) Computer Science & Data Science Master Tutor.
You teach with exceptional pedagogical clarity, first-principles logic, mathematical rigor, and step-by-step clarity.
Always format mathematical equations and formulas using standard LaTeX delimiters:
- For standalone display equations, wrap in $$ ... $$ (e.g., $$\\lim_{t \\to \\infty} \\frac{\\sqrt{t^2+t}-t}{1} = \\frac{1}{2}$$).
- For inline formulas, wrap in $ ... $ (e.g., $\\frac{a}{b}$, $\\sqrt{x}$, $O(n \\log n)$, $\\Sigma = \\{0, 1\\}$, $\\det(A)$).
- Always enclose fractions (\\frac{...}{...}), square roots (\\sqrt{...}), and mathematical expressions in LaTeX dollar delimiters ($...$ or $$...$$) so they render beautifully.
- Complete your derivations and answers fully; never truncate or stop mid-derivation.
If the student asks for a hint, provide an intuitive clue without giving away the full final option right away.
Explain why incorrect distractors fail when asked.
Keep responses structured, engaging, and directly helpful for scoring AIR 1.`
  };

  const messages = [systemMessage];

  if (questionContext) {
    messages.push({
      role: 'system',
      content: `CURRENT GATE QUESTION CONTEXT:
ID: ${questionContext.id}
Subject: ${questionContext.subject} (${questionContext.topic})
Question: ${questionContext.question}
Options: ${JSON.stringify(questionContext.options || [])}
Official Answer: ${questionContext.answer}
Official Explanation: ${questionContext.explanation || 'N/A'}`
    });
  }

  // Append history
  for (const h of history.slice(-6)) {
    messages.push(h);
  }

  messages.push({ role: 'user', content: prompt });

  const payload = JSON.stringify({
    model: model || 'openai/gpt-oss-120b',
    messages,
    max_tokens: 4096,
    temperature: 0.6
  });

  const options = {
    hostname: 'api.groq.com',
    port: 443,
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'User-Agent': 'GATE-Mastery-App/1.0'
    }
  };

  const groqReq = https.request(options, (groqRes) => {
    let data = '';
    groqRes.on('data', chunk => data += chunk);
    groqRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          return res.status(400).json({ error: parsed.error.message || 'Groq error' });
        }
        const reply = parsed.choices?.[0]?.message?.content || parsed.choices?.[0]?.message?.reasoning || 'No response generated.';
        res.json({ reply, model });
      } catch (err) {
        res.status(500).json({ error: 'Failed to parse Groq response' });
      }
    });
  });

  groqReq.on('error', (e) => {
    res.status(500).json({ error: e.message || 'Groq connection failed' });
  });

  groqReq.write(payload);
  groqReq.end();
});

// Serve frontend in production
const distPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`GATE CS Mastery Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
