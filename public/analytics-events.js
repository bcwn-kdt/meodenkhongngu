(() => {
  const clean = (value) => (value || "").replace(/\s+/g, " ").trim();

  const getPageType = () => {
    const path = window.location.pathname;
    if (path === "/") return "home";
    if (path === "/tho") return "poem_archive";
    if (path.startsWith("/tho/")) return "poem_detail";
    if (path.startsWith("/tap-tho/")) return "book";
    if (path === "/ve-meo") return "about";
    return "other";
  };

  const pageType = getPageType();

  const getPoemMeta = () => {
    if (pageType !== "poem_detail") return {};

    const title = clean(document.querySelector(".poem-header h1")?.textContent) || document.title.replace(" | Mèo Đen Không Ngủ", "");
    const collection = clean(document.querySelector(".poem-header .eyebrow")?.textContent);
    const metaText = clean(document.querySelector(".poem-header .meta")?.textContent);
    const parts = metaText.split("·").map(clean).filter(Boolean);

    return {
      poem_title: title,
      poem_collection: collection || "Không phân loại",
      poem_date: parts[0] || "",
      poem_chapter: parts[1] || "",
      poem_mood: parts[2] || "",
      poem_slug: window.location.pathname.replace(/^\/tho\//, ""),
    };
  };

  const getBookMeta = () => {
    if (pageType !== "book") return {};
    return {
      book_title: clean(document.querySelector("h1")?.textContent) || "Va Vào Lần Yêu Cuối",
      book_slug: window.location.pathname.replace(/^\/tap-tho\//, ""),
    };
  };

  const pageMeta = {
    page_type: pageType,
    ...getPoemMeta(),
    ...getBookMeta(),
  };

  const send = (eventName, params = {}) => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", eventName, {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...pageMeta,
      ...params,
    });
  };

  window.setTimeout(() => {
    send("meo_page_ready");
  }, 1200);

  if (pageType === "poem_detail") {
    send("poem_view");
  }

  if (pageType === "book") {
    send("book_open");
  }

  const depthMarks = [25, 50, 75, 90];
  const sentDepths = new Set();

  const trackReadingDepth = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const depth = Math.round((window.scrollY / scrollable) * 100);
    depthMarks.forEach((mark) => {
      if (depth >= mark && !sentDepths.has(mark)) {
        sentDepths.add(mark);
        send("reading_depth", {
          depth_percent: mark,
        });
      }
    });
  };

  window.addEventListener("scroll", trackReadingDepth, { passive: true });
  trackReadingDepth();

  const startTime = Date.now();
  let sentEngaged = false;

  const sendEngagedRead = () => {
    if (sentEngaged) return;
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    if (elapsed < 30) return;
    sentEngaged = true;
    send("engaged_read", {
      seconds: elapsed,
    });
  };

  window.setTimeout(sendEngagedRead, 30000);

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const text = clean(link.textContent).slice(0, 80);

    if (href.startsWith("/tho/")) {
      send("poem_link_click", { link_text: text, link_url: href });
      return;
    }

    if (href.startsWith("/tap-tho/")) {
      send("book_link_click", { link_text: text, link_url: href });
      return;
    }

    if (href.includes("instagram.com")) {
      send("instagram_link_click", { link_text: text, link_url: href });
      return;
    }

    if (link.classList.contains("button") || link.classList.contains("text-link")) {
      send("cta_click", { link_text: text, link_url: href });
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      send("page_leave", {
        seconds_on_page: elapsed,
      });
    }
  });
})();
