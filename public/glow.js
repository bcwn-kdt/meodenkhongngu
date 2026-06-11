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

  const loadReadingMode = () => {
    if (document.querySelector('script[src^="/reading-mode.js"]')) return;
    const script = document.createElement("script");
    script.defer = true;
    script.src = "/reading-mode.js?v=reading-v1";
    document.head.appendChild(script);
  };

  loadAnalytics();
  loadInteractionAnalytics();
  loadReadingMode();

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
      .touch-glow{width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:999px;background:radial-gradient(circle,rgba(255,248,239,.36) 0 2px,rgba(240,198,122,.09) 5px,transparent 74%);box-shadow:0 0 14px rgba(240,198,122,.08),0 0 26px rgba(158,220,255,.045);mix-blend-mode:screen;animation:touchRipple 1600ms cubic-bezier(.16,1,.3,1) forwards}
      .paper-dust{border-radius:999px;background:radial-gradient(circle,rgba(255,248,239,.7),rgba(240,198,122,.24) 48%,transparent 78%);box-shadow:0 0 7px rgba(240,198,122,.11);opacity:.56;mix-blend-mode:screen;animation:paperDustDrift var(--dust-duration) cubic-bezier(.19,1,.22,1) forwards;filter:blur(.1px)}
      @media(pointer:fine){.touch-glow{width:24px;height:24px;margin:-12px 0 0 -12px;background:radial-gradient(circle,rgba(255,248,239,.42) 0 3px,rgba(240,198,122,.12) 7px,transparent 76%);box-shadow:0 0 20px rgba(240,198,122,.11),0 0 36px rgba(158,220,255,.06)}.paper-dust{box-shadow:0 0 10px rgba(240,198,122,.15);opacity:.64;filter:blur(.06px)}}
      @keyframes touchRipple{0%{transform:translate3d(0,0,0) scale(.22);opacity:.32;filter:blur(0)}46%{opacity:.12}100%{transform:translate3d(0,0,0) scale(4.8);opacity:0;filter:blur(3.2px)}}
      @keyframes paperDustDrift{0%{transform:translate3d(-50%,-50%,0) scale(.68);opacity:0}16%{opacity:.48}54%{transform:translate3d(calc(var(--dust-mid-x) - 50%),calc(var(--dust-mid-y) - 50%),0) scale(.94);opacity:.34}82%{opacity:.14}100%{transform:translate3d(calc(var(--dust-x) - 50%),calc(var(--dust-y) - 50%),0) scale(.46);opacity:0}}
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
    if (now - lastBurst < (finePointer ? 90 : 150)) return;
    lastBurst = now;

    const amount = finePointer ? 22 : window.innerWidth < 520 ? 8 : 11;
    for (let index = 0; index < amount; index += 1) {
      const dust = document.createElement("span");
      const size = finePointer ? 3.2 + Math.random() * 6.8 : 1.8 + Math.random() * 3.2;
      const angle = Math.random() * Math.PI * 2;
      const distance = finePointer ? 26 + Math.random() * 96 : 10 + Math.random() * 38;
      const midDistance = distance * (0.34 + Math.random() * 0.28);
      const floatUp = finePointer ? 24 + Math.random() * 72 : 18 + Math.random() * 46;
      const sideDrift = finePointer ? -26 + Math.random() * 52 : -12 + Math.random() * 24;
      const driftX = Math.cos(angle) * distance + sideDrift;
      const driftY = Math.sin(angle) * (distance * (finePointer ? 0.62 : 0.42)) - floatUp;
      const midX = Math.cos(angle + 0.9) * midDistance;
      const midY = Math.sin(angle) * (midDistance * (finePointer ? 0.42 : 0.24)) - floatUp * 0.34;
      const duration = finePointer ? 3200 + Math.random() * 1900 : 2800 + Math.random() * 1700;

      dust.className = "paper-dust";
      dust.style.left = `${x}px`;
      dust.style.top = `${y}px`;
      dust.style.width = `${size}px`;
      dust.style.height = `${size}px`;
      dust.style.setProperty("--dust-mid-x", `${midX}px`);
      dust.style.setProperty("--dust-mid-y", `${midY}px`);
      dust.style.setProperty("--dust-x", `${driftX}px`);
      dust.style.setProperty("--dust-y", `${driftY}px`);
      dust.style.setProperty("--dust-duration", `${duration}ms`);
      dust.style.animationDelay = `${Math.random() * (finePointer ? 220 : 160)}ms`;
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
