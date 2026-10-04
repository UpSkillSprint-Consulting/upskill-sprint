// Regenerate with KaTeX 0.18.7: node scripts/build-lookup-math.cjs [path-to-katex]
// Committed native MathML avoids a CDN dependency or client-side typesetting flash.
const fs = require('node:fs');
const katex = require(process.argv[2] || 'katex');
const source = JSON.parse(fs.readFileSync('tools/calculator-assets/lookup-formulas.json', 'utf8'));
function math(tex) {
  return katex.renderToString(tex, {output:'mathml', displayMode:false, throwOnError:true, strict:'error', trust:false});
}
const formulas = Object.fromEntries(Object.entries(source.tables).map(([key,value]) => [key, {
  ...value, html: value.tex.map(tex => '<span class="lookup-equation">' + math(tex) + '</span>').join('')
}]));
const inline = source.inline.map(([plain,tex]) => [plain,math(tex)]).sort((a,b)=>b[0].length-a[0].length);
// Typeset the manual's prose equations without touching copyable input examples,
// existing MathML, tags, or the generated formula reference below.
function formatProse(text) {
  let result='';
  while(text){let at=text.length,match;for(const pair of inline){const index=text.indexOf(pair[0]);if(index>=0&&index<at){at=index;match=pair;}}
    result+=text.slice(0,at);if(!match)break;result+=match[1];text=text.slice(at+match[0].length);
  }return result;
}
fs.writeFileSync('tools/calculator-assets/lookup-math.js', '/* Generated from lookup-formulas.json by build-lookup-math.cjs; KaTeX '+katex.version+' → native MathML. */\nwindow.LookupMath = '+JSON.stringify({formulas,inline})+';\n'+fs.readFileSync('scripts/lookup-math-runtime.txt','utf8'));
const manualPath = 'tools/calculator-manual.html';
let manual = fs.readFileSync(manualPath,'utf8');
const lookupStart=manual.indexOf('<h2 id="distribution-lookup">');
const lookupEnd=manual.indexOf('<nav class="calc-breadcrumb" aria-label="Continue learning">',lookupStart);
const before=manual.slice(0,lookupStart),after=manual.slice(lookupEnd);
manual=before+manual.slice(lookupStart,lookupEnd).split(/(<math\b[\s\S]*?<\/math>|<code\b[\s\S]*?<\/code>|<[^>]+>)/g).map(part=>part.startsWith('<')?part:formatProse(part)).join('')+after;
const start = '<!-- lookup-equations:start -->', end = '<!-- lookup-equations:end -->';
const titles = {z:'Standard normal',t:'Student’s t',chi_square:'Chi-square',f:'F distribution',binomial_pmf:'Binomial PMF',binomial_cmf:'Binomial cumulative',poisson_pmf:'Poisson PMF',poisson_cmf:'Poisson cumulative',exponential:'Exponential',studentized_range:'Tukey studentized range',duncan:'Duncan multiple range',control_chart:'Control-chart constants',sigma_level:'Sigma level / DPMO',median_ranks:'Median ranks',normal_scores:'Normal scores',tolerance_one:'One-sided normal tolerance factors',tolerance_two:'Two-sided normal tolerance factors'};
const section = start+'\n<h3>Equations and notation</h3>\n<p>Equations are authored in LaTeX and displayed as native mathematical notation, including fractions, roots, subscripts and quantiles. The original LaTeX is retained in each equation’s MathML annotation. Programming examples elsewhere use literal input syntax so they can be copied into the calculator.</p>\n'+Object.entries(formulas).map(([id,f])=>'<div class="lookup-formula-reference"><h4>'+titles[id]+'</h4>'+f.html+'<p>'+f.note+'</p></div>').join('\n')+'\n'+end;
if(manual.includes(start)) manual = manual.slice(0,manual.indexOf(start))+section+manual.slice(manual.indexOf(end)+end.length);
else manual = manual.replace('<nav class="calc-breadcrumb" aria-label="Continue learning">',section+'\n<nav class="calc-breadcrumb" aria-label="Continue learning">');
fs.writeFileSync(manualPath,manual);
