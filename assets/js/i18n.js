/* ============================================================
 * i18n.js —— 中英双语
 * ------------------------------------------------------------
 * 用法：
 *   1) HTML 里给需要翻译的元素加 data-i18n="键名"
 *      （原文照常写在 HTML 里，脚本加载后按当前语言覆写）
 *   2) 需要翻译的属性用 data-i18n-attr="placeholder:键名"
 *   3) 作品内容字段用 I18N.f(w, 'title') 取（自动回退到中文）
 *
 * 语言来源优先级：URL 上的 ?lang= > localStorage 记忆 > 浏览器语言
 * ============================================================ */
(function () {
  'use strict';

  var SUPPORTED = ['zh', 'en'];
  var STORE_KEY = 'portfolio-lang';
  var current = 'zh';

  /* ---------- 语言判定 ---------- */
  function fromUrl() {
    var m = (location.search || '').match(/[?&]lang=([a-zA-Z-]+)/);
    if (!m) return null;
    var v = m[1].toLowerCase().slice(0, 2);
    return SUPPORTED.indexOf(v) >= 0 ? v : null;
  }
  function fromStore() {
    try {
      var v = localStorage.getItem(STORE_KEY);
      return v && SUPPORTED.indexOf(v) >= 0 ? v : null;
    } catch (e) { return null; }
  }
  function fromBrowser() {
    var l = (navigator.language || 'zh').toLowerCase();
    return l.indexOf('zh') === 0 ? 'zh' : 'en';
  }

  /* ---------- 界面文案字典 ---------- */
  var DICT = {
    zh: {
      'nav.works': '作品',
      'nav.about': '关于',
      'nav.contact': '联系',
      'nav.resume': '下载简历',
      'hero.viewWorks': '查看作品 →',
      'hero.resume': '下载简历 PDF',
      'stat.works': '个精选作品',
      'stat.cats': '个设计方向',
      'stat.years': '创作年份',
      'sec.featured': '精选作品',
      'sec.featuredHint': '每个项目都记录了问题、我的角色与最终成果',
      'sec.all': '全部作品',
      'sec.allHint': '支持按方向筛选，也可直接搜索',
      'search.placeholder': '搜索作品名称、简介或工具…',
      'search.label': '搜索作品',
      'search.clear': '清空搜索',
      'search.emptyPrefix': '没有匹配',
      'search.emptySuffix': '的作品。换个词试试，或清空搜索。',
      'grid.empty': '该分类下暂无作品。',
      'filter.all': '全部',
      'about.title': '关于我',
      'about.photoCap': '个人照片占位，待替换为真实照片',
      'about.photoMark': '胡',
      'contact.title': '想聊聊？',
      'contact.email': '邮箱',
      'contact.wechat': '微信',
      'contact.todo': '待补充',
      'contact.mail': '发邮件',
      'contact.pending': '联系方式整理中',
      'resume.missing': '简历准备中',
      'footer.top': '回到顶部 ↑',
      'footer.backHome': '返回首页',
      'footer.site': '个人设计作品集',
      'work.back': '← 返回全部作品',
      'work.brand': '胡方杰 · 设计作品集',
      'work.detailTitle': '作品详情',
      'work.background': '项目背景',
      'work.approach': '我的做法',
      'work.results': '最终成果',
      'work.outcome': '成果与收获',
      'work.video': '视频',
      'work.videoTodo': '视频地址待填',
      'work.videoPlay': '播放',
      'work.prev': '← 上一个',
      'work.next': '下一个 →',
      'work.factYear': '年份',
      'work.factRole': '我的角色',
      'work.factTools': '工具',
      'work.factDuration': '周期',
      'lb.close': '关闭（Esc）',
      'lb.prev': '上一张（←）',
      'lb.next': '下一张（→）',
      'lb.label': '图片放大查看',
      'brand': '设计作品集',
      'page.title': '胡方杰 · 设计作品集',
      'page.desc': '胡方杰的设计作品集：产品设计、视觉传达与数字媒体方向的精选作品。'
    },
    en: {
      'nav.works': 'Work',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.resume': 'Résumé',
      'hero.viewWorks': 'View work →',
      'hero.resume': 'Download résumé (PDF)',
      'stat.works': 'selected projects',
      'stat.cats': 'design fields',
      'stat.years': 'years active',
      'sec.featured': 'Selected work',
      'sec.featuredHint': 'Each project documents the problem, my role, and the outcome',
      'sec.all': 'All work',
      'sec.allHint': 'Filter by field, or search directly',
      'search.placeholder': 'Search by title, summary, or tool…',
      'search.label': 'Search work',
      'search.clear': 'Clear search',
      'search.emptyPrefix': 'No work matches',
      'search.emptySuffix': '. Try another keyword, or clear the search.',
      'grid.empty': 'Nothing in this category yet.',
      'filter.all': 'All',
      'about.title': 'About me',
      'about.photoCap': 'Photo placeholder — to be replaced',
      'about.photoMark': 'HF',
      'contact.title': 'Let\u2019s talk',
      'contact.email': 'Email',
      'contact.wechat': 'WeChat',
      'contact.todo': 'to be added',
      'contact.mail': 'Send email',
      'contact.pending': 'Contact details are being finalised',
      'resume.missing': 'R\u00e9sum\u00e9 in progress',
      'footer.top': 'Back to top ↑',
      'footer.backHome': 'Back to home',
      'footer.site': 'Design portfolio',
      'work.back': '← All work',
      'work.brand': 'Hu Fangjie · Design portfolio',
      'work.detailTitle': 'Project',
      'work.background': 'Context',
      'work.approach': 'What I did',
      'work.results': 'Final results',
      'work.outcome': 'Outcome & takeaways',
      'work.video': 'Video',
      'work.videoTodo': 'Video link pending',
      'work.videoPlay': 'Play',
      'work.prev': '← Previous',
      'work.next': 'Next →',
      'work.factYear': 'Year',
      'work.factRole': 'My role',
      'work.factTools': 'Tools',
      'work.factDuration': 'Duration',
      'lb.close': 'Close (Esc)',
      'lb.prev': 'Previous (←)',
      'lb.next': 'Next (→)',
      'lb.label': 'Enlarged image view',
      'brand': 'Design portfolio',
      'page.title': 'Hu Fangjie · Design Portfolio',
      'page.desc': 'Selected work by Hu Fangjie across product design, visual communication, and digital media.'
    }
  };

  /* ---------- 分类的中英对照 ---------- */
  var CATEGORY_EN = {
    '产品设计': 'Product Design',
    '视觉传达': 'Visual Communication',
    '数字媒体': 'Digital Media'
  };

  /* ---------- API ---------- */
  function t(key, fallback) {
    var d = DICT[current] || DICT.zh;
    if (d[key] != null) return d[key];
    var z = DICT.zh[key];
    return z != null ? z : (fallback != null ? fallback : key);
  }

  /* 取作品字段：英文缺内容时回退中文，避免切换后出现空白 */
  function f(work, key) {
    if (!work) return '';
    if (current === 'en') {
      var v = work[key + '_en'];
      if (v != null && !(Array.isArray(v) && !v.length) && v !== '') return v;
    }
    return work[key] != null ? work[key] : '';
  }

  /* 取数组元素里的文案（process/results/videos 的 caption / title）
     这类对象不是"作品"，用同样的 xxx_en 规则即可 */
  function tc(obj, key) {
    if (!obj) return '';
    if (current === 'en') {
      var v = obj[key + '_en'];
      if (v != null && v !== '') return v;
    }
    return obj[key] != null ? obj[key] : '';
  }

  /* 分类显示名：中文数据 + 英文显示 */
  function cat(name) {
    if (current === 'en' && CATEGORY_EN[name]) return CATEGORY_EN[name];
    return name;
  }

  function lang() { return current; }

  function setLang(next, opts) {
    if (SUPPORTED.indexOf(next) < 0) return;
    current = next;
    try { localStorage.setItem(STORE_KEY, next); } catch (e) { /* 隐私模式忽略 */ }
    document.documentElement.lang = next === 'en' ? 'en' : 'zh-CN';
    apply();
    if (opts && opts.reload) {
      /* 详情页内容由脚本渲染，直接重载最省事、也最不容易出状态错 */
      var url = new URL(location.href);
      url.searchParams.set('lang', next);
      location.replace(url.toString());
    }
  }

  function toggle() { setLang(current === 'zh' ? 'en' : 'zh', { reload: true }); }

  /* 把 data-i18n 的元素按当前语言填好 */
  function apply(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-i18n]');
    Array.prototype.forEach.call(nodes, function (el) {
      var key = el.getAttribute('data-i18n');
      var val = t(key, null);
      if (val != null) el.textContent = val;
    });
    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n-attr]'), function (el) {
      // 格式：placeholder:search.placeholder;aria-label:...
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var kv = pair.split(':');
        if (kv.length !== 2) return;
        var attr = kv[0].trim(), key = kv[1].trim();
        var val = t(key, null);
        if (val != null) el.setAttribute(attr, val);
      });
    });
    // 语言切换按钮的状态
    Array.prototype.forEach.call(scope.querySelectorAll('[data-lang-set]'), function (b) {
      var on = b.getAttribute('data-lang-set') === current;
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('is-on', on);
    });
    // 页面标题与描述
    if (!scope.body || scope.body.contains(document.body)) {
      var pd = document.querySelector('meta[name="description"]');
      if (pd) pd.setAttribute('content', t('page.desc'));
    }
  }

  function boot() {
    // 优先级：URL > 记忆 > 浏览器
    var url = fromUrl();
    var stored = fromStore();
    var browser = fromBrowser();
    current = url || stored || browser;
    if (url) { try { localStorage.setItem(STORE_KEY, url); } catch (e) { /* ignore */ } }
    document.documentElement.lang = current === 'en' ? 'en' : 'zh-CN';
    apply();
  }

  // 暴露 API（其他脚本依赖它）
  window.I18N = {
    t: t, f: f, tc: tc, cat: cat, lang: lang, setLang: setLang, toggle: toggle,
    apply: apply, CATEGORY_EN: CATEGORY_EN, SUPPORTED: SUPPORTED
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
