import { useEffect, useRef } from "react";

const RobotAssistant = ({ message = "Hi! I'm your career AI. Let me help you land your dream job! 🚀" }) => {
  const eyeRef1 = useRef(null);
  const eyeRef2 = useRef(null);
  const antennaRef = useRef(null);
  const bodyRef = useRef(null);
  const armLRef = useRef(null);
  const armRRef = useRef(null);
  const speechRef = useRef(null);
  const robotRef = useRef(null);

  useEffect(() => {
    let t = 0;
    let animId;

    const animate = () => {
      t += 0.03;

      // Body floating up and down
      if (robotRef.current) {
        const floatY = Math.sin(t) * 8;
        robotRef.current.style.transform = `translateY(${floatY}px)`;
      }

      // Eye blinking
      if (eyeRef1.current && eyeRef2.current) {
        const blink = Math.sin(t * 2) > 0.97;
        eyeRef1.current.setAttribute("ry", blink ? "1" : "6");
        eyeRef2.current.setAttribute("ry", blink ? "1" : "6");
      }

      // Antenna glow pulsing
      if (antennaRef.current) {
        const glow = 0.4 + 0.6 * Math.abs(Math.sin(t * 3));
        antennaRef.current.setAttribute("opacity", glow);
        const scale = 0.8 + 0.4 * Math.abs(Math.sin(t * 3));
        antennaRef.current.setAttribute("r", `${3 * scale}`);
      }

      // Arms waving
      if (armLRef.current && armRRef.current) {
        const wave = Math.sin(t * 1.5) * 8;
        armLRef.current.setAttribute("transform", `rotate(${wave}, 21, 102)`);
        armRRef.current.setAttribute("transform", `rotate(${-wave}, 139, 102)`);
      }

      // Chest lights blinking alternately
      if (bodyRef.current) {
        const lights = bodyRef.current.querySelectorAll(".chest-light");
        lights.forEach((light, i) => {
          const alpha = 0.5 + 0.5 * Math.sin(t * 2 + i * Math.PI);
          light.setAttribute("opacity", alpha);
        });
      }

      // Speech bubble subtle pulse
      if (speechRef.current) {
        const scale = 1 + 0.02 * Math.sin(t * 1.5);
        speechRef.current.style.transform = `scale(${scale})`;
      }

      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">

      {/* AI Badge */}
      <div className="flex items-center gap-2 bg-blue-900/30 border border-blue-500/30 rounded-full px-4 py-1.5">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <span className="text-blue-400 text-xs font-medium tracking-widest uppercase">AI Assistant Online</span>
      </div>

      {/* Speech Bubble */}
      <div
        ref={speechRef}
        className="bg-purple-900/20 border border-purple-500/30 rounded-xl px-4 py-3 max-w-[210px] text-center relative"
        style={{ transformOrigin: "bottom center" }}
      >
        <p className="text-purple-300 text-sm leading-relaxed">{message}</p>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-purple-500/30" />
      </div>

      {/* Robot */}
      <div ref={robotRef} style={{ transition: "transform 0.1s ease-out" }}>
        <svg width="170" height="220" viewBox="0 0 170 220">

          {/* Shadow */}
          <ellipse cx="85" cy="212" rx="52" ry="7" fill="#9333ea" opacity="0.15">
            <animate attributeName="rx" values="52;44;52" dur="2s" repeatCount="indefinite" />
          </ellipse>

          {/* Left Arm */}
          <rect ref={armLRef} x="8" y="95" width="27" height="14" rx="7"
            fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1.5" />

          {/* Right Arm */}
          <rect ref={armRRef} x="125" y="95" width="27" height="14" rx="7"
            fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1.5" />

          {/* Body */}
          <rect ref={bodyRef} x="38" y="90" width="90" height="82" rx="18"
            fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1.5" />

          {/* Chest Panel */}
          <rect x="58" y="108" width="50" height="30" rx="6"
            fill="#0f172a" stroke="#4f46e5" strokeWidth="1" />

          {/* Chest Lights */}
          <rect className="chest-light" x="63" y="113" width="16" height="8" rx="3" fill="#9333ea" />
          <rect className="chest-light" x="83" y="113" width="16" height="8" rx="3" fill="#06b6d4" />
          <rect x="63" y="126" width="36" height="5" rx="2" fill="#1e3a5f" opacity="0.8" />

          {/* Neck */}
          <rect x="73" y="78" width="20" height="14" rx="4"
            fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1" />

          {/* Head */}
          <rect x="28" y="20" width="110" height="62" rx="16"
            fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1.5" />

          {/* Eye sockets */}
          <ellipse cx="60" cy="48" rx="14" ry="14" fill="#0f172a" stroke="#4f46e5" strokeWidth="1" />
          <ellipse cx="107" cy="48" rx="14" ry="14" fill="#0f172a" stroke="#4f46e5" strokeWidth="1" />

          {/* Eyes */}
          <ellipse ref={eyeRef1} cx="60" cy="48" rx="8" ry="6" fill="#9333ea" />
          <ellipse ref={eyeRef2} cx="107" cy="48" rx="8" ry="6" fill="#06b6d4" />

          {/* Eye shine */}
          <ellipse cx="63" cy="45" rx="3" ry="2" fill="white" opacity="0.8" />
          <ellipse cx="110" cy="45" rx="3" ry="2" fill="white" opacity="0.8" />

          {/* Scanning line on eyes */}
          <rect x="46" y="47" width="28" height="2" rx="1" fill="#c084fc" opacity="0.5">
            <animate attributeName="y" values="38;57;38" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
          </rect>
          <rect x="93" y="47" width="28" height="2" rx="1" fill="#22d3ee" opacity="0.5">
            <animate attributeName="y" values="38;57;38" dur="2s" begin="0.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </rect>

          {/* Mouth */}
          <path d="M58 68 Q83 78 108 68" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="d"
              values="M58 68 Q83 78 108 68; M58 68 Q83 72 108 68; M58 68 Q83 78 108 68"
              dur="3s" repeatCount="indefinite" />
          </path>

          {/* Antenna */}
          <line x1="83" y1="20" x2="83" y2="6" stroke="#7c3aed" strokeWidth="2" />
          <circle cx="83" cy="4" r="5" fill="#9333ea" />
          <circle ref={antennaRef} cx="83" cy="4" r="3" fill="#c084fc" opacity="0.8" />

          {/* Legs */}
          <rect x="52" y="170" width="24" height="32" rx="8"
            fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1.5" />
          <rect x="90" y="170" width="24" height="32" rx="8"
            fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1.5" />

          {/* Feet */}
          <rect x="48" y="196" width="32" height="10" rx="5"
            fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1" />
          <rect x="86" y="196" width="32" height="10" rx="5"
            fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1" />

        </svg>
      </div>

      <p className="text-purple-400 text-xs font-medium tracking-widest uppercase">JobGenie AI</p>
    </div>
  );
};

export default RobotAssistant;