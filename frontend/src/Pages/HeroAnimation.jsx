import { useEffect, useRef } from "react";

const HeroAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [], stars = [], hexagons = [], t = 0, animId;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      init();
    };

    const init = () => {
      particles = Array.from({ length: 50 }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2 + 0.5,
        color: i % 3 === 0 ? "147,51,234" : i % 3 === 1 ? "6,182,212" : "99,102,241",
        alpha: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      }));
      stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        alpha: Math.random() * 0.5 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
      }));
      hexagons = Array.from({ length: 6 }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H,
        size: Math.random() * 20 + 10,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        alpha: Math.random() * 0.08 + 0.03,
        color: i % 2 === 0 ? "147,51,234" : "6,182,212",
      }));
    };

    const drawHex = (x, y, size, rotation) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = rotation + (Math.PI / 3) * i;
        i === 0
          ? ctx.moveTo(x + size * Math.cos(angle), y + size * Math.sin(angle))
          : ctx.lineTo(x + size * Math.cos(angle), y + size * Math.sin(angle));
      }
      ctx.closePath();
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.016;

      [[W*0.2,H*0.3,"147,51,234"],[W*0.8,H*0.7,"6,182,212"],[W*0.5,H*0.5,"99,102,241"]].forEach(([x,y,c]) => {
        const g = ctx.createRadialGradient(x,y,0,x,y,180);
        g.addColorStop(0, `rgba(${c},0.06)`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
      });

      stars.forEach(s => {
        s.twinkle += s.speed;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha*(0.5+0.5*Math.sin(s.twinkle))})`;
        ctx.fill();
      });

      hexagons.forEach(h => {
        h.rotation += h.rotSpeed;
        h.y += Math.sin(t*0.5+h.x)*0.2;
        drawHex(h.x,h.y,h.size,h.rotation);
        ctx.strokeStyle = `rgba(${h.color},${h.alpha})`;
        ctx.lineWidth = 1; ctx.stroke();
      });

      if (Math.sin(t*0.25) > 0.97) {
        const g = ctx.createRadialGradient(W*0.5,H*0.5,0,W*0.5,H*0.5,100);
        g.addColorStop(0,"rgba(255,255,255,0.08)");
        g.addColorStop(0.5,"rgba(147,51,234,0.05)");
        g.addColorStop(1,"transparent");
        ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
      }

      for (let i = 0; i < particles.length; i++)
        for (let j = i+1; j < particles.length; j++) {
          const dx = particles[i].x-particles[j].x;
          const dy = particles[i].y-particles[j].y;
          const d = Math.sqrt(dx*dx+dy*dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139,92,246,${0.12*(1-d/100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x,particles[i].y);
            ctx.lineTo(particles[j].x,particles[j].y);
            ctx.stroke();
          }
        }

      particles.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.pulse+=0.04;
        if(p.x<0||p.x>W)p.vx*=-1;
        if(p.y<0||p.y>H)p.vy*=-1;
        const a = p.alpha*(0.7+0.3*Math.sin(p.pulse));
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${p.color},${a})`; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2);
        ctx.fillStyle=`rgba(${p.color},0.04)`; ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };

    resize(); animate();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      {/* Orbit Rings */}
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full border border-purple-500/15"
        style={{ animation: "heroSpin 20s linear infinite", transform: "translate(-50%,-50%)" }}>
        <div className="absolute -top-1 left-1/2 w-2 h-2 bg-purple-500 rounded-full" style={{ boxShadow: "0 0 10px #9333ea" }} />
      </div>
      <div className="absolute top-1/2 left-1/2 w-[460px] h-[460px] rounded-full border border-cyan-500/15"
        style={{ animation: "heroSpinReverse 30s linear infinite", transform: "translate(-50%,-50%)" }}>
        <div className="absolute -top-1 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full" style={{ boxShadow: "0 0 8px #06b6d4" }} />
      </div>
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full border border-indigo-500/10"
        style={{ animation: "heroSpin 45s linear infinite", transform: "translate(-50%,-50%)" }}>
        <div className="absolute -top-1 left-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full" style={{ boxShadow: "0 0 6px #6366f1" }} />
      </div>

      <style>{`
        @keyframes heroSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes heroSpinReverse {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};

export default HeroAnimation;