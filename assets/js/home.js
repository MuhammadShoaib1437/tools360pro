/* ============================================================
   Tool360 — Phase 6 homepage controller
   1) Orbit: chips are positioned with left/top percentages from
      a single JS angle per ring. A chip's own transform is only
      translate(-50%,-50%) — it is NEVER rotated, so every label
      stays upright at every moment of the rotation.
   2) QR mini tool: the real generator, using the vendored
      qrcode library exactly like the full tool page.
   3) Search buttons -> shared command palette. 4) Frame tilt.
   ============================================================ */
(function () {
  "use strict";
  if (!window.T360) return;

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Search ---------- */
  T360.qsa("[data-open-search]").forEach(function (btn) {
    btn.addEventListener("click", function () { T360.openPalette(""); });
  });

  /* ---------- Orbit ---------- */
  var stage = document.getElementById("h6-orbit");
  var toggle = document.getElementById("h6-orbit-toggle");
  if (stage) {
    var chips = T360.qsa(".h6-chip", stage).map(function (el) {
      return {
        el: el,
        ring: el.getAttribute("data-ring") || "outer",
        r: parseFloat(el.getAttribute("data-r")) || 40,
        a0: parseFloat(el.getAttribute("data-angle")) || 0
      };
    });
    /* Slow, premium speeds: outer ring one turn / 110s, inner / 85s */
    var SPEED = { outer: 360 / 110, inner: -360 / 85 }; /* deg per second */
    var offset = { outer: 0, inner: 0 };
    var paused = !!reduceMotion;
    var hovering = false;
    var visible = true;
    var last = null;

    /* Radii scale down smoothly as the stage shrinks, so labelled chips
       always fit inside the stage. Below 480px the orbit becomes a static,
       perfectly staggered composition (inner nodes parked +30°) — no
       collisions, labels upright, nothing clipped. */
    var ringOuter = stage.querySelector(".h6-ring-outer");
    var ringInner = stage.querySelector(".h6-ring-inner");
    function metrics() {
      var w = stage.clientWidth || 560;
      var s = Math.max(0.8, Math.min(1, w / 560));
      var si = Math.max(0.78, Math.min(1, w / 560));
      return { outer: 40 * s, inner: 27 * si, isStatic: w < 480 };
    }
    var M = metrics();
    function place() {
      chips.forEach(function (ch) {
        var r = ch.ring === "outer" ? M.outer : M.inner;
        var a0 = ch.a0 + (ch.ring === "inner" && M.isStatic ? 30 : 0);
        var a = (a0 + offset[ch.ring]) * Math.PI / 180;
        ch.el.style.left = (50 + r * Math.cos(a)).toFixed(3) + "%";
        ch.el.style.top = (50 + r * Math.sin(a)).toFixed(3) + "%";
      });
      if (ringOuter) ringOuter.style.inset = (50 - M.outer) + "%";
      if (ringInner) ringInner.style.inset = (50 - M.inner) + "%";
      if (toggle) toggle.style.display = M.isStatic && !reduceMotion ? "none" : "";
    }
    function frame(ts) {
      if (last == null) last = ts;
      var dt = Math.min(0.1, (ts - last) / 1000);
      last = ts;
      if (!paused && !hovering && visible && !document.hidden && !M.isStatic) {
        offset.outer += SPEED.outer * dt;
        offset.inner += SPEED.inner * dt;
        place();
      }
      window.requestAnimationFrame(frame);
    }
    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { M = metrics(); place(); }, 120);
    });
    place();
    if (!reduceMotion) window.requestAnimationFrame(frame);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }, { threshold: 0.05 }).observe(stage);
    }
    stage.addEventListener("pointerenter", function () { hovering = true; });
    stage.addEventListener("pointerleave", function () { hovering = false; });
    stage.addEventListener("focusin", function () { hovering = true; });
    stage.addEventListener("focusout", function () { hovering = false; });

    function paintToggle() {
      if (!toggle) return;
      toggle.setAttribute("aria-pressed", paused ? "true" : "false");
      toggle.innerHTML = paused
        ? '<span aria-hidden="true">▶</span> Resume orbit'
        : '<span aria-hidden="true">❚❚</span> Pause orbit';
      if (reduceMotion) {
        toggle.innerHTML = '<span aria-hidden="true">●</span> Motion off — reduced motion';
        toggle.disabled = true;
      }
    }
    if (toggle) {
      toggle.addEventListener("click", function () {
        paused = !paused;
        last = null;
        paintToggle();
      });
      paintToggle();
    }
  }

  /* ---------- QR mini tool (real generator) ---------- */
  var qrInput = document.getElementById("hq-text");
  var qrCanvas = document.getElementById("hq-canvas");
  if (qrInput && qrCanvas) {
    var qrError = document.getElementById("hq-error");
    var qrCtx = qrCanvas.getContext("2d");
    var qrTimer = null;

    function showQrError(msg) {
      if (!qrError) return;
      qrError.textContent = msg;
      qrError.classList.remove("hidden");
    }
    function hideQrError() {
      if (!qrError) return;
      qrError.textContent = "";
      qrError.classList.add("hidden");
    }
    function clearQr() {
      qrCtx.fillStyle = "#ffffff";
      qrCtx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
    }
    function renderQr() {
      var text = qrInput.value;
      if (typeof qrcode === "undefined") {
        showQrError("QR library failed to load. Please refresh the page.");
        return;
      }
      if (!text || text.trim() === "") {
        showQrError("Enter some text or a URL to generate a QR code.");
        clearQr();
        return;
      }
      var qr;
      try {
        qr = qrcode(0, "M");
        qr.addData(text);
        qr.make();
      } catch (e) {
        showQrError("That text is too long to fit in a QR code. Try shortening it.");
        clearQr();
        return;
      }
      hideQrError();
      var count = qr.getModuleCount();
      var quiet = 4;
      var total = count + quiet * 2;
      var size = qrCanvas.width;
      var cell = size / total;
      qrCtx.fillStyle = "#ffffff";
      qrCtx.fillRect(0, 0, size, size);
      qrCtx.fillStyle = "#000000";
      for (var r = 0; r < count; r++) {
        for (var c = 0; c < count; c++) {
          if (qr.isDark(r, c)) {
            qrCtx.fillRect(
              Math.round((c + quiet) * cell), Math.round((r + quiet) * cell),
              Math.ceil(cell), Math.ceil(cell)
            );
          }
        }
      }
    }
    qrInput.addEventListener("input", function () {
      clearTimeout(qrTimer);
      qrTimer = setTimeout(renderQr, 160);
    });
    var dl = document.getElementById("hq-download");
    if (dl) {
      dl.addEventListener("click", function () {
        renderQr();
        if (qrCanvas.toBlob) {
          qrCanvas.toBlob(function (blob) {
            if (blob) T360.download(blob, "qr-code.png");
            else T360.toast("Could not create PNG");
          }, "image/png");
        } else {
          T360.download(qrCanvas.toDataURL("image/png"), "qr-code.png");
        }
      });
    }
    renderQr();
  }

  /* ---------- Tasteful tilt on showcase frames ---------- */
  var finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  if (finePointer && !reduceMotion) {
    T360.qsa(".tilt").forEach(function (frame) {
      frame.addEventListener("pointermove", function (e) {
        var rect = frame.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        frame.style.transform = "perspective(1100px) rotateX(" + (-py * 3.2).toFixed(2) + "deg) rotateY(" + (px * 3.2).toFixed(2) + "deg)";
      });
      frame.addEventListener("pointerleave", function () {
        frame.style.transform = "";
      });
    });
  }
})();
