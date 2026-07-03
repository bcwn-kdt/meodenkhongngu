(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (document.querySelector(".cinematic-hero-layer")) return;

  const hero = document.querySelector(".home-cover");
  if (!hero) return;

  hero.classList.add("has-cinematic-motion", "cinematic-v3");

  const style = document.createElement("style");
  style.id = "meo-cinematic-hero-style";
  style.textContent = `
    .home-cover.cinematic-v3{
      position:relative;
      isolation:isolate;
      overflow:hidden;
      border-radius:0 0 42px 42px;
      perspective:1400px;
    }
    .home-cover.cinematic-v3 > *{
      position:relative;
      z-index:5;
    }
    .cinematic-hero-layer{
      position:absolute;
      inset:-14% -12%;
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
        radial-gradient(circle at 24% 38%,rgba(255,62,205,.34),transparent 17rem),
        radial-gradient(circle at 38% 48%,rgba(117,87,255,.28),transparent 22rem),
        radial-gradient(circle at 52% 58%,rgba(59,255,220,.2),transparent 20rem),
        radial-gradient(circle at 72% 24%,rgba(240,198,122,.13),transparent 20rem),
        linear-gradient(90deg,rgba(4,3,9,.04),transparent 46%,rgba(2,2,2,.38));
      filter:blur(18px) saturate(1.55);
      opacity:.78;
      transform:translate3d(calc(var(--mx) * -0.035),calc(var(--my) * -0.032 + var(--scroll) * .1px),0) scale(1.04);
      animation:meoColorBreath 10s ease-in-out infinite alternate;
    }
    .cinematic-hero-layer::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        linear-gradient(112deg,transparent 0 20%,rgba(255,255,255,.06) 29%,transparent 42% 100%),
        repeating-linear-gradient(90deg,rgba(255,255,255,.026) 0 1px,transparent 1px 32px),
        repeating-linear-gradient(0deg,rgba(255,255,255,.014) 0 1px,transparent 1px 38px);
      opacity:.22;
      mix-blend-mode:screen;
      transform:translate3d(calc(var(--mx) * .014),calc(var(--my) * .014),0) rotate(-7deg) scale(1.06);
    }
    .cinematic-stage{
      position:absolute;
      left:3%;
      top:14%;
      width:min(48vw,620px);
      height:min(44vw,520px);
      transform-style:preserve-3d;
      opacity:.86;
      transform:translate3d(calc(var(--mx) * .022),calc(var(--my) * .02 + var(--scroll) * .08px),70px) rotateX(calc(var(--my) * -.005deg)) rotateY(calc(var(--mx) * .006deg));
    }
    .cinematic-stage::before{
      content:"";
      position:absolute;
      inset:9% 4% 5%;
      border-radius:42px;
      background:radial-gradient(circle at 44% 48%,rgba(255,255,255,.16),rgba(255,255,255,.034) 34%,transparent 64%);
      filter:blur(8px);
      opacity:.62;
      mix-blend-mode:screen;
      animation:meoPulse 6s ease-in-out infinite alternate;
    }
    .cinematic-orb{
      position:absolute;
      width:min(32vw,390px);
      aspect-ratio:1;
      left:28%;
      top:2%;
      border-radius:999px;
      background:
        radial-gradient(circle at 41% 35%,rgba(255,255,255,.88),rgba(255,248,239,.24) 18%,rgba(158,220,255,.11) 42%,transparent 68%),
        radial-gradient(circle,rgba(255,120,210,.16),transparent 64%);
      filter:drop-shadow(0 0 68px rgba(255,248,239,.22));
      opacity:.56;
      transform:translate3d(calc(var(--mx) * -.019),calc(var(--my) * -.016),150px);
      animation:meoOrbFloat 8s ease-in-out infinite alternate;
    }
    .cinematic-prism{
      position:absolute;
      inset:22% 9% 13% 10%;
      border-radius:38px;
      background:
        radial-gradient(circle at 42% 38%,rgba(255,255,255,.5),transparent 13%),
        radial-gradient(circle at 34% 44%,rgba(255,60,195,.36),transparent 25%),
        radial-gradient(circle at 70% 56%,rgba(45,255,225,.28),transparent 25%),
        radial-gradient(circle at 52% 72%,rgba(95,110,255,.34),transparent 31%);
      filter:blur(2px) saturate(1.35);
      opacity:.62;
      mix-blend-mode:screen;
      transform:translate3d(calc(var(--mx) * -.022),calc(var(--my) * -.018),130px);
      animation:meoPrism 7s ease-in-out infinite alternate;
    }
    .cinematic-glass{
      position:absolute;
      border:1px solid rgba(255,255,255,.2);
      border-radius:32px;
      background:
        linear-gradient(145deg,rgba(255,255,255,.17),rgba(255,255,255,.032)),
        radial-gradient(circle at 30% 24%,rgba(255,255,255,.17),transparent 32%);
      box-shadow:0 30px 96px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.25),0 0 60px rgba(158,220,255,.07);
      backdrop-filter:blur(17px) saturate(1.35);
      overflow:hidden;
      mix-blend-mode:screen;
    }
    .cinematic-glass::before{
      content:"";
      position:absolute;
      inset:-35%;
      background:linear-gradient(115deg,transparent 22%,rgba(255,255,255,.2) 34%,transparent 48%);
      opacity:.36;
      transform:translateX(-18%) rotate(8deg);
      animation:meoGlassSweep 7.5s ease-in-out infinite;
    }
    .cinematic-glass::after{
      content:attr(data-label);
      position:absolute;
      left:24px;
      top:24px;
      color:rgba(255,255,255,.5);
      font:800 clamp(15px,1.6vw,24px)/.95 var(--font-ui,system-ui,sans-serif);
      letter-spacing:.04em;
      text-transform:uppercase;
      white-space:pre-line;
      text-shadow:0 0 18px rgba(255,255,255,.22);
    }
    .cinematic-glass.one{
      width:70%;
      height:36%;
      left:16%;
      top:29%;
      opacity:.68;
      transform:translate3d(calc(var(--mx) * -.045),calc(var(--my) * -.04),200px) rotate(-3deg);
      animation:meoGlassDrift 8s ease-in-out infinite alternate;
    }
    .cinematic-glass.two{
      width:42%;
      height:56%;
      left:1%;
      top:12%;
      border-radius:30px;
      opacity:.44;
      transform:translate3d(calc(var(--mx) * .036),calc(var(--my) * .03),110px) rotate(7deg);
      animation:meoGlassDrift 10s ease-in-out infinite alternate-reverse;
    }
    .cinematic-glass.three{
      width:34%;
      height:32%;
      right:3%;
      bottom:13%;
      border-radius:27px;
      opacity:.4;
      transform:translate3d(calc(var(--mx) * .065),calc(var(--my) * .052),240px) rotate(10deg);
      animation:meoGlassDrift 9s ease-in-out infinite alternate;
    }
    .cinematic-title-echo{
      position:absolute;
      left:8%;
      top:48%;
      max-width:520px;
      color:rgba(255,255,255,.1);
      font-family:var(--font-serif,Georgia,serif);
      font-size:clamp(42px,6.5vw,96px);
      font-weight:700;
      line-height:.86;
      letter-spacing:-.07em;
      filter:blur(.25px);
      mix-blend-mode:screen;
      transform:translate3d(calc(var(--mx) * -.024),calc(var(--my) * -.022 + var(--scroll) * .06px),20px);
      user-select:none;
    }
    .cinematic-noise{
      position:absolute;
      inset:0;
      opacity:.13;
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
      box-shadow:0 0 18px rgba(255,100,220,.2),0 0 28px rgba(80,255,225,.12);
      opacity:.78;
      transform:translate3d(calc(var(--mx) * var(--dx)),calc(var(--my) * var(--dy)),0);
      animation:meoDustFloat var(--d) ease-in-out infinite alternate;
    }
    .home-cover.cinematic-v3 .home-cover-text,
    .home-cover.cinematic-v3 .home-cover-card{
      transition:transform 120ms linear;
    }
    .home-cover.cinematic-v3 .home-cover-text{
      transform:translate3d(calc(var(--cinema-x,0px) * .008),calc(var(--cinema-y,0px) * .006),0);
    }
    .home-cover.cinematic-v3 .home-cover-card{
      transform:translate3d(calc(var(--cinema-x,0px) * -.012),calc(var(--cinema-y,0px) * -.009),0);
      backdrop-filter:blur(22px) saturate(1.22);
      background:linear-gradient(150deg,rgba(255,255,255,.14),rgba(255,255,255,.038));
      border-color:rgba(255,255,255,.19);
    }
    .home-cover.cinematic-v3 h1{
      text-shadow:0 0 42px rgba(240,198,122,.1),0 0 110px rgba(158,220,255,.09);
    }
    @keyframes meoColorBreath{0%{filter:blur(18px) saturate(1.18) hue-rotate(-18deg)}100%{filter:blur(22px) saturate(1.72) hue-rotate(22deg)}}
    @keyframes meoOrbFloat{0%{opacity:.42;scale:.96}100%{opacity:.66;scale:1.05}}
    @keyframes meoGlassDrift{0%{filter:blur(0);opacity:.42}100%{filter:blur(.3px);opacity:.78}}
    @keyframes meoGlassSweep{0%,42%{transform:translateX(-32%) rotate(8deg);opacity:.1}72%{transform:translateX(46%) rotate(8deg);opacity:.45}100%{transform:translateX(58%) rotate(8deg);opacity:.08}}
    @keyframes meoDustFloat{0%{translate:0 0;opacity:.36}100%{translate:0 -64px;opacity:.82}}
    @keyframes meoPulse{0%{opacity:.34;scale:.96}100%{opacity:.68;scale:1.04}}
    @keyframes meoPrism{0%{opacity:.36;filter:blur(3px) saturate(1.1)}100%{opacity:.66;filter:blur(1px) saturate(1.65)}}
    @media(min-width:761px){
      .home-cover.cinematic-v3 .home-cover-text{max-width:760px}
      .home-cover.cinematic-v3 .home-cover-card{z-index:6}
    }
    @media(max-width:760px){
      .home-cover.cinematic-v3{border-radius:0 0 28px 28px}
      .cinematic-hero-layer{inset:-10%;opacity:.74}
      .cinematic-stage{left:-22%;top:5%;width:105vw;height:86vw;opacity:.66}
      .cinematic-glass.one{width:74%;height:38%;left:18%;top:28%;opacity:.48}
      .cinematic-glass.two{width:43%;height:58%;left:0;top:8%;opacity:.28}
      .cinematic-glass.three{opacity:.24}
      .cinematic-glass::after{font-size:12px;left:17px;top:17px}
      .cinematic-title-echo{display:none}
      .cinematic-orb{width:70vw;left:24%;top:0;opacity:.36}
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

  const dustCount = window.innerWidth < 760 ? 46 : 90;
  for (let index = 0; index < dustCount; index += 1) {
    const dust = document.createElement("span");
    dust.className = "cinematic-dust";
    const leftBias = Math.random() < 0.7;
    dust.style.setProperty("--x", `${leftBias ? Math.random() * 64 : Math.random() * 100}%`);
    dust.style.setProperty("--y", `${8 + Math.random() * 82}%`);
    dust.style.setProperty("--s", `${1.4 + Math.random() * (leftBias ? 6.4 : 4.2)}px`);
    dust.style.setProperty("--a", `${0.18 + Math.random() * 0.5}`);
    dust.style.setProperty("--dx", `${(-0.16 + Math.random() * 0.32).toFixed(3)}`);
    dust.style.setProperty("--dy", `${(-0.13 + Math.random() * 0.26).toFixed(3)}`);
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
    x += (tx - x) * 0.055;
    y += (ty - y) * 0.055;
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
