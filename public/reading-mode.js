(() => {
  const STORAGE_KEY = "meo-reading-mode";
  const ACTIVE_CLASS = "is-reading-mode";

  const sendEvent = (enabled) => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", enabled ? "reading_mode_on" : "reading_mode_off", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  };

  const injectStyles = () => {
    if (document.getElementById("meo-reading-mode-style")) return;

    const style = document.createElement("style");
    style.id = "meo-reading-mode-style";
    style.textContent = `
      .reading-mode-toggle{
        position:fixed;
        right:18px;
        bottom:18px;
        z-index:10020;
        display:inline-flex;
        align-items:center;
        gap:8px;
        border:1px solid rgba(255,248,239,.2);
        border-radius:999px;
        padding:10px 14px;
        color:rgba(255,248,239,.86);
        font:800 11px/1 var(--font-ui,system-ui,sans-serif);
        letter-spacing:.08em;
        text-transform:uppercase;
        background:rgba(5,5,5,.72);
        box-shadow:0 16px 46px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.08);
        backdrop-filter:blur(16px) saturate(1.2);
        cursor:pointer;
        transition:transform 180ms ease,border-color 180ms ease,background 180ms ease,color 180ms ease,opacity 180ms ease;
      }
      .reading-mode-toggle:hover{transform:translateY(-2px);border-color:rgba(240,198,122,.52);color:#fff8ef;background:rgba(18,15,12,.82)}
      .reading-mode-toggle .moon-dot{width:8px;height:8px;border-radius:999px;background:rgba(240,198,122,.72);box-shadow:0 0 16px rgba(240,198,122,.38)}
      body.is-reading-mode{
        background:radial-gradient(circle at 50% -18%,rgba(240,198,122,.08),transparent 32rem),linear-gradient(180deg,#020202 0%,#050505 54%,#020202 100%) !important;
      }
      body.is-reading-mode::before{opacity:.22}
      body.is-reading-mode .ambient-particle-canvas{opacity:.16 !important;filter:blur(.2px)}
      body.is-reading-mode .cursor-glow{display:none !important}
      body.is-reading-mode .site-header,
      body.is-reading-mode .site-footer,
      body.is-reading-mode .home-panels,
      body.is-reading-mode .home-latest,
      body.is-reading-mode .studio-controls,
      body.is-reading-mode .studio-stats,
      body.is-reading-mode .mobile-note,
      body.is-reading-mode .book-status{
        opacity:.18;
        transition:opacity 220ms ease;
      }
      body.is-reading-mode .site-header:hover,
      body.is-reading-mode .site-footer:hover,
      body.is-reading-mode .studio-controls:hover{
        opacity:.86;
      }
      body.is-reading-mode .glow-card::after,
      body.is-reading-mode .glow-button::after,
      body.is-reading-mode .poem-page::after,
      body.is-reading-mode .about::after,
      body.is-reading-mode .book-wrap::after,
      body.is-reading-mode .studio-controls::after,
      body.is-reading-mode .writing-note::after,
      body.is-reading-mode .home-cover-card::after,
      body.is-reading-mode .home-panel::after{display:none !important}
      body.is-reading-mode .poem-page,
      body.is-reading-mode .about,
      body.is-reading-mode .archive,
      body.is-reading-mode .home-cover{
        max-width:880px;
      }
      body.is-reading-mode .poem-page{
        margin-top:42px;
        border-color:rgba(255,248,239,.1);
        background:linear-gradient(180deg,rgba(255,255,255,.038),rgba(255,255,255,.015));
        box-shadow:0 24px 80px rgba(0,0,0,.32);
      }
      body.is-reading-mode .poem-header h1,
      body.is-reading-mode .page-title,
      body.is-reading-mode .home-cover-text h1{
        letter-spacing:-.045em;
      }
      body.is-reading-mode .poem-content,
      body.is-reading-mode .about-content,
      body.is-reading-mode .home-manifesto{
        color:rgba(255,248,239,.9);
        font-size:clamp(18px,2vw,22px);
        line-height:2.22;
        letter-spacing:.002em;
      }
      body.is-reading-mode .poem-content p,
      body.is-reading-mode .about-content p,
      body.is-reading-mode .home-manifesto p{
        margin-bottom:1.55em;
      }
      body.is-reading-mode .poem-tags,
      body.is-reading-mode .meta,
      body.is-reading-mode .eyebrow{
        opacity:.72;
      }
      body.is-reading-mode .book-wrap{
        box-shadow:0 32px 110px rgba(0,0,0,.5);
      }
      body.is-reading-mode .book-page{
        filter:saturate(.92) contrast(.98);
      }
      body.is-reading-mode .reading-mode-toggle{
        border-color:rgba(240,198,122,.58);
        color:#100d09;
        background:rgba(240,198,122,.9);
      }
      body.is-reading-mode .reading-mode-toggle .moon-dot{background:#100d09;box-shadow:none}
      @media(max-width:760px){
        .reading-mode-toggle{right:14px;bottom:14px;padding:10px 12px;font-size:10px}
        body.is-reading-mode .site-shell{width:min(100% - 30px,720px)}
        body.is-reading-mode .poem-content,
        body.is-reading-mode .about-content,
        body.is-reading-mode .home-manifesto{font-size:18px;line-height:2.08}
        body.is-reading-mode .site-header{min-height:70px;padding:16px 0}
        body.is-reading-mode .nav{display:none}
      }
    `;
    document.head.appendChild(style);
  };

  const setMode = (enabled, shouldTrack = true) => {
    document.body.classList.toggle(ACTIVE_CLASS, enabled);
    const button = document.querySelector(".reading-mode-toggle");
    if (button) {
      button.setAttribute("aria-pressed", String(enabled));
      button.querySelector(".reading-label").textContent = enabled ? "Thoát chế độ đọc" : "Chế độ đọc";
      button.title = enabled ? "Thoát chế độ đọc" : "Bật chế độ đọc chuyên sâu";
    }
    localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
    if (shouldTrack) sendEvent(enabled);
  };

  const createButton = () => {
    if (document.querySelector(".reading-mode-toggle")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "reading-mode-toggle";
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = `<span class="moon-dot" aria-hidden="true"></span><span class="reading-label">Chế độ đọc</span>`;
    button.addEventListener("click", () => {
      setMode(!document.body.classList.contains(ACTIVE_CLASS));
    });
    document.body.appendChild(button);
  };

  const init = () => {
    injectStyles();
    createButton();
    setMode(localStorage.getItem(STORAGE_KEY) === "on", false);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
