/* ============================================================
 * works.js —— 作品详情页
 * 路由：works.html#/<作品 id>
 *   例：works.html#/ziguji
 * 找不到 id 时自动跳转到第一个作品，方便直接分享链接。
 * ============================================================ */
(function () {
  'use strict';

  var ORIGIN = (window.SITE_CONFIG && window.SITE_CONFIG.ORIGIN_ROOT) || '../作品集/';
  var root = document.getElementById('work-root');
  if (!root) return;

  var currentWork = null;   // 当前渲染的作品，供图片编号与文案使用

  /* ---------- i18n 小工具（i18n.js 缺失时退化为中文） ---------- */
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
  /* 取数组元素里的文案（process/results/videos） */
  function TC(obj, key) {
    if (window.I18N && window.I18N.tc) return window.I18N.tc(obj, key);
    return obj && obj[key] != null ? obj[key] : '';
  }

  function $(sel, r) { return (r || document).querySelector(sel); }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function imgSrc(rel, w) { return ORIGIN + rel + '.png'; }

  function visibleWorks() {
    return (window.WORKS || []).filter(function (w) { return w.visible !== false; });
  }

  /* 处理后的图片优先（assets/img/manifest.js），否则回退原始素材 */
  function manifestOf(id) {
    return (window.IMG_MANIFEST || {})[id] || {};
  }
  function heroSrc(w) {
    var m = manifestOf(w.id);
    if (m.hero) return m.hero;
    return imgSrc(w.hero || w.cover, 1600);
  }

  function currentId() {
    var h = location.hash || '';
    var m = h.match(/#\/([A-Za-z0-9_-]+)/);
    return m ? m[1] : '';
  }

  function findWork(id) {
    var list = visibleWorks();
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; }
    return null;
  }

  /* 图片编号连续：先 process 再 results，与 build_images.py 的编号规则一致 */
  var figCounter = 0;

  function figures(list, wideFirst) {
    if (!list || !list.length) return '';
    var wTitle = currentWork ? FW(currentWork, 'title') : '';
    return '<div class="figs">' + list.map(function (f, i) {
      var wide = wideFirst && i === 0;
      figCounter++;
      var m = manifestOf(currentWork ? currentWork.id : '');
      var figs = m.figures || [];
      var src = figs[figCounter - 1] || imgSrc(f.img, wide ? 1600 : 1200);
      /* 图注双语：process/results 项里的 caption / caption_en */
      var cap = TC(f, 'caption');
      return '<figure class="fig' + (wide ? ' fig--wide' : '') + '" style="margin:0">' +
        '<div class="fig__box ph is-loading">' +
          '<img data-src="' + escapeHtml(src) + '" data-zoom="1" ' +
            'data-caption="' + escapeHtml((wTitle ? wTitle + ' · ' : '') + cap) + '" ' +
            'alt="' + escapeHtml(cap) + '" decoding="async">' +
        '</div>' +
        (cap ? '<figcaption class="fig__cap">' + escapeHtml(cap) + '</figcaption>' : '') +
      '</figure>';
    }).join('') + '</div>';
  }

  function factsHtml(w) {
    var facts = [
      { k: T('work.factYear'), v: w.year },
      { k: T('work.factRole'), v: FW(w, 'role') },
      { k: T('work.factTools'), v: (w.tools || []).join(' / ') },
      { k: T('work.factDuration'), v: FW(w, 'duration') }
    ].filter(function (f) { return f.v; });

    return '<div class="facts">' + facts.map(function (f) {
      return '<div class="fact"><span>' + escapeHtml(f.k) + '</span><b>' + escapeHtml(f.v) + '</b></div>';
    }).join('') + '</div>';
  }

  /* ---------- 视频 ----------
   * 只在点击封面后才插入 iframe：避免进页面就加载第三方播放器（很拖速度）。
   * 支持 B 站与 YouTube 链接自动识别。 */
  function videoEmbed(url) {
    if (!url) return null;
    var u = String(url).trim();

    // B 站：https://www.bilibili.com/video/BV1xx411c7mD 或 .../video/av12345
    var bv = u.match(/bilibili\.com\/video\/(BV[0-9A-Za-z]+)/);
    if (bv) return 'https://player.bilibili.com/player.html?bvid=' + bv[1] + '&autoplay=1&high_quality=1';
    var av = u.match(/bilibili\.com\/video\/av(\d+)/i);
    if (av) return 'https://player.bilibili.com/player.html?aid=' + av[1] + '&autoplay=1&high_quality=1';

    // YouTube：watch?v=xxx / youtu.be/xxx / embed/xxx
    var yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    if (yt) return 'https://www.youtube.com/embed/' + yt[1] + '?autoplay=1&rel=0';

    // 其他直链（.mp4 等）交给 <video>
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(u)) return { file: u };
    return null;
  }

  function videosHtml(w) {
    var list = w.videos || [];
    if (!list.length) return '';
    var m = manifestOf(w.id);

    var blocks = list.map(function (v, i) {
      var embed = videoEmbed(v.url);
      var poster = v.poster
        ? imgSrc(v.poster, 1600)
        : (m.hero || imgSrc(w.hero || w.cover, 1600));
      var ready = !!embed;
      var label = ready ? T('work.videoPlay') : T('work.videoTodo');
      var vTitle = TC(v, 'title') || FW(w, 'title');
      var vCap = TC(v, 'caption');

      /* 容器始终渲染：地址待填时点击不生效，填上地址后同一个卡片就能播 */
      var inner = '<div class="video__frame" data-embed="' +
        escapeHtml(typeof embed === 'string' ? embed : '') + '"' +
        (ready && embed && embed.file ? ' data-file="' + escapeHtml(embed.file) + '"' : '') +
        ' data-poster="' + escapeHtml(poster) + '"></div>';

      return '<figure class="video" data-video-index="' + i + '">' +
        '<button class="video__btn' + (ready ? '' : ' is-todo') + '" type="button"' +
          (ready ? '' : ' aria-disabled="true"') +
          ' aria-label="' + escapeHtml(label + ' · ' + vTitle) + '">' +
          '<span class="video__poster ph is-loading">' +
            '<img data-src="' + escapeHtml(poster) + '" alt="' + escapeHtml(vTitle) + '" decoding="async">' +
          '</span>' +
          '<span class="video__play" aria-hidden="true"><i></i></span>' +
          '<span class="video__hint">' + escapeHtml(label) + '</span>' +
        '</button>' +
        inner +
        ((vTitle || vCap)
          ? '<figcaption class="video__cap">' +
            (vTitle ? '<b>' + escapeHtml(vTitle) + '</b>' : '') +
            (vCap ? '<span>' + escapeHtml(vCap) + '</span>' : '') +
            '</figcaption>'
          : '') +
      '</figure>';
    }).join('');

    return '<div class="block"><h2>' + escapeHtml(T('work.video')) + '</h2><div class="block__body">' +
           '<div class="videos">' + blocks + '</div></div></div>';
  }

  /* 点击视频封面才真正加载播放器 */
  function bindVideos() {
    var btns = root.querySelectorAll('.video__btn');
    Array.prototype.forEach.call(btns, function (btn) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('is-todo') || btn.classList.contains('is-playing')) return;
        var fig = btn.closest('.video');
        var frame = fig && fig.querySelector('.video__frame');
        if (!frame) return;

        var file = frame.getAttribute('data-file');
        if (file) {
          frame.innerHTML = '<video src="' + escapeHtml(file) + '" controls autoplay playsinline ' +
                            'style="width:100%;height:100%;display:block;background:#000"></video>';
        } else {
          var src = frame.getAttribute('data-embed');
          if (!src) return;
          frame.innerHTML = '<iframe src="' + escapeHtml(src) + '" title="视频播放器" ' +
            'frameborder="0" scrolling="no" allowfullscreen ' +
            'allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen">' +
            '</iframe>';
        }
        frame.classList.add('is-on');
        btn.classList.add('is-playing');
        btn.setAttribute('tabindex', '-1');
      });
    });
  }

  function blocksHtml(w) {
    var out = '';
    /* 英文内容的"做法"是个数组，按语言挑选；缺英文时回退中文 */
    var EN = window.I18N && window.I18N.lang() === 'en';
    var approach = (EN && w.approach_en && w.approach_en.length) ? w.approach_en : w.approach;
    var metrics = (EN && w.metrics_en && w.metrics_en.length) ? w.metrics_en : w.metrics;

    if (FW(w, 'background')) {
      out += '<div class="block"><h2>' + escapeHtml(T('work.background')) + '</h2><div class="block__body">' +
             '<p>' + escapeHtml(FW(w, 'background')) + '</p></div></div>';
    }

    if (approach && approach.length) {
      out += '<div class="block"><h2>' + escapeHtml(T('work.approach')) + '</h2><div class="block__body">' +
             '<ul class="points">' + approach.map(function (a) {
               return '<li>' + escapeHtml(a) + '</li>';
             }).join('') + '</ul>' +
             figures(w.process) +
             '</div></div>';
    }

    if (w.results && w.results.length) {
      out += '<div class="block"><h2>' + escapeHtml(T('work.results')) + '</h2><div class="block__body">' +
             figures(w.results, true) + '</div></div>';
    }

    out += videosHtml(w);

    if (FW(w, 'outcome') || (metrics && metrics.length)) {
      out += '<div class="dark-block result">' +
             '<h3>' + escapeHtml(T('work.outcome')) + '</h3>' +
             (FW(w, 'outcome') ? '<p>' + escapeHtml(FW(w, 'outcome')) + '</p>' : '') +
             (metrics && metrics.length
               ? '<div class="metrics">' + metrics.map(function (m) {
                   return '<div><b>' + escapeHtml(m.value) + '</b><span>' + escapeHtml(m.label) + '</span></div>';
                 }).join('') + '</div>'
               : '') +
             '</div>';
    }

    return out;
  }

  function pagerHtml(w) {
    var list = visibleWorks();
    var i = list.indexOf(w);
    var prev = list[(i - 1 + list.length) % list.length];
    var next = list[(i + 1) % list.length];
    if (list.length < 2) return '';
    return '<div class="pager">' +
      '<a class="is-prev" href="#/' + escapeHtml(prev.id) + '"><span>' + escapeHtml(T('work.prev')) + '</span><b>' +
        escapeHtml(FW(prev, 'title')) + '</b></a>' +
      '<a class="is-next" href="#/' + escapeHtml(next.id) + '"><span>' + escapeHtml(T('work.next')) + '</span><b>' +
        escapeHtml(FW(next, 'title')) + '</b></a>' +
    '</div>';
  }

  function render(w) {
    currentWork = w;
    figCounter = 0;
    var title = FW(w, 'title');
    var summary = FW(w, 'summary');
    var role = FW(w, 'role');
    document.title = title + ' · ' + ((window.SITE && window.SITE.name) || '') + ' · ' + T('brand');

    var cats = ['<span class="cat cat--hi">' + escapeHtml(CAT(w.category)) + '</span>'];
    if (w.year) cats.push('<span class="cat">' + escapeHtml(w.year) + '</span>');
    if (role) cats.push('<span class="cat">' + escapeHtml(role) + '</span>');

    root.innerHTML = '' +
      '<header class="phead"><div class="wrap">' +
        '<div class="cats">' + cats.join('') + '</div>' +
        '<h1>' + escapeHtml(title) + '</h1>' +
        (summary ? '<p class="summary">' + escapeHtml(summary) + '</p>' : '') +
        factsHtml(w) +
      '</div></header>' +

      '<div class="wrap"><div class="hero-media">' +
        '<img src="' + escapeHtml(heroSrc(w)) + '" data-zoom="1" ' +
          'data-caption="' + escapeHtml(title + ' · ' + summary) + '" ' +
          'alt="' + escapeHtml(title) + '" fetchpriority="high" decoding="async">' +
      '</div></div>' +

      '<article class="article"><div class="wrap">' + blocksHtml(w) + '</div></article>' +

      '<div class="wrap">' + pagerHtml(w) + '</div>';

    // 新渲染出的图片交给 lazy.js（它会自己兜底加载）
    if (window.LazyImages && window.LazyImages.bind) window.LazyImages.bind();
    bindVideos();
  }

  function boot() {
    var list = visibleWorks();
    if (!list.length) {
      root.innerHTML = '<div class="wrap" style="padding:80px 0"><h1>暂无作品</h1></div>';
      return;
    }
    var w = findWork(currentId());
    if (!w) {
      // 无效 id：跳到第一个作品，保持可分享的链接始终有效
      location.replace('#/' + list[0].id);
      w = list[0];
    }
    render(w);
    checkResume();
  }

  /* 顶栏的简历按钮：文件不存在时降级（与首页同一套逻辑与文案）。
     之前只有首页做了这个检测，结果详情页仍显示"下载简历"且可点，
     点开是 404 —— 审计链接时才发现。 */
  function checkResume() {
    var c = (window.SITE && window.SITE.contact) || {};
    var links = document.querySelectorAll('[data-resume]');
    var canCheck = location.protocol === 'http:' || location.protocol === 'https:';
    if (!links.length || !canCheck) return;
    var path = c.resume || 'resume.pdf';
    fetch(path, { method: 'HEAD' })
      .then(function (res) { if (!res.ok) throw new Error('missing'); })
      .catch(function () {
        Array.prototype.forEach.call(links, function (a) {
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
          a.title = T('resume.missing') + '：把 PDF 命名为 ' + path + ' 放在站点根目录即自动生效';
          a.addEventListener('click', function (e) { e.preventDefault(); });
        });
      });
  }

  window.addEventListener('hashchange', boot);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
