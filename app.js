// FalkirkHelix.co.uk — shared site JS
function trackEvent(name, params) {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params || {});
  }
}

function toggleFaq(el) {
  var a = el.nextElementSibling;
  var open = a.classList.contains("open");
  document.querySelectorAll(".faq-a").forEach(function (x) {
    x.classList.remove("open");
  });
  document.querySelectorAll(".faq-q").forEach(function (x) {
    x.classList.remove("open");
    x.setAttribute("aria-expanded", "false");
  });
  if (!open) {
    a.classList.add("open");
    el.classList.add("open");
    el.setAttribute("aria-expanded", "true");
    trackEvent("faq_open", {
      page_path: window.location.pathname,
      faq_question: (el.textContent || "").trim().slice(0, 120)
    });
  }
}

var navToggle = document.querySelector(".nav-toggle");
if (navToggle) {
  navToggle.addEventListener("click", function () {
    var nav = document.getElementById("main-nav");
    nav.classList.toggle("open");
    this.setAttribute("aria-expanded", nav.classList.contains("open"));
  });
}

// Track clicks to intent pages and official outbound resources.
var intentPages = {
  "kelpies-parking-costs-hours.html": "parking_costs_hours",
  "kelpies-from-glasgow-edinburgh.html": "travel_glasgow_edinburgh",
  "kelpies-night-times.html": "night_times",
  "kelpies-nearby-food.html": "nearby_food"
};

document.addEventListener("click", function (e) {
  var link = e.target.closest("a[href]");
  if (!link) return;
  var href = link.getAttribute("href") || "";
  var cleaned = href.split("#")[0].split("?")[0];

  if (intentPages[cleaned]) {
    trackEvent("intent_page_click", {
      page_path: window.location.pathname,
      destination: cleaned,
      cluster: intentPages[cleaned]
    });
  }

  if (/^https?:\/\//i.test(href) && /(thehelix\.co\.uk|visitfalkirk\.com|thefalkirkwheel\.co\.uk)/i.test(href)) {
    trackEvent("official_outbound_click", {
      page_path: window.location.pathname,
      destination_url: href
    });
  }
});

// Basic scroll-depth events for content engagement.
var scrollMarks = { 50: false, 90: false };
window.addEventListener("scroll", function () {
  var doc = document.documentElement;
  var max = doc.scrollHeight - doc.clientHeight;
  if (max <= 0) return;
  var pct = Math.round((window.scrollY / max) * 100);
  [50, 90].forEach(function (mark) {
    if (!scrollMarks[mark] && pct >= mark) {
      scrollMarks[mark] = true;
      trackEvent("scroll_depth", {
        page_path: window.location.pathname,
        percent_scrolled: mark
      });
    }
  });
}, { passive: true });
