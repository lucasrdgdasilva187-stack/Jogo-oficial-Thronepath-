/* Keep the game and its controls inside the same visible browser rectangle. */
(() => {
  const root = document.documentElement;
  let safe = {top:0,right:0,bottom:0,left:0};
  const viewport = window.ThronepathViewport = {width:1,height:1};
  function measureSafeArea() {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
    document.body.appendChild(probe);
    const style = getComputedStyle(probe);
    for (const side of ['top','right','bottom','left']) safe[side] = parseFloat(style['padding'+side[0].toUpperCase()+side.slice(1)]) || 0;
    probe.remove();
  }
  function sync() {
    const visible = window.visualViewport;
    viewport.width = Math.max(1, visible?.width || window.innerWidth);
    viewport.height = Math.max(1, visible?.height || window.innerHeight);
    const w = viewport.width, h = viewport.height;
    root.style.setProperty('--app-width', w+'px');
    root.style.setProperty('--app-height', h+'px');
    root.style.setProperty('--app-left', (visible?.offsetLeft || 0)+'px');
    root.style.setProperty('--app-top', (visible?.offsetTop || 0)+'px');
    const gap = Math.min(11, Math.max(5, h*.01));
    const preferredTop = Math.max(h,w*.5625)*.4;
    const footer = 48, stats = 40;
    const compact = h-safe.bottom-footer-stats-preferredTop < 4*44+3*gap;
    const rows = compact ? 2 : 4;
    const top = Math.max(safe.top+12, Math.min(preferredTop, h-safe.bottom-footer-stats-rows*44-(rows-1)*gap));
    const button = Math.max(44, Math.min(54, (h-safe.bottom-footer-stats-top-(rows-1)*gap)/rows));
    root.dataset.compactMenu = String(compact);
    root.style.setProperty('--home-menu-top', top+'px');
    root.style.setProperty('--home-button-height', button+'px');
    root.style.setProperty('--home-gap', gap+'px');
    if (typeof window.resize === 'function') window.resize();
  }
  viewport.sync = sync;
  sync();
  document.addEventListener('DOMContentLoaded', () => {measureSafeArea();sync();});
  window.addEventListener('resize', () => {measureSafeArea();sync();});
  window.addEventListener('orientationchange', () => {measureSafeArea();sync();});
  document.addEventListener('fullscreenchange', () => {measureSafeArea();sync();});
  window.visualViewport?.addEventListener('resize', sync);
  window.visualViewport?.addEventListener('scroll', sync);
})();
