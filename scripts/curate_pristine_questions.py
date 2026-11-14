#!/usr/bin/env python3
"""
Curate pristine questions and clean statements:
1. Strips leading instruction headers ('– Q.5 Carry ONE mark Each', etc.)
2. Filters out corrupted legacy OCR fragments
3. Ensures clean options for MCQs/MSQs
4. Sorts modern-first (2025 -> 2024 -> 2023 -> ... -> 1991)
5. Recomputes topic metrics in data/topics.json
"""

import json
import re

DATA_FILE = '/home/anamitra/gate-cs-mastery/data/gate_master_questions.json'
TOPICS_FILE = '/home/anamitra/gate-cs-mastery/data/topics.json'

def clean_stmt(text):
    if not text:
        return ""
    text = re.sub(r'^\s*[-–—]?\s*Q\.?\s*\d+\s*(to\s*Q\.?\s*\d+)?\s*(carry|carries)\s+.*?\n+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^\s*Question\s+Number\s*:\s*\d+\s*(Question\s+Type\s*:\s*[A-Z]+)?\s*\n+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^\s*Correct\s*:\s*\d+\s*Wrong\s*:\s*[-0-9.]+\s*\n+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^\s*to\s*Q\.?\s*\d+\s*(carry|carries)\s+.*?\n+', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^\s*[-–—]?\s*Q\.?\s*\d+\s*[-–—]?\s*\n+', '', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

bad_substrings = [
    '!•', 'quel;twns', 'no11e ofote', 'd1e pol~nomial', 'l££', 'iy.ef',
    'conuoo&lng', '·\'bacl', 'suppqsil', 'ul!!ebrruu', 'jx\'icii', 'lonlildcr',
    'standat\'d', 'jlecilles', 'f:•t', 'llo.at te n.o.t', 'whnt , 1h',
    '!\•latch', 'd1e pol', 'SuppQSil', '!\•'
]

def main():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        questions = json.load(f)

    print(f"Loaded {len(questions)} questions. Cleaning and filtering...")

    curated = []
    dropped = 0

    for q in questions:
        text = clean_stmt(q.get('question', ''))
        if len(text) < 25:
            dropped += 1
            continue

        low = text.lower()
        if any(b.lower() in low for b in bad_substrings):
            dropped += 1
            continue

        # Clean characters ratio
        clean_chars = sum(1 for c in text if c.isalnum() or c in ' .,?!;:()[]{}+-*/=_^$<>%₹#@&\'\"\\/\n')
        if clean_chars / len(text) < 0.85:
            dropped += 1
            continue

        q['question'] = text

        # Clean options for MCQ
        opts = q.get('options', [])
        if q.get('type') == 'MCQ':
            if len(opts) < 2:
                dropped += 1
                continue
            valid_opts = []
            skip = False
            for opt in opts:
                ot = opt.get('text', '').strip()
                if not ot or any(b.lower() in ot.lower() for b in bad_substrings):
                    skip = True
                    break
                ot = re.sub(r'^\s*\(?[A-D]\)?[\s.:\-]+', '', ot).strip()
                valid_opts.append({'label': opt['label'], 'text': ot})
            if skip:
                dropped += 1
                continue
            q['options'] = valid_opts

        curated.append(q)

    # Sort modern first: year descending (2025 -> 1991), then q_no
    def get_sort_key(item):
        yr = item.get('year', 0)
        try:
            qno = int(item.get('q_no', 999))
        except:
            qno = 999
        return (-yr, qno)

    curated.sort(key=get_sort_key)

    # Recompute topic metrics
    topics = {}
    for q in curated:
        subj = q.get('subject', 'General Aptitude')
        topic = q.get('topic', 'General Aptitude')
        if subj not in topics:
            topics[subj] = {'total': 0, 'subtopics': {}}
        topics[subj]['total'] += 1
        topics[subj]['subtopics'][topic] = topics[subj]['subtopics'].get(topic, 0) + 1

    # Save cleaned questions
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(curated, f, indent=2, ensure_ascii=False)

    # Save topics
    with open(TOPICS_FILE, 'w', encoding='utf-8') as f:
        json.dump(topics, f, indent=2, ensure_ascii=False)

    print(f"Dropped {dropped} unreadable / corrupt questions. Retained {len(curated)} pristine questions.")
    print(f"Successfully saved {len(curated)} modern-first questions to {DATA_FILE}")
    print(f"Updated {len(topics)} subjects in {TOPICS_FILE}")

if __name__ == '__main__':
    main()
