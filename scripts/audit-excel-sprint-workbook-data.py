"""Read-only OOXML audit of public source values, blank learner ranges and leaks."""
import json,pathlib,zipfile,xml.etree.ElementTree as E,posixpath,re
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=ROOT/'assets/lessons/excel-formula-fluency/sprint'
NS={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
RNS='{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'
def column(n):
 s=''
 while n:n,i=divmod(n-1,26);s=chr(65+i)+s
 return s
def decode(s):return re.sub(r'_x([0-9A-Fa-f]{4})_',lambda m:chr(int(m[1],16)),s)
def read_workbook(path):
 z=zipfile.ZipFile(path);shared=[]
 if 'xl/sharedStrings.xml' in z.namelist():shared=[decode(''.join(n.itertext())) for n in E.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si',NS)]
 rels={r.attrib['Id']:r.attrib['Target'] for r in E.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
 sheets={};hidden=[];formulas=[]
 for s in E.fromstring(z.read('xl/workbook.xml')).findall('m:sheets/m:sheet',NS):
  name=s.attrib['name'];target=rels[s.attrib[RNS]];file=target.lstrip('/') if target.startswith('/') else posixpath.normpath('xl/'+target);xml=E.fromstring(z.read(file));cells={}
  if s.attrib.get('state','visible')!='visible':hidden.append(name)
  for c in xml.findall('.//m:c',NS):
   if c.find('m:f',NS) is not None:formulas.append(name+'!'+c.attrib['r'])
   v=c.find('m:v',NS);typ=c.attrib.get('t');value=''
   if typ=='s' and v is not None:value=shared[int(v.text)]
   elif typ=='inlineStr':value=decode(''.join(c.find('m:is',NS).itertext()))
   elif v is not None and v.text is not None:value=decode(v.text) if typ=='str' else float(v.text)
   cells[c.attrib['r']]=value
  sheets[name]=cells
 return sheets,hidden,formulas
errors=[];source_cells=answer_cells=workbooks=sheet_count=0
paths=list((BASE/'packages').glob('*.json'))+list((BASE/'learning/drills').glob('*.json'))
for p in sorted(paths):
 d=json.loads(p.read_text());id=d['id'];path=ROOT/d['dataset']['xlsx'].lstrip('/');sheets,hidden,formulas=read_workbook(path);workbooks+=1;sheet_count+=len(sheets)
 if hidden:errors.append([id,'hidden sheets'])
 if formulas:errors.append([id,'public formula leak'])
 tables=[{'name':'Data','headers':d['dataset']['headers'],'rows':d['dataset']['rows']},*d['dataset'].get('sheets',[])]
 for table in tables:
  cells=sheets.get(table['name'])
  if cells is None:errors.append([id,'missing source sheet',table['name']]);continue
  for ri,row in enumerate([table['headers'],*table['rows']],1):
   for ci,expected in enumerate(row,1):
    actual=cells.get(column(ci)+str(ri),'')
    if actual!=expected:errors.append([id,table['name'],column(ci)+str(ri),'source mismatch'])
    source_cells+=1
 for parameter in d.get('parameters',[]) or d['dataset'].get('parameters',[]):
  if sheets.get('Parameters',{}).get(parameter['cell'],'')!=parameter['value']:errors.append([id,'parameter mismatch',parameter['cell']])
 tasks=d.get('tasks',[])+([d['bonus']] if d.get('bonus') else [])+([d['task']] if d.get('task') else [])
 for t in tasks:
  m=re.fullmatch(r'Answers!([A-Z]+)(\d+)(?::([A-Z]+)(\d+))?',t['output'])
  if not m:errors.append([id,t['id'],'invalid output range']);continue
  def number(s):
   n=0
   for c in s:n=n*26+ord(c)-64
   return n
  for row in range(int(m[2]),int(m[4] or m[2])+1):
   for col in range(number(m[1]),number(m[3] or m[1])+1):
    if sheets.get('Answers',{}).get(column(col)+str(row),'')!='':errors.append([id,t['id'],'nonempty learner answer'])
    answer_cells+=1
report={'workbooks':workbooks,'sheets':sheet_count,'source_cells':source_cells,'empty_answer_cells':answer_cells,'errors':errors}
print(json.dumps(report))
if errors:raise SystemExit(1)
