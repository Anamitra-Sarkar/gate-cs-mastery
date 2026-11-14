import re
from test_parse import extract_2024_cs

def parse_options_and_statement(body):
    # Search for (A) ... (B) ... (C) ... (D) ...
    # Sometimes options are (A) (B) (C) (D)
    opt_pattern = re.compile(r'(?:^|\n)\s*\(([A-D])\)\s*', re.M)
    splits = opt_pattern.split(body)
    if len(splits) >= 9: # intro, A, textA, B, textB, C, textC, D, textD
        statement = splits[0].strip()
        options = {}
        for i in range(1, len(splits), 2):
            lbl = splits[i]
            txt = splits[i+1].strip()
            options[lbl] = txt
        return statement, options, "MCQ"
    else:
        # Check if NAT (no options)
        return body.strip(), {}, "NAT"

qs = extract_2024_cs()
for q_num, body in qs[:5]:
    stmt, opts, qtype = parse_options_and_statement(body)
    print(f"=== Q{q_num} [{qtype}] ===")
    print("Statement:", stmt[:80].replace('\n', ' '))
    for k, v in opts.items():
        print(f"  ({k}) {v[:40].replace(chr(10), ' ')}")
