import fitz, re, os, glob, json

def parse_paper_flexible(pdf_path):
    doc = fitz.open(pdf_path)
    full_text = '\n'.join([p.get_text() for p in doc])
    full_text = full_text.replace('\xa0', ' ')
    
    # Try different regex patterns for question markers
    patterns = [
        r'\n\s*Q\s*\.?\s*(\d+)\s*\n',
        r'\n\s*Question\s+Number\s*:\s*(\d+)',
        r'\n\s*Q\.No\.\s*(\d+)\s*\n',
        r'(?:^|\n)\s*(\d+)\.\s+[A-Z]'
    ]
    
    for pat in patterns:
        splits = re.split(pat, '\n' + full_text)
        if len(splits) >= 20: # At least 10 questions found
            qs = []
            for i in range(1, len(splits), 2):
                try:
                    q_num = int(splits[i])
                    body = splits[i+1].strip()
                    qs.append((q_num, body))
                except ValueError:
                    continue
            if len(qs) >= 15:
                return pat, qs
    return None, []

results = {}
for p in sorted(glob.glob('/home/anamitra/GATE_Papers/*Paper*.pdf')):
    if 'Keys' in p: continue
    base = os.path.basename(p)
    pat, qs = parse_paper_flexible(p)
    results[base] = len(qs)
    print(f"{base:<45} -> {len(qs)} questions (pattern: {pat})")

print(f"Total extracted across these papers: {sum(results.values())}")
