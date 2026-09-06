import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

const BOOKMARK_KEY = "meo-bookmark-va-vao-lan-yeu-cuoi";
const PAGE_COUNT = 33;

// Astro serves files in /public at the site root.
const pages = Array.from({ length: PAGE_COUNT }, (_, i) => ({
  index: i,
  src: `/page-${String(i + 1).padStart(2, "0")}.webp`,
}));

function getBookmark() {
  if (typeof window === "undefined") return 0;
  try {
    const value = Number.parseInt(
      window.localStorage.getItem(BOOKMARK_KEY) || "0",
      10,
    );
    return Number.isFinite(value)
      ? Math.max(0, Math.min(PAGE_COUNT - 1, value))
      : 0;
  } catch {
    return 0;
  }
}

function saveBookmark(pageIndex) {
  try {
    window.localStorage.setItem(BOOKMARK_KEY, String(pageIndex));
  } catch {}
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export default function FlipBook() {
  const isMobile = useIsMobile();
  const bookRef = useRef(null);
  const restoredRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [savedPage, setSavedPage] = useState(0);

  useEffect(() => {
    const page = getBookmark();
    setSavedPage(page);
    setCurrentPage(page);
  }, []);

  const handleInit = () => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    requestAnimationFrame(() => {
      const target = getBookmark();
      if (target > 0) {
        try {
          bookRef.current?.pageFlip()?.turnToPage(target);
        } catch {}
      }
    });
  };

  const handleFlip = (event) => {
    const pageIndex = Number(event?.data ?? 0);
    const safePage = Math.max(0, Math.min(PAGE_COUNT - 1, pageIndex));
    setCurrentPage(safePage);
    setSavedPage(safePage);
    saveBookmark(safePage);
  };

  const restoreBookmark = () => {
    const target = getBookmark();
    try {
      bookRef.current?.pageFlip()?.turnToPage(target);
    } catch {}
    setCurrentPage(target);
    setSavedPage(target);
  };

  const progress = Math.round(((currentPage + 1) / PAGE_COUNT) * 100);

  return (
    <section className="vvb-flipbook">
      <style>{`
        .vvb-flipbook { position:relative; min-height:100vh; padding:44px 16px 64px; box-sizing:border-box; background:radial-gradient(circle at 50% 20%,rgba(255,255,255,.055),transparent 32%),#090807; color:#eee3d2; overflow:hidden; }
        .vvb-flipbook__top { position:relative; z-index:5; max-width:1100px; margin:0 auto 18px; text-align:center; }

        /* Use the site's Vietnamese-optimized UI font for the header.
           This avoids the broken glyph spacing seen with some serif fallbacks. */
        .vvb-flipbook__top h1 {
          display:block;
          margin:0;
          padding:0;
          font-family:"Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",Arial,sans-serif;
          font-size:clamp(30px,5vw,54px);
          font-weight:600;
          font-style:normal;
          font-variant:normal;
          font-feature-settings:"kern" 0,"liga" 0,"clig" 0;
          font-kerning:none;
          letter-spacing:0;
          word-spacing:0;
          white-space:nowrap;
          line-height:1.15;
          text-rendering:geometricPrecision;
          -webkit-font-smoothing:antialiased;
        }

        .vvb-flipbook__toolbar { position:relative; z-index:5; display:flex; justify-content:center; align-items:center; flex-wrap:wrap; gap:9px; margin:0 auto 18px; font-size:11px; }
        .vvb-flipbook__status,.vvb-flipbook__resume { border:1px solid rgba(238,227,210,.16); border-radius:999px; background:rgba(20,18,16,.86); color:#eee3d2; padding:8px 12px; }
        .vvb-flipbook__resume { cursor:pointer; }
        .vvb-flipbook__stage { position:relative; z-index:2; display:grid; place-items:center; min-height:min(78vh,900px); padding:10px 0 48px; }
        .vvb-flipbook__stage::after { content:""; position:absolute; left:50%; bottom:24px; width:min(1000px,90vw); height:65px; transform:translateX(-50%); border-radius:50%; background:rgba(0,0,0,.72); filter:blur(24px); pointer-events:none; z-index:0; }
        .vvb-flipbook__book { position:relative; z-index:2; filter:drop-shadow(0 34px 58px rgba(0,0,0,.68)); }
        .vvb-flipbook__page { width:100%; height:100%; overflow:hidden; background:#eee2cf; box-sizing:border-box; }
        .vvb-flipbook__page img { display:block; width:100%; height:100%; object-fit:cover; user-select:none; -webkit-user-drag:none; pointer-events:none; }
        @media(max-width:760px){
          .vvb-flipbook{padding:28px 8px 42px}
          .vvb-flipbook__top h1{font-size:30px; white-space:normal; line-height:1.15}
          .vvb-flipbook__stage{min-height:70vh;padding-bottom:32px}
          .vvb-flipbook__stage::after{width:80vw;height:44px}
        }
      `}</style>

      <div className="vvb-flipbook__top">
        <h1>Va Vào Lần Yêu Cuối</h1>
      </div>

      <div className="vvb-flipbook__toolbar">
        <span className="vvb-flipbook__status">
          🔖 Đã lưu trang {currentPage + 1}/{PAGE_COUNT} · {progress}%
        </span>
        {savedPage > 0 && savedPage !== currentPage && (
          <button
            className="vvb-flipbook__resume"
            type="button"
            onClick={restoreBookmark}
          >
            Tiếp tục từ trang {savedPage + 1}
          </button>
        )}
      </div>

      <div className="vvb-flipbook__stage">
        <HTMLFlipBook
          ref={bookRef}
          key={isMobile ? "mobile-book" : "desktop-book"}
          width={595}
          height={842}
          size="stretch"
          minWidth={280}
          maxWidth={595}
          minHeight={396}
          maxHeight={842}
          showCover
          usePortrait={isMobile}
          drawShadow
          flippingTime={700}
          maxShadowOpacity={0.32}
          startZIndex={20}
          mobileScrollSupport
          clickEventForward
          useMouseEvents
          swipeDistance={30}
          className="vvb-flipbook__book"
          onInit={handleInit}
          onFlip={handleFlip}
        >
          {pages.map((page) => (
            <div
              className="vvb-flipbook__page"
              key={page.index}
              data-page={page.index + 1}
            >
              <img
                src={page.src}
                alt={`Va Vào Lần Yêu Cuối — trang ${page.index + 1}`}
                draggable="false"
              />
            </div>
          ))}
        </HTMLFlipBook>
      </div>
    </section>
  );
}
