from pathlib import Path
import json
import re

path = Path('test-bank.html')
lines = path.read_text(encoding='utf-8').splitlines()

# Preserve current main as the authoritative source, then reapply PR 115's
# presentation changes without disturbing the broader Set 3 OCR cleanup.
css_hits = {'th': 0, 'td': 0, 'num': 0}
styled = []
for line in lines:
    stripped = line.strip()
    indent = line[:len(line) - len(line.lstrip())]
    if stripped.startswith('.tb-q-data-table th{') and ':last-child' not in stripped:
        css_hits['th'] += 1
        styled.append(indent + '.tb-q-data-table th{background:var(--card);color:var(--ink);font-weight:700;text-align:center;padding:9px 12px;border-bottom:2px solid var(--line);border-right:1px solid var(--line);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}')
        styled.append(indent + '.tb-q-data-table th:last-child{border-right:none}')
        continue
    if stripped.startswith('.tb-q-data-table td{') and '.tb-q-num' not in stripped and ':last-child' not in stripped:
        css_hits['td'] += 1
        styled.append(indent + '.tb-q-data-table td{padding:8px 12px;border-bottom:1px solid var(--line);border-right:1px solid var(--line);color:var(--ink);text-align:center}')
        styled.append(indent + '.tb-q-data-table td:last-child{border-right:none}')
        continue
    if stripped.startswith('.tb-q-data-table td.tb-q-num{'):
        css_hits['num'] += 1
        line = indent + '.tb-q-data-table td.tb-q-num{font-variant-numeric:tabular-nums}'
    styled.append(line)

if css_hits != {'th': 1, 'td': 1, 'num': 1}:
    raise SystemExit(f'Unexpected table CSS match counts: {css_hits}')

capability_re = re.compile(r'\b[Gg][Pp](?:[KkMm])?\b')
capability_fixes = 0
erk_fixes = 0
boxcox_fixes = 0
radical_fixes = 0
normalized = []

def replace_capability(value):
    counter = [0]
    def repl(match):
        counter[0] += 1
        return {'gp': 'Cp', 'gpk': 'Cpk', 'gpm': 'Cpm'}[match.group(0).lower()]
    return capability_re.sub(repl, value), counter[0]

for line in styled:
    if '"set":3' not in line:
        normalized.append(line)
        continue

    indent = line[:len(line) - len(line.lstrip())]
    body = line.strip()
    trailing_comma = body.endswith(',')
    raw_obj = body[:-1] if trailing_comma else body
    try:
        q = json.loads(raw_obj)
    except json.JSONDecodeError:
        normalized.append(line)
        continue

    for key in ('stem', 'why'):
        if isinstance(q.get(key), str):
            q[key], count = replace_capability(q[key])
            capability_fixes += count

    if isinstance(q.get('options'), list):
        fixed_options = []
        for option in q['options']:
            if isinstance(option, str):
                option, count = replace_capability(option)
                capability_fixes += count
            fixed_options.append(option)
        q['options'] = fixed_options

    if isinstance(q.get('why'), str):
        q['why'], count = re.subn(r'\berk\b', 'Cpk', q['why'])
        erk_fixes += count

    stem = q.get('stem', '')
    if stem == 'What is the denominator in the population variance formula?':
        if len(q.get('options', [])) != 4:
            raise SystemExit('Population variance question has an unexpected options shape')
        if q['options'][3] != '√N':
            q['options'][3] = '√N'
            radical_fixes += 1

    if stem.startswith('In a two-level full-factorial design, the effect of Factor A is equal to - 12.4.'):
        if len(q.get('options', [])) != 4:
            raise SystemExit('Factor A coefficient question has an unexpected options shape')
        if q['options'][0] != '-12.4 + √MSE':
            q['options'][0] = '-12.4 + √MSE'
            radical_fixes += 1

    if stem == 'What Box-Cox transformation is used to transform data from a Poisson to a normal distribution?':
        q['options'] = ['Y = √X', 'Y = ln(X)', 'Y = X²', 'Y = 1/X']
        q['answer'] = 0
        q['why'] = 'The Box-Cox transformation from Poisson to normal uses a square root transformation, which is the same as Y = X^0.5 (√X). [V.F.5]'
        boxcox_fixes += 1

    rebuilt = indent + json.dumps(q, ensure_ascii=False, separators=(',', ':'))
    normalized.append(rebuilt + (',' if trailing_comma else ''))

# Fail closed if the source shape changes. These guards prevent an apparently
# successful merge that silently applies only part of PR 115.
if capability_fixes < 30:
    raise SystemExit(f'Expected at least 30 Gp/Gpk/Gpm OCR replacements, got {capability_fixes}')
if boxcox_fixes != 1:
    raise SystemExit(f'Expected exactly one Box-Cox correction, got {boxcox_fixes}')
if radical_fixes != 2:
    raise SystemExit(f'Expected exactly two radical-symbol fixes, got {radical_fixes}')
if erk_fixes > 1:
    raise SystemExit(f'Unexpected standalone erk replacement count: {erk_fixes}')

set3_lines = [line for line in normalized if '"set":3' in line]
if any(capability_re.search(line) for line in set3_lines):
    raise SystemExit('Gp/Gpk/Gpm OCR text remains in Set 3')

text = '\n'.join(normalized) + '\n'
for required in (
    'Y = √X',
    'Y = X²',
    '.tb-q-data-table th:last-child{border-right:none}',
    '.tb-q-data-table td:last-child{border-right:none}',
):
    if required not in text:
        raise SystemExit(f'Missing resolved invariant: {required}')

path.write_text(text, encoding='utf-8')
print('PR 115 semantic resolution complete:', {
    'capability_fixes': capability_fixes,
    'erk_fixes': erk_fixes,
    'boxcox_fixes': boxcox_fixes,
    'radical_fixes': radical_fixes,
    'css_hits': css_hits,
})
