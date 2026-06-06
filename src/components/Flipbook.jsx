import { useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

const botanicalStyles = ["rose", "branch", "ginkgo", "wildflower"];

const chapters = [
  { title: "Chương I", subtitle: "Những vết xám đầu tiên", description: "Những ngày đầu của trống rỗng, nơi tổn thương chưa thành tên nhưng đã kịp đổi màu bầu trời.", poems: ["Ngày lại ngày", "Màu xám", "Đôi lúc", "Người Tình", "Vội", "Lỗi", "Tổn thương", "Ưu tình", "Mùi nhớ nhung", "Thành thật", "Hoàng hôn", "Mỏng manh", "Ký ức về anh", "Ngày không anh"] },
  { title: "Chương II", subtitle: "Người tình và những cuộc yêu vội", description: "Những bài thơ của men say, va chạm, hứa hẹn và các cuộc tình chưa kịp gọi đúng tên.", poems: ["Thoáng chốc dại khờ", "Trò chơi", "Ta và em", "Trái tim không tuổi", "Yêu và hiểu", "Lời anh nói", "Lời mật ngọt", "Vết đêm", "Va vào lần yêu cuối", "Giữ lấy em", "Một chút tò mò", "Gửi em", "Yêu em?", "Vật chứa", "Định nghĩa", "Ngôi đền", "Đếm đêm", "Khi ta yêu"] },
  { title: "Chương III", subtitle: "Khi tình yêu bắt đầu rời đi", description: "Những trang thơ của buông tay, muộn màng, những điều không nói và các khoảng cách cứ lớn dần.", poems: ["Vết dấu", "Hết yêu", "Thôi", "Bình thường", "Muộn", "Ngày và đêm", "Hôm nay và mai sau", "Ta không còn là những đứa trẻ", "Cơn đau nào cũng hết", "Đừng giấu vào đêm", "Cuối Cùng Em Hiểu", "Chạm tay nhau lỡ làng", "Thôi mình đừng hỏi nhau “ổn không”", "Đừng để tình mình chỉ chắp vá", "Khi mình xa", "Một ngày", "Yêu xa", "Tình ca tan vỡ", "Dự định", "Những điều không nói", "Lửng lơ", "Lặng thầm"] },
  { title: "Chương IV", subtitle: "Em, những mảnh vỡ và cõi lòng", description: "Khi người viết quay về nhìn chính mình: cơ thể, bản ngã, nỗi buồn, sự nhạy cảm và những phần em đã phải tự ôm lấy.", poems: ["Những bước chân em", "Hãy nhìn em", "Cõi Lòng Em", "Bận Lòng", "Hãy ở lại", "Nhiều nhân cách trong em", "Muôn kiếp nhân sinh", "Nỗi buồn em", "Tổn thương là nhỏ nhặt", "Tất cả của em", "Tìm nơi đâu", "Đừng", "Một, hai và ba…", "Nhạy cảm", "Anh thấy gì ở màu xanh nơi em?", "Hướng nào?", "Những bàn tay", "Hãy Tìm Em", "Tơ Tằm", "Ta Sẽ Đi Về Đâu?", "Vai phụ", "Hỗn loạn", "Intact"] },
  { title: "Chương V", subtitle: "Thơ như một nơi trú ẩn", description: "Những bài thơ viết về chính thơ: nơi nỗi đau được đặt xuống, được đọc lại, và đôi khi được tha thứ.", poems: ["Thơ em", "Nếu anh đọc thơ em", "Những bài thơ", "Vần thơ em", "Anh biết không?"] },
  { title: "Chương VI", subtitle: "Sau cùng, em khép lại", description: "Những trang cuối của một cuộc tình: không còn níu kéo, chỉ còn người viết tự bước qua và gọi tên bình yên.", poems: ["Rung cảm", "Tạm bợ", "Giá như", "Chương khác", "Cổ tích", "Giấc mơ", "Trói buộc/giải thoát", "Rồi Một Ngày", "Nếu Có Thể", "Phép thử", "Miền đất hứa", "Lời xin lỗi", "Ngày không còn tên", "Không tên", "Da thịt và khoảng trống"] },
];

function normalize(text = "") {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[“”]/g, '"').replace(/…/g, "...").replace(/\s+/g, " ").trim();
}

function getChapterIndex(poem) {
  const title = normalize(poem.title || "");
  const index = chapters.findIndex((chapter) => chapter.poems.some((chapterPoem) => normalize(chapterPoem) === title));
  return index >= 0 ? index : chapters.length - 1;
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

function sendBookEvent(eventName, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", eventName, {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_type: "book",
    book_title: "Va Vào Lần Yêu Cuối",
    book_slug: "va-vao-lan-yeu-cuoi",
    ...params,
  });
}

export default function FlipBook({ poems }) {
  const isMobile = useIsMobile();
  const progressMarksRef = useRef(new Set());
  const completedRef = useRef(false);

  const groupedChapters = chapters
    .map((chapter, chapterIndex) => ({ ...chapter, poems: poems.filter((poem) => getChapterIndex(poem) === chapterIndex) }))
    .filter((chapter) => chapter.poems.length > 0);

  const totalPages = useMemo(() => {
    const chapterPages = groupedChapters.length;
    const poemPages = groupedChapters.reduce((sum, chapter) => sum + chapter.poems.length, 0);
    return 3 + chapterPages + poemPages + 1;
  }, [groupedChapters]);

  const getPageMeta = (pageIndex) => {
    const coverPages = 3;
    let index = coverPages;

    for (const chapter of groupedChapters) {
      if (pageIndex === index) {
        return {
          content_type: "chapter",
          chapter_title: chapter.title,
          chapter_subtitle: chapter.subtitle,
        };
      }

      index += 1;

      for (const poem of chapter.poems) {
        if (pageIndex === index) {
          return {
            content_type: "poem",
            chapter_title: chapter.title,
            chapter_subtitle: chapter.subtitle,
            poem_title: poem.title,
            poem_slug: poem.slug,
          };
        }
        index += 1;
      }
    }

    if (pageIndex >= totalPages - 1) {
      return { content_type: "end" };
    }

    return { content_type: pageIndex === 0 ? "cover" : pageIndex === 1 ? "intro" : "toc" };
  };

  const handleFlip = (event) => {
    const pageIndex = Number(event?.data ?? 0);
    const pageNumber = pageIndex + 1;
    const progressPercent = Math.min(100, Math.round((pageNumber / totalPages) * 100));
    const pageMeta = getPageMeta(pageIndex);

    sendBookEvent("book_page_flip", {
      page_index: pageIndex,
      page_number: pageNumber,
      total_pages: totalPages,
      progress_percent: progressPercent,
      ...pageMeta,
    });

    [25, 50, 75, 90].forEach((mark) => {
      if (progressPercent >= mark && !progressMarksRef.current.has(mark)) {
        progressMarksRef.current.add(mark);
        sendBookEvent("book_progress", {
          progress_percent: mark,
          page_number: pageNumber,
          total_pages: totalPages,
          ...pageMeta,
        });
      }
    });

    if (progressPercent >= 95 && !completedRef.current) {
      completedRef.current = true;
      sendBookEvent("book_complete", {
        page_number: pageNumber,
        total_pages: totalPages,
        progress_percent: progressPercent,
      });
    }
  };

  let pageNumber = 1;
  const bookKey = isMobile ? "mobile-book" : "desktop-book";
  const bookSize = isMobile
    ? { width: 340, height: 560, minWidth: 280, maxWidth: 360, minHeight: 460, maxHeight: 620 }
    : { width: 440, height: 640, minWidth: 300, maxWidth: 460, minHeight: 460, maxHeight: 680 };

  return (
    <section className={isMobile ? "book-section is-mobile-book" : "book-section"}>
      <div className="book-top">
        <h1>Va Vào Lần Yêu Cuối</h1>
        <p>Một ấn bản thơ điện tử của Mèo Đen Không Ngủ — nơi những bài thơ cũ được đặt lại trong một căn phòng tối, dịu và yên hơn.</p>
      </div>

      <div className="book-wrap">
        <div className="book-stage">
          <HTMLFlipBook
            key={bookKey}
            width={bookSize.width}
            height={bookSize.height}
            size="stretch"
            minWidth={bookSize.minWidth}
            maxWidth={bookSize.maxWidth}
            minHeight={bookSize.minHeight}
            maxHeight={bookSize.maxHeight}
            showCover={true}
            drawShadow={true}
            flippingTime={900}
            usePortrait={isMobile}
            startZIndex={30}
            maxShadowOpacity={0.28}
            mobileScrollSupport={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            className="flip-book"
            onFlip={handleFlip}
          >
            <div className="book-page cover-page hard-page">
              <div className="cover-art" aria-hidden="true"><span className="moon" /><span className="cat-silhouette" /></div>
              <div className="cover-content"><p className="cover-author">Mèo Đen Không Ngủ</p><h2>Va Vào<br />Lần Yêu Cuối</h2><small>Tập thơ | Ấn bản điện tử</small></div>
            </div>
            <div className="book-page intro-page decorated-page botanical-rose">
              <div className="botanical botanical-top" aria-hidden="true" /><div className="botanical botanical-bottom" aria-hidden="true" />
              <div className="intro-inner"><span>Lời mở</span><p>Có những bài thơ được viết ra không phải để níu một người ở lại, mà để một nỗi buồn có nơi được gọi tên.</p><p><em>Va Vào Lần Yêu Cuối</em> là cách Mèo cất lại những mùa yêu đã qua: không còn trách móc, không còn cầu xin, chỉ còn một khoảng lặng đủ mềm để ký ức thôi làm đau.</p><p>Nếu có một phiên bản cũ của mình từng khóc trong những trang này, mong rằng khi khép sách lại, phiên bản ấy cũng được ngủ yên.</p></div>
            </div>
            <div className="book-page toc-page decorated-page botanical-branch">
              <div className="botanical botanical-top" aria-hidden="true" /><div className="botanical botanical-bottom" aria-hidden="true" />
              <div className="toc-inner"><span>Mục lục</span><h2>Các chương</h2><div className="toc-list">{groupedChapters.map((chapter) => <div className="toc-item" key={`toc-${chapter.title}`}><small>{chapter.title}</small><strong>{chapter.subtitle}</strong></div>)}</div></div>
            </div>
            {groupedChapters.flatMap((chapter, chapterIndex) => {
              const chapterPage = <div className={`book-page chapter-page decorated-page botanical-${botanicalStyles[chapterIndex % botanicalStyles.length]}`} key={`chapter-${chapterIndex}`}><div className="botanical botanical-top" aria-hidden="true" /><div className="botanical botanical-bottom" aria-hidden="true" /><div className="chapter-inner"><span>{chapter.title}</span><h2>{chapter.subtitle}</h2><p>{chapter.description}</p></div></div>;
              const poemPages = chapter.poems.map((poem) => {
                const botanical = botanicalStyles[(pageNumber - 1) % botanicalStyles.length];
                const currentPage = pageNumber++;
                return <div className={`book-page poem-book-page decorated-page botanical-${botanical}`} key={poem.slug}><div className="botanical botanical-top" aria-hidden="true" /><div className="botanical botanical-bottom" aria-hidden="true" /><div className="book-page-number">{String(currentPage).padStart(2, "0")}</div><h2>{poem.title}</h2><div className="book-poem-body" dangerouslySetInnerHTML={{ __html: poem.html }} /></div>;
              });
              return [chapterPage, ...poemPages];
            })}
            <div className="book-page end-page decorated-page botanical-ginkgo hard-page"><div className="botanical botanical-top" aria-hidden="true" /><div className="botanical botanical-bottom" aria-hidden="true" /><div><p>Hết.</p><small>Mèo Đen Không Ngủ</small></div></div>
          </HTMLFlipBook>
        </div>
        <div className="book-status" aria-live="polite">Kéo góc giấy hoặc chạm vào mép trang để lật.</div>
      </div>
      <p className="mobile-note">Trên điện thoại, sách hiển thị một trang mỗi lần để dễ đọc hơn.</p>
    </section>
  );
}
