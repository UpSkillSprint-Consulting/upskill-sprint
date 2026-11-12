#!/usr/bin/env python3
"""Apply Canadian spellings to the Secret Personalities poster PDF in place.
The poster PDF was printed by headless Chrome (Skia) from a source file that is not
in the repo, so it cannot be regenerated. Skia writes one Tj per glyph with a Td
advance after it, so a word can be edited glyph by glyph without touching anything else:
  favorite -> favourite, neighbor -> neighbour (insert 'u' after 'o')
  centered -> centred (drop the 'e' before 'r')
  analyzes -> analyses ('z' -> 's', advance corrected for the width difference)
Each edited line keeps its start point; only the glyphs after the edit move.

NOT part of the site build. One-off, manually run, committed for provenance (like
scripts/build-poster-asset.py). It was run once on the PR #402 PDF; a second run stops
at the assert because the US spellings are gone.

Requires: pikepdf.
Usage: python3 scripts/canadianize-distribution-poster-pdf.py IN.pdf OUT.pdf
"""
import pikepdf, sys, re
def tounicode(font):
    m = {}
    cm = font.get('/ToUnicode').read_bytes().decode('latin1')
    for blk in re.findall(r'beginbfchar(.*?)endbfchar', cm, re.S):
        for a, b in re.findall(r'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>', blk):
            m[int(a,16)] = bytes.fromhex(b).decode('utf-16-be')
    for blk in re.findall(r'beginbfrange(.*?)endbfrange', cm, re.S):
        for a, b, c in re.findall(r'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>', blk):
            s = int(c,16)
            for i, g in enumerate(range(int(a,16), int(b,16)+1)):
                m[g] = chr(s+i)
    return m
def widths(font):
    d = font.DescendantFonts[0]; W = d.get('/W', []); dw = float(d.get('/DW', 1000)); out = {}
    i = 0; W = list(W)
    while i < len(W):
        a = int(W[i])
        if isinstance(W[i+1], pikepdf.Array):
            for j, w in enumerate(W[i+1]): out[a+j] = float(w)
            i += 2
        else:
            for g in range(a, int(W[i+1])+1): out[g] = float(W[i+2])
            i += 3
    return out, dw
def blocks(ops, maps):
    """yield (bt_index, font, [(op_index, char, gid)]) per BT..ET"""
    cur=None; start=None; glyphs=[]
    for i,(a,o) in enumerate(ops):
        o=str(o)
        if o=='BT': start=i; glyphs=[]
        elif o=='Tf': cur=str(a[0])
        elif o=='Tj':
            b=bytes(a[0])
            for j in range(0,len(b),2):
                g=int.from_bytes(b[j:j+2],'big'); glyphs.append((i, maps[cur].get(g,'?'), g))
        elif o=='ET': yield start, cur, glyphs

from decimal import Decimal
src, dst = sys.argv[1], sys.argv[2]
pdf = pikepdf.open(src); page = pdf.pages[0]; F = page.Resources.Font
maps = {k: tounicode(F[k]) for k in F.keys()}
ops = list(pikepdf.parse_content_stream(page))
sizes = {}
cur = None
for i, (a, o) in enumerate(ops):
    if str(o) == 'Tf': cur = (str(a[0]), float(a[1]))
    sizes[i] = cur
EDITS = [('favorite', 'favourite'), ('neighbor', 'neighbour'), ('centered', 'centred'), ('analyzes', 'analyses')]
patches = []  # (op_index, action, payload)
for start, font, gl in blocks(ops, maps):
    text = ''.join(c for _, c, _ in gl)
    for old, new in EDITS:
        for m in re.finditer(old, text):
            patches.append((start, font, gl, m.start(), old, new))
assert len(patches) == 4, patches
inv = {k: {v: g for g, v in maps[k].items()} for k in maps}
def tj(g): return pikepdf.ContentStreamInstruction([pikepdf.String(g.to_bytes(2, 'big'))], pikepdf.Operator('Tj'))
def td(x): return pikepdf.ContentStreamInstruction([Decimal(str(round(x, 7))), 0], pikepdf.Operator('Td'))
edits = {}  # op index -> replacement list of instructions
for start, font, gl, pos, old, new in patches:
    size = sizes[gl[pos][0]][1]; W, dw = widths(F[font])
    adv = lambda g: W.get(g, dw) * size / 1000
    if old in ('favorite', 'neighbor'):
        k = pos + old.index('or')  # glyph 'o'
        tj_o = gl[k][0]; td_o = tj_o + 1
        assert str(ops[td_o].operator) == 'Td'
        u = inv[font]['u']
        edits[td_o] = [ops[td_o], tj(u), td(adv(u))]
    elif old == 'centered':
        k = pos + 4  # the 'e' in cent|e|red
        assert gl[k][1] == 'e'
        tj_e = gl[k][0]
        assert str(ops[tj_e + 1].operator) == 'Td'
        edits[tj_e] = []; edits[tj_e + 1] = []
    elif old == 'analyzes':
        k = pos + 5; assert gl[k][1] == 'z'
        tj_z = gl[k][0]; s = inv[font]['s']
        d = float(ops[tj_z + 1].operands[0]) - adv(gl[k][2]) + adv(s)
        edits[tj_z] = [tj(s)]; edits[tj_z + 1] = [td(d)]
out = []
for i, ins in enumerate(ops):
    out.extend(edits[i] if i in edits else [ins])
page.Contents = pdf.make_stream(pikepdf.unparse_content_stream(out))
pdf.save(dst, deterministic_id=True)
print('patched', len(patches), 'words')
