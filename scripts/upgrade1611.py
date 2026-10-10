"""Add biome artwork and continuous castle journey; preserve original media."""
from pathlib import Path
import re,json,hashlib,base64
root=Path(__file__).resolve().parents[1];p=root/'web/index.html';text=p.read_text();patch=json.loads((root/'source/revision1611.patch.json').read_text())
pattern=r'data:(?:image/(?:jpeg|png|webp)|audio/(?:mpeg|mp3|wav|ogg));base64,[A-Za-z0-9+/=]+'
assets=re.findall(pattern,text);assert len(assets)==patch['assetCount']
for i,v in enumerate(assets):text=text.replace(v,f'__THRONEPATH_ASSET_{i}__')
assert hashlib.sha256(text.encode()).hexdigest()==patch['baseSha256']
lines=text.splitlines(keepends=True)
for c in reversed(patch['changes']):
 assert ''.join(lines[c['start']:c['end']])==c['before'];lines[c['start']:c['end']]=[c['after']]
text=''.join(lines);assert hashlib.sha256(text.encode()).hexdigest()==patch['resultSha256']
for i,v in enumerate(assets):text=text.replace(f'__THRONEPATH_ASSET_{i}__',v)
for asset in patch['newAssets']:
 encoded=(root/asset['path']).read_text().strip();assert hashlib.sha256(base64.b64decode(encoded,validate=True)).hexdigest()==asset['sha256'];text=text.replace(asset['token'],'data:image/jpeg;base64,'+encoded)
assert len(re.findall(pattern,text))==patch['assetCount']+len(patch['newAssets']);p.write_text(text)
print('1.6.11: nine biomes, coherent village and continuous castle approach applied')
