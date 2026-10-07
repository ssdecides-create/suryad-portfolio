(function () {
  if (window.__mailPicker) return; window.__mailPicker = true;
  var touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var el, cur;
  function parse(href) {
    var u = href.replace(/^mailto:/i, ''), q = '', i = u.indexOf('?');
    if (i >= 0) { q = u.slice(i + 1); u = u.slice(0, i); }
    var p = new URLSearchParams(q);
    return { to: decodeURIComponent(u), su: p.get('subject') || '', body: p.get('body') || '' };
  }
  function btn(label, primary) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = label;
    b.style.cssText = 'width:100%;display:flex;align-items:center;justify-content:center;gap:8px;font-family:Inter,sans-serif;font-weight:600;font-size:15px;padding:14px 20px;border-radius:100px;cursor:pointer;transition:background .2s,transform .2s;' +
      (primary ? 'background:#F67C29;color:#1A0E06;border:none;' : 'background:transparent;color:#F5F4E8;border:1px solid rgba(245,244,232,0.22);');
    b.onmouseenter = function () { b.style.background = primary ? '#FF8C3D' : 'rgba(245,244,232,0.08)'; b.style.transform = 'translateY(-1px)'; };
    b.onmouseleave = function () { b.style.background = primary ? '#F67C29' : 'transparent'; b.style.transform = 'none'; };
    return b;
  }
  function close() { if (!el) return; el.style.opacity = '0'; var e = el; el = null; setTimeout(function () { e.remove(); }, 200); document.removeEventListener('keydown', onKey); }
  function onKey(e) { if (e.key === 'Escape') close(); }
  function open(href) {
    cur = parse(href); close();
    el = document.createElement('div');
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Email Surya');
    el.style.cssText = 'position:fixed;inset:0;z-index:400;background:rgba(10,8,6,0.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .2s';
    var card = document.createElement('div');
    card.style.cssText = 'position:relative;width:100%;max-width:400px;background:#1F1F1F;border:1px solid rgba(245,244,232,0.12);border-radius:24px;padding:36px 28px 28px;box-shadow:0 24px 60px rgba(0,0,0,0.5);display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;font-family:Inter,sans-serif';
    card.onclick = function (e) { e.stopPropagation(); };
    var x = document.createElement('button'); x.type = 'button'; x.setAttribute('aria-label', 'Close');
    x.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    x.style.cssText = 'position:absolute;top:14px;right:14px;width:40px;height:40px;border-radius:100px;border:none;background:rgba(245,244,232,0.06);color:#E0DFBF;cursor:pointer;display:flex;align-items:center;justify-content:center';
    x.onclick = close;
    var k = document.createElement('div'); k.textContent = 'Drop me a line';
    k.style.cssText = 'font-weight:600;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#9A9985';
    var m = document.createElement('div'); m.textContent = cur.to;
    m.style.cssText = "font-family:'Bricolage Grotesque',sans-serif;font-weight:600;font-size:clamp(1.3rem,5vw,1.6rem);color:#F5F4E8;margin:2px 0 12px;word-break:break-all";
    var g = btn('Write in Gmail', true), o = btn('Write in Outlook'), d = btn('Open mail app'), c = btn('Copy email');
    var su = encodeURIComponent(cur.su), bd = encodeURIComponent(cur.body), to = encodeURIComponent(cur.to);
    g.onclick = function () { window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + to + '&su=' + su + '&body=' + bd, '_blank', 'noopener'); close(); };
    o.onclick = function () { window.open('https://outlook.live.com/mail/0/deeplink/compose?to=' + to + '&subject=' + su + '&body=' + bd, '_blank', 'noopener'); close(); };
    d.onclick = function () { location.href = href; close(); };
    c.onclick = function () {
      var done = function () { c.textContent = 'Copied ✓'; setTimeout(function () { if (c) c.textContent = 'Copy email'; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(cur.to).then(done, done); else done();
    };
    var row = document.createElement('div'); row.style.cssText = 'display:flex;gap:10px;width:100%;flex-wrap:wrap';
    [d, c].forEach(function (b) { b.style.flex = '1 1 140px'; b.style.width = 'auto'; row.appendChild(b); });
    card.append(x, k, m, g, o, row); el.appendChild(card); el.onclick = close;
    document.body.appendChild(el); requestAnimationFrame(function () { if (el) el.style.opacity = '1'; });
    document.addEventListener('keydown', onKey);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (!a) return;
    e.stopPropagation();
    if (touch) return; // phones & tablets: native mailto opens the default mail app
    e.preventDefault(); open(a.getAttribute('href'));
  }, true);
})();
