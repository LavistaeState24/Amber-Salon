/* ══════════════════════════════════════════════════════════════
   COOKIE CONSENT + 360° VIEW PROMPT POPUPS
   GSAP drives the open/close motion; everything falls back to an
   instant show/hide if GSAP didn't load or the visitor prefers
   reduced motion.
   ══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var CONSENT_KEY = "amberSalonCookieConsent";
  var VIEW_360_SEEN_KEY = "amberSalonView360Seen";
  var VIEW_360_URL = "./demo.html";
  var calmMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safeGet(storage, key) {
    try {
      return storage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeSet(storage, key, value) {
    try {
      storage.setItem(key, value);
    } catch (error) {
      /* storage unavailable (private mode, sandboxed preview, etc.) */
    }
  }

  function openOverlay(overlay, backdrop, panel, panelFrom) {
    if (!overlay || !backdrop || !panel) return;

    overlay.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");

    if (!window.gsap || calmMotion) {
      backdrop.style.opacity = 1;
      panel.style.opacity = 1;
      panel.style.transform = "none";
      return;
    }

    gsap.killTweensOf([backdrop, panel]);
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(panel, panelFrom);
    gsap.to(backdrop, { opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.to(panel, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.6)" });
  }

  function closeOverlay(overlay, backdrop, panel, panelTo, onComplete) {
    if (!overlay || overlay.classList.contains("hidden")) {
      if (onComplete) onComplete();
      return;
    }

    document.body.classList.remove("overflow-hidden");

    function finish() {
      overlay.classList.add("hidden");
      if (onComplete) onComplete();
    }

    if (!window.gsap || calmMotion) {
      finish();
      return;
    }

    gsap.killTweensOf([backdrop, panel]);
    gsap.to(panel, Object.assign({ duration: 0.3, ease: "power2.in", onComplete: finish }, panelTo));
    gsap.to(backdrop, { opacity: 0, duration: 0.3, ease: "power2.in" });
  }

  /* ───────────────── Cookie / privacy consent popup ───────────────── */
  var cookieOverlay = document.getElementById("cookie-consent-overlay");
  var cookieBackdrop = document.getElementById("cookie-consent-backdrop");
  var cookiePanel = document.getElementById("cookie-consent-panel");
  var cookieOptions = document.getElementById("cookie-consent-options");
  var customizeBtn = document.getElementById("cookie-consent-customize");
  var acceptBtn = document.getElementById("cookie-consent-accept");
  var customizeOpen = false;

  function openCookiePopup() {
    openOverlay(cookieOverlay, cookieBackdrop, cookiePanel, { opacity: 0, y: 24, scale: 0.97 });
  }

  function closeCookiePopup(after) {
    closeOverlay(cookieOverlay, cookieBackdrop, cookiePanel, { opacity: 0, y: 24, scale: 0.97 }, after);
  }

  function saveConsent(prefs) {
    var consent = Object.assign({ essential: true, ts: Date.now() }, prefs);
    safeSet(localStorage, CONSENT_KEY, JSON.stringify(consent));
  }

  if (customizeBtn && cookieOptions) {
    customizeBtn.addEventListener("click", function () {
      customizeOpen = !customizeOpen;
      cookieOptions.classList.toggle("hidden", !customizeOpen);
      customizeBtn.textContent = customizeOpen ? "Save Preferences" : "Customize";

      if (!customizeOpen) {
        var analyticsInput = document.querySelector('[data-consent-option="analytics"]');
        var marketingInput = document.querySelector('[data-consent-option="marketing"]');
        saveConsent({
          analytics: analyticsInput ? analyticsInput.checked : false,
          marketing: marketingInput ? marketingInput.checked : false,
        });
        closeCookiePopup(maybeShowView360Popup);
      }
    });
  }

  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      saveConsent({ analytics: true, marketing: true });
      closeCookiePopup(maybeShowView360Popup);
    });
  }

  /* ───────────────── 360° view prompt popup ───────────────── */
  var viewOverlay = document.getElementById("view360-overlay");
  var viewBackdrop = document.getElementById("view360-backdrop");
  var viewPanel = document.getElementById("view360-panel");
  var viewYesBtn = document.getElementById("view360-yes");
  var viewNoBtn = document.getElementById("view360-no");
  var viewCloseBtn = document.getElementById("view360-close");

  function openView360Popup() {
    openOverlay(viewOverlay, viewBackdrop, viewPanel, { opacity: 0, scale: 0.92 });
  }

  function closeView360Popup(after) {
    closeOverlay(viewOverlay, viewBackdrop, viewPanel, { opacity: 0, scale: 0.92 }, after);
  }

  function markView360Seen() {
    safeSet(sessionStorage, VIEW_360_SEEN_KEY, "1");
  }

  function maybeShowView360Popup() {
    if (safeGet(sessionStorage, VIEW_360_SEEN_KEY)) return;
    window.setTimeout(openView360Popup, 450);
  }

  if (viewYesBtn) {
    viewYesBtn.addEventListener("click", function () {
      markView360Seen();
      window.location.href = VIEW_360_URL;
    });
  }

  if (viewNoBtn) {
    viewNoBtn.addEventListener("click", function () {
      markView360Seen();
      closeView360Popup();
    });
  }

  if (viewCloseBtn) {
    viewCloseBtn.addEventListener("click", function () {
      markView360Seen();
      closeView360Popup();
    });
  }

  if (viewBackdrop) {
    viewBackdrop.addEventListener("click", function () {
      markView360Seen();
      closeView360Popup();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (viewOverlay && !viewOverlay.classList.contains("hidden")) {
      markView360Seen();
      closeView360Popup();
    }
  });

  /* ───────────────── Boot ───────────────── */
  function init() {
    if (!cookieOverlay && !viewOverlay) return;

    var consent = safeGet(localStorage, CONSENT_KEY);
    if (!consent) {
      window.setTimeout(openCookiePopup, 900);
    } else {
      maybeShowView360Popup();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
