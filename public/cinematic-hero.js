(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (document.querySelector(".cinematic-hero-layer")) return;

  const hero = document.querySelector(".home-cover");
  if (!hero) return;

  hero.classList.add("has-cinematic-motion", "cinematic-v2");

  const style = document.createElement("style");
  style.id = "meo-cinematic-hero-style";
  style.textContent = `
    .home-cover.cinematic-v2{
      position:relative;
      isolation:isolate;
      overflow:hidden;
      min-height:calc(100vh - 88px);
      border-radius:0 0 46px 46px;
      perspective:1500px;
    }
    .home-cover.cinematic-v2 > *{position:relative;z-index:5}
    .cinematic-hero-layer{
      position:absolute;
      inset:-16% -20%;
      z-index:1;
      pointer-events:none;
      overflow:hidden;
      transform-style:preserve-3d;
      --mx:0px;
      --my:0px;
      --scroll:0;
    }
    .cinematic-hero-layer::before{
      content:"";
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 28% 36%,rgba(255,62,205,.42),transparent 18rem),
        radial-gradient(circle at 42% 46%,rgba(117,87,255,.34),transparent 22rem),
        radial-gradient(circle at 54% 58%,rgba(59,255,220,.28),transparent 20rem),
        radial-gradient(circle at 25% 72%,rgba(240,198,122,.18),transparent 19rem),
        linear-gradient(90deg,rgba(6,4,12,.15),transparent 44%,rgba(2,2,2,.6));
      filter:blur(18px) saturate(1.65);
      opacity:.92;
      transform:translate3d(calc(var(--mx) * -0.04),calc(var(--my) * -0.035 + var(--scroll) * .14px),0) scale(1.05);
      animation:meoColorBreath 9s ease-in-out infinite alternate;
    }
    .cinematic-hero-layer::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        linear-gradient(110deg,transparent 0 18%,rgba(255,255,255,.09) 27%,transparent 39% 100%),
        repeating-linear-gradient(90deg,rgba(255,255,255,.04) 0 1px,transparent 1px 28px),
        repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,transparent 1px 34px);
      opacity:.28;
      mix-blend-mode:screen;
      transform:translate3d(calc(var(--mx) * .018),calc(var(--my) * .018),0) rotate(-7deg) scale(1.06);
    }
    .cinematic-stage{
      position:absolute;
      left:2.5%;
      top:13%;
      width:min(54vw,690px);
      height:min(55vw,590px);
      transform-style:preserve-3d;
      transform:translate3d(calc(var(--mx) * .026),calc(var(--my) * .024 + var(--scroll) * .1px),80px) rotateX(calc(var(--my) * -.006deg)) rotateY(calc(var(--mx) * .007deg));
    }
    .cinematic-stage::before{
      content:"";
      position:absolute;
      inset:8% 3% 4%;
      border-radius:44px;
      background:radial-gradient(circle at 45% 50%,rgba(255,255,255,.18),rgba(255,255,255,.035) 34%,transparent 62%);
      filter:blur(8px);
      opacity:.8;
      mix-blend-mode:screen;
      animation:meoPulse 5.8s ease-in-out infinite alternate;
    }
    .cinematic-orb{
      position:absolute;
      width:min(36vw,470px);
      aspect-ratio:1;
      left:24%;
      top:3%;
      border-radius:999px;
      background:
        radial-gradient(circle at 41% 35%,rgba(255,255,255,.92),rgba(255,248,239,.26) 18%,rgba(158,220,255,.12) 42%,transparent 68%),
        radial-gradient(circle,rgba(255,120,210,.18),transparent 64%);
      filter:drop-shadow(0 0 76px rgba(255,248,239,.24));
      opacity:.68;
      transform:translate3d(calc(var(--mx) * -.022),calc(var(--my) * -.018),160px);
      animation:meoOrbFloat 8s ease-in-out infinite alternate;
    }
    .cinematic-glass{
      position:absolute;
      border:1px solid rgba(255,255,255,.22);
      border-radius:34px;
      background:
        linear-gradient(145deg,rgba(255,255,255,.2),rgba(255,255,255,.035)),
        radial-gradient(circle at 30% 24%,rgba(255,255,255,.2),transparent 32%);
      box-shadow:0 34px 110px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.28),0 0 70px rgba(158,220,255,.08);
      backdrop-filter:blur(18px) saturate(1.4);
      overflow:hidden;
      mix-blend-mode:screen;
    }
    .cinematic-glass::before{
      content:"";
      position:absolute;
      inset:-35%;
      background:linear-gradient(115deg,transparent 22%,rgba(255,255,255,.24) 34%,transparent 48%);
      opacity:.4;
      transform:translateX(-18%) rotate(8deg);
      animation:meoGlassSweep 7.5s ease-in-out infinite;
    }
    .cinematic-glass::after{
      content:attr(data-label);
      position:absolute;
      left:28px;
      top:28px;
      color:rgba(255,255,255,.58);
      font:800 clamp(18px,2vw,30px)/.95 var(--font-ui,system-ui,sans-serif);
      letter-spacing:.04em;
      text-transform:uppercase;
      white-space:pre-line;
      text-shadow:0 0 18px rgba(255,255,255,.25);
    }
    .cinematic-glass.one{
      width:72%;
      height:38%;
      left:18%;
      top:28%;
      opacity:.78;
      transform:translate3d(calc(var(--mx) * -.05),calc(var(--my) * -.045),210px) rotate(-3deg);
      animation:meoGlassDrift 8s ease-in-out infinite alternate;
    }
    .cinematic-glass.two{
      width:44%;
      height:58%;
      left:1%;
      top:13%;
      border-radius:30px;
      opacity:.56;
      transform:translate3d(calc(var(--mx) * .04),calc(var(--my) * .034),110px) rotate(7deg);
      animation:meoGlassDrift 10s ease-in-out infinite alternate-reverse;
    }
    .cinematic-glass.three{
      width:36%;
      height:34%;
      right:0;
      bottom:10%;
      border-radius:28px;
      opacity:.5;
      transform:translate3d(calc(var(--mx) * .072),calc(var(--my) * .058),260px) rotate(10deg);
      animation:meoGlassDrift 9s ease-in-out infinite alternate;
    }
    .cinematic-prism{
      position:absolute;
      inset:21% 8% 12% 9%;
      border-radius:40px;
      background:
        radial-gradient(circle at 42% 38%,rgba(255,255,255,.62),transparent 13%),
        radial-gradient(circle at 34% 44%,rgba(255,60,195,.42),transparent 25%),
        radial-gradient(circle at 70% 56%,rgba(45,255,225,.34),transparent 25%),
        radial-gradient(circle at 52% 72%,rgba(95,110,255,.4),transparent 31%);
      filter:blur(2px) saturate(1.4);
      opacity:.72;
      mix-blend-mode:screen;
      transform:translate3d(calc(var(--mx) * -.025),calc(var(--my) * -.02),150px);
      animation:meoPrism 7s ease-in-out infinite alternate;
    }
    .cinematic-title-echo{
      position:absolute;
      left:12%;
      top:44%;
      max-width:520px;
      color:rgba(255,255,255,.16);
      font-family:var(--font-serif,Georgia,serif);
      font-size:clamp(48px,7.8vw,120px);
      font-weight:700;
      line-height:.86;
      letter-spacing:-.07em;
      filter:blur(.25px);
      mix-blend-mode:screen;
      transform:translate3d(calc(var(--mx) * -.028),calc(var(--my) * -.026 + var(--scroll) * .08px),20px);
      user-select:none;
    }
    .cinematic-noise{
      position:absolute;
      inset:0;
      opacity:.16;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
      mix-blend-mode:soft-light;
      transform:translate3d(calc(var(--mx) * .012),calc(var(--my) * .012),0);
    }
    .cinematic-dust{
      position:absolute;
      left:var(--x);
      top:var(--y);
      width:var(--s);
      height:var(--s);
      border-radius:999px;
      background:radial-gradient(circle,rgba(255,248,239,var(--a)),rgba(255,80,215,calc(var(--a) * .42)) 32%,rgba(50,255,225,calc(var(--a) * .26)) 58%,transparent 78%);
      box-shadow:0 0 22px rgba(255,100,220,.23),0 0 32px rgba(80,255,225,.14);
      opacity:.86;
      transform:translate3d(calc(var(--mx) * var(--dx)),calc(var(--my) * var(--dy)),0);
      animation:meoDustFloat var(--d) ease-in-out infinite alternate;
    }
    .home-cover.cinematic-v2 .home-cover-text{
      transform:translate3d(calc(var(--cinema-x,0px) * .012),calc(var(--cinema-y,0px) * .008),0);
      transition:transform 120ms linear;
    }
    .home-cover.cinematic-v2 .home-cover-card{
      transform:translate3d(calc(var(--cinema-x,0px) * -.024),calc(var(--cinema-y,0px) * -.016),70px);
      backdrop-filter:blur(24px) saturate(1.25);
      background:linear-gradient(150deg,rgba(255,255,255,.16),rgba(255,255,255,.04));
      border-color:rgba(255,255,255,.2);
      transition:transform 120ms linear;
    }
    .home-cover.cinematic-v2 h1{
      text-shadow:0 0 42px rgba(240,198,122,.12),0 0 110px rgba(158,220,255,.11);
    }
    @keyframes meoColorBreath{0%{filter:blur(18px) saturate(1.2) hue-rotate(-18deg)}100%{filter:blur(22px) saturate(1.9) hue-rotate(22deg)}}
    @keyframes meoOrbFloat{0%{opacity:.5;scale:.96}100%{opacity:.78;scale:1.06}}
    @keyframes meoGlassDrift{0%{filter:blur(0);opacity:.5}100%{filter:blur(.3px);opacity:.86}}
    @keyframes meoGlassSweep{0%,42%{transform:translateX(-32%) rotate(8deg);opacity:.12}72%{transform:translateX(46%) rotate(8deg);opacity:.5}100%{transform:translateX(58%) rotate(8deg);opacity:.08}}
    @keyframes meoDustFloat{0%{translate:0 0;opacity:.42}100%{translate:0 -70px;opacity:.9}}
    @keyframes meoPulse{0%{opacity:.42;scale:.96}100%{opacity:.82;scale:1.04}}
    @keyframes meoPrism{0%{opacity:.42;filter:blur(3px) saturate(1.1)}100%{opacity:.82;filter:blur(1px) saturate(1.8)}}
    @media(min-width:761px){
      .home-cover.cinematic-v2{grid-template-columns:minmax(0,.95fr) minmax(390px,.72fr);gap:58px}
      .home-cover.cinematic-v2 .home-cover-text{padding-left:48%;}
      .home-cover.cinematic-v2 .home-manifesto{max-width:520px}
    }
    @media(max-width:760px){
      .home-cover.cinematic-v2{border-radius:0 0 28px 28px}
      .cinematic-hero-layer{inset:-10%;opacity:.78}
      .cinematic-stage{left:-18%;top:6%;width:105vw;height:88vw;opacity:.72}
      .cinematic-glass.one{width:76%;height:38%;left:18%;top:28%;opacity:.54}
      .cinematic-glass.two{width:44%;height:60%;left:0;top:8%;opacity:.32}
      .cinematic-glass.three{opacity:.3}
      .cinematic-glass::after{font-size:13px;left:18px;top:18px}
      .cinematic-title-echo{display:none}
      .cinematic-orb{width:72vw;left:24%;top:0;opacity:.42}
      .cinematic-dust:nth-of-type(n+42){display:none}
    }
    body.is-reading-mode .cinematic-hero-layer{opacity:.12;filter:grayscale(.45)}
  `;
  document.head.appendChild(style);

  const layer = document.createElement("div");
  layer.className = "cinematic-hero-layer";
  layer.setAttribute("aria-hidden", "true");

  layer.innerHTML = `
    <div class="cinematic-noise"></div>
    <div class="cinematic-stage">
      <div class="cinematic-prism"></div>
      <div class="cinematic-orb"></div>
      <div class="cinematic-glass one" data-label="POETRY\A WITHIN"></div>
      <div class="cinematic-glass two" data-label="NIGHT\A ARCHIVE"></div>
      <div class="cinematic-glass three" data-label="VA VÀO\A LẦN YÊU\A CUỐI"></div>
    </div>
    <div class="cinematic-title-echo">Mèo Đen<br/>Không Ngủ</div>
  `;

  const dustCount = window.innerWidth < 760 ? 48 : 110;
  for (let index = 0; index < dustCount; index += 1) {
    const dust = document.createElement("span");
    dust.className = "cinematic-dust";
    const leftBias = Math.random() < 0.74;
    dust.style.setProperty("--x", `${leftBias ? Math.random() * 62 : Math.random() * 100}%`);
    dust.style.setProperty("--y", `${8 + Math.random() * 82}%`);
    dust.style.setProperty("--s", `${1.6 + Math.random() * (leftBias ? 7.4 : 4.4)}px`);
    dust.style.setProperty("--a", `${0.2 + Math.random() * 0.56}`);
    dust.style.setProperty("--dx", `${(-0.18 + Math.random() * 0.36).toFixed(3)}`);
    dust.style.setProperty("--dy", `${(-0.14 + Math.random() * 0.28).toFixed(3)}`);
    dust.style.setProperty("--d", `${4.8 + Math.random() * 8.2}s`);
    dust.style.animationDelay = `${Math.random() * -9}s`;
    layer.appendChild(dust);
  }

  hero.prepend(layer);

  let x = 0;
  let y = 0;
  let tx = 0;
  let ty = 0;
  let scroll = 0;

  const updateTarget = (event) => {
    const rect = hero.getBoundingClientRect();
    tx = event.clientX - rect.left - rect.width / 2;
    ty = event.clientY - rect.top - rect.height / 2;
  };

  const animate = () => {
    x += (tx - x) * 0.06;
    y += (ty - y) * 0.06;
    scroll = Math.max(-320, Math.min(320, -hero.getBoundingClientRect().top));

    layer.style.setProperty("--mx", `${x}px`);
    layer.style.setProperty("--my", `${y}px`);
    layer.style.setProperty("--scroll", `${scroll}`);
    hero.style.setProperty("--cinema-x", `${x}px`);
    hero.style.setProperty("--cinema-y", `${y}px`);

    requestAnimationFrame(animate);
  };

  window.addEventListener("pointermove", updateTarget, { passive: true });
  animate();
})();
