import { useEffect, useRef } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [], stars = [], t = 0, animId;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      particles = Array.from({ length: 60 }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 2.5 + 0.5,
        color: i % 3 === 0 ? "147,51,234" : i % 3 === 1 ? "6,182,212" : "99,102,241",
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * Math.PI * 2,
      }));
      stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.03 + 0.01,
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.016;

      [[W*0.15,H*0.2,"147,51,234"],[W*0.85,H*0.75,"6,182,212"]].forEach(([x,y,c]) => {
        const g = ctx.createRadialGradient(x,y,0,x,y,300);
        g.addColorStop(0, `rgba(${c},0.08)`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
      });

      stars.forEach(s => {
        s.twinkle += s.speed;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha*(0.5+0.5*Math.sin(s.twinkle))})`;
        ctx.fill();
      });

      if (Math.sin(t*0.3) > 0.98) {
        const g = ctx.createRadialGradient(W*0.5+Math.sin(t)*W*0.3, H*0.5+Math.cos(t*0.7)*H*0.3, 0, W*0.5, H*0.5, 80);
        g.addColorStop(0, "rgba(255,255,255,0.12)");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
      }

      for (let i = 0; i < particles.length; i++)
        for (let j = i+1; j < particles.length; j++) {
          const dx = particles[i].x-particles[j].x, dy = particles[i].y-particles[j].y;
          const d = Math.sqrt(dx*dx+dy*dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139,92,246,${0.15*(1-d/120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

      particles.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.pulse+=0.05;
        if(p.x<0||p.x>W) p.vx*=-1;
        if(p.y<0||p.y>H) p.vy*=-1;
        const a = p.alpha*(0.7+0.3*Math.sin(p.pulse));
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${p.color},${a})`; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r*3,0,Math.PI*2);
        ctx.fillStyle=`rgba(${p.color},0.05)`; ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };

    resize(); animate();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />;
};

export default ParticleBackground;