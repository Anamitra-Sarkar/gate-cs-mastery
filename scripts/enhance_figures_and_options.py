#!/usr/bin/env python3
import json, re

MASTER_FILE = '/home/anamitra/gate-cs-mastery/data/gate_master_questions.json'

def get_venn_q4_svg():
    return '''<div class="my-4 flex justify-center">
<svg viewBox="0 0 420 230" class="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 shadow-sm">
  <text x="210" y="20" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="13" font-weight="bold" fill="#050811">Venn Diagram: Intersecting Shapes</text>
  
  <!-- Rectangle (Associated with 1) -->
  <rect x="50" y="65" width="195" height="120" rx="6" fill="rgba(37, 99, 235, 0.08)" stroke="#1d4ed8" stroke-width="2.5" />
  
  <!-- Triangle (Associated with 2) -->
  <polygon points="245,35 150,195 340,195" fill="rgba(217, 119, 6, 0.08)" stroke="#b45309" stroke-width="2.5" />
  
  <!-- Ellipse (Associated with 3) -->
  <ellipse cx="260" cy="135" rx="98" ry="58" fill="rgba(16, 185, 129, 0.08)" stroke="#047857" stroke-width="2.5" />
  
  <!-- Labels -->
  <!-- Only Rectangle: 1 -->
  <text x="95" y="125" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#1d4ed8">1</text>
  
  <!-- Only Triangle: 2 -->
  <text x="245" y="62" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#b45309">2</text>
  
  <!-- Only Ellipse: 3 -->
  <text x="325" y="135" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#047857">3</text>
  
  <!-- Rectangle & Ellipse only: 4 -->
  <text x="145" y="150" font-family="Inter, sans-serif" font-size="13" font-weight="bold" fill="#050811">4</text>
  
  <!-- Rectangle & Triangle only: R -->
  <text x="195" y="105" font-family="Inter, sans-serif" font-size="13" font-weight="bold" fill="#7c3aed">R</text>
  
  <!-- Triangle & Ellipse only: Q -->
  <text x="285" y="160" font-family="Inter, sans-serif" font-size="13" font-weight="bold" fill="#7c3aed">Q</text>
  
  <!-- All Three Intersecting: P -->
  <text x="230" y="138" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#dc2626">P</text>
  
  <!-- Legend -->
  <text x="210" y="218" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#475569">Rectangle = 1 | Triangle = 2 | Ellipse = 3</text>
</svg>
</div>'''

def get_pixel_grid_q3_svg():
    # 4x4 pixel matrix:
    # Row 0: 6, 7, 0, 2
    # Row 1: 4, 7, 3, 3
    # Row 2: 5, 1, 4, 4
    # Row 3: 6, 1, 3, 2
    grid = [
        [6, 7, 0, 2],
        [4, 7, 3, 3],
        [5, 1, 4, 4],
        [6, 1, 3, 2]
    ]
    cells = []
    x_start, y_start = 120, 35
    size = 40
    
    for r in range(4):
        for c in range(4):
            val = grid[r][c]
            is_le4 = val <= 4
            bg = "rgba(16, 185, 129, 0.15)" if is_le4 else "rgba(239, 68, 68, 0.08)"
            border = "#059669" if is_le4 else "#cbd5e1"
            txt_color = "#047857" if is_le4 else "#64748b"
            
            x = x_start + c * size
            y = y_start + r * size
            rect = f'<rect x="{x}" y="{y}" width="{size}" height="{size}" fill="{bg}" stroke="{border}" stroke-width="1.5" />'
            txt = f'<text x="{x + size/2}" y="{y + size/2 + 5}" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="bold" fill="{txt_color}">{val}</text>'
            cells.extend([rect, txt])
            
    return f'''<div class="my-4 flex justify-center">
<svg viewBox="0 0 400 230" class="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 shadow-sm">
  <text x="200" y="22" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="13" font-weight="bold" fill="#050811">4 × 4 Digital Image Pixel Intensities (U)</text>
  {' '.join(cells)}
  <text x="200" y="215" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#047857">Green highlighted cells indicate U ≤ 4 (Total = 11 pixels)</text>
</svg>
</div>'''

def get_dodecagon_q8_svg():
    return '''<div class="my-4 flex justify-center">
<svg viewBox="0 0 340 230" class="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-2 shadow-sm">
  <text x="170" y="20" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="13" font-weight="bold" fill="#050811">Regular Dodecagon Inscribed in Circle</text>
  <!-- Circle of radius 75 -->
  <circle cx="170" cy="120" r="75" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" />
  
  <!-- 12-sided regular polygon -->
  <!-- Vertices at angle i * 30 deg -->
  <polygon points="
    245,120 235,157 207,185 170,195 133,185 105,157 
    95,120 105,83 133,55 170,45 207,55 235,83
  " fill="rgba(59, 130, 246, 0.08)" stroke="#2563eb" stroke-width="2.5" />
  
  <!-- Radius line from center to vertex -->
  <line x1="170" y1="120" x2="245" y2="120" stroke="#dc2626" stroke-width="2" />
  <circle cx="170" cy="120" r="3" fill="#0f172a" />
  <text x="205" y="113" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#dc2626">radius r</text>
  
  <!-- Angle subtended at center = 360/12 = 30 deg -->
  <line x1="170" y1="120" x2="235" y2="157" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3 3" />
  <text x="195" y="136" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" font-weight="bold" fill="#dc2626">30°</text>
  
  <text x="170" y="218" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#475569">Side length s = 2r · sin(15°) = r√(2 - √3)</text>
</svg>
</div>'''

def get_router_fragmentation_q57_svg():
    return '''<div class="my-4 flex justify-center">
<svg viewBox="0 0 460 150" class="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 shadow-sm">
  <text x="230" y="20" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="13" font-weight="bold" fill="#050811">IPv4 Packet Fragmentation Network</text>
  
  <!-- Source -->
  <rect x="20" y="55" width="60" height="35" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2" />
  <text x="50" y="77" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#1e40af">Source</text>
  
  <!-- Link 1: MTU 5000 -->
  <line x1="80" y1="72" x2="140" y2="72" stroke="#64748b" stroke-width="2" />
  <text x="110" y="64" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="bold" fill="#475569">MTU 5000</text>
  
  <!-- Router 1 -->
  <circle cx="165" cy="72" r="22" fill="#fef3c7" stroke="#d97706" stroke-width="2" />
  <text x="165" y="76" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#92400e">R1</text>
  
  <!-- Link 2: MTU 3000 -->
  <line x1="187" y1="72" x2="265" y2="72" stroke="#64748b" stroke-width="2" />
  <text x="226" y="64" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="bold" fill="#475569">MTU 3000</text>
  
  <!-- Router 2 -->
  <circle cx="290" cy="72" r="22" fill="#fef3c7" stroke="#d97706" stroke-width="2" />
  <text x="290" y="76" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#92400e">R2</text>
  
  <!-- Link 3: MTU 1500 -->
  <line x1="312" y1="72" x2="375" y2="72" stroke="#64748b" stroke-width="2" />
  <text x="343" y="64" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="bold" fill="#475569">MTU 1500</text>
  
  <!-- Destination -->
  <rect x="375" y="55" width="65" height="35" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2" />
  <text x="407" y="77" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#1e40af">Dest</text>
  
  <text x="230" y="132" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#64748b">Message Size = 15,000 bytes (IP header = 20 bytes)</text>
</svg>
</div>'''

def get_kmap_q30_svg():
    return '''<div class="my-4 flex justify-center">
<svg viewBox="0 0 340 220" class="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-2 shadow-sm">
  <text x="170" y="20" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="13" font-weight="bold" fill="#050811">4-Variable Karnaugh Map (AB × CD)</text>
  
  <!-- K-Map Grid 4x4 -->
  <line x1="70" y1="50" x2="270" y2="50" stroke="#94a3b8" stroke-width="1.5" />
  <line x1="70" y1="90" x2="270" y2="90" stroke="#94a3b8" stroke-width="1.5" />
  <line x1="70" y1="130" x2="270" y2="130" stroke="#94a3b8" stroke-width="1.5" />
  <line x1="70" y1="170" x2="270" y2="170" stroke="#94a3b8" stroke-width="1.5" />
  <line x1="70" y1="210" x2="270" y2="210" stroke="#94a3b8" stroke-width="1.5" />
  
  <line x1="70" y1="50" x2="70" y2="210" stroke="#94a3b8" stroke-width="1.5" />
  <line x1="120" y1="50" x2="120" y2="210" stroke="#94a3b8" stroke-width="1.5" />
  <line x1="170" y1="50" x2="170" y2="210" stroke="#94a3b8" stroke-width="1.5" />
  <line x1="220" y1="50" x2="220" y2="210" stroke="#94a3b8" stroke-width="1.5" />
  <line x1="270" y1="50" x2="270" y2="210" stroke="#94a3b8" stroke-width="1.5" />
  
  <!-- Column Labels CD: 00, 01, 11, 10 -->
  <text x="95" y="42" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="bold" fill="#1e293b">00</text>
  <text x="145" y="42" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="bold" fill="#1e293b">01</text>
  <text x="195" y="42" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="bold" fill="#1e293b">11</text>
  <text x="245" y="42" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="bold" fill="#1e293b">10</text>
  <text x="45" y="42" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#3b82f6">CD →</text>
  
  <!-- Row Labels AB: 00, 01, 11, 10 -->
  <text x="50" y="75" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="bold" fill="#1e293b">00</text>
  <text x="50" y="115" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="bold" fill="#1e293b">01</text>
  <text x="50" y="155" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="bold" fill="#1e293b">11</text>
  <text x="50" y="195" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="bold" fill="#1e293b">10</text>
  
  <!-- Cell Values -->
  <text x="95" y="75" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#059669">X</text>
  <text x="145" y="75" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#64748b">0</text>
  <text x="195" y="75" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#059669">X</text>
  <text x="245" y="75" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#64748b">0</text>
  
  <text x="95" y="115" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#64748b">0</text>
  <text x="145" y="115" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#2563eb">1</text>
  <text x="195" y="115" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#2563eb">1</text>
  <text x="245" y="115" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#64748b">0</text>
  
  <text x="95" y="155" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#2563eb">1</text>
  <text x="145" y="155" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#2563eb">1</text>
  <text x="195" y="155" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#2563eb">1</text>
  <text x="245" y="155" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#2563eb">1</text>
  
  <text x="95" y="195" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#059669">X</text>
  <text x="145" y="195" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#059669">X</text>
  <text x="195" y="195" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#64748b">0</text>
  <text x="245" y="195" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#64748b">0</text>
</svg>
</div>'''

def run():
    with open(MASTER_FILE, 'r') as f:
        questions = json.load(f)

    fixed_visuals = 0
    cleaned_options = 0

    for q in questions:
        qid = q['id']

        # 1. GATE 2025 DA Q4: Venn diagram + clean Option D
        if qid == 'GATE_2025_DA_Q4_7029':
            q['visual'] = get_venn_q4_svg()
            fixed_visuals += 1
            for opt in q['options']:
                if opt['label'] == 'D':
                    opt['text'] = 'P = 5; Q = 3; R = 6'
                    cleaned_options += 1
                    
        # 2. GATE 2025 DA Q3: 4x4 digital image matrix
        elif qid == 'GATE_2025_DA_Q3_0270':
            q['visual'] = get_pixel_grid_q3_svg()
            fixed_visuals += 1
            
        # 3. GATE 2025 DA Q8: regular dodecagon
        elif qid == 'GATE_2025_DA_Q8_9796':
            q['visual'] = get_dodecagon_q8_svg()
            fixed_visuals += 1

        # 4. GATE 2025 CS1 Q57: IPv4 packet fragmentation
        elif qid == 'GATE_2025_CS1_Q57_8687':
            q['visual'] = get_router_fragmentation_q57_svg()
            fixed_visuals += 1

        # 5. GATE 2012 CS Q30: Karnaugh map
        elif qid == 'GATE_2012_CS_Q30_2345':
            q['visual'] = get_kmap_q30_svg()
            fixed_visuals += 1

        # General Option Cleaning for suspects
        if q.get('options'):
            for opt in q['options']:
                t = opt.get('text', '')
                
                # Check for '1 2 4 3 P Q R' or similar leaked sequence
                if '1 2 4 3 P Q R' in t:
                    opt['text'] = t.replace('1 2 4 3 P Q R', '').strip()
                    cleaned_options += 1
                    
                # Check for demux diagram leak in 2022 CS Q40
                if qid == 'GATE_2022_CS_Q40_9632' and opt['label'] == 'D':
                    opt['text'] = 'P is 1:10 de-multiplexer; Q is 1:5 de-multiplexer; T is 2:1 multiplexer'
                    cleaned_options += 1
                    
                # Check for geometry vertices leak in 2018 CS Q9
                if 'GATE_2018_CS_Q9' in qid or 'GATE_MERGED_2018_P390_Q9' in qid:
                    if opt['label'] == 'D' and 'A B D E C F' in t:
                        opt['text'] = '∠𝐶𝐵𝐴 + ∠𝐴𝐷𝐶'
                        cleaned_options += 1
                        
                # Check for CS Set A page footer in 2016 CS1 Q35
                if qid == 'GATE_2016_CS1_Q35_7615' and opt['label'] == 'D':
                    opt['text'] = '3 1 2 1 1 1 2'
                    cleaned_options += 1
                    
                # Check for relational table leak in 2012 CS Q43
                if qid == 'GATE_2012_CS_Q43_6580' and opt['label'] == 'D':
                    opt['text'] = '∏B(r1) - ∏C(r2) ≠ ∅'
                    cleaned_options += 1

                # Clean DA exam title
                if 'Data Science and Artificial Intelligence (DA)' in t:
                    opt['text'] = t.replace('Data Science and Artificial Intelligence (DA)', '').strip()
                    cleaned_options += 1

    print(f"Attached {fixed_visuals} custom authentic SVGs.")
    print(f"Cleaned {cleaned_options} options from trailing garbage.")

    with open(MASTER_FILE, 'w') as f:
        json.dump(questions, f, indent=2)

if __name__ == '__main__':
    run()
