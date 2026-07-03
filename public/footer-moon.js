(() => {
  const phaseInfo = (date = new Date()) => {
    const month = 29.530588853;
    const base = Date.UTC(2000, 0, 6, 18, 14, 0);
    const age = (((date.getTime() - base) / 86400000) % month + month) % month;
    const phase = age / month;
    const lit = (1 - Math.cos(2 * Math.PI * phase)) / 2;
    const names = [
      [0.03, "Trăng non"], [0.22, "Trăng khuyết đầu tháng"], [0.28, "Bán nguyệt đầu tháng"],
      [0.47, "Trăng tròn dần"], [0.53, "Trăng tròn"], [0.72, "Trăng khuyết dần"],
      [0.78, "Bán nguyệt cuối tháng"], [1, "Trăng tàn"]
    ];
    return { phase, lit, name: names.find(([limit]) => phase < limit)?.[1] || "Trăng non" };
  };

  const smooth = (a, b, v) => {
    const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  const noise = (x, y) => {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };

  const blob = (x, y, cx, cy, rx, ry, r) => {
    const c = Math.cos(r);
    const s = Math.sin(r);
    const dx = x - cx;
    const dy = y - cy;
    const px = dx * c + dy * s;
    const py = -dx * s + dy * c;
    return Math.exp(-((px * px) / (rx * rx) + (py * py) / (ry * ry)) * 2.4);
  };

  const drawMoon = (target) => {
    if (!target) return;
    const size = 560;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(size, size);
    const data = img.data;
    const m = phaseInfo();
    const c = size / 2;
    const r = size * 0.32;
    const angle = 2 * Math.PI * m.phase;
    const sun = { x: Math.sin(angle), y: -0.14, z: -Math.cos(angle) };
    const seas = [[-.28,-.3,.28,.16,-.7,.55],[.04,-.22,.22,.13,.25,.43],[.25,-.03,.17,.25,-.2,.5],[-.2,.18,.24,.16,.55,.38],[.12,.31,.22,.12,-.18,.34],[-.44,.04,.13,.22,.1,.26],[.37,.24,.12,.17,.62,.27]];
    const craters = [[-.45,-.2,.045,.25],[-.18,.38,.056,.2],[.34,.12,.052,.18],[.22,.36,.04,.18],[-.36,.23,.034,.17],[.21,-.36,.03,.22],[.02,.48,.026,.15],[-.1,-.28,.024,.16],[.46,-.2,.024,.15]];

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const nx = (x - c) / r;
        const ny = (y - c) / r;
        const d2 = nx * nx + ny * ny;
        const i = (y * size + x) * 4;
        if (d2 > 1) continue;
        const nz = Math.sqrt(1 - d2);
        const dot = nx * sun.x + ny * sun.y + nz * sun.z;
        const day = smooth(-.07, .18, dot);
        const earth = .07 * (1 - day) * Math.pow(nz, .9);
        const limb = Math.pow(nz, .62);
        const edge = smooth(1, .91, Math.sqrt(d2));

        let sea = 0;
        seas.forEach(([cx, cy, rx, ry, rot, strength]) => { sea += blob(nx, ny, cx, cy, rx, ry, rot) * strength; });
        sea = Math.min(.72, sea);

        let dark = 0;
        let high = 0;
        craters.forEach(([cx, cy, rr, strength]) => {
          const dx = nx - cx;
          const dy = ny - cy;
          const d = Math.sqrt(dx * dx + dy * dy);
          const bowl = Math.exp(-(d * d) / (rr * rr * .86));
          const ring = Math.exp(-Math.pow((d - rr) / (rr * .24), 2));
          const side = d ? (dx * sun.x - dy * .25) / d : 0;
          dark += (bowl * .34 + ring * .22 * Math.max(0, side)) * strength;
          high += ring * .24 * Math.max(0, -side) * strength;
        });

        const grain = (noise(Math.floor(x * .8), Math.floor(y * .8)) - .5) * .05 + (noise(nx * 23, ny * 23) - .5) * .08;
        const surface = 1 - sea * .5 - dark + high + grain;
        const light = Math.max(.016, earth + day * (.18 + .92 * limb));
        const b = Math.max(.015, Math.min(1, light * surface));
        data[i] = Math.round(236 * b + 12 * earth);
        data[i + 1] = Math.round(224 * b + 10 * earth);
        data[i + 2] = Math.round(202 * b + 8 * earth);
        data[i + 3] = Math.round(255 * edge * (.22 + .78 * Math.max(day, earth * 2.2)));
      }
    }

    ctx.putImageData(img, 0, 0);
    ctx.globalCompositeOperation = "screen";
    const glow = ctx.createRadialGradient(c - 34, c - 48, r * .25, c, c, r * 1.8);
    glow.addColorStop(0, "rgba(255,253,245,.2)");
    glow.addColorStop(.4, "rgba(240,198,122,.1)");
    glow.addColorStop(1, "rgba(240,198,122,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);

    target.innerHTML = "";
    target.appendChild(canvas);
    target.title = `${m.name} · ${(m.lit * 100).toFixed(0)}% ánh sáng`;
    target.setAttribute("aria-label", target.title);
  };

  const run = () => drawMoon(document.querySelector(".footer-moon"));
  if (document.querySelector(".footer-moon")) run();
  else new MutationObserver((_, observer) => {
    if (document.querySelector(".footer-moon")) {
      run();
      observer.disconnect();
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
