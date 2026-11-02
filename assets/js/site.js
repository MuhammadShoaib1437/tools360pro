/* ============================================================
   Tool360 — shared site script
   Header/footer injection · Ctrl+K palette · favourites/recent
   (localStorage) · related tools · theme · T360 helpers
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Registry ---------- */
  var CATEGORIES = [
    { id: "pdf",         name: "PDF Tools",    tagline: "Merge, split and build PDFs" },
    { id: "image",       name: "Image Tools",  tagline: "Compress, resize and convert images" },
    { id: "text",        name: "Text Tools",   tagline: "Count, convert and clean up text" },
    { id: "converters",  name: "Converters",   tagline: "Units, bases, time zones and more" },
    { id: "calculators", name: "Calculators",  tagline: "Percentages, age, BMI, loans and tips" },
    { id: "developer",   name: "Developer Tools", tagline: "JSON, Base64, JWT, CSS and regex" },
    { id: "generators",  name: "Generators",   tagline: "QR codes, passwords and palettes" }
  ];

  function ic(p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>"; }
  var ICONS = {
    "merge-pdf":        ic('<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/><path d="M12 8v8"/><path d="M8.5 12h7"/>'),
    "split-pdf":        ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16" stroke-dasharray="3.5 3.5"/>'),
    "images-to-pdf":    ic('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15.5 16 10.5 5 21"/>'),
    "compress-image":   ic('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v4H5"/><path d="M15 3v4h4"/><path d="M9 21v-4H5"/><path d="M15 21v-4h4"/>'),
    "resize-image":     ic('<rect x="3" y="6" width="13" height="13" rx="2"/><path d="M16 3h5v5"/><path d="M21 3l-6.5 6.5"/>'),
    "convert-image":    ic('<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/>'),
    "word-counter":     ic('<path d="M4 6h16"/><path d="M4 12h10"/><path d="M4 18h7"/><path d="M17.5 15.5v5"/><path d="M15 18h5"/>'),
    "case-converter":   ic('<text x="4" y="17" font-size="13" font-weight="700" fill="currentColor" stroke="none" font-family="inherit">Aa</text><path d="M16 8h5"/><path d="M18.5 5.5 21 8l-2.5 2.5"/>'),
    "unit-converter":   ic('<rect x="2" y="9" width="20" height="6" rx="1.5"/><path d="M6 9v3.2"/><path d="M10 9v3.2"/><path d="M14 9v3.2"/><path d="M18 9v3.2"/>'),
    "percentage-calculator": ic('<circle cx="7" cy="7" r="3.2"/><circle cx="17" cy="17" r="3.2"/><path d="M18.5 4.5 5.5 19.5"/>'),
    "age-calculator":   ic('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/><circle cx="12" cy="15.5" r="1.4"/>'),
    "bmi-calculator":   ic('<path d="M3 12h4l2.2-5.5 4 11 2.3-5.5H21"/>'),
    "json-formatter":   ic('<path d="M8.5 4C6.6 4 5.5 5 5.5 7v2.6c0 1.2-.5 1.9-1.7 2.4 1.2.5 1.7 1.2 1.7 2.4V17c0 2 1.1 3 3 3"/><path d="M15.5 4c1.9 0 3 1 3 3v2.6c0 1.2.5 1.9 1.7 2.4-1.2.5-1.7 1.2-1.7 2.4V17c0 2-1.1 3-3 3"/>'),
    "base64":           ic('<path d="M8.5 6 3.5 12l5 6"/><path d="M15.5 6l5 6-5 6"/>'),
    "uuid-generator":   ic('<circle cx="8" cy="15.5" r="4.5"/><path d="M11.2 12.3 20 3.5"/><path d="M16.8 4.6l3 3"/><path d="M14 7.4l2.2 2.2"/>'),
    "qr-code-generator": ic('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3z"/><path d="M21 14v1"/><path d="M14 21h1"/><path d="M18.5 18.5H21V21h-2.5z"/>'),
    "password-generator": ic('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="15.5" r="1.4"/>'),
    "pdf-to-image":     ic('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><circle cx="11" cy="13" r="1.6"/><path d="M19 18.5 15.8 15.2 8.5 21"/>'),
    "rotate-pdf":       ic('<path d="M4 12a8 8 0 0 1 13.7-5.7L20 8"/><path d="M20 3v5h-5"/><path d="M20 12a8 8 0 0 1-13.7 5.7L4 16"/><path d="M4 21v-5h5"/>'),
    "compress-pdf":     ic('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M12 17.5v-5"/><path d="M9.6 14.6 12 17l2.4-2.4"/>'),
    "crop-image":       ic('<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>'),
    "watermark-image":  ic('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8.2s3.2 3.4 3.2 5.6a3.2 3.2 0 1 1-6.4 0C8.8 11.6 12 8.2 12 8.2z"/>'),
    "favicon-generator": ic('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 7.2l1.5 3.1 3.4.5-2.5 2.4.6 3.4-3-1.6-3 1.6.6-3.4L7.1 10.8l3.4-.5z"/>'),
    "keyword-density":  ic('<path d="M5 20v-6"/><path d="M11 20V6"/><path d="M17 20v-9"/><path d="M3 20h18"/>'),
    "meta-tag-generator": ic('<path d="M12.6 2.9 21 11.3a2 2 0 0 1 0 2.8l-7.2 7.2a2 2 0 0 1-2.8 0L2.6 13A2 2 0 0 1 2 11.6V4a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.9z"/><circle cx="7.5" cy="7.5" r="1.3"/>'),
    "lorem-ipsum":      ic('<path d="M15 4v16"/><path d="M10 4v16"/><path d="M15 4h-4.5a3.5 3.5 0 1 0 0 7H15"/>'),
    "text-cleaner":     ic('<path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'),
    "time-zone-converter": ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15.2 15.2 0 0 1 0 18"/><path d="M12 3a15.2 15.2 0 0 0 0 18"/>'),
    "number-base-converter": ic('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8.5 16v-8"/><path d="M6.7 9.6 8.5 8l1.8 1.6"/><circle cx="15.5" cy="12" r="3.4"/>'),
    "currency-converter": ic('<path d="M12 2.5v19"/><path d="M16.8 6.4c-.9-1.1-2.6-1.7-4.8-1.7-2.9 0-4.7 1.4-4.7 3.4 0 4.7 9.6 2.5 9.6 7 0 2-2 3.3-4.9 3.3-2.3 0-4.1-.7-5-2"/>'),
    "loan-calculator":  ic('<path d="M3 9.5 12 4l9 5.5"/><path d="M4.5 10v7.5"/><path d="M9.3 10v7.5"/><path d="M14.7 10v7.5"/><path d="M19.5 10v7.5"/><path d="M2.5 21h19"/><path d="M2.5 17.5h19"/>'),
    "tip-calculator":   ic('<path d="M6 2.5h12V22l-2-1.4L14 22l-2-1.4L10 22l-2-1.4L6 22z"/><path d="M9.5 8h5"/><path d="M9.5 12h5"/>'),
    "url-encode":       ic('<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'),
    "jwt-decoder":      ic('<path d="M12 2 4 5.5V11c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5.5z"/><path d="M9 11.6 11.2 14 15.2 9.6"/>'),
    "css-gradient-generator": ic('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 16.5 16.5 3"/><path d="M3 11 11 3"/><path d="M3 5.8 5.8 3"/>'),
    "regex-tester":     ic('<path d="M12 4v9"/><path d="M5.8 6.5l12.4 6"/><path d="M18.2 6.5l-12.4 6"/><circle cx="5.5" cy="18.5" r="1.6"/>'),
    "color-palette":    ic('<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.9 0-1.2-1-1.7-1-2.9 0-1 .8-1.7 2-1.7h2.1A3.9 3.9 0 0 0 21 10.6C20.6 6.4 16.6 3 12 3z"/><circle cx="7.5" cy="10.5" r="1.2"/><circle cx="12" cy="7.5" r="1.2"/><circle cx="16.5" cy="10.5" r="1.2"/>'),
    "list-randomizer":  ic('<path d="M3 7h4l10 10h4"/><path d="M19 14.5 21.5 17 19 19.5"/><path d="M3 17h4l2.6-2.6"/><path d="M13.4 9.4 17 7h4"/><path d="M19 4.5 21.5 7 19 9.5"/>'),
    "soon":             ic('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>')
  };

  var TOOLS = [
    /* PDF */
    { slug: "merge-pdf",        name: "Merge PDF",        cat: "pdf", desc: "Combine several PDF files into a single document." },
    { slug: "split-pdf",        name: "Split PDF",        cat: "pdf", desc: "Extract a page range or split a PDF into separate files." },
    { slug: "images-to-pdf",    name: "Images to PDF",    cat: "pdf", desc: "Turn JPG, PNG and WebP images into one PDF document." },
    { slug: "pdf-to-image",     name: "PDF to Image",     cat: "pdf", desc: "Render PDF pages as JPG or PNG images." },
    { slug: "rotate-pdf",       name: "Rotate & Organize PDF", cat: "pdf", desc: "Rotate, reorder and delete PDF pages." },
    { slug: "compress-pdf",     name: "Compress PDF",     cat: "pdf", desc: "Shrink a PDF by re-encoding its images." },
    /* Image */
    { slug: "compress-image",   name: "Compress Image",   cat: "image", desc: "Reduce JPG, PNG and WebP file size with a quality slider." },
    { slug: "resize-image",     name: "Resize Image",     cat: "image", desc: "Change image dimensions by pixels or percentage." },
    { slug: "convert-image",    name: "Convert Image",    cat: "image", desc: "Convert images between JPG, PNG and WebP formats." },
    { slug: "crop-image",       name: "Crop Image",       cat: "image", desc: "Crop images with a visual box and aspect presets." },
    { slug: "watermark-image",  name: "Watermark Image",  cat: "image", desc: "Stamp text watermarks onto your images." },
    { slug: "favicon-generator", name: "Favicon Generator", cat: "image", desc: "Generate favicon sizes and an ICO from one image." },
    /* Text */
    { slug: "word-counter",     name: "Word Counter",     cat: "text", desc: "Count words, characters, sentences and reading time." },
    { slug: "case-converter",   name: "Case Converter",   cat: "text", desc: "Switch text between UPPER, lower, Title, camelCase and more." },
    { slug: "keyword-density",  name: "Keyword Density Checker", cat: "text", desc: "See how often words and phrases repeat in your text." },
    { slug: "meta-tag-generator", name: "Meta Tag Generator", cat: "text", desc: "Build meta, Open Graph and Twitter Card tags with preview." },
    { slug: "lorem-ipsum",      name: "Lorem Ipsum Generator", cat: "text", desc: "Generate placeholder paragraphs, sentences or words." },
    { slug: "text-cleaner",     name: "Text Cleaner",     cat: "text", desc: "Clean up text: extra spaces, line breaks, duplicates and accents." },
    /* Converters */
    { slug: "unit-converter",   name: "Unit Converter",   cat: "converters", desc: "Convert length, weight, temperature, area, speed and more." },
    { slug: "time-zone-converter", name: "Time Zone Converter", cat: "converters", desc: "Convert times between world time zones." },
    { slug: "number-base-converter", name: "Number Base Converter", cat: "converters", desc: "Convert between binary, decimal, octal and hex." },
    { slug: "currency-converter", name: "Currency Converter", cat: "converters", desc: "Convert currencies with daily exchange rates." },
    /* Calculators */
    { slug: "percentage-calculator", name: "Percentage Calculator", cat: "calculators", desc: "Find percentages, ratios and percentage change." },
    { slug: "age-calculator",   name: "Age Calculator",   cat: "calculators", desc: "Calculate exact age in years, months and days." },
    { slug: "bmi-calculator",   name: "BMI Calculator",   cat: "calculators", desc: "Check your body mass index and healthy weight range." },
    { slug: "loan-calculator",  name: "Loan / EMI Calculator", cat: "calculators", desc: "Monthly payments plus a full amortisation table." },
    { slug: "tip-calculator",   name: "Tip & Bill Split Calculator", cat: "calculators", desc: "Work out the tip and split the bill fairly." },
    /* Developer */
    { slug: "json-formatter",   name: "JSON Formatter & Validator", cat: "developer", desc: "Format, minify and validate JSON with clear errors." },
    { slug: "base64",           name: "Base64 Encoder & Decoder", cat: "developer", desc: "Encode and decode Base64 text and files, Unicode-safe." },
    { slug: "uuid-generator",   name: "UUID Generator",   cat: "developer", desc: "Generate random v4 UUIDs, one or in bulk." },
    { slug: "url-encode",       name: "URL & HTML Encoder", cat: "developer", desc: "Encode and decode URLs and HTML entities." },
    { slug: "jwt-decoder",      name: "JWT Decoder",      cat: "developer", desc: "Inspect JWT headers and payloads in your browser." },
    { slug: "css-gradient-generator", name: "CSS Gradient & Shadow Generator", cat: "developer", desc: "Design gradients and box shadows with live preview." },
    { slug: "regex-tester",     name: "Regex Tester",     cat: "developer", desc: "Test regular expressions with highlighted matches." },
    /* Generators */
    { slug: "qr-code-generator", name: "QR Code Generator", cat: "generators", desc: "Create QR codes for links and text, download PNG or SVG." },
    { slug: "password-generator", name: "Password Generator", cat: "generators", desc: "Generate strong random passwords with a strength meter." },
    { slug: "color-palette",    name: "Color Converter & Palette", cat: "generators", desc: "Convert HEX, RGB and HSL and build colour palettes." },
    { slug: "list-randomizer",  name: "List Randomizer",  cat: "generators", desc: "Shuffle lists and pick random winners." }
  ];
  var POPULAR = ["merge-pdf", "compress-image", "qr-code-generator", "word-counter", "json-formatter", "images-to-pdf", "password-generator", "unit-converter", "resize-image", "bmi-calculator"];

  var bySlug = {}, catById = {};
  TOOLS.forEach(function (t) { bySlug[t.slug] = t; });
  CATEGORIES.forEach(function (c) { catById[c.id] = c; });

  /* ---------- Base path (root vs /tools/) ---------- */
  var scriptSrc = (document.currentScript && document.currentScript.getAttribute("src")) || "";
  var BASE = scriptSrc.indexOf("../") === 0 ? "../" : "";
  function toolUrl(slug) { return BASE + "tools/" + slug + ".html"; }

  /* ---------- localStorage helpers ---------- */
  function lsGet(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  function getFavs() { return lsGet("t360:favs", []); }
  function getRecent() { return lsGet("t360:recent", []); }
  function recordRecent(slug) {
    if (!bySlug[slug] || bySlug[slug].soon) return;
    var r = getRecent().filter(function (s) { return s !== slug; });
    r.unshift(slug); lsSet("t360:recent", r.slice(0, 8));
  }
  function toggleFav(slug) {
    var f = getFavs(), i = f.indexOf(slug);
    if (i >= 0) f.splice(i, 1); else f.unshift(slug);
    lsSet("t360:favs", f);
    syncFavButtons(); renderHomeShelves();
    toast(i >= 0 ? "Removed from favourites" : "Saved to favourites");
  }
  function syncFavButtons() {
    var favs = getFavs();
    document.querySelectorAll(".fav-btn").forEach(function (b) {
      var on = favs.indexOf(b.getAttribute("data-slug")) >= 0;
      b.classList.toggle("active", on);
      b.textContent = on ? "★" : "☆";
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  /* ---------- Card rendering ---------- */
  function iconFor(t) { return ICONS[t.slug] || ICONS.soon; }
  function cardHTML(t) {
    if (t.soon) {
      return '<div class="tool-card soon" data-cat="' + t.cat + '" aria-disabled="true">' +
        '<span class="tool-icon">' + iconFor(t) + "</span>" +
        '<span class="tool-card-body"><span class="tool-name">' + t.name + '</span>' +
        '<span class="tool-desc">' + t.desc + "</span></span>" +
        '<span class="badge-soon">Soon</span></div>';
    }
    return '<a class="tool-card" href="' + toolUrl(t.slug) + '" data-cat="' + t.cat + '">' +
      '<span class="tool-icon">' + iconFor(t) + "</span>" +
      '<span class="tool-card-body"><span class="tool-name">' + t.name + '</span>' +
      '<span class="tool-desc">' + t.desc + "</span></span>" +
      '<span class="fav-btn" data-slug="' + t.slug + '" role="button" tabindex="0" aria-label="Save ' + t.name + ' to favourites" aria-pressed="false">☆</span></a>';
  }
  function renderHomeShelves() {
    var rg = document.getElementById("recent-grid"), fs = document.getElementById("fav-section"), fg = document.getElementById("fav-grid"), rs = document.getElementById("recent-section");
    if (rg && rs) {
      var rec = getRecent().map(function (s) { return bySlug[s]; }).filter(Boolean);
      if (rec.length) { rg.innerHTML = rec.map(cardHTML).join(""); rs.classList.remove("hidden"); }
      else rs.classList.add("hidden");
    }
    if (fg && fs) {
      var fav = getFavs().map(function (s) { return bySlug[s]; }).filter(Boolean);
      if (fav.length) { fg.innerHTML = fav.map(cardHTML).join(""); fs.classList.remove("hidden"); }
      else fs.classList.add("hidden");
    }
    syncFavButtons();
  }
  function renderRelated() {
    var mount = document.getElementById("related-tools");
    if (!mount) return;
    var cur = document.body.getAttribute("data-tool");
    var cat = document.body.getAttribute("data-category");
    var same = TOOLS.filter(function (t) { return !t.soon && t.cat === cat && t.slug !== cur; });
    var rest = POPULAR.map(function (s) { return bySlug[s]; }).filter(function (t) {
      return t && t.slug !== cur && same.indexOf(t) < 0;
    });
    mount.innerHTML = same.concat(rest).slice(0, 4).map(cardHTML).join("");
    syncFavButtons();
  }

  /* ---------- Logo (360 Orbit mark) ---------- */
  var LOGO_SVG = '<svg class="logo-svg" viewBox="0 0 48 48" fill="none" aria-hidden="true"><defs><linearGradient id="t360lg" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0a7a55"/><stop offset=".52" stop-color="#2fbf8f"/><stop offset="1" stop-color="#d9a441"/></linearGradient></defs><circle cx="24" cy="24" r="18.5" stroke="url(#t360lg)" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="86 30"/><circle cx="36.6" cy="10.5" r="3.2" fill="#d9a441"/><path fill="currentColor" fill-rule="evenodd" d="M24 14.6l8.1 4.7v9.4L24 33.4l-8.1-4.7v-9.4L24 14.6zm0 5.3a4.1 4.1 0 1 0 0 8.2 4.1 4.1 0 0 0 0-8.2z"/></svg>';

  /* ---------- Header / footer injection ---------- */
  var sunSVG = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var moonSVG = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var searchSVG = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20.5 20.5 16.7 16.7"/></svg>';

  function currentTheme() { return document.documentElement.getAttribute("data-theme") || "light"; }
  function injectChrome() {
    var header = document.getElementById("site-header");
    if (header) {
      var nav = CATEGORIES.map(function (c) {
        return '<a href="' + BASE + "index.html#" + c.id + '">' + c.name.replace(" Tools", "") + "</a>";
      }).join("");
      header.className = "site-header";
      header.innerHTML =
        '<div class="container header-inner">' +
          '<a class="logo" href="' + BASE + 'index.html" aria-label="Tool360 home">' + LOGO_SVG + '<span>Tool<span class="logo-num">360</span></span></a>' +
          '<nav class="main-nav" aria-label="Tool categories">' + nav + "</nav>" +
          '<div class="header-actions">' +
            '<button class="search-btn" id="hdr-search" type="button" aria-label="Search tools">' + searchSVG + '<span class="sb-label">Search tools…</span><span class="spacer"></span><span class="kbd">Ctrl K</span></button>' +
            '<button class="icon-btn" id="theme-toggle" type="button" aria-label="Toggle dark mode">' + (currentTheme() === "dark" ? sunSVG : moonSVG) + "</button>" +
          "</div>" +
        "</div>";
      document.getElementById("hdr-search").addEventListener("click", function () { openPalette(""); });
      document.getElementById("theme-toggle").addEventListener("click", function () {
        var next = currentTheme() === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        lsSet("t360:theme", next);
        this.innerHTML = next === "dark" ? sunSVG : moonSVG;
      });
    }
    var footer = document.getElementById("site-footer");
    if (footer) {
      var catLinks = CATEGORIES.map(function (c) {
        return '<li><a href="' + BASE + "index.html#" + c.id + '">' + c.name + "</a></li>";
      }).join("");
      function toolLinks(catIds) {
        return TOOLS.filter(function (t) { return !t.soon && catIds.indexOf(t.cat) >= 0; })
          .map(function (t) { return '<li><a href="' + toolUrl(t.slug) + '">' + t.name + "</a></li>"; }).join("");
      }
      footer.className = "site-footer";
      footer.innerHTML =
        '<div class="container">' +
          '<div class="footer-grid">' +
            '<div class="footer-brand">' +
              '<a class="logo" href="' + BASE + 'index.html">' + LOGO_SVG + '<span>Tool<span class="logo-num">360</span></span></a>' +
              "<p>Free online tools for PDFs, images, text, conversions and code. Everything runs locally in your browser — your files are never uploaded to a server.</p>" +
            "</div>" +
            "<div><h4>Categories</h4><ul>" + catLinks + "</ul></div>" +
            "<div><h4>Popular tools</h4><ul>" + POPULAR.slice(0, 7).map(function (s) {
                var t = bySlug[s]; return '<li><a href="' + toolUrl(s) + '">' + t.name + "</a></li>";
              }).join("") + "</ul></div>" +
            "<div><h4>More tools</h4><ul>" + toolLinks(["text", "calculators", "developer", "generators"]) + "</ul></div>" +
          "</div>" +
          '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + ' Tool360. Free tools that respect your privacy.</span><span>Runs 100% in your browser · No sign-up · No uploads</span></div>' +
        "</div>";
    }
  }

  /* ---------- Command palette ---------- */
  var overlay, palInput, palList, palItems = [], palSel = 0;
  function fuzzyScore(q, name) {
    q = q.toLowerCase(); name = name.toLowerCase();
    if (!q) return 1;
    var idx = name.indexOf(q);
    if (idx >= 0) return 1000 - idx;
    var qi = 0, score = 0, last = -1;
    for (var i = 0; i < name.length && qi < q.length; i++) {
      if (name[i] === q[qi]) { score += last === i - 1 ? 3 : 1; last = i; qi++; }
    }
    return qi === q.length ? score : -1;
  }
  function paletteResults(q) {
    q = (q || "").trim();
    if (!q) {
      var out = [];
      var rec = getRecent().map(function (s) { return bySlug[s]; }).filter(Boolean);
      if (rec.length) out.push({ group: "Recent", tools: rec });
      var fav = getFavs().map(function (s) { return bySlug[s]; }).filter(Boolean);
      if (fav.length) out.push({ group: "Favourites", tools: fav });
      out.push({ group: "Popular", tools: POPULAR.map(function (s) { return bySlug[s]; }) });
      return out;
    }
    var scored = TOOLS.filter(function (t) { return !t.soon; })
      .map(function (t) { return { t: t, s: Math.max(fuzzyScore(q, t.name), fuzzyScore(q, t.slug.replace(/-/g, " ")) * 0.9) }; })
      .filter(function (x) { return x.s >= 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 10).map(function (x) { return x.t; });
    return scored.length ? [{ group: "Tools", tools: scored }] : [];
  }
  function renderPalette(q) {
    var groups = paletteResults(q);
    palItems = [];
    if (!groups.length) {
      palList.innerHTML = '<div class="palette-empty">No tools match “' + q.replace(/</g, "&lt;") + '”. Try “merge”, “image” or “json”.</div>';
      return;
    }
    palList.innerHTML = groups.map(function (g) {
      return '<div class="palette-group">' + g.group + "</div>" + g.tools.map(function (t) {
        palItems.push(t);
        return '<div class="palette-item" data-slug="' + t.slug + '" role="option">' +
          '<span class="tool-icon" data-cat="' + t.cat + '">' + iconFor(t) + "</span>" +
          '<span class="pi-name">' + t.name + '</span><span class="pi-cat">' + catById[t.cat].name + "</span></div>";
      }).join("");
    }).join("");
    palSel = 0; markPalSel();
    palList.querySelectorAll(".palette-item").forEach(function (el) {
      el.addEventListener("click", function () { goTool(el.getAttribute("data-slug")); });
      el.addEventListener("mousemove", function () {
        var i = Array.prototype.indexOf.call(palList.querySelectorAll(".palette-item"), el);
        if (i >= 0 && i !== palSel) { palSel = i; markPalSel(); }
      });
    });
  }
  function markPalSel() {
    palList.querySelectorAll(".palette-item").forEach(function (el, i) {
      el.classList.toggle("sel", i === palSel);
      if (i === palSel && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
    });
  }
  function goTool(slug) {
    recordRecent(slug);
    window.location.href = toolUrl(slug);
  }
  function openPalette(q) {
    if (!overlay) buildPalette();
    overlay.classList.add("open");
    palInput.value = q || "";
    renderPalette(palInput.value);
    setTimeout(function () { palInput.focus(); palInput.select(); }, 10);
    document.body.style.overflow = "hidden";
  }
  function closePalette() {
    if (overlay) overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  function buildPalette() {
    overlay = document.createElement("div");
    overlay.className = "palette-overlay";
    overlay.innerHTML =
      '<div class="palette" role="dialog" aria-modal="true" aria-label="Search tools">' +
        '<input type="text" placeholder="Search tools… (try “merge” or “json”)" aria-label="Search tools" autocomplete="off">' +
        '<div class="palette-list" role="listbox"></div>' +
        '<div class="palette-foot"><span><span class="kbd">↑</span> <span class="kbd">↓</span> navigate</span><span><span class="kbd">Enter</span> open</span><span><span class="kbd">Esc</span> close</span></div>' +
      "</div>";
    document.body.appendChild(overlay);
    palInput = overlay.querySelector("input");
    palList = overlay.querySelector(".palette-list");
    palInput.addEventListener("input", function () { renderPalette(palInput.value); });
    palInput.addEventListener("keydown", function (e) {
      var n = palList.querySelectorAll(".palette-item").length;
      if (e.key === "ArrowDown") { e.preventDefault(); palSel = Math.min(palSel + 1, n - 1); markPalSel(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); palSel = Math.max(palSel - 1, 0); markPalSel(); }
      else if (e.key === "Enter") { var el = palList.querySelectorAll(".palette-item")[palSel]; if (el) goTool(el.getAttribute("data-slug")); }
    });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closePalette(); });
  }

  /* ---------- Toast ---------- */
  var toastTimer = null;
  function toast(msg) {
    var el = document.querySelector(".toast");
    if (!el) { el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  /* ---------- Public helpers ---------- */
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function formatBytes(n) {
    if (n == null || isNaN(n)) return "—";
    if (n < 1024) return n + " B";
    var units = ["KB", "MB", "GB"], i = -1, v = n;
    do { v /= 1024; i++; } while (v >= 1024 && i < units.length - 1);
    return (v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)) + " " + units[i];
  }
  function download(blobOrUrl, filename) {
    var url = typeof blobOrUrl === "string" ? blobOrUrl : URL.createObjectURL(blobOrUrl);
    var a = document.createElement("a");
    a.href = url; a.download = filename || "download";
    document.body.appendChild(a); a.click(); a.remove();
    if (typeof blobOrUrl !== "string") setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  function copyText(text, btn) {
    function done() {
      if (btn) {
        var old = btn.getAttribute("data-label") || btn.textContent;
        btn.setAttribute("data-label", old);
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = btn.getAttribute("data-label"); }, 1600);
      }
      toast("Copied to clipboard");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else fallback();
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast("Copy failed — select and copy manually"); }
      ta.remove();
    }
  }

  window.T360 = {
    qs: qs, qsa: qsa, toast: toast, download: download, copyText: copyText,
    formatBytes: formatBytes, tools: TOOLS, categories: CATEGORIES, openPalette: openPalette,
    iconFor: iconFor, bySlug: bySlug, catById: catById
  };

  /* ---------- Init ---------- */
  (function initTheme() {
    /* Dark is the default showpiece theme; a saved choice always wins. */
    var saved = lsGet("t360:theme", null);
    document.documentElement.setAttribute("data-theme", saved === "light" ? "light" : "dark");
  })();

  injectChrome();
  /* Hydrate static homepage card icons from the registry */
  document.querySelectorAll(".tool-icon[data-icon]").forEach(function (el) {
    var s = el.getAttribute("data-icon");
    if (ICONS[s]) el.innerHTML = ICONS[s];
  });
  renderRelated();
  renderHomeShelves();
  syncFavButtons();

  var curSlug = document.body.getAttribute("data-tool");
  if (curSlug) recordRecent(curSlug);

  document.addEventListener("click", function (e) {
    var fb = e.target.closest ? e.target.closest(".fav-btn") : null;
    if (fb) { e.preventDefault(); e.stopPropagation(); toggleFav(fb.getAttribute("data-slug")); }
  });
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      if (overlay && overlay.classList.contains("open")) closePalette(); else openPalette("");
    } else if (e.key === "Escape") closePalette();
    if (e.key === "Enter" && e.target && e.target.classList && e.target.classList.contains("fav-btn")) {
      e.preventDefault(); toggleFav(e.target.getAttribute("data-slug"));
    }
  });

  var heroSearch = document.getElementById("hero-search");
  if (heroSearch) {
    heroSearch.addEventListener("focus", function () { openPalette(heroSearch.value); });
    heroSearch.addEventListener("input", function () {
      if (overlay && overlay.classList.contains("open")) { palInput.value = heroSearch.value; renderPalette(palInput.value); }
    });
  }

  /* Scroll reveal for homepage cards */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
      }, { threshold: 0.08 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    }
  }

  /* ---------- 3D tilt + glow on cards (fine pointers only) ---------- */
  if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".tool-card, .cat-card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--ry", ((px - 0.5) * 7).toFixed(2) + "deg");
        card.style.setProperty("--rx", ((0.5 - py) * 7).toFixed(2) + "deg");
        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        card.classList.add("tilting");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
        card.classList.remove("tilting");
      });
    });
  }

  /* ---------- Marquee: clone the set once for a seamless loop ---------- */
  var mqTrack = document.getElementById("marquee-track");
  if (mqTrack && mqTrack.children.length === 1) {
    mqTrack.appendChild(mqTrack.children[0].cloneNode(true));
    mqTrack.classList.add("loop");
  }
})();
