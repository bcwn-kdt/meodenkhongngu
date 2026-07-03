(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (document.querySelector(".cinematic-hero-layer")) return;

  const hero = document.querySelector(".home-cover");
  if (!hero) return;

  hero.classList.add("has-cinematic-motion", "cinematic-v4");

  const style = document.createElement("style");
  style.id = "meo-cinematic-hero-style";
  style.textContent = `
    .home-cover.cinematic-v4{position:relative;isolation:isolate;overflow:hidden;border-radius:0 0 42px 42px;perspective:1400px}
    .home-cover.cinematic-v4>*{position:relative;z-index:5}
    .cinematic-hero-layer{position:absolute;inset:-12%;z-index:1;pointer-events:none;overflow:hidden;transform-style:preserve-3d;--mx:0px;--my:0px;--scroll:0}
    .cinematic-hero-layer::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 30% 34%,rgba(255,72,205,.28),transparent 17rem),radial-gradient(circle at 50% 48%,rgba(111,92,255,.24),transparent 23rem),radial-gradient(circle at 70% 36%,rgba(58,244,222,.18),transparent 21rem),radial-gradient(circle at 82% 74%,rgba(240,198,122,.13),transparent 20rem),linear-gradient(90deg,rgba(10,7,16,.16),transparent 42%,rgba(9,15,20,.22));filter:blur(18px) saturate(1.5);opacity:.82;transform:translate3d(calc(var(--mx)*-.028),calc(var(--my)*-.026 + var(--scroll)*.08px),0) scale(1.03);animation:meoColorBreath 11s ease-in-out infinite alternate}
    .cinematic-hero-layer::after{content:"";position:absolute;inset:0;background:linear-gradient(112deg,transparent 0 24%,rgba(255,255,255,.055) 32%,transparent 44% 100%),repeating-linear-gradient(90deg,rgba(255,255,255,.024) 0 1px,transparent 1px 34px),repeating-linear-gradient(0deg,rgba(255,255,255,.012) 0 1px,transparent 1px 42px);opacity:.2;mix-blend-mode:screen;transform:translate3d(calc(var(--mx)*.012),calc(var(--my)*.012),0) rotate(-7deg) scale(1.06)}
    .cinematic-stage{position:absolute;left:50%;top:50%;width:min(72vw,880px);height:min(52vw,620px);transform-style:preserve-3d;opacity:.72;transform:translate3d(calc(-50% + var(--mx)*.018),calc(-50% + var(--my)*.016 + var(--scroll)*.06px),70px) rotateX(calc(var(--my)*-.004deg)) rotateY(calc(var(--mx)*.005deg))}
    .cinematic-stage::before{content:"";position:absolute;inset:5% 2%;border-radius:50px;background:radial-gradient(circle at 48% 48%,rgba(255,255,255,.14),rgba(255,255,255,.034) 34%,transparent 65%);filter:blur(10px);opacity:.66;mix-blend-mode:screen;animation:meoPulse 6.5s ease-in-out infinite alternate}
    .cinematic-orb{position:absolute;width:min(28vw,360px);aspect-ratio:1;left:50%;top:8%;border-radius:999px;background:radial-gradient(circle at 42% 35%,rgba(255,255,255,.86),rgba(255,248,239,.23) 18%,rgba(158,220,255,.1) 42%,transparent 68%),radial-gradient(circle,rgba(255,120,210,.14),transparent 64%);filter:drop-shadow(0 0 64px rgba(255,248,239,.2));opacity:.5;transform:translate3d(calc(-50% + var(--mx)*-.017),calc(var(--my)*-.014),150px);animation:meoOrbFloat 8s ease-in-out infinite alternate}
    .cinematic-prism{position:absolute;inset:20% 12% 15%;border-radius:42px;background:radial-gradient(circle at 42% 38%,rgba(255,255,255,.42),transparent 12%),radial-gradient(circle at 34% 44%,rgba(255,60,195,.28),transparent 26%),radial-gradient(circle at 70% 56%,rgba(45,255,225,.22),transparent 26%),radial-gradient(circle at 52% 72%,rgba(95,110,255,.3),transparent 32%);filter:blur(2px) saturate(1.32);opacity:.56;mix-blend-mode:screen;transform:translate3d(calc(var(--mx)*-.019),calc(var(--my)*-.016),130px);animation:meoPrism 7.5s ease-in-out infinite alternate}
    .cinematic-glass{position:absolute;border:1px solid rgba(255,255,255,.18);border-radius:32px;background:linear-gradient(145deg,rgba(255,255,255,.145),rgba(255,255,255,.032)),radial-gradient(circle at 30% 24%,rgba(255,255,255,.14),transparent 32%);box-shadow:0 30px 96px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.23),0 0 54px rgba(158,220,255,.06);backdrop-filter:blur(16px) saturate(1.3);overflow:hidden;mix-blend-mode:screen}
    .cinematic-glass::before{content:"";position:absolute;inset:-35%;background:linear-gradient(115deg,transparent 22%,rgba(255,255,255,.18) 34%,transparent 48%);opacity:.32;transform:translateX(-18%) rotate(8deg);animation:meoGlassSweep 8s ease-in-out infinite}
    .cinematic-glass::after{content:attr(data-label);position:absolute;left:24px;top:24px;color:rgba(255,255,255,.45);font:800 clamp(13px,1.25vw,21px)/.95 var(--font-ui,system-ui,sans-serif);letter-spacing:.04em;text-transform:uppercase;white-space:pre-line;text-shadow:0 0 18px rgba(255,255,255,.2)}
    .cinematic-glass.one{width:52%;height:34%;left:25%;top:30%;opacity:.56;transform:translate3d(calc(var(--mx)*-.038),calc(var(--my)*-.035),200px) rotate(-3deg);animation:meoGlassDrift 8s ease-in-out infinite alternate}
    .cinematic-glass.two{width:30%;height:52%;left:13%;top:14%;border-radius:30px;opacity:.36;transform:translate3d(calc(var(--mx)*.032),calc(var(--my)*.028),110px) rotate(7deg);animation:meoGlassDrift 10s ease-in-out infinite alternate-reverse}
    .cinematic-glass.three{width:28%;height:30%;right:12%;bottom:14%;border-radius:27px;opacity:.34;transform:translate3d(calc(var(--mx)*.055),calc(var(--my)*.045),240px) rotate(10deg);animation:meoGlassDrift 9s ease-in-out infinite alternate}
    .cinematic-title-echo{position:absolute;left:50%;top:52%;color:rgba(255,255,255,.075);font-family:var(--font-serif,Georgia,serif);font-size:clamp(48px,8vw,120px);font-weight:700;line-height:.86;letter-spacing:-.07em;filter:blur(.3px);mix-blend-mode:screen;transform:translate3d(calc(-50% + var(--mx)*-.018),calc(-50% + var(--my)*-.016 + var(--scroll)*.04px),20px);user-select:none;white-space:nowrap}
    .cinematic-noise{position:absolute;inset:0;opacity:.12;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");mix-blend-mode:soft-light;transform:translate3d(calc(var(--mx)*.012),calc(var(--my)*.012),0)}
    .cinematic-dust{position:absolute;left:var(--x);top:var(--y);width:var(--s);height:var(--s);border-radius:999px;background:radial-gradient(circle,rgba(255,248,239,var(--a)),rgba(255,80,215,calc(var(--a)*.34)) 32%,rgba(50,255,225,calc(var(--a)*.22)) 58%,transparent 78%);box-shadow:0 0 18px rgba(255,100,220,.18),0 0 28px rgba(80,255,225,.1);opacity:.72;transform:translate3d(calc(var(--mx)*var(--dx)),calc(var(--my)*var(--dy)),0);animation:meoDustFloat var(--d) ease-in-out infinite alternate}
    .home-cover.cinematic-v4 .home-cover-text,.home-cover.cinematic-v4 .home-cover-card{transition:transform 120ms linear}
    .home-cover.cinematic-v4 .home-cover-text{transform:translate3d(calc(var(--cinema-x,0px)*.006),calc(var(--cinema-y,0px)*.004),0)}
    .home-cover.cinematic-v4 .home-cover-card{transform:translate3d(calc(var(--cinema-x,0px)*-.01),calc(var(--cinema-y,0px)*-.008),0);backdrop-filter:blur(22px) saturate(1.2);background:linear-gradient(150deg,rgba(255,255,255,.13),rgba(255,255,255,.038));border-color:rgba(255,255,255,.18)}
    .home-cover.cinematic-v4 h1{text-shadow:0 0 42px rgba(240,198,122,.1),0 0 110px rgba(158,220,255,.09)}
    @keyframes meoColorBreath{0%{filter:blur(18px) saturate(1.14) hue-rotate(-16deg)}100%{filter:blur(22px) saturate(1.64) hue-rotate(20deg)}}
    @keyframes meoOrbFloat{0%{opacity:.38;scale:.96}100%{opacity:.6;scale:1.05}}
    @keyframes meoGlassDrift{0%{filter:blur(0);opacity:.34}100%{filter:blur(.3px);opacity:.68}}
    @keyframes meoGlassSweep{0%,42%{transform:translateX(-32%) rotate(8deg);opacity:.1}72%{transform:translateX(46%) rotate(8deg);opacity:.38}100%{transform:translateX(58%) rotate(8deg);opacity:.08}}
    @keyframes meoDustFloat{0%{translate:0 0;opacity:.32}100%{translate:0 -60px;opacity:.76}}
    @keyframes meoPulse{0%{opacity:.3;scale:.96}100%{opacity:.62;scale:1.04}}
    @keyframes meoPrism{0%{opacity:.32;filter:blur(3px) saturate(1.05)}100%{opacity:.6;filter:blur(1px) saturate(1.58)}}
    @media(max-width:760px){.home-cover.cinematic-v4{border-radius:0 0 28px 28px}.cinematic-hero-layer{inset:-10%;opacity:.72}.cinematic-stage{width:112vw;height:86vw;opacity:.58}.cinematic-glass.one{width:60%;height:38%;left:20%;top:28%;opacity:.38}.cinematic-glass.two{width:36%;height:56%;left:10%;top:10%;opacity:.24}.cinematic-glass.three{opacity:.2}.cinematic-glass::after{font-size:11px;left:16px;top:16px}.cinematic-title-echo{display:none}.cinematic-orb{width:70vw;left:50%;top:0;opacity:.32}.cinematic-dust:nth-of-type(n+44){display:none}}
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
    <div class="cinematic-title-echo">Mèo Đen Không Ngủ</div>
  `;

  const dustCount = window.innerWidth < 760 ? 46 : 86;
  for (let index = 0; index < dustCount; index += 1) {
    const dust = document.createElement("span");
    dust.className = "cinematic-dust";
    dust.style.setProperty("--x", `${Math.random() * 100}%`);
    dust.style.setProperty("--y", `${8 + Math.random() * 82}%`);
    dust.style.setProperty("--s", `${1.3 + Math.random() * 5.8}px`);
    dust.style.setProperty("--a", `${0.16 + Math.random() * 0.46}`);
    dust.style.setProperty("--dx", `${(-0.14 + Math.random() * 0.28).toFixed(3)}`);
    dust.style.setProperty("--dy", `${(-0.12 + Math.random() * 0.24).toFixed(3)}`);
    dust.style.setProperty("--d", `${5 + Math.random() * 8}s`);
    dust.style.animationDelay = `${Math.random() * -9}s`;
    layer.appendChild(dust);
  }

  hero.prepend(layer);

  let x = 0, y = 0, tx = 0, ty = 0, scroll = 0;
  const updateTarget = (event) => {
    const rect = hero.getBoundingClientRect();
    tx = event.clientX - rect.left - rect.width / 2;
    ty = event.clientY - rect.top - rect.height / 2;
  };
  const animate = () => {
    x += (tx - x) * 0.052;
    y += (ty - y) * 0.052;
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
