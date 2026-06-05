(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const cursor = document.querySelector(".cursor-glow");
  if (!cursor) return;

  const injectEffectStyles = () => {
    if (document.getElementById("meo-touch-effects")) return;
    const style = document.createElement("style");
    style.id = "meo-touch-effects";
    style.textContent = `
      .mobile-particles{position:fixed;inset:0;z-index:9997;pointer-events:none;overflow:hidden;opacity:.9;mix-blend-mode:screen}
      .mobile-particle{position:absolute;left:0;top:0;border-radius:999px;background:radial-gradient(circle,rgba(255,248,239,.95),rgba(240,198,122,.55) 46%,transparent 72%);box-shadow:0 0 10px rgba(240,198,122,.25);animation:ambientDrift ease-in-out infinite alternate;will-change:transform,opacity}
      .touch-glow,.paper-dust{position:fixed;left:0;top:0;pointer-events:none;z-index:10000;will-change:transform,opacity}
      .touch-glow{width:28px;height:28px;margin:-14px 0 0 -14px;border-radius:999px;background:radial-gradient(circle,rgba(255,255,255,1) 0 3px,rgba(240,198,122,.72) 4px,rgba(240,198,122,.34) 30%,rgba(158,220,255,.22) 58%,transparent 76%);box-shadow:0 0 44px rgba(240,198,122,.48),0 0 74px rgba(158,220,255,.28);mix-blend-mode:screen;animation:touchRipple 920ms cubic-bezier(.16,1,.3,1) forwards}
      .paper-dust{border-radius:2px;background:linear-gradient(135deg,rgba(255,248,239,1),rgba(240,198,122,.88));box-shadow:0 0 14px rgba(240,198,122,.32);opacity:1;mix-blend-mode:screen;animation:paperDust ease-out forwards}
      @keyframes ambientDrift{0%{transform:translate3d(0,0,0) scale(.8);opacity:.28}100%{transform:translate3d(var(--ambient-x),var(--ambient-y),0) scale(1.08);opacity:.82}}
      @keyframes touchRipple{0%{transform:translate3d(0,0,0) scale(.45);opacity:1;filter:blur(0)}48%{opacity:.72}100%{transform:translate3d(0,0,0) scale(9.6);opacity:0;filter:blur(2px)}}
      @keyframes paperDust{0%{transform:translate3d(-50%,-50%,0) rotate(0deg) scale(1);opacity:1}55%{opacity:.82}100%{transform:translate3d(calc(var(--dust-x) - 50%),calc(var(--dust-y) + 64px),0) rotate(var(--dust-r)) scale(.28);opacity:0}}
      @media(min-width:761px){.mobile-particles{display:none}}
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
    if (now - lastBurst < 70) return;
    lastBurst = now;

    const amount = window.innerWidth < 520 ? 24 : 32;
    for (let index = 0; index < amount; index += 1) {
      const dust = document.createElement("span");
      const size = 5 + Math.random() * 11;
      const angle = Math.random() * Math.PI * 2;
      const distance = 52 + Math.random() * 150;
      const driftX = Math.cos(angle) * distance;
      const driftY = Math.sin(angle) * distance + 70 + Math.random() * 130;
      const rotate = -260 + Math.random() * 520;
      const duration = 1100 + Math.random() * 850;

      dust.className = "paper-dust";
      dust.style.left = `${x}px`;
      dust.style.top = `${y}px`;
      dust.style.width = `${size}px`;
      dust.style.height = `${size * (0.5 + Math.random() * 1.1)}px`;
      dust.style.setProperty("--dust-x", `${driftX}px`);
      dust.style.setProperty("--dust-y", `${driftY}px`);
      dust.style.setProperty("--dust-r", `${rotate}deg`);
      dust.style.animationDuration = `${duration}ms`;
      dust.style.animationDelay = `${Math.random() * 90}ms`;
      document.body.appendChild(dust);
      dust.addEventListener("animationend", () => dust.remove(), { once: true });
    }
  };

  const createAmbientParticles = () => {
    if (window.innerWidth > 760 || document.querySelector(".mobile-particles")) return;

    const layer = document.createElement("div");
    layer.className = "mobile-particles";
    layer.setAttribute("aria-hidden", "true");

    const amount = window.innerWidth < 420 ? 30 : 42;
    for (let index = 0; index < amount; index += 1) {
      const particle = document.createElement("span");
      const size = 1.8 + Math.random() * 4.2;
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      const driftX = -24 + Math.random() * 48;
      const driftY = -34 + Math.random() * 68;
      const duration = 3600 + Math.random() * 5200;
      const delay = -Math.random() * duration;

      particle.className = "mobile-particle";
      particle.style.transform = `translate3d(${startX}px, ${startY}px, 0)`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.opacity = `${0.3 + Math.random() * 0.46}`;
      particle.style.setProperty("--ambient-x", `${driftX}px`);
      particle.style.setProperty("--ambient-y", `${driftY}px`);
      particle.style.animationDuration = `${duration}ms`;
      particle.style.animationDelay = `${delay}ms`;
      layer.appendChild(particle);
    }

    document.body.prepend(layer);
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

  createAmbientParticles();

  window.addEventListener("resize", createAmbientParticles, { passive: true });

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