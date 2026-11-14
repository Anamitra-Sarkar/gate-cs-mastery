#!/usr/bin/env python3
import json, re

MASTER_FILE = '/home/anamitra/gate-cs-mastery/data/gate_master_questions.json'

def make_svg_pie_chart(title, slices, colors=None):
    if not colors:
        colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']
    
    # SVG size 360x220
    cx, cy, r = 100, 110, 80
    total = sum(s[1] for s in slices)
    
    svg_paths = []
    import math
    current_angle = -math.pi / 2
    legend_items = []
    
    y_leg = 35
    for i, (label, val) in enumerate(slices):
        pct = val / total if total > 0 else 0
        angle = pct * 2 * math.pi
        
        x1 = cx + r * math.cos(current_angle)
        y1 = cy + r * math.sin(current_angle)
        x2 = cx + r * math.cos(current_angle + angle)
        y2 = cy + r * math.sin(current_angle + angle)
        
        large_arc = 1 if angle > math.pi else 0
        color = colors[i % len(colors)]
        
        # Pie slice
        path = f'<path d="M {cx} {cy} L {x1:.2f} {y1:.2f} A {r} {r} 0 {large_arc} 1 {x2:.2f} {y2:.2f} Z" fill="{color}" stroke="#ffffff" stroke-width="1.5" />'
        svg_paths.append(path)
        
        # Legend item
        leg = f'<g transform="translate(200, {y_leg})">' \
              f'<rect width="12" height="12" rx="3" fill="{color}" />' \
              f'<text x="18" y="10" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#334155">{label}: {val}%</text>' \
              f'</g>'
        legend_items.append(leg)
        y_leg += 26
        current_angle += angle

    return f'''<div class="my-3 flex justify-center">
<svg viewBox="0 0 380 220" class="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-sm">
  <text x="190" y="20" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="13" font-weight="bold" fill="#0f172a">{title}</text>
  {' '.join(svg_paths)}
  {' '.join(legend_items)}
</svg>
</div>'''

def make_svg_bar_chart(title, x_label, y_label, data):
    # data: list of (x_val, y_val)
    # Viewbox 380x210
    bars = []
    max_y = max(d[1] for d in data) * 1.2
    
    x_start = 60
    w_bar = 42
    gap = 28
    chart_h = 130
    y_base = 160
    
    for i, (xv, yv) in enumerate(data):
        bx = x_start + i * (w_bar + gap)
        bh = (yv / max_y) * chart_h
        by = y_base - bh
        bar_elem = f'<rect x="{bx}" y="{by:.1f}" width="{w_bar}" height="{bh:.1f}" rx="4" fill="#3b82f6" stroke="#2563eb" stroke-width="1" />' \
                   f'<text x="{bx + w_bar/2}" y="{by - 6:.1f}" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="bold" fill="#1e293b">{yv}</text>' \
                   f'<text x="{bx + w_bar/2}" y="{y_base + 16}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#475569">{xv}</text>'
        bars.append(bar_elem)
        
    return f'''<div class="my-3 flex justify-center">
<svg viewBox="0 0 380 210" class="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-sm">
  <text x="190" y="18" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="13" font-weight="bold" fill="#0f172a">{title}</text>
  <!-- Axes -->
  <line x1="45" y1="{y_base}" x2="350" y2="{y_base}" stroke="#94a3b8" stroke-width="1.5" />
  <line x1="45" y1="35" x2="45" y2="{y_base}" stroke="#94a3b8" stroke-width="1.5" />
  <text x="190" y="{y_base + 34}" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#64748b">{x_label}</text>
  <text x="18" y="95" text-anchor="middle" transform="rotate(-90 18,95)" font-family="Inter, sans-serif" font-size="10" fill="#64748b">{y_label}</text>
  {' '.join(bars)}
</svg>
</div>'''

def make_svg_campus_map():
    return '''<div class="my-3 flex justify-center">
<svg viewBox="0 0 460 270" class="w-full max-w-lg bg-[#f8fafc] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm">
  <!-- Title & Compass -->
  <text x="230" y="20" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="13" font-weight="bold" fill="#0f172a">Campus Location Map</text>
  
  <!-- Compass Rose -->
  <g transform="translate(415, 35)">
    <circle cx="0" cy="0" r="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
    <path d="M 0 -13 L 4 0 L 0 3 L -4 0 Z" fill="#ef4444" />
    <path d="M 0 13 L 4 0 L 0 -3 L -4 0 Z" fill="#94a3b8" />
    <text x="0" y="-18" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" font-weight="bold" fill="#0f172a">N</text>
    <text x="19" y="3" text-anchor="start" font-family="Inter, sans-serif" font-size="9" font-weight="bold" fill="#64748b">E</text>
    <text x="0" y="26" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" font-weight="bold" fill="#64748b">S</text>
    <text x="-21" y="3" text-anchor="end" font-family="Inter, sans-serif" font-size="9" font-weight="bold" fill="#64748b">W</text>
  </g>

  <!-- Roads -->
  <!-- 1st Main Road (Horizontal) -->
  <rect x="25" y="115" width="410" height="24" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1" />
  <text x="230" y="131" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#475569">1st Main Road</text>

  <!-- 5th Cross Road (Vertical) -->
  <rect x="200" y="35" width="24" height="215" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1" />
  <text x="212" y="180" text-anchor="middle" transform="rotate(-90 212,180)" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#475569">5th Cross Road</text>

  <!-- Buildings Northwest -->
  <g transform="translate(40, 45)">
    <rect width="68" height="32" rx="4" fill="#dbeafe" stroke="#3b82f6" stroke-width="1" />
    <text x="34" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="bold" fill="#1e40af">Physics Lab</text>
  </g>
  <g transform="translate(118, 45)">
    <rect width="72" height="32" rx="4" fill="#e0e7ff" stroke="#6366f1" stroke-width="1" />
    <text x="36" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="bold" fill="#3730a3">Chem Lab</text>
  </g>

  <!-- Buildings Northeast -->
  <g transform="translate(235, 45)">
    <rect width="65" height="32" rx="4" fill="#fef3c7" stroke="#f59e0b" stroke-width="1" />
    <text x="32" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="bold" fill="#92400e">Library</text>
  </g>
  <g transform="translate(310, 45)">
    <rect width="65" height="32" rx="4" fill="#fee2e2" stroke="#ef4444" stroke-width="1" />
    <text x="32" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="bold" fill="#991b1b">Hospital</text>
  </g>

  <!-- Buildings Southwest -->
  <g transform="translate(50, 160)">
    <rect width="70" height="32" rx="4" fill="#f3e8ff" stroke="#a855f7" stroke-width="1" />
    <text x="35" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="bold" fill="#6b21a8">Hostels</text>
  </g>
  <g transform="translate(125, 160)">
    <rect width="65" height="32" rx="4" fill="#dcfce7" stroke="#22c55e" stroke-width="1" />
    <text x="32" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="bold" fill="#166534">Canteen</text>
  </g>

  <!-- Buildings Southeast -->
  <g transform="translate(240, 160)">
    <rect width="80" height="32" rx="4" fill="#ecfdf5" stroke="#10b981" stroke-width="1" />
    <text x="40" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="bold" fill="#065f46">Classrooms</text>
  </g>
</svg>
</div>'''

def make_svg_triangle_parallel():
    return '''<div class="my-3 flex justify-center">
<svg viewBox="0 0 340 210" class="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-sm">
  <text x="170" y="20" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="13" font-weight="bold" fill="#0f172a">Geometry: Parallel Lines in Triangle</text>
  
  <!-- Main Triangle PQR -->
  <!-- P at (170, 35), Q at (50, 185), R at (290, 185) -->
  <polygon points="170,35 50,185 290,185" fill="none" stroke="#0f172a" stroke-width="2" />
  
  <!-- Parallel line ST: mid distance to QR => S at (110, 110), T at (230, 110) -->
  <line x1="110" y1="110" x2="230" y2="110" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="none" />
  
  <!-- Shaded Triangle PST -->
  <polygon points="170,35 110,110 230,110" fill="rgba(37, 99, 235, 0.12)" />
  <!-- Shaded Trapezium SQRT -->
  <polygon points="110,110 50,185 290,185 230,110" fill="rgba(245, 158, 11, 0.15)" />
  
  <!-- Points & Labels -->
  <text x="170" y="30" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">P</text>
  <text x="42" y="195" text-anchor="end" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">Q</text>
  <text x="298" y="195" text-anchor="start" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">R</text>
  <text x="100" y="112" text-anchor="end" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#2563eb">S</text>
  <text x="240" y="112" text-anchor="start" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#2563eb">T</text>
  
  <!-- Parallel arrows -->
  <text x="170" y="105" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="bold" fill="#2563eb">ST ∥ QR</text>
  <text x="170" y="150" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-style="italic" fill="#64748b">Trapezium SQRT</text>
</svg>
</div>'''

def make_svg_queue_list():
    return '''<div class="my-3 flex justify-center">
<svg viewBox="0 0 420 120" class="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-sm">
  <text x="210" y="18" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="12" font-weight="bold" fill="#0f172a">Singly Linked List Queue with Head and Tail Pointers</text>
  
  <!-- Head Pointer -->
  <rect x="25" y="45" width="45" height="28" rx="4" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5" />
  <text x="47" y="62" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="bold" fill="#92400e">head</text>
  <line x1="70" y1="59" x2="95" y2="59" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)" />
  
  <!-- Node 1 -->
  <rect x="100" y="42" width="42" height="34" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
  <rect x="142" y="42" width="22" height="34" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5" />
  <line x1="164" y1="59" x2="190" y2="59" stroke="#3b82f6" stroke-width="1.5" />
  <circle cx="153" cy="59" r="3" fill="#1e40af" />
  
  <!-- Ellipsis Nodes -->
  <text x="208" y="63" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#64748b">• • •</text>
  
  <!-- Node n -->
  <line x1="225" y1="59" x2="250" y2="59" stroke="#3b82f6" stroke-width="1.5" />
  <rect x="255" y="42" width="42" height="34" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
  <rect x="297" y="42" width="22" height="34" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5" />
  <line x1="297" y1="42" x2="319" y2="76" stroke="#94a3b8" stroke-width="1.5" /> <!-- NULL slash -->
  
  <!-- Tail Pointer -->
  <rect x="345" y="45" width="45" height="28" rx="4" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5" />
  <text x="367" y="62" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="bold" fill="#991b1b">tail</text>
  <line x1="345" y1="59" x2="322" y2="59" stroke="#ef4444" stroke-width="2" />
</svg>
</div>'''

def clean_option_text(text):
    if not text:
        return ''
    t = text.strip()
    
    # 1. Strip PDF headers / footers
    t = re.sub(r'Data Science\s*(?:&|and)\s*Arti[fﬁ]cial Intelligence\s*(?:\(DA\)|-\s*DA)', '', t, flags=re.IGNORECASE)
    t = re.sub(r'Computer Science and (?:Information Technology|Engineering)(?:\s*-\s*CS)?', '', t, flags=re.IGNORECASE)
    t = re.sub(r'CS01\s*\(GATE\s*\d{4}\)', '', t, flags=re.IGNORECASE)
    t = re.sub(r'CS\s*\n\s*\d+/\d+', '', t, flags=re.IGNORECASE)
    t = re.sub(r'END OF THE QUESTION PAPER', '', t, flags=re.IGNORECASE)
    t = re.sub(r'www\.examrace\.com', '', t, flags=re.IGNORECASE)
    t = re.sub(r'Choose\s+one\s+answer\s+from\s+the\s+4\s+options.*', '', t, flags=re.IGNORECASE | re.DOTALL)
    
    # 2. Check if text is a fraction like "1\n3" or "75\n216"
    m_frac = re.match(r'^([0-9]+)\s*\n\s*([0-9]+)$', t.strip())
    if m_frac:
        return f"{m_frac.group(1)}/{m_frac.group(2)}"
        
    m_frac2 = re.match(r'^([0-9]+)\s*\n\s*([0-9]+)\s*\n.*', t.strip(), flags=re.DOTALL)
    if m_frac2 and len(m_frac2.group(1)) <= 3 and len(m_frac2.group(2)) <= 3:
        # Check if rest was a diagram
        return f"{m_frac2.group(1)}/{m_frac2.group(2)}"
        
    # 3. If there are double newlines separating an option from a figure/garbage block
    parts = re.split(r'\n\s*\n+', t)
    first_part = parts[0].strip()
    
    # Check if first part looks like a complete option statement
    if len(parts) > 1 and len(first_part) > 0:
        # If the trailing parts contain diagrams, map words, or exam headers
        trailing_text = ' '.join(parts[1:])
        diagram_keywords = ['road', 'garden', 'entrance', '5th cross', '1st main', 'number of shifts', 'carbohydrates', 'proteins', 'valid votes', 'turing machine', 'linked answer', 'common data', 'npc', 'head\ntail', 'head \ntail']
        if any(k in trailing_text.lower() for k in diagram_keywords):
            t = first_part
            
    # 4. Join line-wrapped words into a clean line
    lines = [l.strip() for l in t.split('\n') if l.strip()]
    if lines:
        t = ' '.join(lines)
        
    return t.strip()

def run():
    with open(MASTER_FILE, 'r') as f:
        questions = json.load(f)

    cleaned_questions = []
    fixed_diagrams = 0
    cleaned_options_count = 0
    removed_corrupted = 0

    for q in questions:
        qid = q['id']
        
        # 1. Filter out completely scrambled multi-column OCR token salad questions
        q_text = q.get('question', '')
        lines = [line.strip() for line in q_text.split('\n') if line.strip()]
        if len(lines) > 6 and all(len(l) < 18 for l in lines[:6]):
            removed_corrupted += 1
            continue
        if 'Four\nThe v\n' in q_text:
            removed_corrupted += 1
            continue
            
        # 2. Attach authentic SVG visualizers for questions with maps/figures
        if qid == 'GATE_2025_CS1_Q5_9500':
            q['visual'] = make_svg_campus_map()
            fixed_diagrams += 1
        elif qid == 'GATE_2025_CS1_Q7_0479':
            q['visual'] = make_svg_triangle_parallel()
            fixed_diagrams += 1
        elif qid == 'GATE_2025_DA_Q10_1497':
            q['visual'] = make_svg_bar_chart(
                "Number of Patients per Shift (X) Consulting Dr. Gita",
                "Number of Patients (X)",
                "Number of Shifts",
                [(5, 10), (6, 20), (7, 30), (8, 40)]
            )
            fixed_diagrams += 1
        elif qid == 'GATE_2024_CS1_Q8_3888':
            q['visual'] = make_svg_pie_chart(
                "Macronutrient Contribution (2000 kcal Diet)",
                [("Carbs", 35), ("Proteins", 20), ("Unsaturated Fat", 20), ("Saturated Fat", 20), ("Trans Fat", 5)]
            )
            fixed_diagrams += 1
        elif qid == 'GATE_2024_DA_Q5_2590':
            q['visual'] = make_svg_pie_chart(
                "Share of Valid Votes by Candidate",
                [("Candidate A", 40), ("Candidate B", 25), ("Candidate C", 20), ("Candidate D", 15)]
            )
            fixed_diagrams += 1
        elif qid == 'GATE_2018_CS_Q3_1550':
            q['visual'] = make_svg_queue_list()
            fixed_diagrams += 1

        # 3. Clean options
        if q.get('options'):
            for opt in q['options']:
                old_text = opt.get('text', '')
                new_text = clean_option_text(old_text)
                if new_text != old_text:
                    opt['text'] = new_text
                    cleaned_options_count += 1
                    
        cleaned_questions.append(q)

    print(f"Processed {len(questions)} questions.")
    print(f"Removed {removed_corrupted} scrambled OCR questions.")
    print(f"Attached {fixed_diagrams} authentic SVG diagrams/maps.")
    print(f"Cleaned {cleaned_options_count} option texts from leaked figure text and footers.")
    print(f"Final pristine question count: {len(cleaned_questions)}")

    with open(MASTER_FILE, 'w') as f:
        json.dump(cleaned_questions, f, indent=2)

if __name__ == '__main__':
    run()
