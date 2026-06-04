(() => {
  const controls = document.querySelector("[data-poem-controls]");
  const list = document.querySelector("[data-poem-list]");
  const search = document.querySelector("[data-poem-search]");
  const emptyState = document.querySelector("[data-empty-state]");

  if (!controls || !list || !search) return;

  const items = Array.from(list.querySelectorAll("[data-title]"));
  const chips = Array.from(controls.querySelectorAll("[data-filter]"));
  const active = { type: "all", value: "all" };

  const normalize = (value) => String(value || "").trim().toLowerCase();

  const applyFilters = () => {
    const keyword = normalize(search.value);
    let visibleCount = 0;

    items.forEach((item) => {
      const title = normalize(item.dataset.title);
      const excerpt = normalize(item.dataset.excerpt);
      const collection = normalize(item.dataset.collection);
      const mood = normalize(item.dataset.mood);

      const matchesText = !keyword || title.includes(keyword) || excerpt.includes(keyword) || collection.includes(keyword) || mood.includes(keyword);
      const matchesFilter =
        active.type === "all" ||
        (active.type === "collection" && collection === normalize(active.value)) ||
        (active.type === "mood" && mood === normalize(active.value));

      const shouldShow = matchesText && matchesFilter;
      item.hidden = !shouldShow;
      if (shouldShow) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount !== 0;
  };

  search.addEventListener("input", applyFilters);

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((item) => item.classList.remove("is-active"));
      chip.classList.add("is-active");
      active.type = chip.dataset.filter || "all";
      active.value = chip.dataset.value || "all";
      applyFilters();
    });
  });

  applyFilters();
})();
