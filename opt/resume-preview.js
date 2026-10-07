(function () {
  if (window.__resumePreview) return;
  var PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  var pdfjsP = null;
  function loadPdfjs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (pdfjsP) return pdfjsP;
    pdfjsP = new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = PDFJS + 'pdf.min.js'; s.async = true;
      s.onload = function () { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js'; res(window.pdfjsLib); };
      s.onerror = rej; document.head.appendChild(s);
    });
    return pdfjsP;
  }
  var blobCache = {};
  function getBlob(href) {
    if (!blobCache[href]) blobCache[href] = fetch(href).then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); });
    return blobCache[href];
  }
  function toast() {
    var el = document.getElementById('dl-toast'); if (el) el.remove();
    el = document.createElement('div'); el.id = 'dl-toast'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
    el.style.cssText = 'position:fixed;left:50%;bottom:calc(28px + env(safe-area-inset-bottom));z-index:10002;transform:translate(-50%,16px);opacity:0;transition:opacity .25s ease,transform .25s ease;display:flex;align-items:center;gap:12px;padding:14px 18px;max-width:calc(100vw - 32px);box-sizing:border-box;background:#1E1E1E;border:1px solid rgba(224,223,191,0.15);border-radius:14px;box-shadow:0 16px 40px rgba(0,0,0,0.45);font-family:Inter,system-ui,sans-serif;color:#E0DFBF';
    el.innerHTML = '<span style="flex:none;width:28px;height:28px;border-radius:50%;background:rgba(246,124,41,0.15);display:flex;align-items:center;justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F67C29" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span><span style="display:flex;flex-direction:column;gap:2px"><span style="font-size:14px;font-weight:600">Resume downloaded successfully</span><span style="font-size:12.5px;color:rgba(224,223,191,0.7)">Saved to your Downloads folder.</span></span>';
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.style.opacity = '1'; el.style.transform = 'translate(-50%,0)'; });
    setTimeout(function () { el.style.opacity = '0'; el.style.transform = 'translate(-50%,16px)'; setTimeout(function () { el.remove(); }, 300); }, 3500);
  }
  function anchorSave(buf, name) {
    var u = URL.createObjectURL(new Blob([buf], { type: 'application/octet-stream' }));
    var t = document.createElement('a'); t.href = u; t.download = name;
    var blurred = false, done = false;
    function onBlur() { blurred = true; }
    function finish() { if (done) return; done = true; window.removeEventListener('blur', onBlur); window.removeEventListener('focus', onFocus); toast(); }
    function onFocus() { if (blurred) setTimeout(finish, 300); }
    window.addEventListener('blur', onBlur); window.addEventListener('focus', onFocus);
    document.body.appendChild(t); t.click(); t.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 60000);
    setTimeout(function () { if (!blurred) finish(); }, 900);
  }
  function download(href, name) {
    if (window.showSaveFilePicker) {
      var picker;
      try { picker = window.showSaveFilePicker({ suggestedName: name, types: [{ description: 'PDF document', accept: { 'application/pdf': ['.pdf'] } }] }); } catch (e) { picker = null; }
      if (picker) return picker.then(function (h) {
        return getBlob(href).then(function (buf) { return h.createWritable().then(function (w) { return w.write(new Blob([buf], { type: 'application/pdf' })).then(function () { return w.close(); }); }); }).then(function () { toast(); return true; });
      }, function (e) {
        if (e && e.name === 'AbortError') return false;
        return getBlob(href).then(function (buf) { anchorSave(buf, name); return true; });
      }).catch(function () { window.location.href = href; return true; });
    }
    return getBlob(href).then(function (buf) { anchorSave(buf, name); return true; }).catch(function () { window.location.href = href; return true; });
  }
  function open(href, name) {
    var prevOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    var ov = document.createElement('div'); ov.id = 'resume-preview';
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Resume preview');
    ov.style.cssText = 'position:fixed;inset:0;z-index:10001;background:rgba(10,6,4,0.82);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;opacity:0;transition:opacity .2s ease;font-family:Inter,system-ui,sans-serif';
    ov.innerHTML =
      '<div data-panel style="width:100%;max-width:820px;height:min(92vh,1100px);display:flex;flex-direction:column;background:#171717;border:1px solid rgba(224,223,191,0.15);border-radius:20px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.5)">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px 14px 20px;border-bottom:1px solid rgba(224,223,191,0.1)">' +
          '<span style="display:flex;flex-direction:column;gap:2px;min-width:0"><span style="font-size:15px;font-weight:600;color:#E0DFBF">Resume preview</span><span style="font-size:12.5px;color:rgba(224,223,191,0.65);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + name + '</span></span>' +
          '<button data-close aria-label="Close preview" style="flex:none;width:44px;height:44px;border-radius:12px;border:1px solid rgba(224,223,191,0.15);background:transparent;color:#E0DFBF;cursor:pointer;display:flex;align-items:center;justify-content:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>' +
        '</div>' +
        '<div data-pages style="flex:1;min-height:0;overflow:auto;-webkit-overflow-scrolling:touch;background:#0F0F0F;padding:16px;display:flex;flex-direction:column;align-items:center;gap:16px">' +
          '<div data-loading style="margin:auto;display:flex;flex-direction:column;align-items:center;gap:12px;color:rgba(224,223,191,0.7);font-size:13px"><span style="width:28px;height:28px;border-radius:50%;border:3px solid rgba(224,223,191,0.15);border-top-color:#F67C29;animation:rpspin .8s linear infinite"></span>Loading resume…</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;justify-content:flex-end;gap:10px;padding:14px 16px;border-top:1px solid rgba(224,223,191,0.1)">' +
          '<button data-cancel style="height:46px;padding:0 18px;border-radius:12px;border:1px solid rgba(224,223,191,0.2);background:transparent;color:#E0DFBF;font:600 14px Inter,system-ui,sans-serif;cursor:pointer">Close</button>' +
          '<button data-dl style="height:46px;padding:0 20px;border-radius:12px;border:none;background:#F67C29;color:#120A06;font:600 14px Inter,system-ui,sans-serif;cursor:pointer;display:flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M6 11l6 6 6-6M5 21h14"/></svg>Download PDF</button>' +
        '</div>' +
      '</div>' +
      '<style>@keyframes rpspin{to{transform:rotate(360deg)}}</style>';
    document.body.appendChild(ov);
    requestAnimationFrame(function () { ov.style.opacity = '1'; });
    var pagesEl = ov.querySelector('[data-pages]');
    function close() { document.removeEventListener('keydown', onKey); ov.style.opacity = '0'; setTimeout(function () { ov.remove(); }, 200); document.body.style.overflow = prevOverflow; }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('[data-close]').onclick = close;
    ov.querySelector('[data-cancel]').onclick = close;
    ov.querySelector('[data-dl]').onclick = function () { download(href, name).then(function (ok) { if (ok) setTimeout(close, 300); }); };
    ov.querySelector('[data-dl]').focus();
    Promise.all([loadPdfjs(), getBlob(href)]).then(function (r) {
      return r[0].getDocument({ data: r[1].slice(0) }).promise;
    }).then(function (pdf) {
      var avail = Math.min(pagesEl.clientWidth - 32, 788); var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var chain = Promise.resolve(); var first = true;
      for (var i = 1; i <= pdf.numPages; i++) (function (n) {
        chain = chain.then(function () { return pdf.getPage(n); }).then(function (page) {
          var base = page.getViewport({ scale: 1 }); var scale = avail / base.width; var vp = page.getViewport({ scale: scale * dpr });
          var c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
          c.style.cssText = 'display:block;width:' + avail + 'px;max-width:100%;height:auto;background:#fff;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,0.4)';
          if (first) { first = false; var l = pagesEl.querySelector('[data-loading]'); if (l) l.remove(); }
          pagesEl.appendChild(c);
          return page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
        });
      })(i);
      return chain;
    }).catch(function () {
      var l = pagesEl.querySelector('[data-loading]'); if (l) l.remove();
      var f = document.createElement('iframe'); f.src = href + '#view=FitH'; f.title = 'Resume';
      f.style.cssText = 'width:100%;flex:1;min-height:70vh;border:0;border-radius:6px;background:#fff';
      pagesEl.appendChild(f);
    });
  }
  window.__resumePreview = open;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[download]'); if (!a) return;
    var href = a.getAttribute('href') || ''; if (!/\.pdf($|\?)/i.test(href)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    open(href, a.getAttribute('download') || 'Resume.pdf');
  }, true);
  if ('requestIdleCallback' in window) requestIdleCallback(function () { loadPdfjs().catch(function () {}); }, { timeout: 4000 });
})();
