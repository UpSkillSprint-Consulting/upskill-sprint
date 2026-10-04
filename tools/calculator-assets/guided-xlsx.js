/* Bounded, values-only OOXML reader using native browser decompression and XML parsing.
 * Supports .xlsx ZIP packages (stored/deflated). Does not execute formulas or external links.
 * Relationships and cell types: Microsoft Open XML spreadsheet documentation.
 */
'use strict';
const GuidedXlsx = (() => {
  const check=GuidedData.check, MAX_XML=30000000;
  const nodes=(node,name)=>[...node.getElementsByTagNameNS('*',name)];
  const one=(node,name)=>nodes(node,name)[0];
  function xml(text){
    check(!/<!DOCTYPE|<!ENTITY/i.test(text),'Workbook XML declarations are not supported. Export the table as CSV.');
    const doc=new DOMParser().parseFromString(text,'application/xml');
    check(!nodes(doc,'parsererror').length,'Workbook XML is malformed. Open and resave the file in Excel.');return doc;
  }
  function resolve(base,target){
    check(target&&!/^[a-z]+:|\\|[?#]/i.test(target),'External or invalid workbook relationships are not supported.');
    const parts=target.startsWith('/')?[]:base.split('/').slice(0,-1);
    for(const part of target.split('/')){if(!part||part==='.')continue;if(part==='..'){check(parts.length,'Invalid workbook relationship path.');parts.pop();}else parts.push(part);}
    return parts.join('/');
  }
  const crcTable=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
  function crc32(bytes){let crc=0xffffffff;for(const b of bytes)crc=crcTable[(crc^b)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}
  async function archive(buffer){
    check(buffer.byteLength>=22&&buffer.byteLength<=GuidedData.limits.file,'Choose an .xlsx file of at most 10 MB.');
    const bytes=new Uint8Array(buffer),view=new DataView(buffer),u16=i=>view.getUint16(i,true),u32=i=>view.getUint32(i,true);
    let end=-1;
    for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--)if(u32(i)===0x06054b50&&i+22+u16(i+20)===bytes.length){end=i;break;}
    check(end>=0,'This is not an unencrypted .xlsx workbook. Save it as .xlsx or CSV.');
    check(u16(end+4)===0&&u16(end+6)===0&&u16(end+8)===u16(end+10),'Multipart workbooks are not supported.');
    const count=u16(end+10),size=u32(end+12),start=u32(end+16);
    check(count>0&&count<=3000&&start+size<=end,'Workbook has too many parts or an invalid ZIP directory.');
    const entries=new Map(),decoder=new TextDecoder('utf-8',{fatal:true});let pos=start,total=0;
    for(let i=0;i<count;i++){
      check(pos+46<=end&&u32(pos)===0x02014b50,'Invalid workbook ZIP directory.');
      const flag=u16(pos+8),method=u16(pos+10),crc=u32(pos+16),packed=u32(pos+20),unpacked=u32(pos+24),len=u16(pos+28),extra=u16(pos+30),comment=u16(pos+32),offset=u32(pos+42);
      check(pos+46+len+extra+comment<=start+size,'Invalid workbook ZIP entry.');
      const name=decoder.decode(bytes.subarray(pos+46,pos+46+len));
      check(!(flag&1)&&[0,8].includes(method),'Encrypted or unsupported workbook compression. Save a plain .xlsx or CSV.');
      check(!entries.has(name),'Workbook contains duplicate ZIP parts.');
      total+=unpacked;check(total<=MAX_XML,'Expanded workbook exceeds 30 MB. Export only the needed table as CSV.');
      check(offset+30<=start&&u32(offset)===0x04034b50,'Invalid workbook ZIP part.');
      const dataStart=offset+30+u16(offset+26)+u16(offset+28);
      check(dataStart+packed<=start,'Workbook ZIP part exceeds file bounds.');
      entries.set(name,{method,crc,packed,unpacked,dataStart});pos+=46+len+extra+comment;
    }
    check(pos===start+size,'Workbook ZIP directory size is inconsistent.');
    const cache=new Map();
    async function read(name){
      if(cache.has(name))return cache.get(name);
      const entry=entries.get(name);check(entry,`Workbook part is missing: ${name}`);
      const source=bytes.subarray(entry.dataStart,entry.dataStart+entry.packed);let output=source;
      if(entry.method===8){
        check(typeof DecompressionStream==='function','This browser cannot read compressed Excel files. Use CSV or paste from Excel.');
        let stream;try{stream=new Blob([source]).stream().pipeThrough(new DecompressionStream('deflate-raw'));}catch{throw new Error('This browser cannot decompress Excel files. Use CSV or paste from Excel.');}
        const reader=stream.getReader(),chunks=[];let length=0;
        try{while(true){const {value,done}=await reader.read();if(done)break;length+=value.length;check(length<=entry.unpacked&&length<=MAX_XML,'Workbook expansion exceeds its declared size.');chunks.push(value);}}
        catch(error){await reader.cancel().catch(()=>{});throw error;}
        output=new Uint8Array(length);let at=0;for(const chunk of chunks){output.set(chunk,at);at+=chunk.length;}
      }
      check(output.length===entry.unpacked&&crc32(output)===entry.crc,'Workbook checksum failed. Download or resave the original file.');
      const text=decoder.decode(output);cache.set(name,text);return text;
    }
    return {read,has:name=>entries.has(name)};
  }
  const relPath=path=>path.replace(/([^/]+)$/,'_rels/$1.rels');
  function richText(node){return nodes(node,'t').filter(n=>n.parentNode.localName!=='rPh').map(n=>n.textContent).join('');}
  async function open(buffer){
    const zip=await archive(buffer),root=xml(await zip.read('_rels/.rels'));
    const office=nodes(root,'Relationship').find(r=>/\/officeDocument$/.test(r.getAttribute('Type')));
    check(office&&office.getAttribute('TargetMode')!=='External','Workbook relationship is missing.');
    const workbookPath=resolve('',office.getAttribute('Target'));
    const book=xml(await zip.read(workbookPath)),relationships=xml(await zip.read(relPath(workbookPath)));
    const rels=new Map(nodes(relationships,'Relationship').map(r=>[r.getAttribute('Id'),r]));
    const sheets=nodes(book,'sheet').map(s=>{
      const id=[...s.attributes].find(a=>a.localName==='id')?.value,r=rels.get(id);
      if(!r||! /\/worksheet$/.test(r.getAttribute('Type'))||r.getAttribute('TargetMode')==='External')return null;
      return {name:s.getAttribute('name')||'Sheet',path:resolve(workbookPath,r.getAttribute('Target')),hidden:!!s.getAttribute('state')&&s.getAttribute('state')!=='visible'};
    }).filter(Boolean);
    check(sheets.length&&sheets.length<=100,'Choose a workbook with 1–100 worksheets.');
    const stringsRel=[...rels.values()].find(r=>/\/sharedStrings$/.test(r.getAttribute('Type'))&&r.getAttribute('TargetMode')!=='External');
    const strings=stringsRel?nodes(xml(await zip.read(resolve(workbookPath,stringsRel.getAttribute('Target')))),'si').map(richText):[];
    const stylesRel=[...rels.values()].find(r=>/\/styles$/.test(r.getAttribute('Type'))&&r.getAttribute('TargetMode')!=='External');
    let dateStyles=[];
    if(stylesRel){
      const styles=xml(await zip.read(resolve(workbookPath,stylesRel.getAttribute('Target')))),formats=new Map(nodes(styles,'numFmt').map(n=>[Number(n.getAttribute('numFmtId')),n.getAttribute('formatCode')]));
      dateStyles=[...(one(styles,'cellXfs')?.children||[])].map(x=>{
        const id=Number(x.getAttribute('numFmtId')),custom=(formats.get(id)||'').replace(/"[^"]*"|\\.|\[[^\]]*\]/g,'');
        return (id>=14&&id<=22)||(id>=27&&id<=36)||(id>=45&&id<=47)||(id>=50&&id<=58)||/[ymdhs]/i.test(custom);
      });
    }
    const epoch1904=['1','true'].includes(one(book,'workbookPr')?.getAttribute('date1904'));
    async function sheet(index){
      check(Number.isInteger(index)&&sheets[index],'Choose a worksheet.');
      const doc=xml(await zip.read(sheets[index].path)),matrix=[],occupied=new Set();let width=0,formulaCount=0,dateCount=0,hiddenCount=0;
      for(const row of nodes(doc,'row')){
        const rowIndex=Number(row.getAttribute('r'))-1;
        check(Number.isInteger(rowIndex)&&rowIndex>=0&&rowIndex<=GuidedData.limits.rows,'Worksheet uses rows beyond 10,001. Copy the table to a new sheet or CSV.');
        if(row.getAttribute('hidden')==='1')hiddenCount++;
        for(const cell of [...row.children].filter(n=>n.localName==='c')){
          const ref=/^([A-Z]+)(\d+)$/.exec(cell.getAttribute('r')||'');
          check(ref&&Number(ref[2])===rowIndex+1,'Worksheet contains invalid cell addresses.');
          let col=0;for(const c of ref[1])col=col*26+c.charCodeAt(0)-64;col--;
          const valueNode=one(cell,'v'),inline=one(cell,'is'),formula=one(cell,'f');
          if(!valueNode&&!inline&&!formula)continue; // Formatting-only cells do not extend the table.
          check(col<GuidedData.limits.columns,'Worksheet uses values beyond column AN (40 columns). Export a smaller table.');
          const address=`${rowIndex}:${col}`;check(!occupied.has(address),'Worksheet contains duplicate cells.');occupied.add(address);
          let value=valueNode?.textContent??'',type=cell.getAttribute('t');
          if(formula){formulaCount++;if(!valueNode||!valueNode.textContent)value='#FORMULA_WITHOUT_CACHED_VALUE';}
          if(type==='s'){
            const n=Number(value);check(/^\d+$/.test(value)&&strings[n]!=null,'Worksheet contains an invalid shared string.');value=strings[n];
          }else if(type==='inlineStr')value=inline?richText(inline):'';
          else if(type==='b')value=value==='1'?'TRUE':'FALSE';
          else if(value&&value!=='#FORMULA_WITHOUT_CACHED_VALUE'&&(!type||type==='n')&&dateStyles[Number(cell.getAttribute('s')||0)]){
            const serial=GuidedData.number(value);check(Number.isFinite(serial)&&serial>=0&&serial<2958466,'Excel date is outside the supported range.');
            value=!epoch1904&&Math.floor(serial)===60?'1900-02-29 (Excel serial 60)':new Date(Date.UTC(epoch1904?1904:1899,epoch1904?0:11,epoch1904?1:30)+(serial+(!epoch1904&&serial<60?1:0))*86400000).toISOString();dateCount++;
          }
          check(value.length<=10000,'An Excel cell exceeds 10,000 characters.');
          width=Math.max(width,col+1);check((rowIndex+1)*width<=GuidedData.limits.cells+GuidedData.limits.columns,'Worksheet exceeds 100,000 cells.');
          matrix[rowIndex]||=[];matrix[rowIndex][col]=value;
        }
      }
      check(matrix.length&&width,'Selected worksheet has no values.');
      const rows=Array.from({length:matrix.length},(_,i)=>Array.from({length:width},(_,j)=>matrix[i]?.[j]??''));
      const notes=['Excel import reads stored values. Number formats, percentages and units are not inferred; for example, 5% imports as 0.05. No formulas or external links are executed.'];
      if(formulaCount)notes.push(`${formulaCount} formula cells: cached values may be stale. Recalculate and save in Excel before importing. Missing caches are marked and cannot be analyzed as numbers.`);
      if(dateCount)notes.push(`${dateCount} formatted date/time cells were converted to ISO text (no timezone inferred). Duration formats are not supported; review date/time columns.`);
      if(hiddenCount||sheets[index].hidden)notes.push('Hidden worksheet/rows are included. Review row exclusions before analysis.');
      if(nodes(doc,'mergeCell').length)notes.push('Merged cells are not filled down. Only stored values are imported; review blanks.');
      if(nodes(doc,'autoFilter').length)notes.push('Excel filters are not applied; all stored rows are included.');
      return {matrix:rows,rowNumbers:rows.map((_,i)=>i+1),notes};
    }
    return {sheets:sheets.map(s=>({name:s.name,hidden:s.hidden})),sheet};
  }
  return {open};
})();
