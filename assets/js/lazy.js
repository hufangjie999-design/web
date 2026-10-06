/* ============================================================
 * lazy.js —— 自实现的图片懒加载
 * ------------------------------------------------------------
 * 为什么不用浏览器原生 loading="lazy"：
 *   在 file:// 协议下（本地双击预览）原生懒加载会跳过加载，
 *   图片会一直停在"未加载"状态，卡片看起来是灰块。
 *   实测：Chrome 无头模式 + file:// 时，下方图片 complete 始终为 false。
 * 因此改为自己控制：data-src 存真实地址，进入视口（或兜底计时到）
 * 才写入 src —— file:// 与 http(s) 行为一致。
 *
 * 用法：
 *   <div class="card__thumb ph is-loading">
 *     <img data-src="真实地址" alt="..." decoding="async">
 *   </div>
 *
 * 兜底策略（保证任何情况下图片都会显示）：
 *   1) IntersectionObserver 进入视口即加载
 *   2) 页面空闲后加载全部（这样打印/整页截图/无 IO 环境都正常）
 *   3) 用户首次交互（滚动/点击/按键）立即加载全部
 * ============================================================ */
(function () {
  'use strict';

  var IDLE_DELAY = 400;     // 首屏稳定后开始后台加载其余图片
  var forceAll = false;

  function markLoaded(img) {
    img.classList.add('is-loaded');
    var box = img.closest('.ph');
    if (box) box.classList.remove('is-loading');
  }

  function markFailed(img) {
    img.classList.add('is-loaded');   // 别让灰块一直闪着
    var box = img.closest('.ph');
    if (box) {
      box.classList.remove('is-loading');
      box.style.background = 'var(--bg-soft)';
    }
  }

  function load(img) {
    if (img.dataset.lazyDone === '1') return;
    img.dataset.lazyDone = '1';

    var src = img.getAttribute('data-src');
    if (!src) { markLoaded(img); return; }

    img.classList.add('is-loading');

    function ok() { markLoaded(img); }
    function bad() { markFailed(img); }

    img.addEventListener('load', ok, { once: true });
    img.addEventListener('error', bad, { once: true });
    img.src = src;

    // 已在缓存里时 load 事件不会再触发，用 complete 补一次
    if (img.complete) {
      if (img.naturalWidth > 0) ok(); else bad();
    }
  }

  function all(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector || 'img[data-src]'));
  }

  function loadAll() {
    all().forEach(load);
  }

  function bind() {
    var imgs = all();
    if (!imgs.length) return;

    if (forceAll || !('IntersectionObserver' in window)) {
      loadAll();
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { load(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '200px 0px' });

    imgs.forEach(function (img) {
      io.observe(img);
      // 已经在视口内的立即加载
      var r = img.getBoundingClientRect();
      if (r.top < window.innerHeight + 200 && r.bottom > -200) {
        load(img);
        io.unobserve(img);
      }
    });
  }

  /* 兜底 1：空闲后台加载全部 */
  function idleLoadAll() {
    var run = function () { forceAll = true; loadAll(); };
    if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 1200 });
    else setTimeout(run, IDLE_DELAY);
  }

  /* 兜底 2：用户一交互就全部加载 */
  function bindInteractionFallback() {
    var once = function () {
      window.removeEventListener('scroll', once);
      window.removeEventListener('click', once);
      window.removeEventListener('keydown', once);
      window.removeEventListener('touchstart', once);
      forceAll = true;
      loadAll();
    };
    window.addEventListener('scroll', once, { passive: true, once: true });
    window.addEventListener('click', once, { once: true });
    window.addEventListener('keydown', once, { once: true });
    window.addEventListener('touchstart', once, { passive: true, once: true });
  }

  function init() {
    bind();
    bindInteractionFallback();
    idleLoadAll();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /* 脚本渲染出来的新图片：DOM 变化后重新绑定一次。
     注意：新图片必须交给 bind()（它按视口判断），不要直接 loadAll()，
     否则详情页刚渲染就被迫全量加载，失去懒加载意义。 */
  if ('MutationObserver' in window) {
    var timer = 0;
    new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(bind, 60);
    }).observe(document.body, { childList: true, subtree: true });
  }

  window.LazyImages = { loadAll: function () { forceAll = true; loadAll(); }, bind: bind };
})();
