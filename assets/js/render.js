/* ============================================================
 * render.js —— 用 WORKS 数据渲染首页
 * 依赖：works-data.js、i18n.js（必须先加载）
 * ============================================================ */
(function () {
  'use strict';

  var ORIGIN = (window.SITE_CONFIG && window.SITE_CONFIG.ORIGIN_ROOT) || '../作品集/';

  /* ---------- i18n 小工具（i18n.js 缺失时优雅退化为中文） ---------- */
  function T(key, fallback) {
    return (window.I18N && window.I18N.t(key, fallback)) || fallback || key;
  }
  function FW(work, key) {
    if (window.I18N) return window.I18N.f(work, key);
    return work[key] != null ? work[key] : '';
  }
  function CAT(name) {
    return (window.I18N && window.I18N.cat(name)) || name;
  }

  /* ---------- 工具 ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* 图片地址：
   *   优先用 build_images.py 处理过的压缩图（assets/img/manifest.js）
   *   清单里没有就回退到原始素材（作品集/…），保证换素材后也不会破图 */
  function imgSrc(rel, width) {
    return ORIGIN + rel + '.png';
  }

  function coverSrc(w) {
    var m = (window.IMG_MANIFEST || {})[w.id];
    if (m && m.cover) return m.cover;
    return imgSrc(w.cover || w.hero, 800);
  }

  function visibleWorks() {
    return (window.WORKS || []).filter(function (w) { return w.visible !== false; });
  }

  /* 判断一个配置值是否"真的填了"：
     空、纯空格、以及明显是占位的值（如 12345678 / 待补充）都算没填。
     这样资料没到位时 UI 会自动降级，填上后无需改代码。 */
  var PLACEHOLDER_RE = /^(12345678|待补充|todo|tbd|xxx+|test|-+)$/i;
  function isRealValue(v) {
    if (v == null) return false;
    var s = String(v).trim();
    if (!s) return false;
    if (PLACEHOLDER_RE.test(s)) return false;
    return true;
  }

  function byId(id) {
    var list = window.WORKS || [];
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; }
    return null;
  }

  /* ---------- 卡片 ---------- */
  function cardHtml(w, wide) {
    var src = coverSrc(w);
    var title = FW(w, 'title');
    var role = FW(w, 'role');
    /* 搜索用：中英字段一起进索引，这样在中文界面搜英文词也能命中 */
    var haystack = [
      w.title, w.title_en, w.category, window.I18N ? window.I18N.CATEGORY_EN[w.category] : '',
      w.summary, w.summary_en, w.role, w.role_en, w.year, w.duration, w.duration_en
    ].concat(w.tools || []).concat(w.keywords || []).concat(w.keywords_en || [])
      .join(' ').toLowerCase();
    return '' +
      '<a class="card reveal' + (wide ? ' card--wide' : '') + '" data-cat="' + escapeHtml(w.category) + '" ' +
        'data-search="' + escapeHtml(haystack) + '" ' +
        'href="works.html#/' + escapeHtml(w.id) + '" title="' + escapeHtml(title) + '">' +
        '<div class="card__thumb ph is-loading">' +
          /* 用 data-src 交给 lazy.js 加载：原生 loading="lazy" 在 file:// 下不加载 */
          '<img data-src="' + escapeHtml(src) + '" alt="' + escapeHtml(title) + '" decoding="async">' +
          '<span class="card__hover">' + escapeHtml(T('nav.works') === 'Work' ? 'View project →' : '查看详情 →') + '</span>' +
        '</div>' +
        '<div class="card__meta">' +
          '<div><h3>' + escapeHtml(title) + '</h3>' +
          '<p>' + escapeHtml(w.category + (w.role ? ' · ' + w.role : '')) + '</p></div>' +
          '<div class="year">' + escapeHtml(w.year) + '</div>' +
        '</div>' +
      '</a>';
  }

  /* ---------- 图片：交给 lazy.js（data-src + 自动兜底） ---------- */
  function kickLazy() {
    if (window.LazyImages && window.LazyImages.bind) window.LazyImages.bind();
  }

  /* ---------- 进场动效（尊重 prefers-reduced-motion） ----------
   * 注意：卡片是脚本渲染出来的，必须在渲染完成之后再调用本函数，
   * 否则 IntersectionObserver 观察不到它们，元素会一直停在 opacity:0。 */
  var revealBound = false;
  function bindReveal() {
    var items = $$('.reveal:not(.is-in)');
    if (!items.length) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) {
      io.observe(el);
      // 已经在视口内的元素立即显示，不等回调（避免首屏内容空一拍）
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
        el.classList.add('is-in');
        io.unobserve(el);
      }
    });

    // 兜底：任何原因导致没触发（比如元素尺寸为 0），1.2 秒后强制显示，
    // 保证内容绝不会因为动画而永久不可见。
    setTimeout(function () {
      items.forEach(function (el) { el.classList.add('is-in'); });
    }, 1200);
  }

  /* ---------- 精选作品 ---------- */
  function renderFeatured() {
    var box = $('#featured');
    if (!box) return;
    var works = visibleWorks().filter(function (w) { return w.featured; }).slice(0, 3);
    if (!works.length) { box.parentElement.style.display = 'none'; return; }
    box.innerHTML = works.map(function (w, i) { return cardHtml(w, i === 0); }).join('');
    var count = $('#featured-count');
    if (count) count.textContent = '0' + works.length + ' / ' + visibleWorks().length;
  }

  /* ---------- 全部作品：分类筛选 + 搜索 ----------
   * 两者是"与"的关系：
   *   分类按钮决定范围，搜索词在范围内进一步过滤。
   * 但搜索会顺手切回"全部"分类——因为用户搜"海报"时，
   * 期望搜的是所有作品，而不是当前恰好停留的分类。 */
  function renderGrid() {
    var box = $('#grid');
    if (!box) return;
    var works = visibleWorks();
    box.innerHTML = works.map(function (w) { return cardHtml(w, false); }).join('');

    var filters = $('#filters');
    var empty = $('#empty');
    var count = $('#grid-count');
    var searchInput = $('#search-input');
    var searchClear = $('#search-clear');

    var state = { cat: '全部', q: '' };

    function apply() {
      var q = state.q.trim().toLowerCase();
      var hit = 0, total = 0;
      $$('.card', box).forEach(function (card) {
        total++;
        var okCat = (state.cat === '全部' || card.getAttribute('data-cat') === state.cat);
        var okQ = !q || (card.getAttribute('data-search') || '').indexOf(q) >= 0;
        var match = okCat && okQ;
        card.hidden = !match;
        if (match) hit++;
      });
      if (count) count.textContent = hit + ' / ' + total;
      if (empty) {
        empty.textContent = q
          ? T('search.emptyPrefix') + ' “' + state.q.trim() + '” ' + T('search.emptySuffix')
          : T('grid.empty');
        empty.classList.toggle('is-on', hit === 0);
      }
      if (searchClear) searchClear.hidden = !state.q;
    }

    function setCat(cat, syncButtons) {
      state.cat = cat;
      if (syncButtons !== false && filters) {
        $$('.filter', filters).forEach(function (b) {
          b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === cat));
        });
      }
      apply();
    }

    if (filters) {
      var cats = [{ key: '全部', label: T('filter.all') }].concat(
        (window.CATEGORIES || []).map(function (c) { return { key: c, label: CAT(c) }; })
      );
      filters.innerHTML = cats.map(function (c, i) {
        /* data-cat 存中文原值（内部匹配用），显示文字才翻译 */
        return '<button class="filter" type="button" data-cat="' + escapeHtml(c.key) + '" ' +
               'aria-pressed="' + (i === 0 ? 'true' : 'false') + '">' + escapeHtml(c.label) + '</button>';
      }).join('');
      filters.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter');
        if (!btn) return;
        setCat(btn.getAttribute('data-cat'));
      });
    }

    if (searchInput) {
      var timer = 0;
      var onInput = function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          var q = searchInput.value || '';
          var had = state.q;
          state.q = q;
          if (q.trim() && state.cat !== '全部') setCat('全部');   // 搜索时回到全部范围
          else if (!q.trim() && had.trim()) apply();
          else apply();
        }, 120);
      };
      searchInput.addEventListener('input', onInput);
      searchInput.addEventListener('search', onInput);          // 点原生清除按钮
      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { searchInput.value = ''; state.q = ''; apply(); searchInput.blur(); }
      });
    }
    if (searchClear) {
      searchClear.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        state.q = '';
        apply();
        if (searchInput) searchInput.focus();
      });
    }

    apply();

    /* 支持 ?q=关键词 直接带着搜索结果打开（方便分享/截图，例如 ?q=海报） */
    if (searchInput) {
      var m = (location.search || '').match(/[?&]q=([^&]+)/);
      if (m) {
        var q0 = decodeURIComponent(m[1].replace(/\+/g, ' '));
        searchInput.value = q0;
        state.q = q0;
        apply();
      }
    }
  }

  /* ---------- 关于我 / 联系方式 ---------- */
  function renderAbout() {
    var site = window.SITE || {};
    var EN = window.I18N && window.I18N.lang() === 'en';
    var setText = function (sel, text) { var el = $(sel); if (el) el.textContent = text; };
    var setHtml = function (sel, html) { var el = $(sel); if (el) el.innerHTML = html; };

    setText('#site-name', site.name || '');
    /* 静态文案（品牌、定位、按钮等）由 i18n.js 通过 data-i18n 处理，
       这里只填数据驱动的部分。 */

    var heroTitle = $('#hero-title');
    if (heroTitle) {
      var ht = (EN && site.heroTitle_en) ? site.heroTitle_en : site.heroTitle;
      if (ht) heroTitle.innerHTML = ht;
    }
    /* 定位标签在英文下用英文；中文下留空由 data-i18n 机制处理 */
    var posEl = $('#site-positioning');
    if (posEl) {
      posEl.textContent = EN
        ? ((site.positioning_en) || 'Product Design · Visual Communication · Digital Media')
        : (site.positioning || '');
    }
    setText('#hero-lede', (EN && site.heroLede_en) ? site.heroLede_en : (site.heroLede || ''));

    var about = $('#about-body');
    if (about) {
      var paras = (EN && site.about_en) ? site.about_en : site.about;
      if (paras) {
        about.innerHTML = paras.map(function (p) { return '<p>' + escapeHtml(p) + '</p>'; }).join('');
      }
    }

    var skills = $('#skills');
    if (skills) {
      var sk = (EN && site.skills_en) ? site.skills_en : site.skills;
      if (sk) {
        skills.innerHTML = sk.map(function (s) {
          return '<span class="chip">' + escapeHtml(s) + '</span>';
        }).join('');
      }
    }

    var tl = $('#timeline');
    if (tl) {
      var rows = (EN && site.timeline_en) ? site.timeline_en : site.timeline;
      if (rows) {
        tl.innerHTML = rows.map(function (r) {
          return '<div class="tl-row"><b>' + escapeHtml(r.year) + '</b><span>' + escapeHtml(r.text) + '</span></div>';
        }).join('');
      }
    }

    // 首屏统计
    var works = visibleWorks();
    var years = works.map(function (w) { return parseInt(w.year, 10); }).filter(Boolean);
    var range = years.length
      ? Math.min.apply(null, years) + '–' + String(Math.max.apply(null, years)).slice(-2)
      : '—';
    setText('#stat-works', String(works.length));
    setText('#stat-cats', String((window.CATEGORIES || []).length));
    setText('#stat-years', range);

    // 联系方式：留空或明显是占位值时自动隐藏该项，不显示"待补充"半成品
    var c = site.contact || {};
    var todo = T('contact.todo', '待补充');
    var emailEl = $('#contact-email');
    var hasEmail = isRealValue(c.email) && c.email.indexOf('@') > 0;
    if (emailEl) emailEl.textContent = hasEmail ? c.email : '';

    var emailItem = $('#contact-email-item');
    if (emailItem) emailItem.hidden = !hasEmail;
    if (hasEmail && emailEl) emailEl.href = 'mailto:' + c.email;

    var hasWechat = isRealValue(c.wechat);
    var wechatEl = $('#contact-wechat');
    if (wechatEl) wechatEl.textContent = hasWechat ? c.wechat : '';
    var wechatItem = $('#contact-wechat-item');
    if (wechatItem) wechatItem.hidden = !hasWechat;

    // 邮箱显示时，如果微信不显示，"·"分隔符要去掉
    var sep = emailItem ? emailItem.querySelector('.sep') : null;
    if (sep) sep.hidden = !hasWechat;

    // 两项都没有：给一句得体的话，而不是留一片空
    var todoEl = $('#contact-todo');
    if (todoEl) todoEl.hidden = hasEmail || hasWechat;

    // 发邮件按钮：没有邮箱时整块隐藏，避免一个点了没反应的按钮
    var mailBtn = $('#mail-btn');
    if (mailBtn) {
      if (hasEmail) {
        mailBtn.hidden = false;
        mailBtn.href = 'mailto:' + c.email;
        mailBtn.removeAttribute('aria-disabled');
      } else {
        mailBtn.hidden = true;
        mailBtn.href = 'javascript:void(0)';
        mailBtn.setAttribute('aria-disabled', 'true');
      }
    }

    // 个人照片：SITE.photo 有值就显示图片，否则显示设计过的占位块
    var portrait = $('#portrait');
    if (portrait) {
      var photo = isRealValue(site.photo) ? site.photo : null;
      var mark = $('#portrait-mark');
      if (photo) {
        portrait.classList.remove('is-placeholder');
        portrait.innerHTML = '<img src="' + escapeHtml(photo) + '" alt="' +
          escapeHtml((site.name || '') + ' · ' + T('about.title')) + '" decoding="async">';
        var cap = $('#portrait-cap');
        if (cap) cap.hidden = true;
      } else {
        portrait.classList.add('is-placeholder');
        if (!mark) {
          portrait.innerHTML = '<span class="portrait__mark" id="portrait-mark"></span>';
          mark = $('#portrait-mark');
        }
        if (mark) mark.textContent = T('about.photoMark', '胡');
      }
    }

    // 简历可用性检测（首页与详情页共用同一套逻辑）
    checkResume(site);

    setText('#footer-year', String(new Date().getFullYear()));
    setHtml('#footer-name', escapeHtml(site.name || ''));
  }

  /* 简历文件不存在时，把按钮文案与状态一起改掉 ——
     留一个"下载简历"却点了没反应，比没有按钮更让人困惑。
     文案放在 <span data-resume-label> 里，切语言时 i18n 能正常覆盖；
     降级后再移除该属性，避免被覆盖回"下载简历"。
     注意：file:// 下浏览器不允许 HEAD 请求，所以本地预览不检测，
     部署到 http(s) 后才真正校验。 */
  function checkResume(site) {
    var c = (site && site.contact) || {};
    var resumeLinks = $$('[data-resume]');
    var canCheck = location.protocol === 'http:' || location.protocol === 'https:';
    if (!resumeLinks.length || !canCheck) return;

    var resumePath = (c.resume || 'resume.pdf');
    fetch(resumePath, { method: 'HEAD' })
      .then(function (res) { if (!res.ok) throw new Error('missing'); })
      .catch(function () {
        resumeLinks.forEach(function (a) {
          var label = a.querySelector('[data-resume-label]');
          var original = (label ? label.textContent : a.textContent).trim();
          a.removeAttribute('href');
          a.removeAttribute('download');
          a.setAttribute('aria-disabled', 'true');
          a.classList.add('is-missing');
          a.setAttribute('aria-label', original + '（' + T('resume.missing') + '）');
          if (label) {
            label.textContent = T('resume.missing');
            label.removeAttribute('data-i18n');
          } else {
            a.textContent = T('resume.missing');
          }
          a.title = T('resume.missing') + '：把 PDF 命名为 ' + resumePath + ' 放在站点根目录即自动生效';
          a.addEventListener('click', function (e) { e.preventDefault(); });
        });
      });
  }

  /* ---------- 启动 ---------- */
  function init() {
    renderAbout();
    renderFeatured();
    renderGrid();
    kickLazy();
    bindReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 暴露给调试
  window.Portfolio = { works: visibleWorks, byId: byId, imgSrc: imgSrc };
})();
