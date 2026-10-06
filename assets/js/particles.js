/* ============================================================
 * particles.js —— 首屏粒子动效
 * 需求见 docs/项目构想.md §3.4：
 *   - 只在首屏运行
 *   - 滚动出视口 / 页面不可见时暂停
 *   - 粒子数按面积自适应
 *   - prefers-reduced-motion 时只画静态一帧
 * ============================================================ */
(function () {
  'use strict';

  var canvas = document.getElementById('particles');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var cfg = (window.SITE && window.SITE.particles) || {};
  var DENSITY = cfg.density || 9500;
  var MAXN = cfg.maxCount || 200;
  var MINN = cfg.minCount || 80;
  var LINK2 = cfg.linkDistance || 17000;   // 已是"距离平方"的量级
  var MOUSE_R = 190;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, pts = [], n = 0, running = false, rafId = 0;
  var mouse = { x: -9999, y: -9999, on: false };

  function makePoints() {
    pts = new Array(n);
    for (var i = 0; i < n; i++) {
      pts[i] = {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - .5) * .34,
        vy: (Math.random() - .5) * .34,
        r: Math.random() * 1.7 + .7,
        big: Math.random() < .08
      };
    }
  }

  function resize() {
    var box = canvas.parentElement.getBoundingClientRect();
    W = Math.max(1, box.width);
    H = Math.max(1, box.height);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    n = Math.round(Math.min(MAXN, Math.max(MINN, W * H / DENSITY)));
    makePoints();
    if (reduce || !running) draw();   // 静态模式：尺寸变化后重绘一帧
  }

  /* 用网格把邻居查找从 O(n²) 降到接近 O(n)，
     手机上粒子多一点也不会掉帧。 */
  function drawLinks() {
    var cell = Math.sqrt(LINK2);           // 网格边长 = 连线阈值
    var cols = Math.max(1, Math.ceil(W / cell));
    var rows = Math.max(1, Math.ceil(H / cell));
    var buckets = new Array(cols * rows);

    for (var i = 0; i < n; i++) {
      var p = pts[i];
      var cx = Math.min(cols - 1, Math.max(0, Math.floor(p.x / cell)));
      var cy = Math.min(rows - 1, Math.max(0, Math.floor(p.y / cell)));
      var k = cy * cols + cx;
      (buckets[k] || (buckets[k] = [])).push(i);
    }

    for (var by = 0; by < rows; by++) {
      for (var bx = 0; bx < cols; bx++) {
        var list = buckets[by * cols + bx];
        if (!list) continue;
        for (var a = 0; a < list.length; a++) {
          var ia = list[a], pa = pts[ia];
          for (var dy = 0; dy <= 1; dy++) {
            for (var dx = -1; dx <= 1; dx++) {
              if (dy === 0 && dx < 0) continue;             // 每对只算一次
              var nx = bx + dx, ny = by + dy;
              if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
              var other = buckets[ny * cols + nx];
              if (!other) continue;
              for (var b = 0; b < other.length; b++) {
                var ib = other[b];
                if (ib <= ia) continue;
                var pb = pts[ib];
                var ddx = pa.x - pb.x, ddy = pa.y - pb.y;
                var d2 = ddx * ddx + ddy * ddy;
                if (d2 < LINK2) {
                  ctx.strokeStyle = 'rgba(120,190,220,' + ((1 - d2 / LINK2) * .30) + ')';
                  ctx.lineWidth = .7;
                  ctx.beginPath();
                  ctx.moveTo(pa.x, pa.y);
                  ctx.lineTo(pb.x, pb.y);
                  ctx.stroke();
                }
              }
            }
          }
        }
      }
    }
  }

  function drawParticles() {
    for (var i = 0; i < n; i++) {
      var p = pts[i];
      if (p.big) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(79,224,176,.95)';
        ctx.shadowColor = 'rgba(79,224,176,.9)';
        ctx.shadowBlur = 14;
        ctx.arc(p.x, p.y, p.r + 1.1, 0, 6.2832);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(190,225,240,.74)';
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fill();
      }
      if (mouse.on) {
        var dx = p.x - mouse.x, dy = p.y - mouse.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_R) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(79,224,176,' + ((1 - d / MOUSE_R) * .5) + ')';
          ctx.lineWidth = .8;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function drawMouseGlow() {
    if (!mouse.on) return;
    var g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
    g.addColorStop(0, 'rgba(79,224,176,.13)');
    g.addColorStop(1, 'rgba(79,224,176,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 150, 0, 6.2832);
    ctx.fill();
  }

  function step() {
    for (var i = 0; i < n; i++) {
      var p = pts[i];
      if (mouse.on) {
        var mx = p.x - mouse.x, my = p.y - mouse.y;
        var md = Math.sqrt(mx * mx + my * my);
        if (md < MOUSE_R && md > 0.1) { p.vx += (mx / md) * .05; p.vy += (my / md) * .05; }
      }
      p.vx *= .995; p.vy *= .995;
      var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (sp < .08) { p.vx += (Math.random() - .5) * .04; p.vy += (Math.random() - .5) * .04; }
      if (sp > 1.1) { p.vx *= .92; p.vy *= .92; }
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawLinks();
    drawParticles();
    drawMouseGlow();
  }

  function frame() {
    if (!running) return;
    step();
    draw();
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduce) return;
    running = true;
    rafId = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  /* ---------- 事件 ---------- */
  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  window.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.on = mouse.x > -80 && mouse.x < r.width + 80 && mouse.y > -80 && mouse.y < r.height + 80;
  });
  window.addEventListener('mouseleave', function () { mouse.on = false; });

  window.addEventListener('touchmove', function (e) {
    var r = canvas.getBoundingClientRect(), t = e.touches[0];
    if (!t) return;
    mouse.x = t.clientX - r.left;
    mouse.y = t.clientY - r.top;
    mouse.on = true;
  }, { passive: true });
  window.addEventListener('touchend', function () { mouse.on = false; });

  /* 首屏滚出视口就停 */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.isIntersecting ? start() : stop(); });
    }, { threshold: 0 }).observe(canvas);
  } else {
    start();
  }

  /* 切到别的标签页时停 */
  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : start();
  });

  resize();
  if (reduce) draw(); else start();

  /* ---------- 滚动时首屏内容轻微退场 ----------
     只写一个 CSS 变量，实际动画交给 CSS 合成层，几乎不耗性能。
     用 rAF 节流，避免在滚动事件里直接写样式造成抖动。 */
  var heroEl = canvas.parentElement;
  var ticking = false;
  function updateFade() {
    ticking = false;
    var h = heroEl.getBoundingClientRect().height || H || 1;
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    var t = Math.max(0, Math.min(1, y / (h * 0.75)));
    heroEl.style.setProperty('--hero-fade', t.toFixed(3));
  }
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateFade);
  }, { passive: true });
  updateFade();
})();
