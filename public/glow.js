(() => {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!finePointer || reduceMotion) return;

  const cursor = document.querySelector(".cursor-glow");
  if (!cursor) return;

  const interactiveElements = document.querySelectorAll(
    ".glow-surface, .glow-card, .glow-button, .glow-link, .poem-page, .poem-content, .about, .about-content, .book-wrap"
  );

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let visible = false;

  const render = () => {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;

    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    cursor.style.opacity = visible ? "1" : "0";

    requestAnimationFrame(render);
  };

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    visible = true;

    document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);

    interactiveElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      element.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    });
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    visible = false;
  });

  window.addEventListener("pointerdown", () => {
    cursor.classList.add("is-pressing");
  });

  window.addEventListener("pointerup", () => {
    cursor.classList.remove("is-pressing");
  });

  render();
})();
