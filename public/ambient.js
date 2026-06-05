(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (document.querySelector(".ambient-particle-canvas")) return;

  const style = document.createElement("style");
  style.textContent = `
    .ambient-particle-canvas{
      position:fixed;
      inset:0;
      width:100vw;
      height:100vh;
      z-index:0;
      pointer-events:none;
      opacity:.58;
      mix-blend-mode:screen;
    }
  `;
  document.head.appendChild(style);

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

    const amount = width < 430 ? 36 : 48;
    particles = Array.from({ length: amount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.45 + Math.random() * 1.05,
      vx: -0.055 + Math.random() * 0.11,
      vy: -0.07 - Math.random() * 0.12,
      alpha: 0.14 + Math.random() * 0.22,
      pulse: Math.random() * Math.PI * 2,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.014;

      if (p.y < -18) {
        p.y = height + 18;
        p.x = Math.random() * width;
      }
      if (p.x < -18) p.x = width + 18;
      if (p.x > width + 18) p.x = -18;

      const alpha = Math.max(0.05, p.alpha + Math.sin(p.pulse) * 0.045);
      const glow = p.r * 3.4;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
      gradient.addColorStop(0, `rgba(255,248,239,${alpha})`);
      gradient.addColorStop(0.5, `rgba(240,198,122,${alpha * 0.38})`);
      gradient.addColorStop(1, "rgba(240,198,122,0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });
  draw();
})();
