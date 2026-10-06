/* ============================================================
 * lightbox.js —— 图片灯箱
 * 点击作品图可放大查看细节；支持：
 *   - Esc / 点击遮罩 / 点击关闭按钮 关闭
 *   - ← → 在本页所有可放大图片间切换
 *   - 打开时锁定页面滚动，关闭后恢复到原位置
 *   - 焦点管理（打开后焦点进入对话框，关闭后回到触发元素）
 * 用法：给 <img> 加 data-zoom="1"，可选 data-caption="说明文字"
 * ============================================================ */
(function () {
  'use strict';

  var box = null, imgEl = null, capEl = null, idxEl = null;
  var items = [], current = 0, lastFocus = null, scrollY = 0;

  function collect() {
    items = Array.prototype.slice.call(document.querySelectorAll('img[data-zoom]'));
  }

  function T(key, fallback) {
    return (window.I18N && window.I18N.t(key, fallback)) || fallback || key;
  }

  function build() {
    if (box) return;
    box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', T('lb.label', '图片放大查看'));
    box.innerHTML = '' +
      '<button class="lightbox__close" type="button" aria-label="' + T('lb.close', '关闭') + '">×</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="' + T('lb.prev', '上一张') + '">‹</button>' +
      '<figure class="lightbox__fig">' +
        '<img class="lightbox__img" alt="">' +
        '<figcaption class="lightbox__cap"></figcaption>' +
      '</figure>' +
      '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="' + T('lb.next', '下一张') + '">›</button>' +
      '<div class="lightbox__idx"></div>';
    document.body.appendChild(box);

    imgEl = box.querySelector('.lightbox__img');
    capEl = box.querySelector('.lightbox__cap');
    idxEl = box.querySelector('.lightbox__idx');

    box.querySelector('.lightbox__close').addEventListener('click', close);
    box.querySelector('.lightbox__nav--prev').addEventListener('click', function (e) { e.stopPropagation(); go(-1); });
    box.querySelector('.lightbox__nav--next').addEventListener('click', function (e) { e.stopPropagation(); go(1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
  }

  function show(i) {
    if (!items.length) return;
    current = (i + items.length) % items.length;
    var el = items[current];
    var src = el.currentSrc || el.getAttribute('data-src') || el.src;
    imgEl.src = src;
    imgEl.alt = el.alt || '';
    var cap = el.getAttribute('data-caption') || el.alt || '';
    capEl.textContent = cap;
    capEl.style.display = cap ? '' : 'none';
    idxEl.textContent = (current + 1) + ' / ' + items.length;
    var multi = items.length > 1;
    box.querySelector('.lightbox__nav--prev').style.display = multi ? '' : 'none';
    box.querySelector('.lightbox__nav--next').style.display = multi ? '' : 'none';
    idxEl.style.display = multi ? '' : 'none';
  }

  function go(step) { show(current + step); }

  function open(el) {
    build();
    collect();
    var i = items.indexOf(el);
    lastFocus = document.activeElement;
    scrollY = window.scrollY || document.documentElement.scrollTop;
    document.body.style.position = 'fixed';
    document.body.style.top = (-scrollY) + 'px';
    document.body.style.width = '100%';
    box.classList.add('is-on');
    document.documentElement.style.overflow = 'hidden';
    show(i < 0 ? 0 : i);
    box.querySelector('.lightbox__close').focus();
  }

  function close() {
    if (!box || !box.classList.contains('is-on')) return;
    box.classList.remove('is-on');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.documentElement.style.overflow = '';
    window.scrollTo(0, scrollY);
    imgEl.removeAttribute('src');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* 事件委托：图片是脚本渲染的，用 document 层监听最稳 */
  document.addEventListener('click', function (e) {
    var img = e.target.closest ? e.target.closest('img[data-zoom]') : null;
    if (img) { e.preventDefault(); open(img); }
  });

  document.addEventListener('keydown', function (e) {
    if (!box || !box.classList.contains('is-on')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  });

  window.Lightbox = { open: open, close: close, refresh: collect };
})();
