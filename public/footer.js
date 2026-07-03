(() => {
  const loadFooterStyles = () => {
    if (document.querySelector('link[href^="/footer.css"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/footer.css?v=footer-v2";
    document.head.appendChild(link);
  };

  loadFooterStyles();

  const footer = document.querySelector(".site-footer");
  if (!footer || footer.dataset.enhanced === "true") return;

  footer.dataset.enhanced = "true";

  const quotes = [
    "Đêm nay, Mèo vẫn chưa ngủ.",
    "Có những bài thơ chỉ tìm được người đọc vào lúc nửa đêm.",
    "Cảm ơn vì đã ở lại đến những dòng cuối.",
    "Nếu còn thức, hãy đọc thêm một bài nữa.",
    "Có người đọc, bài thơ mới hoàn thành.",
    "Mỗi lượt đọc là một cuộc gặp gỡ rất khẽ.",
    "Mong bạn mang theo một điều gì đó sau khi rời trang này.",
    "Một bài thơ cũ đôi khi vẫn biết cách thở.",
    "Có những điều không ngủ, nên thơ phải thức cùng.",
    "Nếu đêm quá dài, cứ để chữ ngồi cạnh bạn một lúc."
  ];

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  const sendFooterEvent = (eventName, params = {}) => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", eventName, {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...params,
    });
  };

  footer.innerHTML = `
    <div class="footer-moon" aria-hidden="true"></div>
    <div class="footer-dust" aria-hidden="true"></div>

    <div class="footer-inner">
      <div class="footer-brand">
        <p class="eyebrow">một căn phòng còn sáng đèn</p>
        <h2>Mèo Đen Không Ngủ</h2>
        <p>Có những bài thơ chỉ sống khi có người đọc.</p>
      </div>

      <div class="footer-grid">
        <nav class="footer-column" aria-label="Khám phá">
          <h3>Khám phá</h3>
          <a class="glow-link" href="/tho">Kho thơ</a>
          <a class="glow-link" href="/tap-tho/va-vao-lan-yeu-cuoi">Va Vào Lần Yêu Cuối</a>
          <a class="glow-link" href="/ve-meo">Về Mèo</a>
        </nav>

        <div class="footer-column">
          <h3>Kết nối</h3>
          <a class="glow-link footer-contact" href="https://www.instagram.com/meodenkhongngu" target="_blank" rel="noopener noreferrer" data-footer-contact="instagram">
            <span>Instagram</span>
            <strong>@meodenkhongngu</strong>
          </a>
          <a class="glow-link footer-contact" href="mailto:blackcatwhitenight@gmail.com" data-footer-contact="email">
            <span>Email</span>
            <strong>blackcatwhitenight@gmail.com</strong>
          </a>
        </div>
      </div>

      <div class="footer-quote" data-footer-quote>“${quote}”</div>

      <div class="footer-bottom">
        <span>© 2026 Mèo Đen Không Ngủ</span>
        <span>Viết trong những đêm không ngủ.</span>
      </div>
    </div>
  `;

  footer.querySelectorAll("[data-footer-contact]").forEach((link) => {
    link.addEventListener("click", () => {
      sendFooterEvent("footer_contact_click", {
        contact_type: link.dataset.footerContact,
        link_url: link.getAttribute("href") || "",
      });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        footer.classList.add("is-visible");
        sendFooterEvent("footer_view");
        observer.disconnect();
      }
    });
  }, { threshold: 0.18 });

  observer.observe(footer);
})();
