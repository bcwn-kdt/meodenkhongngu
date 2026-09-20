(() => {
  if (document.querySelector(".ambient-particle-canvas")) return;

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motionPreference.matches) return;

  const style = document.createElement("style");
  style.textContent = `
    .ambient-particle-canvas {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
      pointer-events: none;
      opacity: .54;
      mix-blend-mode: screen;
    }
  `;
  document.head.appendChild(style);

  const canvas = document.createElement("canvas");
  canvas.className = "ambient-particle-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    canvas.remove();
    style.remove();
    return;
  }

  const particleSprite = document.createElement("canvas");
  particleSprite.width = 40;
  particleSprite.height = 40;
  const spriteCtx = particleSprite.getContext("2d");
  const spriteGradient = spriteCtx.createRadialGradient(20, 20, 0, 20, 20, 20);
  spriteGradient.addColorStop(0, "rgba(255,248,239,1)");
  spriteGradient.addColorStop(.5, "rgba(240,198,122,.38)");
  spriteGradient.addColorStop(1, "rgba(240,198,122,0)");
  spriteCtx.fillStyle = spriteGradient;
  spriteCtx.fillRect(0, 0, 40, 40);

  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame = 0;
  let previousFrame = 0;
  let resizeFrame = 0;

  const makeParticle = (fromBottom = false) => ({
    x: Math.random() * width,
    y: fromBottom ? height + 18 : Math.random() * height,
    radius: .45 + Math.random() * 1.05,
    velocityX: -.055 + Math.random() * .11,
    velocityY: -.07 - Math.random() * .12,
    alpha: .14 + Math.random() * .22,
    pulse: Math.random() * Math.PI * 2,
  });

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    const isSmallScreen = width < 600;
    const dpr = Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.5 : 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const amount = isSmallScreen ? 28 : 42;
    particles = Array.from({ length: amount }, () => makeParticle());
  };

  const draw = (time) => {
    animationFrame = requestAnimationFrame(draw);
    if (time - previousFrame < 33) return;
    previousFrame = time;

    ctx.clearRect(0, 0, width, height);

    for (const particle of particles) {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.pulse += .014;

      if (particle.y < -18) Object.assign(particle, makeParticle(true));
      if (particle.x < -18) particle.x = width + 18;
      if (particle.x > width + 18) particle.x = -18;

      const alpha = Math.max(.05, particle.alpha + Math.sin(particle.pulse) * .045);
      const glow = particle.radius * 6.8;
      ctx.globalAlpha = alpha;
      ctx.drawImage(
        particleSprite,
        particle.x - glow / 2,
        particle.y - glow / 2,
        glow,
        glow,
      );
    }

    ctx.globalAlpha = 1;
  };

  const start = () => {
    if (animationFrame || document.hidden) return;
    previousFrame = 0;
    animationFrame = requestAnimationFrame(draw);
  };

  const stop = () => {
    if (!animationFrame) return;
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  const remove = () => {
    stop();
    window.removeEventListener("resize", scheduleResize);
    document.removeEventListener("visibilitychange", handleVisibility);
    canvas.remove();
    style.remove();
  };

  const scheduleResize = () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      resize();
    });
  };

  const handleVisibility = () => {
    if (document.hidden) stop();
    else start();
  };

  resize();
  start();
  window.addEventListener("resize", scheduleResize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibility);
  motionPreference.addEventListener("change", (event) => {
    if (event.matches) remove();
  }, { once: true });
})();
