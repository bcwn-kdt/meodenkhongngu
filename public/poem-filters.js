(() => {
  const search = document.querySelector("[data-poem-search]");
  const cards = [...document.querySelectorAll("[data-poem-list] .archive-card")];
  const emptyState = document.querySelector("[data-empty-state]");
  const resultCount = document.querySelector("[data-result-count]");
  const wander = document.querySelector("[data-archive-wander]");

  if (!search || !cards.length) return;

  const normalize = (value) => value
    .toLocaleLowerCase("vi-VN")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

  const visibleCards = () => cards.filter((card) => !card.hidden);

  const update = () => {
    const query = normalize(search.value);
    cards.forEach((card) => {
      card.hidden = query.length > 0 && !normalize(card.dataset.searchText || "").includes(query);
    });

    const count = visibleCards().length;
    emptyState.hidden = count !== 0;
    resultCount.textContent = `${count} bài thơ`;
  };

  search.addEventListener("input", update);

  wander?.addEventListener("click", () => {
    const available = visibleCards();
    const chosen = available[Math.floor(Math.random() * available.length)];
    if (!chosen) return;
    chosen.scrollIntoView({ behavior: "smooth", block: "center" });
    chosen.classList.add("is-random");
    window.setTimeout(() => window.location.assign(chosen.href), 650);
  });
})();
