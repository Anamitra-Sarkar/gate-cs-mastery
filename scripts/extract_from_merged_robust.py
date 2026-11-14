import fitz, re, os, json
from classifier import classify_text
from comprehensive_extractor import clean_question_body, parse_options, generate_explanation_and_hint, build_svg_diagram

def extract_merged_all():
    master_path = '/home/anamitra/gate-cs-mastery/data/gate_master_questions.json'
    with open(master_path, 'r', encoding='utf-8') as f:
        existing = json.load(f)
        
    seen = {re.sub(r'\s+', '', q['question'][:90]) for q in existing}
    initial_count = len(existing)
    print(f"Starting with {initial_count} questions...")
    
    doc = fitz.open('/home/anamitra/GATE_Papers/GATE_Question_Papers_Yearwise_Merged.pdf')
    
    # Process page by page or block of text
    curr_year = 2000
    curr_sec = "CS"
    added = 0
    
    # Concatenate text with page boundaries
    full_pages = []
    for p_idx in range(len(doc)):
        txt = doc[p_idx].get_text().replace('\xa0', ' ')
        # Detect year
        ym = re.search(r'GATE\s*[-–]?\s*([12]\d{3})', txt, re.I)
        if ym:
            curr_year = int(ym.group(1))
            
        full_pages.append((p_idx + 1, curr_year, txt))
        
    # Split questions per page or across pages
    for p_num, yr, page_txt in full_pages:
        if len(page_txt.strip()) < 100: continue
        
        # Split on question markers
        # Try Strategy 1
        splits = re.split(r'\n\s*(?:Question\s+Number\s*:\s*|Q\s*\.?\s*|Q\.No\.\s*)(\d+)\s*(?:[.:\n]|\s)', '\n' + page_txt)
        if len(splits) < 3:
            # Try Strategy 2: \n 1. or \n1.
            splits = re.split(r'\n\s*(\d{1,2})\s*\.\s*(?=[A-Z0-9\(\"\'\n])', '\n' + page_txt)
            
        if len(splits) >= 3:
            for i in range(1, len(splits), 2):
                try:
                    qn = int(splits[i])
                    body = splits[i+1].strip()
                    cleaned = clean_question_body(body)
                    if len(cleaned) < 25: continue
                    
                    norm_k = re.sub(r'\s+', '', cleaned[:90])
                    if norm_k in seen:
                        continue
                    seen.add(norm_k)
                    
                    stmt, options, detected_type = parse_options(cleaned)
                    if len(stmt.strip()) < 15:
                        continue
                    ans = "A"
                    marks = 2 if qn > 35 else 1
                    
                    subject, subtopic = classify_text(stmt)
                    if qn <= 10 and yr >= 2011:
                        subject = "General Aptitude"
                        subtopic = "Verbal & Quantitative Aptitude"
                        
                    neg_marks = 0.33 if (marks == 1 and detected_type == "MCQ") else (0.66 if (marks == 2 and detected_type == "MCQ") else 0)
                    explanation, hint = generate_explanation_and_hint(subject, subtopic, stmt, ans, detected_type)
                    visual_svg = build_svg_diagram(subject, subtopic)
                    
                    difficulty = "Easy" if marks == 1 else "Medium"
                    if "Deadlocks" in subtopic or "Parsing" in subtopic or "Undecidability" in subtopic:
                        difficulty = "Hard"
                        
                    chash = abs(hash(norm_k)) % 10000
                    q_id = f"GATE_MERGED_{yr}_P{p_num}_Q{qn}_{chash:04d}"
                    
                    existing.append({
                        'id': q_id,
                        'year': yr,
                        'paper': f"GATE {yr} CS",
                        'q_no': qn,
                        'type': detected_type,
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
                    added += 1
                except Exception:
                    continue

    print(f"Extracted {added} new unique questions from merged PDF! Total now: {len(existing)}")
    
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
    extract_merged_all()
