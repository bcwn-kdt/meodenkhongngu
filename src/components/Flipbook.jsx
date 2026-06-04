import HTMLFlipBook from "react-pageflip";

export default function FlipBook({ poems }) {
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
              <small>Tập thơ | Ấn bản điện tử | 2026</small>
            </div>
          </div>

          <div className="book-page intro-page decorated-page">
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

          {poems.map((poem, index) => (
            <div className="book-page poem-book-page decorated-page" key={poem.slug}>
              <div className="botanical botanical-top" aria-hidden="true" />
              <div className="botanical botanical-bottom" aria-hidden="true" />
              <div className="book-page-number">{String(index + 1).padStart(2, "0")}</div>
              <p className="book-date">{poem.date}</p>
              <h2>{poem.title}</h2>
              {poem.excerpt && <p className="book-excerpt">{poem.excerpt}</p>}
              <div
                className="book-poem-body"
                dangerouslySetInnerHTML={{ __html: poem.html }}
              />
            </div>
          ))}

          <div className="book-page end-page decorated-page">
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
