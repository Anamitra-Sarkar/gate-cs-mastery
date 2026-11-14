import fitz, re, os, glob, json

def clean_txt(t):
    return re.sub(r'[ \t]+', ' ', t).strip()

def extract_2024_cs():
    doc = fitz.open('/home/anamitra/GATE_Papers/2024_[CS]_Paper_2024_Set_1_Paper.pdf')
    full_text = ''
    for p in doc:
        full_text += p.get_text() + '\n---PAGE---\n'
    
    # Split by Q.<num>
    pattern = re.compile(r'\nQ\.(\d+)\s*\n')
    parts = pattern.split(full_text)
    print("Parts length:", len(parts))
    qs = []
    for i in range(1, len(parts), 2):
        q_num = int(parts[i])
        raw_body = parts[i+1].split('---PAGE---')[0].strip()
        qs.append((q_num, raw_body))
    return qs

if __name__ == '__main__':
    qs = extract_2024_cs()
    print(f"Extracted {len(qs)} questions from 2024 CS Set 1")
    for q_num, body in qs[:3]:
        print(f"Q{q_num}: {body[:150]}...")
