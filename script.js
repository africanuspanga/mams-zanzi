/* =========================================================
   MAMS ZANZI — site behaviour
   ========================================================= */

// 👉 Set the company WhatsApp number here (country code, digits only — no +, spaces or leading 0)
const WHATSAPP_NUMBER = "255000000000";
const WHATSAPP_GREETING = "Hello MAMS ZANZI, I would like to enquire about your logistics services.";

const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// ---------- WhatsApp links ----------
document.querySelectorAll(".js-wa").forEach((el) => {
  el.href = waLink(WHATSAPP_GREETING);
  el.target = "_blank";
  el.rel = "noopener";
});

// Show the floating button tooltip briefly after load
const waFloat = document.querySelector(".wa-float");
setTimeout(() => waFloat.classList.add("show-tip"), 2500);
setTimeout(() => waFloat.classList.remove("show-tip"), 7000);

// ---------- Header: scrolled state ----------
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// ---------- Mobile menu ----------
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const setMenu = (open) => {
  nav.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

// ---------- Active nav link ----------
const links = [...document.querySelectorAll(".nav__link")];
const sections = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${entry.target.id}`));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => navObserver.observe(s));

// ---------- Reveal on scroll ----------
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

// Stagger siblings inside grids
document.querySelectorAll(".services__grid, .why__cards, .steps, .about__copy").forEach((group) => {
  group.querySelectorAll(":scope > .reveal").forEach((el, i) => (el.style.transitionDelay = `${i * 90}ms`));
});
document.querySelectorAll(".reveal, .steps").forEach((el) => revealObserver.observe(el));

// ---------- Quote form → WhatsApp ----------
const form = document.getElementById("quote-form");
const error = document.getElementById("quote-error");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const required = ["name", "phone", "service"];
  let valid = true;

  required.forEach((name) => {
    const field = form.elements[name];
    const ok = Boolean((data[name] || "").trim());
    field.classList.toggle("is-invalid", !ok);
    if (!ok) valid = false;
  });

  error.hidden = valid;
  if (!valid) return;

  const message = [
    "Hello MAMS ZANZI, I would like to request a quote.",
    "",
    `Name: ${data.name}`,
    data.company ? `Company: ${data.company}` : null,
    `Phone: ${data.phone}`,
    `Service: ${data.service}`,
    data.details ? `Details: ${data.details}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  window.open(waLink(message), "_blank", "noopener");
  form.reset();
});

form.querySelectorAll("input, select").forEach((f) =>
  f.addEventListener("input", () => f.classList.remove("is-invalid"))
);

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
