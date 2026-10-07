#!/usr/bin/env python3
"""Reproduce the reviewed CQE Set 3 crops from the user-provided study-guide PDF.

Usage: python3 scripts/extract-cqe-set3-source-visuals.py /path/to/source.pdf
Requires PyMuPDF (fitz). The book itself is deliberately not checked in.
"""
import hashlib
import json
from pathlib import Path
import sys

import fitz


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    root = Path(__file__).resolve().parents[1]
    manifest = json.loads((root / 'docs/audits/cqe-set3-source-audit.json').read_text())
    source = Path(sys.argv[1])
    if hashlib.sha256(source.read_bytes()).hexdigest() != manifest['sourceSha256']:
        raise SystemExit('Source PDF differs from the audited edition/file; review the mapping before extracting.')
    with fitz.open(source) as document:
        scale = manifest['renderDpi'] / 72
        for asset in manifest['assets']:
            target = (root / asset['src'].lstrip('/')).resolve()
            if not target.is_relative_to(root / 'test-bank-assets/cqe-set3-source'):
                raise SystemExit('Asset path is outside the CQE source asset directory.')
            pixmap = document[asset['pdfPage'] - 1].get_pixmap(
                matrix=fitz.Matrix(scale, scale), clip=fitz.Rect(asset['cropPoints']), alpha=False
            )
            if (pixmap.width, pixmap.height) != (asset['width'], asset['height']):
                raise SystemExit('Unexpected crop dimensions: ' + asset['id'])
            data = pixmap.tobytes('png')
            if hashlib.sha256(data).hexdigest() != asset['sha256']:
                raise SystemExit('Rendered bytes differ: ' + asset['id'] + '. Check the PyMuPDF version before replacing reviewed assets.')
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
    print(f"Reproduced {len(manifest['assets'])} verified original crops.")


if __name__ == '__main__':
    main()
