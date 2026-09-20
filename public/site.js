(() => {
  const header = document.querySelector("[data-site-header]");
  if (header) {
    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 32);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  const exhibitionCards = [...document.querySelectorAll("[data-exhibition-grid] .poem-card")];

  document.querySelector("[data-wander]")?.addEventListener("click", () => {
    const chosen = exhibitionCards[Math.floor(Math.random() * exhibitionCards.length)];
    if (!chosen) return;
    chosen.scrollIntoView({ behavior: "smooth", block: "center" });
    chosen.classList.remove("is-random");
    requestAnimationFrame(() => chosen.classList.add("is-random"));
    window.setTimeout(() => {
      window.location.assign(chosen.href);
    }, 750);
  });

})();
