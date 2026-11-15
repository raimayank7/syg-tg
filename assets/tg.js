/* tg.shareyourgroup.com front end: browse, submit, report. API address in TG_CFG.api. */
(function () {
  var API = (window.TG_CFG || {}).api || '', $ = function (i) { return document.getElementById(i); }, esc = function (s) { return SYG.esc(String(s)); };
  function token() { var t = ''; try { t = localStorage.getItem('tg-token'); } catch (e) {} if (!t) { t = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now()).replace(/-/g, ''); try { localStorage.setItem('tg-token', t); } catch (e) {} } return t; }
  function post(b) { b.token = token(); return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(b) }).then(function (r) { return r.json(); }); }
  var out = $('tg-out');
  if (out && window.TG_LIST) {
    var L = window.TG_LIST, C = window.TG_CATS || {}, q = $('tg-q'), fc = $('tg-fc'), ft = $('tg-ft'), n = $('tg-n');
    var run = function () {
      var w = q.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      var r = L.filter(function (x) { var t = (x[2] + ' ' + x[3] + ' ' + (C[x[4]] || '') + ' ' + x[5]).toLowerCase(); return (!fc.value || x[4] === fc.value) && (!ft.value || x[1] === ft.value) && w.every(function (k) { return t.indexOf(k) > -1; }); });
      out.innerHTML = r.slice(0, 60).map(function (x) { return '<li class="card"><p><b>' + esc(x[2]) + '</b></p><p>' + esc(x[3]) + '</p><div class="tg-meta"><span>' + esc(x[1]) + '</span><span>' + esc(C[x[4]] || '') + '</span><span>' + esc(x[5]) + '</span></div><div class="acts"><a class="btn sm" href="/g/' + esc(x[0]) + '/">Open</a></div></li>'; }).join('');
      n.textContent = L.length ? (r.length + ' listing' + (r.length === 1 ? '' : 's')) : '';
    };
    [q, fc, ft].forEach(function (e) { e.addEventListener('input', run); }); run();
  }
  var f = $('tg-form');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault(); var m = $('tg-msg');
    if (!API) { m.textContent = 'The directory is not switched on yet. Please come back soon.'; return; }
    $('tg-go').disabled = true; m.textContent = 'Sending...';
    post({ action: 'submit', type: $('tg-type').value, cat: $('tg-cat').value, lang: $('tg-lang').value, name: $('tg-name').value, link: $('tg-link').value, desc: $('tg-desc').value }).then(function (r) {
      $('tg-go').disabled = false;
      if (!r.ok) { m.textContent = r.why || 'Could not save the listing.'; return; }
      m.innerHTML = r.status === 'live' ? 'Thank you! Your listing is saved and will appear on the site after the next update (usually within a few hours).' : 'Thank you! Your listing is waiting for a check.'; f.reset();
    }).catch(function () { $('tg-go').disabled = false; m.textContent = 'The service did not answer. Please try again.'; });
  });
  var rep = $('tg-rep');
  if (rep) rep.addEventListener('click', function () {
    if (!API) return; var r = prompt('Why do you report this listing? Type one of: spam, adult, scam, piracy, hate, dead, other', 'spam'); if (!r) return;
    post({ action: 'report', id: rep.getAttribute('data-id'), reason: r.toLowerCase().trim() }).then(function () { SYG.toast('Thank you. We will look at it.'); });
  });
})();
