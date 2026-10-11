"""Build the reviewed public Thronepath revision on Vercel."""
from pathlib import Path
import hashlib, shutil, subprocess, sys, os
REVISION = 'cdd96b6e33183de9a8e6d1a21f0c643d4b762ed0'
REPOSITORY = 'https://github.com/lucasrdgdasilva187-stack/Jogo-oficial-Thronepath-.git'
root = Path(__file__).resolve().parent
source = root / 'game-source'
if source.exists(): shutil.rmtree(source)
subprocess.run(['git','init',str(source)],check=True)
subprocess.run(['git','-C',str(source),'remote','add','origin',REPOSITORY],check=True)
subprocess.run(['git','-C',str(source),'fetch','--depth=1','origin',REVISION],check=True)
subprocess.run(['git','-C',str(source),'checkout','--detach','FETCH_HEAD'],check=True)
assert subprocess.check_output(['git','-C',str(source),'rev-parse','HEAD'],text=True).strip() == REVISION
subprocess.run([sys.executable,str(source / 'scripts/build-website.py')],check=True)
assert hashlib.sha256((source / 'website-dist/index.html').read_bytes()).hexdigest() == '400f3d58b4736e83c0f9cd1d17132429377121cf30e7714dc1f20e6051c670eb'
for test in ['website-viewport.cjs','website-canvas.cjs','options1612.cjs']:
    env = dict(os.environ, GAME_HTML=str(source / 'website-dist/index.html'))
    subprocess.run(['node',str(source / 'tests' / test)],cwd=source,env=env,check=True)
output = root / 'dist'
if output.exists(): shutil.rmtree(output)
shutil.copytree(source / 'website-dist',output)
print('Reviewed Thronepath revision built and verified:',REVISION)
