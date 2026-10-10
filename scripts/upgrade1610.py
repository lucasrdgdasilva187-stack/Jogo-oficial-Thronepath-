"""Apply the reviewed Beta changes while preserving all original embedded media."""
from pathlib import Path
import re,json,hashlib
root=Path(__file__).resolve().parents[1]
p=root/'web/index.html';text=p.read_text()
patch=json.loads((root/'source/revision1610.patch.json').read_text())
pattern=r'data:(?:image/(?:jpeg|png|webp)|audio/(?:mpeg|mp3|wav|ogg));base64,[A-Za-z0-9+/=]+'
assets=re.findall(pattern,text)
assert len(assets)==patch['assetCount'],'Unexpected media count'
for i,v in enumerate(assets):text=text.replace(v,f'__THRONEPATH_ASSET_{i}__')
assert hashlib.sha256(text.encode()).hexdigest()==patch['baseSha256'],'Unexpected baseline: regenerate the reviewed patch'
lines=text.splitlines(keepends=True)
for change in reversed(patch['changes']):
 i,j=change['start'],change['end']
 assert ''.join(lines[i:j])==change['before'],'Patch context mismatch'
 lines[i:j]=[change['after']]
text=''.join(lines)
assert hashlib.sha256(text.encode()).hexdigest()==patch['resultSha256'],'Unexpected Beta output'
for i,v in enumerate(assets):text=text.replace(f'__THRONEPATH_ASSET_{i}__',v)
p.write_text(text)
print('Thronepath 1.6.10 Beta: credits only after completion, P pause and M home shortcuts applied')
