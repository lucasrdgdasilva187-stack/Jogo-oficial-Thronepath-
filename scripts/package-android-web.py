"""Extract embedded media losslessly so Android parses a small startup document.
The standalone HTML stays fully self-contained. No network resources are added.
"""
from pathlib import Path
import base64,hashlib,json,re,shutil
root=Path(__file__).resolve().parents[1]
out=root/'android-web'
if out.exists():shutil.rmtree(out)
(out/'media').mkdir(parents=True)
original=(root/'web/index.html').read_text()
assets={}
def extract(match):
 mime,payload=match.groups();data=base64.b64decode(payload,validate=True)
 ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','audio/mpeg':'mp3','audio/mp3':'mp3','audio/wav':'wav','audio/ogg':'ogg'}[mime]
 name='media/'+hashlib.sha256(data).hexdigest()[:24]+'.'+ext
 (out/name).write_bytes(data);assets[name]={'mime':mime,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
 return './'+name
pattern=r'data:(image/(?:jpeg|png|webp)|audio/(?:mpeg|mp3|wav|ogg));base64,([A-Za-z0-9+/=]+)'
small=re.sub(pattern,extract,original)
(out/'index.html').write_text(small)
# Verify every replacement can restore exactly the original media payload.
restored=small
for name,info in assets.items():
 data=(out/name).read_bytes()
 restored=restored.replace('./'+name,'data:'+info['mime']+';base64,'+base64.b64encode(data).decode())
assert restored==original,'Packaging changed game content'
(root/'ANDROID_ASSETS.json').write_text(json.dumps({'standaloneBytes':len(original.encode()),'startupBytes':len(small.encode()),'assets':assets},indent=2))
print(f'Lossless Android assets: {len(assets)}, startup HTML: {len(small.encode())} bytes (was {len(original.encode())})')
