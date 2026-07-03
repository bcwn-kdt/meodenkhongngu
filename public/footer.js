(() => {
  const loadFooterStyles = () => {
    if (document.querySelector('link[href^="/footer.css"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/footer.css?v=footer-v4";
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

  const getMoonPhase = (date = new Date()) => {
    const synodicMonth = 29.530588853;
    const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
    const days = (date.getTime() - knownNewMoon) / 86400000;
    const age = ((days % synodicMonth) + synodicMonth) % synodicMonth;
    const phase = age / synodicMonth;
    const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;

    let name = "Trăng non";
    if (phase < 0.03 || phase > 0.97) name = "Trăng non";
    else if (phase < 0.22) name = "Trăng khuyết đầu tháng";
    else if (phase < 0.28) name = "Bán nguyệt đầu tháng";
    else if (phase < 0.47) name = "Trăng tròn dần";
    else if (phase < 0.53) name = "Trăng tròn";
    else if (phase < 0.72) name = "Trăng khuyết dần";
    else if (phase < 0.78) name = "Bán nguyệt cuối tháng";
    else name = "Trăng tàn";

    return { phase, age, illumination, name };
  };

  const renderMoon = (target) => {
    if (!target) return;

    const size = 520;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const moon = getMoonPhase();
    const center = size / 2;
    const radius = size * 0.32;
    const phaseAngle = 2 * Math.PI * moon.phase;
    const sunX = Math.sin(phaseAngle);
    const sunZ = -Math.cos(phaseAngle);
    const image = ctx.createImageData(size, size);
    const data = image.data;

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const dx = (x - center) / radius;
        const dy = (y - center) / radius;
        const dist2 = dx * dx + dy * dy;
        const index = (y * size + x) * 4;
        if (dist2 > 1) continue;

        const z = Math.sqrt(1 - dist2);
        const light = Math.max(0, dx * sunX + z * sunZ);
        const rim = Math.pow(Math.max(0, 1 - dist2), 0.22);
        const sphereShade = 0.5 + 0.5 * z;
        const surfaceNoise = Math.sin(x * 0.047 + y * 0.031) * 0.035 + Math.sin(x * 0.013 - y * 0.041) * 0.026;
        const brightness = Math.max(0.04, Math.min(1, light * 0.92 + sphereShade * 0.12 + surfaceNoise));
        const edgeFade = Math.min(1, Math.max(0, (1 - Math.sqrt(dist2)) * 18));

        data[index] = Math.round(242 * brightness + 18);
        data[index + 1] = Math.round(208 * brightness + 12);
        data[index + 2] = Math.round(150 * brightness + 8);
        data[index + 3] = Math.round(255 * edgeFade * (0.1 + 0.9 * rim));
      }
    }

    ctx.putImageData(image, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const glow = ctx.createRadialGradient(center - 42, center - 54, radius * 0.12, center, center, radius * 1.9);
    glow.addColorStop(0, "rgba(255, 253, 245, .38)");
    glow.addColorStop(0.38, "rgba(240, 198, 122, .11)");
    glow.addColorStop(1, "rgba(240, 198, 122, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);
    ctx.restore();

    const craters = [
      [218, 165, 15, 0.18], [180, 244, 23, 0.15], [283, 210, 18, 0.13],
      [306, 292, 26, 0.11], [220, 322, 13, 0.14], [151, 270, 15, 0.12],
      [286, 145, 10, 0.16], [242, 255, 8, 0.13], [170, 188, 9, 0.11]
    ];

    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.clip();
    craters.forEach(([x, y, r, alpha]) => {
      const crater = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
      crater.addColorStop(0, `rgba(255, 248, 226, ${alpha * 0.55})`);
      crater.addColorStop(0.55, `rgba(84, 56, 30, ${alpha})`);
      crater.addColorStop(1, "rgba(255, 248, 226, 0)");
      ctx.fillStyle = crater;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    const outerGlow = ctx.createRadialGradient(center, center, radius * 0.8, center, center, radius * 1.55);
    outerGlow.addColorStop(0, "rgba(255, 248, 239, 0)");
    outerGlow.addColorStop(0.6, "rgba(255, 248, 239, .08)");
    outerGlow.addColorStop(1, "rgba(240, 198, 122, 0)");
    ctx.fillStyle = outerGlow;
    ctx.fillRect(0, 0, size, size);

    target.innerHTML = "";
    target.appendChild(canvas);
    target.title = `${moon.name} · ${(moon.illumination * 100).toFixed(0)}% ánh sáng`;
    target.setAttribute("aria-label", target.title);
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

  renderMoon(footer.querySelector(".footer-moon"));

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
