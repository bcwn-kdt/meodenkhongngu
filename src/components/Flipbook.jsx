import HTMLFlipBook from "react-pageflip";

const botanicalStyles = ["rose", "branch", "ginkgo", "wildflower"];

const chapters = [
  {
    title: "Chương I",
    subtitle: "Những ngày không anh",
    description: "Những bài thơ của khoảng trống, của một người ở lại với căn phòng và tiếng im lặng.",
    match: ["ngày không anh", "hoàng hôn", "mỏng manh", "những bước chân em"],
  },
  {
    title: "Chương II",
    subtitle: "Va vào tình yêu",
    description: "Những bài thơ của lần chạm cuối, nơi tình yêu vừa rực rỡ vừa làm mình xây xát.",
    match: ["va vào lần yêu cuối", "giữ lấy em", "yêu", "tình"],
  },
  {
    title: "Chương III",
    subtitle: "Sau những tổn thương",
    description: "Những bài thơ của đoạn rơi, của nỗi đau được gọi tên và được đặt xuống rất khẽ.",
    match: ["đau", "buồn", "rời", "khóc", "vỡ", "quên"],
  },
  {
    title: "Chương IV",
    subtitle: "Khép lại",
    description: "Những bài thơ còn lại, như phần cuối của một cuốn sổ đã biết cách tự ngủ yên.",
    match: [],
  },
];

function normalize(text = "") {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getChapterIndex(poem) {
  const text = normalize(`${poem.title || ""} ${poem.excerpt || ""}`);

  const index = chapters.findIndex((chapter) =>
    chapter.match.some((keyword) => text.includes(normalize(keyword)))
  );

  return index >= 0 ? index : chapters.length - 1;
}

export default function FlipBook({ poems }) {
  const groupedChapters = chapters
    .map((chapter, chapterIndex) => ({
      ...chapter,
      poems: poems.filter((poem) => getChapterIndex(poem) === chapterIndex),
    }))
    .filter((chapter) => chapter.poems.length > 0);

  let pageNumber = 1;

  return (
    <section className="book-section">
      <div className="book-top">
        <h1>Va Vào Lần Yêu Cuối</h1>
        <p>
          Một ấn bản thơ điện tử của Mèo Đen Không Ngủ — nơi những bài thơ cũ
          được đặt lại trong một căn phòng tối, dịu và yên hơn.
        </p>
      </div>

      <div className="book-wrap">
        <HTMLFlipBook
          width={420}
          height={620}
          size="stretch"
          minWidth={290}
          maxWidth={480}
          minHeight={440}
          maxHeight={720}
          showCover={true}
          mobileScrollSupport={true}
          className="flip-book"
        >
          <div className="book-page cover-page">
            <div className="cover-art" aria-hidden="true">
              <span className="moon" />
              <span className="cat-silhouette" />
            </div>

            <div className="cover-content">
              <p className="cover-author">Mèo Đen Không Ngủ</p>
              <h2>
                Va Vào
                <br />
                Lần Yêu Cuối
              </h2>
              <small>Tập thơ | Ấn bản điện tử</small>
            </div>
          </div>

          <div className="book-page intro-page decorated-page botanical-rose">
            <div className="botanical botanical-top" aria-hidden="true" />
            <div className="botanical botanical-bottom" aria-hidden="true" />

            <div className="intro-inner">
              <span>Lời mở</span>
              <p>
                Có những bài thơ được viết ra không phải để níu một người ở lại,
                mà để một nỗi buồn có nơi được gọi tên.
              </p>
              <p>
                <em>Va Vào Lần Yêu Cuối</em> là cách Mèo cất lại những mùa yêu đã qua:
                không còn trách móc, không còn cầu xin, chỉ còn một khoảng lặng
                đủ mềm để ký ức thôi làm đau.
              </p>
              <p>
                Nếu có một phiên bản cũ của mình từng khóc trong những trang này,
                mong rằng khi khép sách lại, phiên bản ấy cũng được ngủ yên.
              </p>
            </div>
          </div>

          {groupedChapters.flatMap((chapter, chapterIndex) => {
            const chapterPage = (
              <div
                className={`book-page chapter-page decorated-page botanical-${botanicalStyles[chapterIndex % botanicalStyles.length]}`}
                key={`chapter-${chapterIndex}`}
              >
                <div className="botanical botanical-top" aria-hidden="true" />
                <div className="botanical botanical-bottom" aria-hidden="true" />
                <div className="chapter-inner">
                  <span>{chapter.title}</span>
                  <h2>{chapter.subtitle}</h2>
                  <p>{chapter.description}</p>
                </div>
              </div>
            );

            const poemPages = chapter.poems.map((poem) => {
              const botanical = botanicalStyles[(pageNumber - 1) % botanicalStyles.length];
              const currentPage = pageNumber++;

              return (
                <div
                  className={`book-page poem-book-page decorated-page botanical-${botanical}`}
                  key={poem.slug}
                >
                  <div className="botanical botanical-top" aria-hidden="true" />
                  <div className="botanical botanical-bottom" aria-hidden="true" />
                  <div className="book-page-number">{String(currentPage).padStart(2, "0")}</div>
                  <h2>{poem.title}</h2>
                  <div
                    className="book-poem-body"
                    dangerouslySetInnerHTML={{ __html: poem.html }}
                  />
                </div>
              );
            });

            return [chapterPage, ...poemPages];
          })}

          <div className="book-page end-page decorated-page botanical-ginkgo">
            <div className="botanical botanical-top" aria-hidden="true" />
            <div className="botanical botanical-bottom" aria-hidden="true" />
            <div>
              <p>Hết.</p>
              <small>Mèo Đen Không Ngủ</small>
            </div>
          </div>
        </HTMLFlipBook>
      </div>

      <p className="mobile-note">
        Nếu đọc trên điện thoại thấy khó lật trang, hãy xoay ngang màn hình hoặc đọc ở chế độ danh sách thơ.
      </p>
    </section>
  );
}
