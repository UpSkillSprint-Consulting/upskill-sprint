"""One-time PR 168 presentation migration. Refuses any unexpected input revision."""
from pathlib import Path
import re, json, hashlib
from bs4 import BeautifulSoup
import tinycss2
ROOT = Path.cwd()
path = ROOT / 'lessons/statistics/variance-covariance-correlation-and-coefficient-of-variation.html'
original = path.read_text()
assert hashlib.sha1(b'blob '+str(len(original.encode())).encode()+b'\0'+original.encode()).hexdigest() == '8f6f24e03c4be2fa2ba29aebae9b314f6b0d7287'
s = original.replace('--sl-', '--lesson-sl-')
s = s.replace('Coefficient of Variation | UpSkill Sprint Consulting</title>', 'Coefficient of Variation</title>')
s = s.replace('initial-scale=1.0', 'initial-scale=1')
s = s.replace('css2?family=Fraunces:', 'css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&family=Fraunces:')
style = re.search(r'<style>\n(.*?)</style>', s, re.S)
def scope_rules(rules):
    for rule in rules:
        if rule.type == 'qualified-rule':
            selector = tinycss2.serialize(rule.prelude).strip()
            if selector in (':root', 'body', 'html'):
                selector = '#lesson-content'
            else:
                selector = ', '.join('#lesson-content '+part.strip() for part in selector.split(','))
            rule.prelude = tinycss2.parse_component_value_list(selector+' ')
        elif rule.type == 'at-rule' and rule.content is not None:
            nested = tinycss2.parse_rule_list(rule.content)
            scope_rules(nested)
            rule.content = tinycss2.parse_component_value_list(tinycss2.serialize(nested))
rules = tinycss2.parse_stylesheet(style.group(1))
scope_rules(rules)
scoped = tinycss2.serialize(rules)
scoped = scoped.replace('--lesson-sl-accent:#E08E2B;', '--lesson-sl-accent:#A95C00;\n    --lesson-sl-control-border:#708589;')
scoped = scoped.replace('background: rgba(238,243,241,0.88);', 'background: var(--lesson-sl-paper);\n    color: var(--lesson-sl-ink);')
scoped = scoped.replace('position: sticky; top:0; z-index: 20;', 'position: sticky; top:var(--lesson-sl-sitebar-height, 73px); z-index: 10;')
scoped = scoped.replace('position: fixed;', 'position: absolute;')
scoped_rules = tinycss2.parse_stylesheet(scoped)
def pair_colors(rules):
    for rule in rules:
        if rule.type == 'qualified-rule':
            ds = tinycss2.parse_declaration_list(rule.content)
            props = {d.lower_name for d in ds if d.type == 'declaration'}
            if ('background' in props or 'background-color' in props) and 'color' not in props:
                rule.content.extend(tinycss2.parse_component_value_list(' color: var(--lesson-sl-ink); '))
        elif rule.type == 'at-rule' and rule.content is not None:
            ns = tinycss2.parse_rule_list(rule.content)
            pair_colors(ns)
            rule.content = tinycss2.parse_component_value_list(tinycss2.serialize(ns))
pair_colors(scoped_rules)
scoped = tinycss2.serialize(scoped_rules)
s = s[:style.start(1)] + scoped + s[style.end(1):]
s = s.replace('id="heroSlider"', 'id="heroSlider" aria-label="Relationship strength"')
for id_, name in [('heroSvg','Correlation scatter plot'), ('covSvg','Covariance: four-quadrant scatter plot'), ('corrSvg','Pearson correlation scatter plot'), ('diagramSvg','Variance family tree: square root; divide by mean; extend to 2 variables; divide by both standard deviations')]:
    s = s.replace(f'id="{id_}"', f'id="{id_}" role="img" aria-label="{name}"', 1)
s = s.replace('class="widget diagram-wrap"', 'class="widget diagram-wrap" tabindex="0" role="region" aria-label="Scrollable variance family tree"')
s = s.replace('class="impl-scroll"', 'class="impl-scroll" tabindex="0" role="region" aria-label="Excel functions table"')
s = s.replace('<div style="overflow-x:auto">\n      <table class="compare">', '<div style="overflow-x:auto" tabindex="0" role="region" aria-label="Pallets and pins comparison table">\n      <table class="compare">')
s = s.replace('id="guessPallets"', 'id="guessPallets" aria-controls="guessReveal" aria-expanded="false"')
s = s.replace('id="guessPins"', 'id="guessPins" aria-controls="guessReveal" aria-expanded="false"')
s = s.replace('id="guessResponse"', 'id="guessResponse" aria-live="polite"')
ui = '''<script id="sl-presentation-controls">
(function () {
  'use strict';
  const main = document.getElementById('lesson-content');
  const header = document.querySelector('header.site');
  if (!main || !header) return;
  function syncLayout() {
    const height = Math.ceil(header.getBoundingClientRect().height) + 'px';
    if (main.style.getPropertyValue('--lesson-sl-sitebar-height') !== height) {
      main.style.setProperty('--lesson-sl-sitebar-height', height);
    }
    main.querySelectorAll('.katex-box').forEach(function (box) {
      if (box.scrollWidth > box.clientWidth + 1) {
        box.setAttribute('tabindex', '0');
        box.setAttribute('role', 'region');
        box.setAttribute('aria-label', 'Scrollable formula');
      } else {
        box.removeAttribute('tabindex');
        box.removeAttribute('role');
        box.removeAttribute('aria-label');
      }
    });
  }
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(syncLayout);
    observer.observe(header);
    observer.observe(main);
  }
  window.addEventListener('resize', syncLayout, { passive: true });
  window.addEventListener('load', syncLayout);
  document.addEventListener('DOMContentLoaded', syncLayout);
  ['guessPallets', 'guessPins'].forEach(function (id) {
    document.getElementById(id).addEventListener('click', function () {
      document.getElementById('guessPallets').setAttribute('aria-expanded', 'true');
      document.getElementById('guessPins').setAttribute('aria-expanded', 'true');
      syncLayout();
    });
  });
  syncLayout();
})();
</script>
'''
s = s.replace('<style id="sl-dark-overrides">', ui + '<style id="sl-dark-overrides">')
s = s.replace('html[data-theme="dark"]{\n  --lesson-sl-paper', 'html[data-theme="dark"] #lesson-content{\n  --lesson-sl-paper')
s = s.replace('--lesson-sl-border: rgba(180,220,220,0.20);', '--lesson-sl-border: rgba(180,220,220,0.20);\n  --lesson-sl-control-border:#708C91;')
s = s.replace('html[data-theme="dark"] table.compare', 'html[data-theme="dark"] #lesson-content table.compare')
s = s.replace('</style>\n</body>', '''/* Presentation-only safeguards. Shared header/footer/progress styling stays untouched. */
#lesson-content{position:relative;min-width:0;max-width:none;padding:0 0 24px}
#lesson-content .wrap{min-width:0}
#lesson-content .hero{min-width:0}
#lesson-content h1.title{max-width:24ch;overflow-wrap:anywhere}
#lesson-content section.page{scroll-margin-top:calc(var(--lesson-sl-sitebar-height, 73px) + 80px)}
#lesson-content .hero-demo>*{min-width:0;max-width:100%}
#lesson-content .hero-demo svg{height:auto}
#lesson-content .path-block{overflow-wrap:anywhere}
#lesson-content .scatter-side{min-width:min(200px,100%)}
#lesson-content .btn{white-space:normal;max-width:100%;min-height:44px}
#lesson-content .btn.ghost{border-color:var(--lesson-sl-control-border)}
#lesson-content input[type="range"]{min-height:24px;height:24px;padding:9.5px 0;max-width:100%;background-clip:content-box}
#lesson-content .control-row input[type="range"]{min-width:min(140px,100%)}
#lesson-content .track .axis{background:var(--lesson-sl-control-border)}
#lesson-content .diagram-node{border-color:var(--lesson-sl-control-border);color:var(--lesson-sl-ink)}
#lesson-content :is(button,input,a,[tabindex="0"]):focus-visible{outline:3px solid var(--lesson-sl-teal-deep);outline-offset:3px}
#quiz .quiz-question{min-inline-size:0}
#quiz .quiz,#quiz .quiz-question,#quiz .quiz-feedback,#quiz .quiz-result{color:#172033}
#quiz .quiz-option{overflow-wrap:anywhere}
html[data-theme="light"] #lesson-content{color-scheme:light}
html[data-theme="dark"] #lesson-content .btn:hover,
html[data-theme="dark"] #lesson-content .btn.ghost:hover{color:var(--lesson-sl-paper)}
html[data-theme="dark"] #lesson-content input[type="range"]{background:linear-gradient(90deg,var(--lesson-sl-teal),var(--lesson-sl-accent)) content-box !important;color:var(--lesson-sl-ink)}
html[data-theme="dark"] #quiz .lesson-kicker{color:#67D4DF}
html[data-theme="dark"] #quiz .quiz,
html[data-theme="dark"] #quiz .quiz-question,
html[data-theme="dark"] #quiz .quiz-feedback,
html[data-theme="dark"] #quiz .quiz-result{color:#E7EEF4}
@media (max-width:480px){
  #lesson-content .wrap{padding-left:16px;padding-right:16px}
  #lesson-content .widget{padding:18px}
  #lesson-content .formula-card{padding:16px}
  #lesson-content .hero{padding-top:36px}
  #lesson-content .nav-dots{padding-left:16px;padding-right:16px;gap:14px}
}
</style>
</body>''')
a = BeautifulSoup(original, 'html.parser')
b = BeautifulSoup(s, 'html.parser')
def signature(doc):
    roots = [doc.select_one('#lesson-content'), doc.select_one('#quiz')]
    return {'headings': [(x.name,x.get_text()) for root in roots for x in root.select('h1,h2,h3,h4')], 'text': [root.get_text() for root in roots], 'quiz': [(x['data-answer'],x['data-explanation']) for x in doc.select('.quiz-question')]}
assert signature(a) == signature(b), 'Teaching material changed'
old_scripts = [x.string or x.get_text() for x in a.select('script:not([src])')]
new_scripts = [x.string or x.get_text() for x in b.select('script:not([src]):not(#sl-presentation-controls)')]
assert [x.replace('--sl-', '--lesson-sl-') for x in old_scripts] == new_scripts, 'Original logic changed'
assert a.select_one('header.site').decode() == b.select_one('header.site').decode()
assert a.select_one('footer.site').decode() == b.select_one('footer.site').decode()
assert a.select_one('#uss-quiz-style').get_text() == b.select_one('#uss-quiz-style').get_text()
blob = hashlib.sha1(b'blob '+str(len(s.encode())).encode()+b'\0'+s.encode()).hexdigest()
assert blob == '774b8a5e62051ea0cc6cd0a67f640f45678e84ea', 'Output differs from independently reviewed local patch'
path.write_text(s)
print(json.dumps({'source_blob': '8f6f24e03c4be2fa2ba29aebae9b314f6b0d7287', 'new_blob': blob, 'heading_count':len(signature(a)['headings']), 'main_text_characters':len(a.select_one('#lesson-content').get_text()), 'quiz_text_characters':len(a.select_one('#quiz').get_text()), 'content_preserved':True}, indent=2))
