const nav = document.querySelector(".nav-shell");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("[data-nav-links]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (nav && menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  });
}

const logoRow = document.querySelector(".logo-row");

if (logoRow && !prefersReducedMotion) {
  const logos = Array.from(logoRow.children);
  logos.forEach((logo) => {
    const clone = logo.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    logoRow.appendChild(clone);
  });
}

const revealTargets = document.querySelectorAll(
  ".partner-band, .roster-heading, .testimonials h2, .testimonial, .section-heading, .service-card, .process-grid article, .faq-list, .founder-grid"
);

if (prefersReducedMotion) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
} else {
  revealTargets.forEach((target) => target.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

const motionCards = document.querySelectorAll(
  ".creator-card, .testimonial, .service-card, details"
);

if (!prefersReducedMotion) {
  motionCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
      card.style.setProperty("--tilt-x", `${x}px`);
      card.style.setProperty("--tilt-y", `${y}px`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0px");
      card.style.setProperty("--tilt-y", "0px");
    });
  });
}

if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  const cursorDot = document.createElement("div");
  const cursorRing = document.createElement("div");
  let ringX = window.innerWidth / 2;
  let ringY = window.innerHeight / 2;
  let targetX = ringX;
  let targetY = ringY;

  cursorDot.className = "cursor-dot";
  cursorRing.className = "cursor-ring";
  document.body.append(cursorRing, cursorDot);
  document.body.classList.add("has-cursor");

  const moveCursor = () => {
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;
    cursorDot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(moveCursor);
  };

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    document.body.classList.add("cursor-active");
  });

  document.addEventListener("pointerover", (event) => {
    if (event.target.closest("a, button, summary")) {
      document.body.classList.add("cursor-link");
    }
  });

  document.addEventListener("pointerout", (event) => {
    if (event.target.closest("a, button, summary")) {
      document.body.classList.remove("cursor-link");
    }
  });

  document.addEventListener("mouseleave", () => {
    document.body.classList.remove("cursor-active", "cursor-link");
  });

  moveCursor();
}
