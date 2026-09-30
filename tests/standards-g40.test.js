const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {resolve} = require('node:path');
const {test} = require('node:test');
const vm = require('node:vm');
const {brotliDecompressSync} = require('node:zlib');

const root = resolve(__dirname, '..');
const original = brotliDecompressSync(Buffer.from(readFileSync(resolve(root, 'source-assets/grade-specification-lookup/grade_spec_lookup.html.br.b64.part-01'), 'utf8').trim(), 'base64')).toString('utf8');
const dataStart = original.indexOf('let SPEC_DATA = ') + 'let SPEC_DATA = '.length;
const dataEnd = original.indexOf('\n};', dataStart);
assert.ok(dataStart > 15 && dataEnd > dataStart);
const dataset = JSON.parse(original.slice(dataStart, dataEnd + 2));
const sandbox = vm.createContext({});
vm.runInContext(readFileSync(resolve(root, 'source-assets/grade-specification-lookup/audited-g40.js'), 'utf8'), sandbox);
sandbox.applyAuditedG40(dataset);
const grades = dataset.specBodies.CSA_G40_21.grades;
const lookup = (designation, context = {}) => sandbox.resolveAuditedG40(grades[`G40_${designation}`], {
  form: 'PLATE', thicknessMM: 20, widthMM: 1200, tensileOrientation: 'TRANSVERSE',
  gaugeLengthMM: 50, tensileSpecimenType: 'RECTANGULAR', supplyCondition: 'AS_ROLLED', ...context
});
const row = (result, thickness = 20) => result.grade.mechanical.thicknessBreakpoints.find((r) => thickness > r.tMin_mm && thickness <= r.tMax_mm);
const chem = (result, symbol, bound = 'max') => result.grade.chemistry.elements[symbol].heat[bound].value;

test('G40 uses the attached reaffirmed edition and all actual Table 1 grade designations', () => {
  const actual = Object.keys(grades).map((key) => key.replace('G40_', '')).sort();
  const expected = ['260W','300W','345WM','350W','380W','400W','450W','480W','550W',
    '260WT','300WT','345WMT','350WT','380WT','400WT','450WT','480WT','550WT',
    '350R','350A','400A','480A','550A','350AT','400AT','480AT','550AT','700Q','700QT'].sort();
  assert.deepEqual(actual, expected);
  assert.equal(grades.G40_230G, undefined);
  assert.equal(grades.G40_230W, undefined);
  assert.match(grades.G40_350W.specEdition, /2014/);
  assert.match(grades.G40_350W.specEdition, /R2023/);
  assert.equal(grades.G40_350W.verification.lastVerifiedDate, '2026-09-29');
});

test('plate yield boundary is strictly above 65 mm, not the old 40 mm breakpoint', () => {
  for (const [thickness, expected] of [[40,350],[40.01,350],[65,350],[65.001,320],[100,320],[150,320],[200,320]]) {
    assert.equal(row(lookup('350W', {thicknessMM:thickness}), thickness).yieldStrength.min.value, expected);
  }
  const outside = lookup('350W', {thicknessMM:200.01});
  assert.equal(row(outside,200.01), undefined);
  assert.ok(outside.missingContext.some((message) => message.includes('exceeds Table 6')));
});

test('amended Table 3 carbon and silicon notes resolve exact thickness boundaries', () => {
  assert.equal(chem(lookup('260W', {thicknessMM:100}), 'C'), .20);
  assert.equal(chem(lookup('260W', {thicknessMM:100.01}), 'C'), .22);
  assert.equal(chem(lookup('300WT', {thicknessMM:100}), 'C'), .22);
  assert.equal(chem(lookup('300WT', {thicknessMM:100.01}), 'C'), .23);
  assert.equal(chem(lookup('350WT', {thicknessMM:100.01}), 'C'), .23);
  assert.equal(chem(lookup('350W', {thicknessMM:40}), 'Si','min'), null);
  assert.equal(chem(lookup('350W', {thicknessMM:40.001}), 'Si','min'), .15);
  assert.equal(chem(lookup('350WT'), 'Si','min'), .15);
  assert.equal(chem(lookup('345WM', {thicknessMM:40}), 'Si','min'), .10);
  assert.equal(chem(lookup('345WM', {thicknessMM:40.001}), 'Si','min'), .15);
});

test('HSS uses Table 5 chemistry and Table 8 mechanics, not plate defaults', () => {
  const hss = lookup('350WT', {form:'HSS',tensileOrientation:'LONGITUDINAL'});
  assert.equal(chem(hss,'Mn','min'), .50);
  assert.equal(chem(lookup('350WT'),'Mn','min'), .80);
  assert.equal(row(hss).tensileStrength.max.value, 620);
  assert.equal(row(lookup('350WT')).tensileStrength.max.value, 650);
  assert.equal(row(hss).elongation.fixedMin.value, 22);
  assert.equal(row(lookup('350WT')).elongation.fixedMin.value, 20);
  const high = lookup('480WT',{form:'HSS',tensileOrientation:'LONGITUDINAL'});
  assert.equal(chem(high,'C'), .20);
  assert.equal(chem(high,'S'), .03);
  assert.equal(high.grade.footnoteRules[0].limit, .12);
});

test('rolled shape 350WT has distinct tensile minimum, and 380WT is HSS only', () => {
  const shape = lookup('350WT',{form:'STRUCTURAL_SHAPE',tensileOrientation:'LONGITUDINAL',shapeGroup:2});
  assert.equal(row(shape).tensileStrength.min.value, 480);
  assert.equal(row(lookup('350WT')).tensileStrength.min.value, 450);
  assert.deepEqual(Array.from(grades.G40_380WT.applicableForms), ['HSS']);
  assert.ok(lookup('380WT').missingContext.some((message) => message.includes('No heat-chemistry table')));
});

test('SI remains the G40 record basis even when imperial display is requested', () => {
  const si = lookup('350W',{thicknessMM:64,unitBasis:'SI'});
  const display = lookup('350W',{thicknessMM:64,unitBasis:'IMPERIAL'});
  assert.equal(row(si,64).yieldStrength.min.value,350);
  assert.equal(row(display,64).yieldStrength.min.value,350);
  assert.equal(row(display,64).tensileStrength.min.value,450);
});

test('elongation depends on orientation/gauge and does not invent a missing specimen value', () => {
  assert.equal(row(lookup('350W')).elongation.fixedMin.value,20);
  assert.equal(row(lookup('350W',{gaugeLengthMM:200})).elongation.fixedMin.value,17);
  assert.equal(row(lookup('350W',{tensileOrientation:'LONGITUDINAL'})).elongation.fixedMin.value,22);
  assert.equal(row(lookup('350W',{tensileOrientation:'LONGITUDINAL',gaugeLengthMM:200})).elongation.fixedMin.value,19);
  const missing = lookup('350W',{gaugeLengthMM:''});
  assert.equal(row(missing).elongation.fixedMin.value,null);
  assert.ok(missing.missingContext.some((message) => message.includes('gauge length')));
  assert.ok(lookup('350W',{widthMM:600}).missingContext.some((message) => message.includes('over 600')));
  const floor=lookup('350W',{productSubtype:'FLOOR_PLATE',gaugeLengthMM:''});
  assert.equal(row(floor).elongation.fixedMin.value,null);
  assert.ok(!floor.missingContext.some((message) => message.includes('gauge length')));
});

test('thin rectangular and sheet elongation use their distinct source deduction schedules', () => {
  const plate=lookup('350W',{thicknessMM:3.2});
  assert.equal(row(plate,3.2).elongation.fixedMin.value,13);
  const sheet=lookup('350W',{form:'SHEET',thicknessMM:3.2,tensileOrientation:'LONGITUDINAL'});
  assert.equal(row(sheet,3.2).elongation.fixedMin.value,20.5);
  const round=lookup('350W',{thicknessMM:3.2,tensileSpecimenType:'ROUND'});
  assert.equal(row(round,3.2).elongation.fixedMin.value,20);
  assert.equal(row(lookup('350W',{thicknessMM:102.5}),102.5).elongation.fixedMin.value,19);
});

test('Charpy category is explicitly ordered, with 27 J average and 18 J individual for 350WT', () => {
  const missing=lookup('350WT');
  assert.equal(missing.grade.charpy.testTemp.value,null);
  assert.ok(missing.missingContext.some((message) => message.includes('impact category')));
  for (const [category,temp] of [[1,0],[2,-20],[3,-30],[4,-45]]) {
    const result=lookup('350WT',{impactCategory:category});
    assert.equal(result.grade.charpy.testTemp.value,temp);
    assert.equal(result.grade.charpy.energyFullSize.average.min.value,27);
    assert.equal(result.grade.charpy.energyFullSize.single.min.value,18);
  }
  assert.equal(lookup('260WT',{impactCategory:1}).grade.charpy.energyFullSize.average.min.value,20);
  const custom=lookup('350WT',{impactCategory:5});
  assert.equal(custom.grade.charpy.energyFullSize.average.min.value,null);
  assert.ok(custom.missingContext.some((message) => message.includes('Category 5')));
});

test('each Charpy subsize uses tabulated energy instead of linear scaling', () => {
  for (const [designation,expected] of [
    ['260WT',[15,13,11,7,5]],['350WT',[20,18,14,9,7]],['700QT',[26,23,17,11,8]]
  ]) {
    const c=lookup(designation,{impactCategory:2,supplyCondition:'QT'}).grade.charpy;
    const sizes=['10x7.5','10x6.7','10x5','10x3.3','10x2.5'];
    sizes.forEach((size,index)=>{
      const factor=c.subSizeFactors.find((item)=>item.specimen===size).factor;
      assert.ok(Math.abs(c.energyFullSize.average.min.value*factor-expected[index])<1e-10);
      assert.ok(Math.abs(c.energyFullSize.single.min.value*factor-expected[index]*2/3)<1e-10);
    });
  }
});

test('WM/WMT applies CE, yield maximum and Y/T limits with flange/web boundaries', () => {
  const shape=(extra={})=>lookup('345WMT',{form:'STRUCTURAL_SHAPE',tensileOrientation:'LONGITUDINAL',impactCategory:2,shapeTestLocation:'FLANGE',flangeThicknessMM:50,...extra});
  assert.equal(shape().grade.chemistry.carbonEquivalent.ceIiw.limit.value,.45);
  assert.equal(shape({flangeThicknessMM:50.001}).grade.chemistry.carbonEquivalent.ceIiw.limit.value,.47);
  assert.equal(row(shape()).yieldStrength.max.value,450);
  assert.equal(row(shape()).ytRatio.max.value,.85);
  const web=shape({shapeTestLocation:'WEB'});
  assert.equal(row(web).yieldStrength.max.value,480);
  assert.equal(row(web).ytRatio.max.value,.87);
  assert.ok(web.manualChecks.some((message)=>message.includes('required to be tested at the web')));
  assert.equal(chem(shape(),'N'),.015);
  assert.equal(chem(shape(),'Nb'),.05);
  assert.equal(chem(shape(),'Mo'),.15);
  assert.equal(shape().grade.chemistry.carbonEquivalent.selectionRule.type,'ALWAYS_IIW');
  const plate=lookup('345WMT',{impactCategory:2});
  assert.equal(plate.grade.chemistry.carbonEquivalent.ceIiw.limit.value,null);
  assert.ok(plate.manualChecks.some((message)=>message.includes('expressly describe shapes')));
});

test('product analysis and manufacturing records cannot receive fabricated automatic acceptance', () => {
  const product=lookup('350W',{analysisType:'PRODUCT'});
  assert.equal(product.grade.chemistry.elements.C.product,null);
  assert.ok(product.missingContext.some((message)=>message.includes('ASTM A6/A6M')));
  assert.ok(product.manualChecks.some((message)=>message.includes('dimensional/mass tolerances')));
  const q=lookup('700QT',{impactCategory:4});
  assert.ok(q.missingContext.some((message)=>message.includes('quenched and tempered')));
  assert.equal(lookup('350W').grade.chemistry.carbonEquivalent.ceIiw.limit.value,null);
});
