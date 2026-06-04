import HTMLFlipBook from "react-pageflip";

export default function FlipBook({ poems }) {
  return (
    <section className="book-section">
      <div className="book-top">
        <p className="book-eyebrow">digital poetry book</p>
        <h1>Va Vào Lần Yêu Cuối</h1>
        <p>
          Một tập thơ về những điều từng làm mình không ngủ —
          nay được cất lại như một cuốn sách.
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
            <div>
              <p>Mèo Đen Không Ngủ</p>
              <h2>Va Vào Lần Yêu Cuối</h2>
              <small>Một tập thơ để khép lại một mùa yêu.</small>
            </div>
          </div>

          <div className="book-page intro-page">
            <p>
              Có những bài thơ không được viết ra để giữ một người ở lại.
            </p>
            <p>
              Chúng được viết ra để một phiên bản cũ của mình
              có nơi mà nằm xuống.
            </p>
          </div>

          {poems.map((poem) => (
            <div className="book-page poem-book-page" key={poem.slug}>
              <p className="book-date">{poem.date}</p>
              <h2>{poem.title}</h2>
              {poem.excerpt && <p className="book-excerpt">{poem.excerpt}</p>}
              <div
                className="book-poem-body"
                dangerouslySetInnerHTML={{ __html: poem.html }}
              />
            </div>
          ))}

          <div className="book-page end-page">
            <p>Hết.</p>
            <small>Mèo Đen Không Ngủ</small>
          </div>
        </HTMLFlipBook>
      </div>

      <p className="mobile-note">
        Nếu đọc trên điện thoại thấy khó lật trang, hãy xoay ngang màn hình hoặc đọc ở chế độ danh sách thơ.
      </p>
    </section>
  );
}