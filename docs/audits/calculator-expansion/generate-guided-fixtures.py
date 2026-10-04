"""Generate independent t-inference references and small OOXML import fixtures.

Run from the repository root with scipy and openpyxl installed. Runtime tests
consume committed JSON and need neither Python package.
"""
import base64
import datetime
import io
import json
import zipfile
from pathlib import Path

import numpy as np
import openpyxl
import scipy
from scipy import stats

cases = []
for name, before, after, paired, confidence in [
    ('independent-change', [10.5, 10.3, 10.8, 10.4, 10.6, 10.7], [10.1, 9.9, 10.2, 10, 10.1, 9.8], False, .95),
    ('unequal-variance-size', [1, 2, 4, 6, 9], [3, 3.1, 3.2], False, .99),
    ('matched-change', [12, 15, 11, 14, 13, 16], [10, 12, 10, 11, 11, 12], True, .95),
    ('small-scale', [1e-8, 3e-8, 4e-8], [4e-8, 5e-8, 8e-8], False, .90),
]:
    a, b = np.array(before), np.array(after)
    if paired:
        result = stats.ttest_rel(b, a)
        se = np.std(b-a, ddof=1)/np.sqrt(len(a))
        matrix = [['Before', 'After']] + [[str(x), str(y)] for x, y in zip(a, b)]
        options = dict(goal='compare', design='paired', y='0', x='1')
    else:
        result = stats.ttest_ind(b, a, equal_var=False)
        se = np.sqrt(np.var(a, ddof=1)/len(a)+np.var(b, ddof=1)/len(b))
        matrix = [['Group', 'Y']] + [['Before', str(x)] for x in a] + [['After', str(x)] for x in b]
        options = dict(goal='compare', design='independent', y='1', group='0', baseline='Before')
    ci = result.confidence_interval(confidence_level=confidence)
    cases.append(dict(name=name, matrix=matrix, options=dict(**options, confidence=confidence, direction='different'),
                      expected=dict(estimate=float(np.mean(b)-np.mean(a)), low=float(ci.low), high=float(ci.high),
                                    p=float(result.pvalue), df=float(result.df), se=float(se))))
a = np.array([9.9, 10.2, 10.1, 10.4, 10.3, 10.0])
result = stats.ttest_1samp(a, 10)
ci = result.confidence_interval(.95)
cases.append(dict(name='target', matrix=[['Y']]+[[str(v)] for v in a], options=dict(goal='target', y='0', target='10', confidence=.95),
                  expected=dict(estimate=float(np.mean(a)-10), low=float(ci.low-10), high=float(ci.high-10),
                                p=float(result.pvalue), df=float(result.df), se=float(np.std(a, ddof=1)/np.sqrt(len(a))))))
Path('tests/fixtures/calculator-guided-reference.json').write_text(json.dumps(dict(source=f'SciPy {scipy.__version__}', cases=cases), indent=2)+'\n')

book = openpyxl.Workbook()
sheet = book.active
sheet.title = 'Measurements'
sheet.append(['Group', 'Value', 'Date', 'Formula'])
sheet.append(['Before', 10.5, datetime.datetime(2026, 10, 4, 12, 30), '=B2*2'])
sheet.append(['After', 9.8, datetime.datetime(2026, 10, 5), '=B3*2'])
sheet.row_dimensions[3].hidden = True
sheet.auto_filter.ref = 'A1:D3'
sheet['F1000'].number_format = '0.00'  # Formatting only must not enlarge the table.
second = book.create_sheet('Second sheet')
second.append(['X', 'Y'])
second.append([1, 2])
second.append([2, 5])
second.append([3, 7])
stream = io.BytesIO()
book.save(stream)

def rewrite(changes, compression=zipfile.ZIP_DEFLATED, additions=None):
    output = io.BytesIO()
    with zipfile.ZipFile(io.BytesIO(stream.getvalue())) as source, zipfile.ZipFile(output, 'w', compression=compression) as dest:
        for name in source.namelist():
            text = source.read(name).decode()
            dest.writestr(name, changes.get(name, lambda s: s)(text))
        for name, text in (additions or {}).items():
            dest.writestr(name, text)
    return base64.b64encode(output.getvalue()).decode()

fixture = {
    'source': f'openpyxl {openpyxl.__version__}; ZIP stored/deflated using Python stdlib',
    'compressed': rewrite({}),
    'storedCached': rewrite({'xl/worksheets/sheet1.xml': lambda s: s.replace('<f>B2*2</f><v></v>', '<f>B2*2</f><v>21</v>')}, zipfile.ZIP_STORED),
    'oversized': rewrite({'xl/worksheets/sheet1.xml': lambda s: s.replace('r="B2"', 'r="AO2"')}),
    'doctype': rewrite({'xl/workbook.xml': lambda s: '<!DOCTYPE workbook [<!ENTITY x "bad">]>'+s}),
    'sharedStrings': rewrite({
        'xl/_rels/workbook.xml.rels': lambda s: s.replace('</Relationships>', '<Relationship Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml" Id="rStrings"/></Relationships>'),
        'xl/worksheets/sheet1.xml': lambda s: s.replace('<c r="A2" t="inlineStr"><is><t>Before</t></is></c>', '<c r="A2" t="s"><v>0</v></c>')
    }, additions={'xl/sharedStrings.xml': '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><si><r><t>Be</t></r><r><t>fore</t></r></si></sst>'}),
}
Path('tests/fixtures/calculator-guided-xlsx.json').write_text(json.dumps(fixture, indent=2)+'\n')
