#!/usr/bin/env python3
"""
Parses ALL official GATE answer key PDFs in /home/anamitra/GATE_Papers/
and synchronizes the exact official Answer Key, Question Type, and Marks
for all questions in gate_master_questions.json.
"""

import glob, os, pypdf, re, json

DATA_FILE = '/home/anamitra/gate-cs-mastery/data/gate_master_questions.json'

def parse_key_pdf(pdf_path):
    reader = pypdf.PdfReader(pdf_path)
    full_text = '\n'.join([p.extract_text() for p in reader.pages])
    lines = [l.strip() for l in full_text.split('\n') if l.strip()]
    entries = {}
    
    # Format 1: Single line table
    for line in lines:
        m = re.match(r'^(\d+)\s+(?:\d+\s+)?(MCQ|MSQ|NAT)\s+(?:GA|CS|DA|CS-1|CS-2|[A-Z0-9-]+)\s+(.+?)\s+([12](?:\.0)?)$', line, re.IGNORECASE)
        if m:
            qno = int(m.group(1))
            qtype = m.group(2).upper()
            key_raw = m.group(3).strip().replace(';', ', ')
            marks = float(m.group(4))
            entries[qno] = {'type': qtype, 'key': key_raw, 'marks': int(marks)}
            
    if len(entries) >= 50:
        return entries
        
    # Format 2: Token stream
    for i in range(len(lines)):
        val = lines[i].upper()
        if val in ['MCQ', 'MSQ', 'NAT']:
            try:
                qno = None
                for offset in [-2, -1]:
                    if lines[i+offset].isdigit():
                        candidate = int(lines[i+offset])
                        if 1 <= candidate <= 65:
                            qno = candidate
                            break
                if qno and i + 2 < len(lines):
                    key_val = lines[i+2].replace(';', ', ').strip()
                    marks_val = float(lines[i+3]) if (i+3 < len(lines) and lines[i+3].replace('.','',1).isdigit()) else 1
                    entries[qno] = {'type': val, 'key': key_val, 'marks': int(marks_val)}
            except Exception:
                pass

    return entries

def main():
    papers_dir = '/home/anamitra/GATE_Papers'
    key_files = sorted(glob.glob(f'{papers_dir}/*Key*.pdf') + glob.glob(f'{papers_dir}/*key*.pdf'))
    print(f"Found {len(key_files)} answer key PDFs. Parsing...")

    # Build master key dictionary: (year, set_label) -> { qno: {type, key, marks} }
    master_keys = {}

    for kf in key_files:
        basename = os.path.basename(kf)
        # Identify year
        ym = re.search(r'(20\d\d)', basename)
        if not ym:
            continue
        year = int(ym.group(1))

        # Identify set / subject
        set_id = 'default'
        low = basename.lower()
        if 'da' in low:
            set_id = 'DA'
        elif 'set_1' in low or 'set 1' in low or 'cs1' in low:
            set_id = 'CS1'
        elif 'set_2' in low or 'set 2' in low or 'cs2' in low:
            set_id = 'CS2'
        elif 'set_3' in low or 'set 3' in low or 'cs3' in low:
            set_id = 'CS3'
        else:
            set_id = 'CS'

        parsed = parse_key_pdf(kf)
        if parsed:
            master_keys[(year, set_id)] = parsed
            print(f"  Mapped ({year}, {set_id}): {len(parsed)} questions from {basename}")

    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        questions = json.load(f)

    updated_count = 0
    for q in questions:
        yr = q.get('year')
        try:
            qno = int(q.get('q_no', 0))
        except:
            continue

        paper_str = q.get('paper', '').upper()
        # Find matching key
        matched_dict = None
        for (y, s), kdict in master_keys.items():
            if y == yr:
                if s == 'DA' and 'DA' in paper_str:
                    matched_dict = kdict
                    break
                elif s == 'CS1' and ('CS1' in paper_str or 'SET_1' in paper_str or 'SET 1' in paper_str):
                    matched_dict = kdict
                    break
                elif s == 'CS2' and ('CS2' in paper_str or 'SET_2' in paper_str or 'SET 2' in paper_str):
                    matched_dict = kdict
                    break
                elif s == 'CS3' and ('CS3' in paper_str or 'SET_3' in paper_str or 'SET 3' in paper_str):
                    matched_dict = kdict
                    break
                elif s in ['CS', 'default'] and matched_dict is None:
                    matched_dict = kdict

        if matched_dict and qno in matched_dict:
            official = matched_dict[qno]
            old_ans = q.get('answer')
            q['answer'] = official['key']
            q['type'] = official['type']
            q['marks'] = official['marks']
            q['negative_marks'] = 0 if official['type'] in ['NAT', 'MSQ'] else (0.66 if official['marks'] == 2 else 0.33)
            
            # Update explanation answer string
            ans_str = f"Option ({official['key']})" if len(official['key']) == 1 and official['key'].isalpha() else official['key']
            q['explanation'] = re.sub(r'\*\*Official Verified Answer:\*\*.*$', f'**Official Verified Answer:** **{ans_str}**', q.get('explanation', ''), flags=re.DOTALL)
            updated_count += 1

    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)

    print(f"\nSuccessfully synchronized {updated_count} questions with official GATE keys in {DATA_FILE}!")

if __name__ == '__main__':
    main()
