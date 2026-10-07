(() => {
  if (window.__skelInit) return; window.__skelInit = true;
  const st = document.createElement('style');
  st.textContent = '@keyframes skel-sweep{0%{background-position:150% 0}100%{background-position:-50% 0}}' +
    'img[data-skel]{background-color:#262320!important;background-image:linear-gradient(100deg,rgba(255,255,255,0) 20%,rgba(255,255,255,.10) 40%,rgba(255,255,255,.22) 50%,rgba(255,255,255,.10) 60%,rgba(255,255,255,0) 80%)!important;background-size:250% 100%!important;background-repeat:no-repeat!important;animation:skel-sweep 1.3s linear infinite;color:transparent}' +
    'img[data-skel-fade]{transition:opacity .45s ease}' +
    '@media (prefers-reduced-motion:reduce){img[data-skel]{animation:none}}';
  document.head.appendChild(st);
  const done = (img) => { img.removeAttribute('data-skel'); };
  const tag = (img) => {
    if (img.__skel) return; img.__skel = true;
    const w = parseInt(img.getAttribute('width') || '0', 10);
    if (w && w < 80) return;
    if (img.complete && img.naturalWidth) return;
    img.setAttribute('data-skel', '');
    img.addEventListener('load', () => done(img), { once: true });
    img.addEventListener('error', () => done(img), { once: true });
  };
  const scan = (root) => { (root.tagName === 'IMG' ? [root] : root.querySelectorAll ? root.querySelectorAll('img') : []).forEach(tag); };
  scan(document);
  new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && scan(n)))).observe(document.documentElement, { childList: true, subtree: true });
})();
