import json
from classifier import classify_text

def reclassify_master():
    path = '/home/anamitra/gate-cs-mastery/data/gate_master_questions.json'
    with open(path, 'r', encoding='utf-8') as f:
        questions = json.load(f)
        
    for q in questions:
        if q['subject'] == 'Computer Science Core' or q['subject'] not in [
            'Operating Systems', 'Databases', 'Computer Networks', 'Theory of Computation',
            'Compiler Design', 'Algorithms', 'Programming & Data Structures',
            'Computer Organization & Architecture', 'Digital Logic', 'Discrete Mathematics',
            'Engineering Mathematics', 'General Aptitude', 'Data Science & AI'
        ]:
            new_sub, new_top = classify_text(q['question'])
            q['subject'] = new_sub
            q['topic'] = new_top
            
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
        
    topic_summary = {}
    for q in questions:
        sub = q['subject']
        top = q['topic']
        if sub not in topic_summary:
            topic_summary[sub] = {'total': 0, 'subtopics': {}}
        topic_summary[sub]['total'] += 1
        topic_summary[sub]['subtopics'][top] = topic_summary[sub]['subtopics'].get(top, 0) + 1
        
    with open('/home/anamitra/gate-cs-mastery/data/topics.json', 'w', encoding='utf-8') as f:
        json.dump(topic_summary, f, indent=2)
        
    print("Reclassification complete. Updated summary:")
    for k, v in topic_summary.items():
        print(f"  {k:<35}: {v['total']} questions")

if __name__ == '__main__':
    reclassify_master()
