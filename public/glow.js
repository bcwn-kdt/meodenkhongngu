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
