# Font subsetting

`public/fonts/gujarati-sans.woff2` is Noto Sans Gujarati, subset to only the
53 Gujarati codepoints this app actually uses. The full family is 110 kB; the
subset is 72 kB, and it ships to every visitor because the wordmark, tagline
and each product's second name are Gujarati script in both languages.

To regenerate after adding new Gujarati copy:

```bash
pip install fonttools brotli
# 1. collect every Gujarati codepoint used in the source
python3 - <<'PY'
import pathlib
chars = set()
for p in pathlib.Path('.').rglob('*'):
    if p.is_file() and p.suffix in {'.ts','.tsx','.css','.md'} \
       and 'node_modules' not in str(p) and '.next' not in str(p):
        for ch in p.read_text(errors='ignore'):
            if 0x0A80 <= ord(ch) <= 0x0AFF or ord(ch) in (0x200C, 0x200D):
                chars.add(ch)
open('/tmp/gu-chars.txt','w').write(''.join(sorted(chars)))
print(len(chars), 'codepoints')
PY

# 2. subset (source: any Noto Sans Gujarati woff2; next/font leaves one in
#    .next/static/media after a build)
pyftsubset <source.woff2> \
  --unicodes-file=/tmp/gu-chars.txt \
  --layout-features='*' --notdef-outline --flavor=woff2 \
  --output-file=public/fonts/gujarati-sans.woff2
```

`--layout-features='*'` is essential: dropping it breaks Gujarati conjuncts
(ક્યાંથી, ગુણવત્તા) into separate letters.
