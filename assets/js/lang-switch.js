/* ============================================================
 * lang-switch.js —— 语言切换按钮的交互
 * 依赖 i18n.js（先加载）
 * ============================================================ */
(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-lang-set]') : null;
    if (!btn || !window.I18N) return;
    var next = btn.getAttribute('data-lang-set');
    if (next === window.I18N.lang()) return;
    window.I18N.setLang(next, { reload: true });
  });

  /* 切到英文时，页面标题也换掉（静态 title 标签没法用 data-i18n 直接改） */
  if (window.I18N) {
    var applyTitle = function () {
      var t = document.querySelector('title');
      if (t && window.I18N.lang() === 'en') t.textContent = window.I18N.t('page.title');
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyTitle);
    else applyTitle();
  }
})();
