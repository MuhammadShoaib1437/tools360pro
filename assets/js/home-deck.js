/* ============================================================
   Tool360 — Command Deck controller (homepage only)
   Category rail + orbit wheel + selected-category console.
   The shared registry in site.js remains the source of truth.
   ============================================================ */
(function () {
  "use strict";

  var deck = document.getElementById("command-deck");
  if (!deck || !window.T360) return;

  var tools = T360.tools;
  var categories = T360.categories;
  var bySlug = T360.bySlug;
  var catById = T360.catById;

  var representative = {
    pdf: "merge-pdf",
    image: "compress-image",
    text: "word-counter",
    converters: "unit-converter",
    calculators: "percentage-calculator",
    developer: "json-formatter",
    generators: "qr-code-generator"
  };
  var featured = {
    pdf: "merge-pdf",
    image: "compress-image",
    text: "word-counter",
    converters: "currency-converter",
    calculators: "loan-calculator",
    developer: "json-formatter",
    generators: "qr-code-generator"
  };
  var shortNames = {
    "merge-pdf": "Merge PDF", "split-pdf": "Split PDF", "images-to-pdf": "Images to PDF",
    "pdf-to-image": "PDF to Image", "rotate-pdf": "Rotate PDF", "compress-pdf": "Compress PDF",
    "compress-image": "Compress", "resize-image": "Resize", "convert-image": "Convert",
    "crop-image": "Crop", "watermark-image": "Watermark", "favicon-generator": "Favicon",
    "word-counter": "Word Counter", "case-converter": "Case", "keyword-density": "Keywords",
    "meta-tag-generator": "Meta Tags", "lorem-ipsum": "Lorem Ipsum", "text-cleaner": "Text Cleaner",
    "unit-converter": "Units", "time-zone-converter": "Time Zones", "number-base-converter": "Number Base",
    "currency-converter": "Currency", "percentage-calculator": "Percent", "age-calculator": "Age",
    "bmi-calculator": "BMI", "loan-calculator": "Loan / EMI", "tip-calculator": "Tip Split",
    "json-formatter": "JSON", "base64": "Base64", "uuid-generator": "UUID",
    "url-encode": "URL Encode", "jwt-decoder": "JWT", "css-gradient-generator": "CSS Design",
    "regex-tester": "Regex", "qr-code-generator": "QR Code", "password-generator": "Password",
    "color-palette": "Colors", "list-randomizer": "Randomizer"
  };

  var wheelTitle = document.getElementById("wheel-title");
  var wheelStatus = document.getElementById("wheel-status");
  var wheelRing = document.getElementById("wheel-tools-ring");
  var wheelCoreCat = document.getElementById("wheel-core-cat");
  var wheelCoreCount = document.getElementById("wheel-core-count");
  var consoleIcon = document.getElementById("console-icon");
  var consoleTitle = document.getElementById("console-title");
  var consoleTagline = document.getElementById("console-tagline");
  var consoleCount = document.getElementById("console-count");
  var consoleList = document.getElementById("console-list");
  var spotlight = document.getElementById("spotlight-card");
  var spotlightIcon = document.getElementById("spotlight-icon");
  var spotlightName = document.getElementById("spotlight-name");
  var spotlightDesc = document.getElementById("spotlight-desc");
  var motionToggle = document.getElementById("motion-toggle");
  var themeToggle = document.getElementById("deck-theme");
  var searchButton = document.getElementById("deck-search");

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var active = "pdf";
  var motionPaused = !!reduceMotion;
  var lastInteraction = 0;
  var lastCycle = Date.now();
  var deckVisible = true;
  var deckHovered = false;
  var deckFocused = false;

  function toolsFor(cat) {
    return tools.filter(function (tool) { return tool.cat === cat; });
  }
  function favSet() {
    try {
      var parsed = JSON.parse(localStorage.getItem("t360:favs") || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }
  function angleFor(index, count) {
    return (-90 + (360 / count) * index).toFixed(3) + "deg";
  }

  function renderWheelTools(cat) {
    var list = toolsFor(cat);
    wheelRing.setAttribute("data-count", String(list.length));
    wheelRing.innerHTML = list.map(function (tool, index) {
      return '<a class="wheel-node tool-node" style="--a:' + angleFor(index, list.length) + '" href="tools/' + tool.slug + '.html" data-cat="' + tool.cat + '" aria-label="Open ' + tool.name + '">' +
        '<span class="wheel-node-pos"><span class="wheel-chip tool-chip">' +
        '<span class="tool-icon">' + T360.iconFor(tool) + '</span><span>' + (shortNames[tool.slug] || tool.name) + "</span>" +
        "</span></span></a>";
    }).join("");
  }

  function renderConsole(cat) {
    var category = catById[cat];
    var list = toolsFor(cat);
    var feature = bySlug[featured[cat]] || list[0];
    var rep = bySlug[representative[cat]] || list[0];
    var favs = favSet();

    consoleIcon.innerHTML = T360.iconFor(rep);
    consoleIcon.setAttribute("data-cat", cat);
    consoleTitle.textContent = category.name;
    consoleTagline.textContent = category.tagline;
    consoleCount.textContent = list.length + (list.length === 1 ? " tool" : " tools");

    spotlight.href = "tools/" + feature.slug + ".html";
    spotlight.setAttribute("data-cat", cat);
    spotlightIcon.innerHTML = T360.iconFor(feature);
    spotlightName.textContent = feature.name;
    spotlightDesc.textContent = feature.desc;

    consoleList.innerHTML = list.map(function (tool) {
      var isFav = favs.indexOf(tool.slug) >= 0;
      return '<a class="console-tool" href="tools/' + tool.slug + '.html" data-cat="' + tool.cat + '">' +
        '<span class="tool-icon">' + T360.iconFor(tool) + "</span>" +
        '<span class="console-tool-copy"><strong>' + tool.name + "</strong><span>" + tool.desc + "</span></span>" +
        '<span class="fav-btn' + (isFav ? " active" : "") + '" data-slug="' + tool.slug + '" role="button" tabindex="0" aria-label="Save ' + tool.name + ' to favourites" aria-pressed="' + (isFav ? "true" : "false") + '">' + (isFav ? "★" : "☆") + "</span>" +
        '<span class="console-open">Open →</span></a>';
    }).join("");
  }

  function setCategory(cat, options) {
    options = options || {};
    if (!catById[cat]) cat = "pdf";
    active = cat;
    document.body.setAttribute("data-active-category", cat);

    document.querySelectorAll("[data-deck-category]").forEach(function (control) {
      var selected = control.getAttribute("data-deck-category") === cat;
      control.classList.toggle("is-active", selected);
      control.setAttribute("aria-pressed", selected ? "true" : "false");
    });

    var category = catById[cat];
    var count = toolsFor(cat).length;
    wheelTitle.textContent = category.name + " in orbit";
    wheelCoreCat.textContent = category.name;
    wheelCoreCount.textContent = count + " tools ready";
    wheelStatus.textContent = "Showing " + category.name + ". Outer nodes select a category; inner nodes open tools directly.";

    renderWheelTools(cat);
    renderConsole(cat);

    if (options.user) {
      lastInteraction = Date.now();
      lastCycle = Date.now();
      try { history.replaceState(null, "", "#" + cat); } catch (e) {}
    }
  }

  document.querySelectorAll("[data-deck-category]").forEach(function (control) {
    control.addEventListener("click", function () {
      setCategory(control.getAttribute("data-deck-category"), { user: true });
    });
  });

  deck.addEventListener("pointerdown", function () { lastInteraction = Date.now(); }, true);
  deck.addEventListener("mouseenter", function () { deckHovered = true; });
  deck.addEventListener("mouseleave", function () { deckHovered = false; lastInteraction = Date.now(); });
  deck.addEventListener("focusin", function () { deckFocused = true; lastInteraction = Date.now(); });
  deck.addEventListener("focusout", function () {
    setTimeout(function () { deckFocused = deck.contains(document.activeElement); }, 0);
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      deckVisible = entries[0].isIntersecting;
    }, { threshold: 0.12 }).observe(deck);
  }

  window.setInterval(function () {
    var now = Date.now();
    if (reduceMotion || motionPaused || document.hidden || !deckVisible || deckHovered || deckFocused) return;
    if (now - lastInteraction < 12000 || now - lastCycle < 6000) return;
    var index = categories.map(function (c) { return c.id; }).indexOf(active);
    setCategory(categories[(index + 1) % categories.length].id, { auto: true });
    lastCycle = now;
  }, 500);

  function paintMotionToggle() {
    if (!motionToggle) return;
    motionToggle.setAttribute("aria-pressed", motionPaused ? "true" : "false");
    motionToggle.innerHTML = motionPaused ? '<span aria-hidden="true">▶</span> Resume motion' : '<span aria-hidden="true">Ⅱ</span> Pause motion';
    deck.classList.toggle("motion-off", motionPaused);
    if (reduceMotion) {
      motionToggle.innerHTML = '<span aria-hidden="true">●</span> Reduced motion on';
      motionToggle.disabled = true;
    }
  }
  if (motionToggle) {
    motionToggle.addEventListener("click", function () {
      motionPaused = !motionPaused;
      lastInteraction = Date.now();
      lastCycle = Date.now();
      paintMotionToggle();
    });
  }

  var sunSVG = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var moonSVG = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  function paintThemeToggle() {
    if (!themeToggle) return;
    themeToggle.innerHTML = document.documentElement.getAttribute("data-theme") === "dark" ? sunSVG : moonSVG;
  }
  if (themeToggle) {
    paintThemeToggle();
    themeToggle.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("t360:theme", JSON.stringify(next)); } catch (e) {}
      paintThemeToggle();
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", function () { T360.openPalette(""); });
  }

  function categoryFromHash() {
    var id = (window.location.hash || "").replace("#", "");
    return catById[id] ? id : null;
  }
  window.addEventListener("hashchange", function () {
    var cat = categoryFromHash();
    if (cat && cat !== active) setCategory(cat, { user: true });
  });

  setCategory(categoryFromHash() || "pdf", { initial: true });
  paintMotionToggle();

  window.Tool360Deck = {
    setCategory: setCategory,
    getActiveCategory: function () { return active; }
  };
})();
