(() => {
  const loadAnalytics = () => {
    const measurementId = "G-Z90LT6R7NK";
    if (window.gtag || document.querySelector(`script[src*="${measurementId}"]`)) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(){ window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", measurementId);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  };

  const loadInteractionAnalytics = () => {
    if (document.querySelector('script[src^="/analytics-events.js"]')) return;
    const script = document.createElement("script");
    script.defer = true;
    script.src = "/analytics-events.js?v=events-v2";
    document.head.appendChild(script);
  };

  loadAnalytics();
  loadInteractionAnalytics();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const cursor = document.querySelector(".cursor-glow");
  if (!cursor) return;

  const injectEffectStyles = () => {
    const previous = document.getElementById("meo-touch-effects");
    if (previous) previous.remove();

    const style = document.createElement("style");
    style.id = "meo-touch-effects";
    style.textContent = `
      .touch-glow,.paper-dust{position:fixed;left:0;top:0;pointer-events:none;z-index:10000;will-change:transform,opacity}
      .touch-glow{width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:999px;background:radial-gradient(circle,rgba(255,248,239,.68) 0 2px,rgba(240,198,122,.18) 4px,rgba(158,220,255,.09) 42%,transparent 74%);box-shadow:0 0 20px rgba(240,198,122,.16),0 0 34px rgba(158,220,255,.09);mix-blend-mode:screen;animation:touchRipple 1120ms cubic-bezier(.16,1,.3,1) forwards}
      .paper-dust{border-radius:999px;background:radial-gradient(circle,rgba(255,248,239,.78),rgba(240,198,122,.3) 48%,transparent 76%);box-shadow:0 0 7px rgba(240,198,122,.14);opacity:.68;mix-blend-mode:screen;animation:paperDust 1450ms cubic-bezier(.16,1,.3,1) forwards;filter:blur(.08px)}
      @keyframes touchRipple{0%{transform:translate3d(0,0,0) scale(.34);opacity:.56;filter:blur(0)}42%{opacity:.28}100%{transform:translate3d(0,0,0) scale(6.8);opacity:0;filter:blur(3px)}}
      @keyframes paperDust{0%{transform:translate3d(-50%,-50%,0) rotate(0deg) scale(.82);opacity:.6}38%{opacity:.44}72%{opacity:.16}100%{transform:translate3d(calc(var(--dust-x) - 50%),calc(var(--dust-y) + 30px),0) rotate(var(--dust-r)) scale(.06);opacity:0}}
    `;
    document.head.appendChild(style);
  };

  injectEffectStyles();

  const interactiveElements = document.querySelectorAll(
    ".glow-surface, .glow-card, .glow-button, .glow-link, .poem-page, .poem-content, .about, .about-content, .book-wrap, .studio-controls, .writing-note"
  );

  const finePointer = window.matchMedia("(pointer: fine)").matches;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let visible = false;
  let hideTimer = null;
  let lastBurst = 0;

  const paintElements = (x, y) => {
    document.documentElement.style.setProperty("--cursor-x", `${x}px`);
    document.documentElement.style.setProperty("--cursor-y", `${y}px`);

    interactiveElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--mouse-x", `${x - rect.left}px`);
      element.style.setProperty("--mouse-y", `${y - rect.top}px`);
    });
  };

  const showAt = (x, y, temporary = false) => {
    targetX = x;
    targetY = y;
    visible = true;
    cursor.classList.add("is-visible");
    paintElements(x, y);

    if (temporary) {
      clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        visible = false;
        cursor.classList.remove("is-visible", "is-pressing");
      }, 620);
    }
  };

  const makeTouchGlow = (x, y) => {
    const glow = document.createElement("span");
    glow.className = "touch-glow";
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
    document.body.appendChild(glow);
    glow.addEventListener("animationend", () => glow.remove(), { once: true });
  };

  const makePaperDust = (x, y) => {
    const now = performance.now();
    if (now - lastBurst < 90) return;
    lastBurst = now;

    const amount = window.innerWidth < 520 ? 14 : 18;
    for (let index = 0; index < amount; index += 1) {
      const dust = document.createElement("span");
      const size = 2.2 + Math.random() * 4.4;
      const angle = Math.random() * Math.PI * 2;
      const distance = 24 + Math.random() * 82;
      const driftX = Math.cos(angle) * distance;
      const driftY = Math.sin(angle) * distance + 24 + Math.random() * 66;
      const rotate = -140 + Math.random() * 280;
      const duration = 1240 + Math.random() * 760;

      dust.className = "paper-dust";
      dust.style.left = `${x}px`;
      dust.style.top = `${y}px`;
      dust.style.width = `${size}px`;
      dust.style.height = `${size}px`;
      dust.style.setProperty("--dust-x", `${driftX}px`);
      dust.style.setProperty("--dust-y", `${driftY}px`);
      dust.style.setProperty("--dust-r", `${rotate}deg`);
      dust.style.animationDuration = `${duration}ms`;
      dust.style.animationDelay = `${Math.random() * 80}ms`;
      document.body.appendChild(dust);
      dust.addEventListener("animationend", () => dust.remove(), { once: true });
    }
  };

  const burstAt = (x, y, temporary = true) => {
    showAt(x, y, temporary);
    makeTouchGlow(x, y);
    makePaperDust(x, y);
  };

  const render = () => {
    currentX += (targetX - currentX) * (finePointer ? 0.18 : 0.32);
    currentY += (targetY - currentY) * (finePointer ? 0.18 : 0.32);
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    cursor.style.opacity = visible ? "1" : "0";
    requestAnimationFrame(render);
  };

  window.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    showAt(event.clientX, event.clientY);
  }, { passive: true });

  window.addEventListener("pointerdown", (event) => {
    cursor.classList.add("is-pressing");
    burstAt(event.clientX, event.clientY, event.pointerType === "touch");
  }, { passive: true });

  window.addEventListener("click", (event) => {
    burstAt(event.clientX, event.clientY, true);
  }, { passive: true });

  window.addEventListener("pointerup", () => {
    cursor.classList.remove("is-pressing");
    if (!finePointer) {
      clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        visible = false;
        cursor.classList.remove("is-visible");
      }, 460);
    }
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    visible = false;
    cursor.classList.remove("is-visible", "is-pressing");
  });

  render();
})();
