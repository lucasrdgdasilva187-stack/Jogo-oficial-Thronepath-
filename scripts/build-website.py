"""Build a portable offline website from the verified original game."""
from pathlib import Path
import base64, hashlib, json, re, shutil, subprocess, sys

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = '4967f2dde6c7ff06f18aebf17d6e9c7188e02b2e7e6f418424c4296fda5f2acc'
for version in ['', '160', '161', '163', '164', '165', '167', '168', '169', '1610', '1611', '1612']:
    name = f'upgrade{version}.py' if version else 'assemble-game.py'
    subprocess.run([sys.executable, str(ROOT / 'scripts' / name)], check=True)
original = (ROOT / 'web/index.html').read_bytes()
assert hashlib.sha256(original).hexdigest() == EXPECTED, 'Original game checksum mismatch'
out = ROOT / 'website-dist'
if out.exists(): shutil.rmtree(out)
(out / 'media').mkdir(parents=True)
assets = {}
def extract(match):
    mime, payload = match.groups()
    raw = base64.b64decode(payload, validate=True)
    ext = {'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp', 'audio/mpeg':'mp3', 'audio/mp3':'mp3', 'audio/wav':'wav', 'audio/ogg':'ogg'}[mime]
    path = 'media/' + hashlib.sha256(raw).hexdigest()[:24] + '.' + ext
    (out / path).write_bytes(raw)
    assets[path] = {'mime':mime, 'bytes':len(raw)}
    return './' + path
text = re.sub(r'data:(image/(?:jpeg|png|webp)|audio/(?:mpeg|mp3|wav|ogg));base64,([A-Za-z0-9+/=]+)', extract, original.decode())
restored = text
for path, info in assets.items():
    restored = restored.replace('./'+path, 'data:'+info['mime']+';base64,'+base64.b64encode((out/path).read_bytes()).decode())
assert restored.encode() == original, 'Media extraction changed original game'
icon = re.search(r'<link rel="icon"[^>]*href="([^"]+)"', text)[1]
manifest = {'name':'Thronepath', 'short_name':'Thronepath', 'lang':'pt-BR', 'id':'./', 'start_url':'./', 'scope':'./', 'display':'standalone', 'orientation':'landscape', 'background_color':'#102638', 'theme_color':'#102638', 'icons':[{'src':icon,'sizes':'1536x1536','type':'image/jpeg','purpose':'any'}]}
(out / 'manifest.webmanifest').write_text(json.dumps(manifest, ensure_ascii=False))
text = re.sub(r'<title>.*?</title>', '<title>Thronepath</title>', text, count=1)
text = text.replace('</head>', '<meta name="theme-color" content="#102638"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Thronepath"><link rel="manifest" href="./manifest.webmanifest"><style>'+ (ROOT/'website/fullscreen.css').read_text() +'</style></head>', 1)
tools = '<aside id="siteTools"><button id="installSite" aria-controls="installHelp">Instalar</button><span id="offlineStatus" role="status" aria-live="polite"></span></aside><section id="installHelp" hidden role="dialog" aria-modal="true" aria-labelledby="installHeading"><h2 id="installHeading">Thronepath na tela inicial</h2><p>No iPhone: abra no Safari, toque em Compartilhar e depois em Adicionar à Tela de Início.</p><p>No Android: abra o menu do navegador e escolha Instalar aplicativo ou Adicionar à tela inicial.</p><p>Carregue o jogo com internet. Quando aparecer Disponível offline, você pode jogar sem conexão. Se os dados do navegador forem apagados, carregue novamente.</p><button id="closeInstallHelp">Voltar ao jogo</button></section><script src="./pwa.js"></script>'
text = text.replace('</body>', tools+'</body>', 1)
(out/'index.html').write_text(text)
shutil.copyfile(ROOT/'website/pwa.js', out/'pwa.js')
(out/'.nojekyll').touch()
files = ['./','./index.html','./pwa.js','./manifest.webmanifest'] + ['./'+name for name in sorted(assets)]
revision = hashlib.sha256(text.encode()+(out/'pwa.js').read_bytes()).hexdigest()[:16]
worker = (ROOT/'website/sw-template.js').read_text().replace('__PRECACHE__',json.dumps(files)).replace('__REVISION__',revision)
(out/'sw.js').write_text(worker)
assert all((out/name).exists() for name in files if name not in ['./'])
assert max(p.stat().st_size for p in out.rglob('*') if p.is_file()) < 25*1024*1024
print(f'Thronepath website: {len(assets)} verified media files, original hash {EXPECTED}, revision {revision}')
