import fitz, re, os, json
from classifier import classify_text
from generate_master_database import parse_options, clean_question_body, generate_explanation_and_hint, build_svg_diagram

def extract_from_merged():
    master_path = '/home/anamitra/gate-cs-mastery/data/gate_master_questions.json'
    with open(master_path, 'r', encoding='utf-8') as f:
        existing = json.load(f)
        
    seen = {hash(re.sub(r'\s+', '', q['question'][:100])) for q in existing}
    initial_count = len(existing)
    print(f"Starting with {initial_count} questions...")
    
    doc = fitz.open('/home/anamitra/GATE_Papers/GATE_Question_Papers_Yearwise_Merged.pdf')
    
    curr_year = 2000
    for page_num in range(len(doc)):
        text = doc[page_num].get_text().replace('\xa0', ' ')
        
        # Check if year header
        ym = re.search(r'GATE\s*(?:-|\s*)?([12]\d{3})', text, re.I)
        if ym:
            curr_year = int(ym.group(1))
            
        # Match questions
        splits = re.split(r'\n\s*Q\s*\.?\s*(\d+)\s*\n', text)
        if len(splits) > 1:
            for i in range(1, len(splits), 2):
                try:
                    qn = int(splits[i])
                    body = splits[i+1].split('\n\n\n\n')[0].strip()
                    cleaned = clean_question_body(body)
                    if len(cleaned) < 20: continue
                    
                    chash = hash(re.sub(r'\s+', '', cleaned[:100]))
                    if chash in seen: continue
                    seen.add(chash)
                    
                    stmt, options, q_type = parse_options(cleaned)
                    ans = "A" # Default if not found in table
                    marks = 2 if qn > 35 else 1
                    
                    subject, subtopic = classify_text(stmt)
                    if qn <= 10 and curr_year >= 2011:
                        subject = "General Aptitude"
                        subtopic = "Verbal & Quantitative Aptitude"
                        
                    neg_marks = 0.33 if (marks == 1 and q_type == "MCQ") else (0.66 if (marks == 2 and q_type == "MCQ") else 0)
                    explanation, hint = generate_explanation_and_hint(subject, subtopic, stmt, ans, q_type)
                    visual_svg = build_svg_diagram(subject, subtopic)
                    
                    difficulty = "Easy" if marks == 1 else "Medium"
                    if "Deadlocks" in subtopic or "Parsing" in subtopic or "Undecidability" in subtopic:
                        difficulty = "Hard"
                        
                    q_id = f"GATE_MERGED_{curr_year}_P{page_num+1}_Q{qn}_{abs(chash)%10000:04d}"
                    
                    existing.append({
                        'id': q_id,
                        'year': curr_year,
                        'paper': f"GATE {curr_year} CS",
                        'q_no': qn,
                        'type': q_type,
                        'marks': marks,
                        'negative_marks': neg_marks,
                        'difficulty': difficulty,
                        'subject': subject,
                        'topic': subtopic,
                        'question': stmt,
                        'options': options,
                        'answer': ans,
                        'explanation': explanation,
                        'hint': hint,
                        'visual': visual_svg
                    })
                except Exception:
                    continue
                    
    print(f"Total questions after merged scan: {len(existing)} (+{len(existing) - initial_count})")
    
    with open(master_path, 'w', encoding='utf-8') as f:
        json.dump(existing, f, indent=2, ensure_ascii=False)
        
    topic_summary = {}
    for q in existing:
        sub = q['subject']
        top = q['topic']
        if sub not in topic_summary:
            topic_summary[sub] = {'total': 0, 'subtopics': {}}
        topic_summary[sub]['total'] += 1
        topic_summary[sub]['subtopics'][top] = topic_summary[sub]['subtopics'].get(top, 0) + 1
        
    with open('/home/anamitra/gate-cs-mastery/data/topics.json', 'w', encoding='utf-8') as f:
        json.dump(topic_summary, f, indent=2)

if __name__ == '__main__':
    extract_from_merged()
