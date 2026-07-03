(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (document.querySelector(".cinematic-hero-layer")) return;

  const hero = document.querySelector(".home-cover");
  if (!hero) return;

  hero.classList.add("has-cinematic-motion");

  const style = document.createElement("style");
  style.id = "meo-cinematic-hero-style";
  style.textContent = `
    .home-cover.has-cinematic-motion{
      position:relative;
      isolation:isolate;
      overflow:hidden;
      min-height:calc(100vh - 88px);
      border-radius:0 0 42px 42px;
      perspective:1200px;
    }
    .home-cover.has-cinematic-motion > *{
      position:relative;
      z-index:4;
    }
    .cinematic-hero-layer{
      position:absolute;
      inset:-18%;
      z-index:0;
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
        radial-gradient(circle at 58% 26%,rgba(255,120,210,.23),transparent 18rem),
        radial-gradient(circle at 82% 62%,rgba(85,255,220,.16),transparent 21rem),
        radial-gradient(circle at 18% 44%,rgba(120,170,255,.18),transparent 19rem),
        radial-gradient(circle at 44% 88%,rgba(240,198,122,.13),transparent 22rem);
      filter:blur(20px) saturate(1.35);
      opacity:.92;
      transform:translate3d(calc(var(--mx) * -0.035),calc(var(--my) * -0.035 + var(--scroll) * .18px),0) scale(1.04);
      animation:meoColorBreath 11s ease-in-out infinite alternate;
    }
    .cinematic-hero-layer::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        linear-gradient(115deg,transparent 0 22%,rgba(255,255,255,.05) 28%,transparent 36% 100%),
        repeating-linear-gradient(90deg,rgba(255,255,255,.035) 0 1px,transparent 1px 28px);
      opacity:.2;
      mix-blend-mode:screen;
      transform:translate3d(calc(var(--mx) * .02),calc(var(--my) * .02),0) rotate(-7deg) scale(1.05);
    }
    .cinematic-orb{
      position:absolute;
      width:min(46vw,520px);
      aspect-ratio:1;
      left:52%;
      top:4%;
      border-radius:999px;
      background:
        radial-gradient(circle at 38% 34%,rgba(255,255,255,.72),rgba(255,248,239,.23) 25%,rgba(240,198,122,.1) 45%,transparent 68%),
        radial-gradient(circle,rgba(158,220,255,.12),transparent 64%);
      filter:blur(.2px) drop-shadow(0 0 70px rgba(255,248,239,.16));
      opacity:.58;
      transform:translate3d(calc(var(--mx) * .02),calc(var(--my) * .018 + var(--scroll) * .08px),90px);
      animation:meoOrbFloat 9s ease-in-out infinite alternate;
    }
    .cinematic-glass{
      position:absolute;
      border:1px solid rgba(255,255,255,.16);
      border-radius:34px;
      background:linear-gradient(145deg,rgba(255,255,255,.13),rgba(255,255,255,.025));
      box-shadow:0 34px 110px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.22);
      backdrop-filter:blur(16px) saturate(1.35);
      opacity:.52;
      mix-blend-mode:screen;
    }
    .cinematic-glass.one{
      width:min(44vw,480px);
      height:min(30vw,310px);
      right:2%;
      top:24%;
      transform:translate3d(calc(var(--mx) * -.055),calc(var(--my) * -.05 + var(--scroll) * .18px),120px) rotate(-6deg);
      animation:meoGlassDrift 8s ease-in-out infinite alternate;
    }
    .cinematic-glass.two{
      width:min(28vw,310px);
      height:min(38vw,410px);
      left:2%;
      top:16%;
      border-radius:28px;
      opacity:.32;
      transform:translate3d(calc(var(--mx) * .045),calc(var(--my) * .035 + var(--scroll) * .12px),70px) rotate(8deg);
      animation:meoGlassDrift 10s ease-in-out infinite alternate-reverse;
    }
    .cinematic-glass.three{
      width:min(24vw,260px);
      height:min(18vw,200px);
      right:14%;
      bottom:9%;
      border-radius:24px;
      opacity:.28;
      transform:translate3d(calc(var(--mx) * .075),calc(var(--my) * .06 + var(--scroll) * .22px),160px) rotate(11deg);
    }
    .cinematic-title-echo{
      position:absolute;
      right:7%;
      top:39%;
      max-width:420px;
      color:rgba(255,255,255,.08);
      font-family:var(--font-serif,Georgia,serif);
      font-size:clamp(42px,7vw,100px);
      font-weight:700;
      line-height:.88;
      letter-spacing:-.07em;
      text-transform:none;
      filter:blur(.2px);
      mix-blend-mode:screen;
      transform:translate3d(calc(var(--mx) * -.032),calc(var(--my) * -.03 + var(--scroll) * .1px),20px);
      user-select:none;
    }
    .cinematic-noise{
      position:absolute;
      inset:0;
      opacity:.12;
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
      background:radial-gradient(circle,rgba(255,248,239,var(--a)),rgba(240,198,122,calc(var(--a) * .32)) 42%,transparent 75%);
      box-shadow:0 0 16px rgba(240,198,122,.18);
      opacity:.74;
      transform:translate3d(calc(var(--mx) * var(--dx)),calc(var(--my) * var(--dy)),0);
      animation:meoDustFloat var(--d) ease-in-out infinite alternate;
    }
    .home-cover.has-cinematic-motion .home-cover-text,
    .home-cover.has-cinematic-motion .home-cover-card{
      transform:translate3d(calc(var(--cinema-x,0px) * .018),calc(var(--cinema-y,0px) * .012),0);
      transition:transform 120ms linear;
    }
    .home-cover.has-cinematic-motion .home-cover-card{
      backdrop-filter:blur(20px) saturate(1.2);
    }
    .home-cover.has-cinematic-motion h1{
      text-shadow:0 0 38px rgba(240,198,122,.08),0 0 90px rgba(158,220,255,.08);
    }
    @keyframes meoColorBreath{0%{filter:blur(22px) saturate(1.15) hue-rotate(-10deg)}100%{filter:blur(24px) saturate(1.55) hue-rotate(18deg)}}
    @keyframes meoOrbFloat{0%{opacity:.46;scale:.98}100%{opacity:.68;scale:1.04}}
    @keyframes meoGlassDrift{0%{filter:blur(0);opacity:.4}100%{filter:blur(.4px);opacity:.62}}
    @keyframes meoDustFloat{0%{translate:0 0;opacity:.35}100%{translate:0 -46px;opacity:.8}}
    @media(max-width:760px){
      .home-cover.has-cinematic-motion{border-radius:0 0 26px 26px}
      .cinematic-hero-layer{inset:-12%;opacity:.68}
      .cinematic-glass.one{width:76vw;height:45vw;right:-22%;top:22%;opacity:.36}
      .cinematic-glass.two{width:48vw;height:70vw;left:-24%;top:18%;opacity:.2}
      .cinematic-glass.three,.cinematic-title-echo{display:none}
      .cinematic-orb{width:86vw;left:42%;top:2%;opacity:.38}
      .cinematic-dust:nth-of-type(n+28){display:none}
    }
    body.is-reading-mode .cinematic-hero-layer{opacity:.14;filter:grayscale(.4)}
  `;
  document.head.appendChild(style);

  const layer = document.createElement("div");
  layer.className = "cinematic-hero-layer";
  layer.setAttribute("aria-hidden", "true");

  layer.innerHTML = `
    <div class="cinematic-noise"></div>
    <div class="cinematic-orb"></div>
    <div class="cinematic-glass one"></div>
    <div class="cinematic-glass two"></div>
    <div class="cinematic-glass three"></div>
    <div class="cinematic-title-echo">Mèo Đen<br/>Không Ngủ</div>
  `;

  const dustCount = window.innerWidth < 760 ? 32 : 58;
  for (let index = 0; index < dustCount; index += 1) {
    const dust = document.createElement("span");
    dust.className = "cinematic-dust";
    dust.style.setProperty("--x", `${Math.random() * 100}%`);
    dust.style.setProperty("--y", `${Math.random() * 100}%`);
    dust.style.setProperty("--s", `${1.4 + Math.random() * 4.8}px`);
    dust.style.setProperty("--a", `${0.18 + Math.random() * 0.42}`);
    dust.style.setProperty("--dx", `${(-0.12 + Math.random() * 0.24).toFixed(3)}`);
    dust.style.setProperty("--dy", `${(-0.1 + Math.random() * 0.2).toFixed(3)}`);
    dust.style.setProperty("--d", `${5.5 + Math.random() * 7.5}s`);
    dust.style.animationDelay = `${Math.random() * -8}s`;
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
    scroll = Math.max(-300, Math.min(300, -hero.getBoundingClientRect().top));

    layer.style.setProperty("--mx", `${x}px`);
    layer.style.setProperty("--my", `${y}px`);
    layer.style.setProperty("--scroll", `${scroll}`);
    hero.style.setProperty("--cinema-x", `${x}px`);
    hero.style.setProperty("--cinema-y", `${y}px`);

    requestAnimationFrame(animate);
  };

  window.addEventListener("pointermove", updateTarget, { passive: true });
  window.addEventListener("scroll", () => {}, { passive: true });
  animate();
})();
