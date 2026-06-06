(() => {
  const send = (eventName, params = {}) => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", eventName, {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...params,
    });
  };

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

  window.setTimeout(() => {
    send("meo_page_ready", { page_type: pageType });
  }, 1200);

  if (pageType === "poem_detail") {
    send("poem_view", {
      poem_title: document.querySelector(".poem-header h1")?.textContent?.trim() || document.title,
    });
  }

  if (pageType === "book") {
    send("book_open", {
      book_title: document.querySelector("h1")?.textContent?.trim() || "Va Vào Lần Yêu Cuối",
    });
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
          page_type: pageType,
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
      page_type: pageType,
      seconds: elapsed,
    });
  };

  window.setTimeout(sendEngagedRead, 30000);

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const text = link.textContent?.trim().slice(0, 80) || "";

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
        page_type: pageType,
        seconds_on_page: elapsed,
      });
    }
  });
})();
