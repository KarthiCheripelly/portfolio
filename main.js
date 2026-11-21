(function () {
  // Fade sections in as they scroll into view.
  document.documentElement.classList.add("js");
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-in"); });
  }

  // Thin line under the header once the page scrolls.
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  var carousel = document.getElementById("hero-carousel");
  if (!carousel) return;

  var slides = carousel.querySelectorAll(".hero-slide");
  var dots = carousel.querySelectorAll(".hero-dot");
  var captionEl = document.getElementById("hero-photo-caption");
  var intervalMs = parseInt(carousel.getAttribute("data-interval"), 10);
  if (isNaN(intervalMs) || intervalMs < 800) {
    intervalMs = 3000;
  }

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var index = 0;
  var timer;

  function applySlide(i) {
    index = i;
    slides.forEach(function (el, j) {
      var on = j === index;
      el.classList.toggle("is-active", on);
      if (on && captionEl) {
        var cap = el.getAttribute("data-caption");
        if (cap) captionEl.textContent = cap;
      }
    });
    dots.forEach(function (dot, j) {
      dot.classList.toggle("is-active", j === index);
    });
  }

  function next() {
    applySlide((index + 1) % slides.length);
  }

  function start() {
    if (prefersReduced || slides.length < 2) return;
    stop();
    timer = window.setInterval(next, intervalMs);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("touchstart", stop, { passive: true });
  carousel.addEventListener("touchend", start, { passive: true });

  applySlide(0);
  start();
})();
