/* portfolio26 - interactions */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduce) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else if ("IntersectionObserver" in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); revObs.unobserve(e.target); }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { revObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- year rail sync ---- */
  var railItems = {};
  document.querySelectorAll(".rail__item").forEach(function (it) {
    railItems[it.getAttribute("data-year")] = it;
  });
  var stations = document.querySelectorAll("[data-year]");
  if (Object.keys(railItems).length && "IntersectionObserver" in window) {
    var yearObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var y = e.target.getAttribute("data-year");
          Object.keys(railItems).forEach(function (k) {
            railItems[k].classList.toggle("is-active", k === y);
          });
        }
      });
    }, { threshold: 0.01, rootMargin: "-45% 0px -45% 0px" });
    stations.forEach(function (s) { if (s.classList.contains("station") || s.classList.contains("hero")) yearObs.observe(s); });
  }

  /* ---- count-up ---- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reduce) { el.textContent = el.getAttribute("data-final"); return; }
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.floor(eased * target);
      el.textContent = val.toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = el.getAttribute("data-final");
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cObs.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cObs.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute("data-final"); });
  }

  /* ---- bar fills ---- */
  var barSections = document.querySelectorAll("[data-bars]");
  if ("IntersectionObserver" in window) {
    var bObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.querySelectorAll(".bar-fill").forEach(function (f) {
            f.style.width = f.getAttribute("data-w");
          });
          bObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.25, rootMargin: "0px 0px -10% 0px" });
    barSections.forEach(function (s) { bObs.observe(s); });
  } else {
    document.querySelectorAll(".bar-fill").forEach(function (f) { f.style.width = f.getAttribute("data-w"); });
  }

  /* ---- ambient hero canvas: drifting tokens + faint links ---- */
  var canvas = document.getElementById("hero-canvas");
  if (canvas && !reduce) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, pts;
    var COLORS = ["#28B8A0", "#6B57FF", "#087CFA", "#FC801D", "#FF318C"];

    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round(Math.min(70, Math.max(28, (W * H) / 22000)));
      pts = [];
      for (var i = 0; i < count; i++) {
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 0.6,
          c: COLORS[(Math.random() * COLORS.length) | 0]
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 15000) {
            ctx.globalAlpha = (1 - d2 / 15000) * 0.12;
            ctx.strokeStyle = p.c;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      for (var k = 0; k < pts.length; k++) {
        var pt = pts[k];
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = pt.c;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(frame);
  }

  /* ---- footer year ---- */
  var y = document.getElementById("yr");
  if (y) y.textContent = new Date().getFullYear();
})();
