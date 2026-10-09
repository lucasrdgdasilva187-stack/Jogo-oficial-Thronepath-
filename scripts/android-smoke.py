import subprocess,time,xml.etree.ElementTree as ET
from pathlib import Path
PACKAGE='com.lucasrodrigues.thronepath'
def adb(*args):return subprocess.check_output(['adb',*args],text=True)
def alive():assert adb('shell','pidof',PACKAGE).strip(), 'Thronepath closed during startup'
def dump():
 adb('shell','uiautomator','dump','/sdcard/window.xml')
 return ET.fromstring(adb('shell','cat','/sdcard/window.xml'))
def button(label,required=True):
 for attempt in range(8):
  alive();root=dump()
  for n in root.iter('node'):
   if label in [n.get('text'),n.get('content-desc')]:
    import re
    x1,y1,x2,y2=map(int,re.findall(r'\d+',n.get('bounds')))
    adb('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2));time.sleep(2);return True
  if not required:return False
  time.sleep(2)
 raise AssertionError('Missing functional button: '+label)
def launch():
 adb('logcat','-c');adb('shell','am','force-stop',PACKAGE)
 adb('shell','am','start','-n',PACKAGE+'/.MainActivity');time.sleep(5);alive()
def check(fresh):
 launch()
 if not fresh:assert button('Continuar',False),'Installed update must show one-time release notes'
 else:assert not button('Continuar',False),'First install must not show release notes'
 button('Toque para começar');button('Jogar');time.sleep(4);alive()
 log=adb('logcat','-d','-s','AndroidRuntime:E','chromium:E')
 assert 'FATAL EXCEPTION' not in log,log
 assert 'Uncaught ' not in log,log
 Path('smoke-'+('fresh' if fresh else 'upgrade')+'.log').write_text(log)
 subprocess.run(['adb','shell','screencap','-p','/sdcard/smoke.png'],check=True)
 subprocess.run(['adb','pull','/sdcard/smoke.png','smoke-'+('fresh' if fresh else 'upgrade')+'.png'],check=True)
 print('PASS Android '+('fresh install' if fresh else '1.6.0 -> 1.6.3 update')+' opens and starts a phase',flush=True)
import sys
check(sys.argv[1]=='fresh')
