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
    if (document.querySelector('script[src="/analytics-events.js"]')) return;
    const script = document.createElement("script");
    script.defer = true;
    script.src = "/analytics-events.js";
    document.head.appendChild(script);
  };

  loadAnalytics();
  loadInteractionAnalytics();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const cursor = document.querySelector(".cursor-glow");
  if (!cursor) return;

  const injectEffectStyles = () => {
    if (document.getElementById("meo-touch-effects")) return;
    const style = document.createElement("style");
    style.id = "meo-touch-effects";
    style.textContent = `
      .ambient-particle-canvas{position:fixed;inset:0;width:100vw;height:100vh;z-index:2;pointer-events:none;mix-blend-mode:screen;opacity:.78}
      .touch-glow,.paper-dust{position:fixed;left:0;top:0;pointer-events:none;z-index:10000;will-change:transform,opacity}
      .touch-glow{width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:999px;background:radial-gradient(circle,rgba(255,248,239,.72) 0 2px,rgba(240,198,122,.2) 4px,rgba(158,220,255,.1) 42%,transparent 74%);box-shadow:0 0 22px rgba(240,198,122,.18),0 0 38px rgba(158,220,255,.1);mix-blend-mode:screen;animation:touchRipple 1080ms cubic-bezier(.16,1,.3,1) forwards}
      .paper-dust{border-radius:999px;background:radial-gradient(circle,rgba(255,248,239,.82),rgba(240,198,122,.34) 48%,transparent 76%);box-shadow:0 0 8px rgba(240,198,122,.16);opacity:.72;mix-blend-mode:screen;animation:paperDust 1380ms cubic-bezier(.16,1,.3,1) forwards;filter:blur(.08px)}
      @keyframes touchRipple{0%{transform:translate3d(0,0,0) scale(.38);opacity:.62;filter:blur(0)}42%{opacity:.32}100%{transform:translate3d(0,0,0) scale(7.4);opacity:0;filter:blur(2.8px)}}
      @keyframes paperDust{0%{transform:translate3d(-50%,-50%,0) rotate(0deg) scale(.84);opacity:.64}38%{opacity:.48}72%{opacity:.18}100%{transform:translate3d(calc(var(--dust-x) - 50%),calc(var(--dust-y) + 34px),0) rotate(var(--dust-r)) scale(.08);opacity:0}}
      @media(min-width:761px){.ambient-particle-canvas{display:none}}
    `;
    document.head.appendChild(style);
  };

  injectEffectStyles();

  const createAmbientCanvas = () => {
    if (window.innerWidth > 760 || document.querySelector(".ambient-particle-canvas")) return;

    const canvas = document.createElement("canvas");
    canvas.className = "ambient-particle-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: width < 420 ? 34 : 46 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.8 + Math.random() * 2.1,
        vx: -0.08 + Math.random() * 0.16,
        vy: -0.12 - Math.random() * 0.18,
        a: 0.18 + Math.random() * 0.34,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.018;

        if (p.y < -12) {
          p.y = height + 12;
          p.x = Math.random() * width;
        }
        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;

        const alpha = p.a + Math.sin(p.pulse) * 0.08;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4.2);
        gradient.addColorStop(0, `rgba(255,248,239,${alpha})`);
        gradient.addColorStop(0.42, `rgba(240,198,122,${alpha * 0.48})`);
        gradient.addColorStop(1, "rgba(240,198,122,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4.2, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    draw();
  };

  createAmbientCanvas();

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

    const amount = window.innerWidth < 520 ? 15 : 20;
    for (let index = 0; index < amount; index += 1) {
      const dust = document.createElement("span");
      const size = 2.4 + Math.random() * 4.8;
      const angle = Math.random() * Math.PI * 2;
      const distance = 28 + Math.random() * 92;
      const driftX = Math.cos(angle) * distance;
      const driftY = Math.sin(angle) * distance + 28 + Math.random() * 72;
      const rotate = -160 + Math.random() * 320;
      const duration = 1200 + Math.random() * 700;

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