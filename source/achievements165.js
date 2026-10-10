const achievementQueue=[];let achievementShowing=false;
function notifyAchievement(a){achievementQueue.push(a);showNextAchievement();}
function showNextAchievement(){
 if(achievementShowing||!achievementQueue.length)return;
 achievementShowing=true;const a=achievementQueue.shift(),box=$('achievementToast');
 $('achievementToastTitle').textContent=a[1];$('achievementToastDescription').textContent=a[2];box.hidden=false;box.classList.remove('celebrate');void box.offsetWidth;box.classList.add('celebrate');
 if(!muted&&audioContext&&audioContext.state==='running'){const t=audioContext.currentTime;[659,784,1047].forEach((f,i)=>tone(f,t+i*.09,.2,.09*settings.effects/100,'sine'));}
 setTimeout(()=>{box.hidden=true;achievementShowing=false;showNextAchievement();},3600);
}
