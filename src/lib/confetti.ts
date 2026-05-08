// Confetti utility
export function fireConfetti() {
  if (typeof document === "undefined") return;
  const colors = ["#C9A84C", "#7A9E7E", "#E8D5C4", "#FAF7F0", "#E8C97E", "#ffb3d1"];
  const el = document.createElement("canvas");
  el.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9997;";
  document.body.appendChild(el);
  const ctx = el.getContext("2d")!;
  el.width = window.innerWidth;
  el.height = window.innerHeight;
  const particles = Array.from({ length: 110 }, () => ({
    x: Math.random() * el.width,
    y: -20,
    vx: (Math.random() - 0.5) * 5,
    vy: Math.random() * 5 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    r: Math.random() * 7 + 3,
    rot: Math.random() * 360,
    vrot: (Math.random() - 0.5) * 12,
    circle: Math.random() > 0.55,
  }));
  let alive = true;
  const draw = () => {
    if (!alive) return;
    ctx.clearRect(0, 0, el.width, el.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.14;
      p.rot += p.vrot;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.circle) {
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      }
      ctx.restore();
    });
    if (particles.some((p) => p.y < el.height + 20)) requestAnimationFrame(draw);
    else {
      alive = false;
      if (el.parentNode) document.body.removeChild(el);
    }
  };
  draw();
  setTimeout(() => {
    alive = false;
    if (el.parentNode) document.body.removeChild(el);
  }, 4500);
}
