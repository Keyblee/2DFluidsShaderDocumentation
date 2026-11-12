// Fluid Shaders 2D documentation: navigation helpers and before/after comparisons.
(function () {
  "use strict";

  var nav = document.getElementById("site-nav");
  var links = nav ? Array.prototype.slice.call(nav.querySelectorAll("a")) : [];
  var article = document.querySelector(".markdown");

  function normalize(path) {
    path = path.replace(/index\.html$/, "").replace(/\.html$/, "");
    return path.replace(/\/$/, "");
  }

  // ---------- Current page in the menu, previous / next ----------
  var here = normalize(location.pathname);
  var current = -1;
  links.forEach(function (link, i) {
    if (normalize(new URL(link.href).pathname) === here) {
      link.classList.add("active");
      if (current < 0) current = i;
    }
  });

  var pager = document.getElementById("pager");
  if (pager && current >= 0) {
    var prev = links[current - 1], next = links[current + 1];
    if (prev) pager.insertAdjacentHTML("beforeend",
      '<a class="prev" href="' + prev.href + '"><small>← Previous</small><span>' + prev.textContent + "</span></a>");
    if (next) pager.insertAdjacentHTML("beforeend",
      '<a class="next" href="' + next.href + '"><small>Next →</small><span>' + next.textContent + "</span></a>");
  }

  // ---------- Overview page: the hero replaces the title, image and demo line ----------
  if (document.querySelector(".hero") && article) {
    document.body.classList.add("is-home");
    Array.prototype.forEach.call(article.querySelectorAll(":scope > p"), function (p) {
      var img = p.querySelector("img");
      var demo = p.querySelector('a[href*="/demo"]');
      if ((img && p.textContent.trim() === "") || demo) p.classList.add("home-image");
    });
  }

  // ---------- Mobile menu ----------
  var toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.forEach(function (link) {
      link.addEventListener("click", function () { document.body.classList.remove("menu-open"); });
    });
  }

  if (!article) return;

  // ---------- Heading anchors and "On this page" ----------
  var headings = Array.prototype.slice.call(article.querySelectorAll("h2[id], h3[id]"));
  headings.forEach(function (h) {
    var a = document.createElement("a");
    a.className = "heading-anchor";
    a.href = "#" + h.id;
    a.textContent = "#";
    a.setAttribute("aria-label", "Link to this section");
    h.insertBefore(a, h.firstChild);
  });

  var toc = document.getElementById("toc");
  var sections = headings.filter(function (h) { return h.tagName === "H2"; });
  if (toc && sections.length > 2) {
    toc.insertAdjacentHTML("beforeend", "<p>On this page</p>");
    sections.forEach(function (h) {
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent.replace(/^#/, "");
      toc.appendChild(a);
    });
    var tocLinks = Array.prototype.slice.call(toc.querySelectorAll("a"));
    var onScroll = function () {
      var active = 0;
      sections.forEach(function (h, i) { if (h.getBoundingClientRect().top < 120) active = i; });
      tocLinks.forEach(function (a, i) { a.classList.toggle("active", i === active); });
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------- "Cost:" lines as badges ----------
  Array.prototype.forEach.call(article.querySelectorAll("p"), function (p) {
    if (/^Cost:/.test(p.textContent.trim())) p.classList.add("cost");
  });

  // ---------- Before / after sliders ----------
  // Effect images are two 640×400 panels side by side with an 8 px gap: off on the left, on on the right.
  function labelsFor(img) {
    var alt = img.getAttribute("alt") || "";
    var m = alt.match(/^(.*) off and on$/);
    if (m) return { before: "Without", after: "With", caption: m[1] };
    m = alt.match(/^(.*?)(\S+) and (\S+)$/);
    if (m) return { before: m[1] + m[2], after: m[1] + m[3], caption: alt };
    return { before: "Before", after: "After", caption: alt };
  }

  Array.prototype.forEach.call(article.querySelectorAll('img[src*="effect-"], img[src*="wave-sharpness"]'), function (img) {
    var labels = labelsFor(img);
    var src = img.getAttribute("src");
    var figure = document.createElement("figure");
    figure.className = "compare";
    figure.innerHTML =
      '<div class="compare-layer compare-before"></div>' +
      '<div class="compare-layer compare-after"></div>' +
      '<input type="range" min="0" max="100" value="50" aria-label="Compare ' + labels.caption + ' without and with">' +
      '<div class="compare-handle"></div>' +
      '<span class="compare-label before"></span><span class="compare-label after"></span>';
    figure.querySelector(".compare-before").style.backgroundImage = 'url("' + src + '")';
    figure.querySelector(".compare-after").style.backgroundImage = 'url("' + src + '")';
    figure.querySelector(".compare-label.before").textContent = labels.before;
    figure.querySelector(".compare-label.after").textContent = labels.after;
    var range = figure.querySelector("input");
    var update = function () { figure.style.setProperty("--split", range.value + "%"); };
    range.addEventListener("input", update);
    update();

    var caption = document.createElement("p");
    caption.className = "compare-caption";
    caption.textContent = "Drag to compare " + labels.caption.toLowerCase() + " " +
      (labels.before === "Without" ? "off and on." : "(" + labels.before + " · " + labels.after + ").");

    var holder = img.parentNode.tagName === "P" && img.parentNode.textContent.trim() === "" ? img.parentNode : img;
    holder.parentNode.insertBefore(figure, holder);
    holder.parentNode.insertBefore(caption, holder);
    holder.parentNode.removeChild(holder);
  });
})();
