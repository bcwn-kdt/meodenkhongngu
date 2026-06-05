(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const cursor = document.querySelector(".cursor-glow");
  if (!cursor) return;

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
    if (now - lastBurst < 120) return;
    lastBurst = now;

    const amount = window.innerWidth < 520 ? 11 : 15;
    for (let index = 0; index < amount; index += 1) {
      const dust = document.createElement("span");
      const size = 3 + Math.random() * 6;
      const angle = Math.random() * Math.PI * 2;
      const distance = 34 + Math.random() * 86;
      const driftX = Math.cos(angle) * distance;
      const driftY = Math.sin(angle) * distance - 24 - Math.random() * 40;
      const rotate = -110 + Math.random() * 220;
      const duration = 720 + Math.random() * 520;

      dust.className = "paper-dust";
      dust.style.left = `${x}px`;
      dust.style.top = `${y}px`;
      dust.style.width = `${size}px`;
      dust.style.height = `${size * (0.55 + Math.random() * 0.85)}px`;
      dust.style.setProperty("--dust-x", `${driftX}px`);
      dust.style.setProperty("--dust-y", `${driftY}px`);
      dust.style.setProperty("--dust-r", `${rotate}deg`);
      dust.style.animationDuration = `${duration}ms`;
      dust.style.animationDelay = `${Math.random() * 70}ms`;
      document.body.appendChild(dust);
      dust.addEventListener("animationend", () => dust.remove(), { once: true });
    }
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
    showAt(event.clientX, event.clientY, event.pointerType === "touch");

    if (event.pointerType === "touch" || !finePointer) {
      makeTouchGlow(event.clientX, event.clientY);
      makePaperDust(event.clientX, event.clientY);
    }
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