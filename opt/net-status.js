(function () {
  if (window.__netStatus) return; window.__netStatus = true;
  var el, hideT;
  function make() {
    el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.style.cssText = 'position:fixed;left:50%;bottom:24px;z-index:10000;transform:translate(-50%,24px);opacity:0;pointer-events:none;transition:opacity .35s ease,transform .45s cubic-bezier(.16,.84,.44,1);display:flex;align-items:center;gap:12px;max-width:calc(100vw - 32px);background:rgba(23,23,23,0.94);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(224,223,191,0.18);border-radius:100px;padding:10px 12px 10px 16px;box-shadow:0 18px 40px rgba(0,0,0,0.45);font-family:Inter,ui-sans-serif,sans-serif;font-size:14px;color:#E0DFBF';
    el.innerHTML = '<span data-dot style="width:8px;height:8px;border-radius:50%;flex-shrink:0"></span><span data-msg style="line-height:1.35"></span><button type="button" data-btn style="flex-shrink:0;border:none;cursor:pointer;background:#F67C29;color:#171717;font:600 13px Inter,sans-serif;padding:7px 14px;border-radius:100px">Retry</button>';
    el.querySelector('[data-btn]').onclick = function () { if (navigator.onLine) location.reload(); };
    document.body.appendChild(el);
  }
  function show(off) {
    if (!el) make();
    clearTimeout(hideT);
    el.querySelector('[data-dot]').style.background = off ? '#F67C29' : '#5FBE7C';
    el.querySelector('[data-msg]').textContent = off ? "You're offline. Some images or pages may not load." : 'Back online.';
    el.querySelector('[data-btn]').style.display = off ? '' : 'none';
    el.style.pointerEvents = 'auto'; el.style.opacity = '1'; el.style.transform = 'translate(-50%,0)';
    if (!off) hideT = setTimeout(hide, 2600);
  }
  function hide() { if (!el) return; el.style.opacity = '0'; el.style.transform = 'translate(-50%,24px)'; el.style.pointerEvents = 'none'; }
  window.addEventListener('offline', function () { show(true); });
  window.addEventListener('online', function () { show(false); });
  function init() { if (navigator.onLine === false) show(true); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  // Send in-site links to the offline page when there's no connection.
  document.addEventListener('click', function (e) {
    if (navigator.onLine !== false) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || /^(mailto:|tel:|#)/.test(a.getAttribute('href'))) return;
    if (a.origin !== location.origin) return;
    e.preventDefault();
    show(true);
  }, true);
})();
