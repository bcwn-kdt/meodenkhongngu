import { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";

const PAGE_COUNT = 32;

// Astro serves files in /public at the site root.
const pages = Array.from({ length: PAGE_COUNT }, (_, i) => ({
  index: i,
  src: `/page-${String(i + 1).padStart(2, "0")}.webp`,
}));

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

  return (
    <section className="vvb-flipbook">
      <style>{`
        .vvb-flipbook { position:relative; min-height:100vh; padding:44px 16px 64px; box-sizing:border-box; background:radial-gradient(circle at 50% 20%,rgba(255,255,255,.055),transparent 32%),#090807; color:#eee3d2; overflow:hidden; }
        .vvb-flipbook__top { position:relative; z-index:5; max-width:1100px; margin:0 auto 18px; text-align:center; }
        .vvb-flipbook__top h1 {
          display:block;
          margin:0;
          padding:0;
          font-family:var(--font-serif);
          font-size:clamp(42px,6vw,72px);
          font-weight:700;
          letter-spacing:-.055em;
          line-height:1.05;
          text-wrap:balance;
          text-rendering:optimizeLegibility;
          -webkit-font-smoothing:antialiased;
        }

        .vvb-flipbook__stage { position:relative; z-index:2; display:grid; place-items:center; min-height:min(78vh,900px); padding:10px 0 48px; }
        .vvb-flipbook__stage::after { content:""; position:absolute; left:50%; bottom:24px; width:min(1000px,90vw); height:65px; transform:translateX(-50%); border-radius:50%; background:rgba(0,0,0,.72); filter:blur(24px); pointer-events:none; z-index:0; }
        .vvb-flipbook__book { position:relative; z-index:2; filter:drop-shadow(0 34px 58px rgba(0,0,0,.68)); }
        .vvb-flipbook__page { width:100%; height:100%; overflow:hidden; background:#eee2cf; box-sizing:border-box; }
        .vvb-flipbook__page img { display:block; width:100%; height:100%; object-fit:cover; user-select:none; -webkit-user-drag:none; pointer-events:none; }
        @media(max-width:760px){
          .vvb-flipbook{padding:28px 8px 42px}
          .vvb-flipbook__top h1{font-size:clamp(34px,11vw,48px);line-height:1.08}
          .vvb-flipbook__stage{min-height:70vh;padding-bottom:32px}
          .vvb-flipbook__stage::after{width:80vw;height:44px}
        }
      `}</style>

      <div className="vvb-flipbook__top">
        <h1>Va Vào Lần Yêu Cuối</h1>
      </div>

      <div className="vvb-flipbook__stage">
        <HTMLFlipBook
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
