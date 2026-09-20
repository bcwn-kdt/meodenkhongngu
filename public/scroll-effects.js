(() => {
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motionPreference.matches) return;

  const root = document.documentElement;
  const body = document.body;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const parallaxLayers = [];
  let updateFrame = 0;
  let enhanceFrame = 0;
  let currentProgress = 0;
  let firstProgressUpdate = true;

  root.classList.add("scroll-motion-ready");

  const thread = document.createElement("span");
  thread.className = "scroll-thread";
  thread.setAttribute("aria-hidden", "true");
  const threadFill = document.createElement("span");
  threadFill.className = "scroll-thread__fill";
  thread.appendChild(threadFill);
  body.appendChild(thread);

  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    }
  }, { threshold: .12, rootMargin: "0px 0px -8% 0px" });

  const lightObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-focus-lit");
      observer.unobserve(entry.target);
    }
  }, { threshold: .01, rootMargin: "-30% 0px -30% 0px" });

  const footer = document.querySelector(".site-footer");
  if (footer) {
    const footerObserver = new IntersectionObserver((entries) => {
      const active = entries.some((entry) => entry.isIntersecting);
      footer.classList.toggle("is-closing", active);
      body.classList.toggle("is-near-footer", active);
      window.dispatchEvent(new CustomEvent("ambient:footer", { detail: { active } }));
    }, { threshold: .12 });
    footerObserver.observe(footer);
  }

  const getColumnCount = (container) => {
    const columns = getComputedStyle(container).gridTemplateColumns;
    if (!columns || columns === "none") return 1;
    return Math.max(1, columns.split(" ").length);
  };

  const registerCards = () => {
    document.querySelectorAll(".poem-grid, .archive-grid").forEach((grid) => {
      const columns = getColumnCount(grid);
      grid.querySelectorAll(".poem-card, .archive-card").forEach((card, index) => {
        if (card.dataset.scrollCard === "true") return;
        card.dataset.scrollCard = "true";
        card.classList.add("scroll-stagger-card");
        card.style.setProperty("--reveal-delay", `${(index % columns) * 90}ms`);

        const sheen = document.createElement("span");
        sheen.className = "scroll-sheen";
        sheen.setAttribute("aria-hidden", "true");
        card.appendChild(sheen);

        revealObserver.observe(card);
        lightObserver.observe(card);
      });
    });
  };

  const registerStanzas = () => {
    document.querySelectorAll(".poem-content > p, .poem-content > blockquote, .about-content > p").forEach((stanza, index) => {
      if (stanza.dataset.scrollStanza === "true") return;
      stanza.dataset.scrollStanza = "true";
      stanza.classList.add("scroll-stanza");
      stanza.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 55}ms`);
      revealObserver.observe(stanza);
    });
  };

  const registerParallax = () => {
    const layers = [
      [".hero-art", .045],
      [".entrance-copy", .018],
      [".vvb-flipbook__top", .022],
      [".vvb-flipbook__stage", .01],
    ];

    for (const [selector, strength] of layers) {
      document.querySelectorAll(selector).forEach((element) => {
        if (element.dataset.scrollParallax === "true") return;
        element.dataset.scrollParallax = "true";
        element.classList.add("scroll-parallax-layer");
        parallaxLayers.push({ element, strength, currentOffset: 0 });
      });
    }
  };

  const update = () => {
    updateFrame = 0;
    const scrollRange = root.scrollHeight - window.innerHeight;
    const targetProgress = scrollRange > 0 ? clamp(window.scrollY / scrollRange, 0, 1) : 0;
    if (firstProgressUpdate) {
      currentProgress = targetProgress;
      firstProgressUpdate = false;
    } else {
      currentProgress += (targetProgress - currentProgress) * .085;
    }
    thread.hidden = scrollRange < 120;
    threadFill.style.transform = `scaleY(${currentProgress})`;

    const viewportCenter = window.innerHeight / 2;
    let shouldContinue = Math.abs(targetProgress - currentProgress) > .0004;
    for (const layer of parallaxLayers) {
      const rect = layer.element.getBoundingClientRect();
      if (rect.bottom < -240 || rect.top > window.innerHeight + 240) continue;
      const layerCenter = rect.top + rect.height / 2;
      const targetOffset = clamp((viewportCenter - layerCenter) * layer.strength, -24, 24);
      layer.currentOffset += (targetOffset - layer.currentOffset) * .07;
      layer.element.style.setProperty("--parallax-y", `${layer.currentOffset.toFixed(2)}px`);
      if (Math.abs(targetOffset - layer.currentOffset) > .03) shouldContinue = true;
    }

    if (shouldContinue) scheduleUpdate();
  };

  function scheduleUpdate() {
    if (updateFrame) return;
    updateFrame = requestAnimationFrame(update);
  }

  const enhance = () => {
    registerCards();
    registerStanzas();
    registerParallax();
    scheduleUpdate();
  };

  const scheduleEnhance = () => {
    if (enhanceFrame) return;
    enhanceFrame = requestAnimationFrame(() => {
      enhanceFrame = 0;
      enhance();
    });
  };

  const mutationObserver = new MutationObserver(scheduleEnhance);
  mutationObserver.observe(body, { childList: true, subtree: true });

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleEnhance, { passive: true });
  window.addEventListener("load", scheduleEnhance, { once: true });

  enhance();
})();
