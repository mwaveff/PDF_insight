import { useEffect, useRef } from 'react';

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    let mouseX = w / 2;
    let mouseY = h / 2;

    const onResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const particleCount = Math.min(Math.floor((w * h) / 12000), 120);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.5 + 0.5,
    }));

    let t = 0;

    const draw = () => {
      t += 0.002;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#03040b';
      ctx.fillRect(0, 0, w, h);

      const cx1 = w * 0.5 + Math.sin(t) * w * 0.25;
      const cy1 = h * 0.5 + Math.cos(t * 1.2) * h * 0.25;
      const g1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, w * 0.55);
      g1.addColorStop(0, 'rgba(79, 70, 229, 0.12)');
      g1.addColorStop(1, 'rgba(3, 4, 11, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const cx2 = w * 0.5 + Math.cos(t * 0.8) * w * 0.25;
      const cy2 = h * 0.5 + Math.sin(t * 1.1) * h * 0.25;
      const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, w * 0.45);
      g2.addColorStop(0, 'rgba(14, 165, 233, 0.08)');
      g2.addColorStop(1, 'rgba(3, 4, 11, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dxMouse = mouseX - p.x;
        const dyMouse = mouseY - p.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);

        if (distMouse < 180) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(129, 140, 248, ${0.4 * (1 - distMouse / 180)})`;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();

          p.x -= dxMouse * 0.015;
          p.y -= dyMouse * 0.015;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(199, 210, 254, 0.8)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(165, 180, 252, ${0.2 * (1 - dist / 130)})`;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-[#03040b]">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
