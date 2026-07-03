"use client";

import { useMemo } from "react";

// Deterministic PRNG so the star field renders identically on server & client.
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COMETS = [
  { path: "M -80,220 C 320,60 780,340 1560,120", dur: "26s", delay: "0s", size: 2.2, color: "#a3e635" },
  { path: "M 1540,640 C 1100,780 520,560 -100,720", dur: "34s", delay: "-12s", size: 1.7, color: "#5eead4" },
  { path: "M -60,820 C 420,620 980,880 1540,560", dur: "42s", delay: "-25s", size: 1.4, color: "#c4b5fd" },
];

export default function GalaxyBackground() {
  const rand = useMemo(() => mulberry32(1977), []);
  const stars = useMemo(
    () =>
      Array.from({ length: 110 }, (_, i) => ({
        id: i,
        x: +(rand() * 1440).toFixed(1),
        y: +(rand() * 900).toFixed(1),
        r: +(0.4 + rand() * 1.1).toFixed(2),
        dur: +(2 + rand() * 5).toFixed(2),
        delay: +(rand() * 6).toFixed(2),
        dim: rand() > 0.65,
      })),
    [rand]
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <defs>
          <radialGradient id="gb-space" cx="50%" cy="35%" r="90%">
            <stop offset="0%" stopColor="#081120" />
            <stop offset="55%" stopColor="#040810" />
            <stop offset="100%" stopColor="#02030a" />
          </radialGradient>
          <radialGradient id="gb-nebula-green" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gb-nebula-teal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gb-nebula-violet" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gb-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ecfccb" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#a3e635" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gb-trail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="gb-planet" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#5eead4" />
            <stop offset="45%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#042f2e" />
          </radialGradient>
          <radialGradient id="gb-planet-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gb-ring" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a3e635" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#a3e635" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#5eead4" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="gb-beam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a3e635" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gb-hull" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="45%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* deep space */}
        <rect width="1440" height="900" fill="url(#gb-space)" />

        {/* drifting nebulae */}
        <g className="gb-drift-slow">
          <ellipse cx="1120" cy="210" rx="420" ry="260" fill="url(#gb-nebula-green)" />
        </g>
        <g className="gb-drift-slower">
          <ellipse cx="260" cy="700" rx="480" ry="300" fill="url(#gb-nebula-violet)" />
          <ellipse cx="720" cy="420" rx="520" ry="330" fill="url(#gb-nebula-teal)" />
        </g>

        {/* star field */}
        <g>
          {stars.map((s) => (
            <circle
              key={s.id}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={s.dim ? "#94a3b8" : "#e2e8f0"}
              className="gb-twinkle"
              style={{ animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
            />
          ))}
        </g>

        {/* spiral galaxy, slowly rotating */}
        <g className="gb-spin" style={{ transformOrigin: "1150px 190px" }}>
          <circle cx="1150" cy="190" r="70" fill="url(#gb-core)" />
          {[
            { rx: 60, ry: 22, rot: 20, o: 0.5 },
            { rx: 95, ry: 34, rot: 20, o: 0.35 },
            { rx: 132, ry: 47, rot: 20, o: 0.22 },
            { rx: 170, ry: 60, rot: 20, o: 0.12 },
          ].map((ring, i) => (
            <ellipse
              key={i}
              cx="1150"
              cy="190"
              rx={ring.rx}
              ry={ring.ry}
              transform={`rotate(${ring.rot} 1150 190)`}
              fill="none"
              stroke="#a3e635"
              strokeOpacity={ring.o}
              strokeWidth="0.8"
              strokeDasharray={i % 2 === 0 ? "1 7" : "2 10"}
            />
          ))}
          <circle cx="1150" cy="190" r="3" fill="#f7fee7" />
        </g>

        {/* orbital rings behind the console, with travelling satellites */}
        <g style={{ transformOrigin: "720px 480px" }} className="gb-spin-reverse">
          <circle cx="720" cy="480" r="330" fill="none" stroke="#5eead4" strokeOpacity="0.09" strokeWidth="1" strokeDasharray="3 14" />
          <circle cx="720" cy="480" r="425" fill="none" stroke="#a3e635" strokeOpacity="0.07" strokeWidth="1" strokeDasharray="2 18" />
        </g>
        <g>
          <circle r="2.6" fill="#5eead4" opacity="0.85">
            <animateMotion
              dur="38s"
              repeatCount="indefinite"
              path="M 720,150 A 330,330 0 1,1 719.9,150 Z"
            />
          </circle>
          <circle r="1.9" fill="#a3e635" opacity="0.7">
            <animateMotion
              dur="55s"
              repeatCount="indefinite"
              path="M 720,905 A 425,425 0 1,0 719.9,905 Z"
            />
          </circle>
        </g>

        {/* looping comets riding bezier flight paths */}
        {COMETS.map((comet, i) => (
          <g key={i} style={{ color: comet.color }}>
            <g>
              <animateMotion
                dur={comet.dur}
                begin={comet.delay}
                repeatCount="indefinite"
                rotate="auto"
                path={comet.path}
              />
              <rect
                x={-comet.size * 26}
                y={-comet.size * 0.5}
                width={comet.size * 26}
                height={comet.size}
                rx={comet.size * 0.5}
                fill="url(#gb-trail)"
              />
              <circle r={comet.size} fill={comet.color} />
              <circle r={comet.size * 2.6} fill={comet.color} opacity="0.15" />
            </g>
          </g>
        ))}

        {/* ringed planet with orbiting moon */}
        <g>
          <circle cx="235" cy="640" r="58" fill="url(#gb-planet-glow)" />
          {/* moon: back half of the orbit (drawn behind the planet) */}
          <g transform="rotate(-14 235 640)">
            <ellipse cx="235" cy="640" rx="58" ry="15" fill="none" stroke="#5eead4" strokeOpacity="0.15" strokeWidth="0.7" strokeDasharray="1 5" />
            <circle r="3.2" fill="#a5f3fc">
              <animateMotion dur="16s" repeatCount="indefinite" path="M 177,640 a 58,15 0 1,0 116,0 a 58,15 0 1,0 -116,0" />
              <animate attributeName="opacity" values="1;1;0.15;0.15;1" keyTimes="0;0.35;0.5;0.85;1" dur="16s" repeatCount="indefinite" />
            </circle>
          </g>
          <circle cx="235" cy="640" r="30" fill="url(#gb-planet)" />
          {/* soft surface bands */}
          <clipPath id="gb-planet-clip">
            <circle cx="235" cy="640" r="30" />
          </clipPath>
          <g clipPath="url(#gb-planet-clip)" opacity="0.35">
            <ellipse cx="230" cy="632" rx="38" ry="5" fill="#99f6e4" opacity="0.35" />
            <ellipse cx="242" cy="650" rx="40" ry="6" fill="#134e4a" opacity="0.8" />
          </g>
          {/* rings */}
          <g transform="rotate(-14 235 640)">
            <ellipse cx="235" cy="640" rx="48" ry="11" fill="none" stroke="url(#gb-ring)" strokeWidth="2.2" />
            <ellipse cx="235" cy="640" rx="54" ry="13" fill="none" stroke="url(#gb-ring)" strokeWidth="0.8" opacity="0.6" />
          </g>
        </g>

        {/* alien saucer running its abduction loop */}
        <g transform="translate(408 508)">
          <g className="gb-ufo-bob">
            {/* tractor beam */}
            <polygon points="-9,8 9,8 30,112 -30,112" fill="url(#gb-beam)" className="gb-beam" />
            {/* star being beamed up */}
            <g className="gb-abduct">
              <path
                d="M 0,-6 L 1.7,-1.7 L 6,0 L 1.7,1.7 L 0,6 L -1.7,1.7 L -6,0 L -1.7,-1.7 Z"
                fill="#fef9c3"
              />
            </g>
            {/* pilot in the dome */}
            <path d="M -15,-5 A 15,15 0 0 1 15,-5 Z" fill="#67e8f9" opacity="0.22" />
            <circle cx="0" cy="-13" r="4.6" fill="#86efac" />
            <ellipse cx="-1.7" cy="-13.7" rx="1.1" ry="1.6" fill="#052e16" />
            <ellipse cx="1.7" cy="-13.7" rx="1.1" ry="1.6" fill="#052e16" />
            {/* hull */}
            <ellipse cx="0" cy="0" rx="37" ry="11" fill="url(#gb-hull)" />
            <ellipse cx="0" cy="-2.5" rx="24" ry="5.5" fill="#e2e8f0" opacity="0.14" />
            {/* running lights */}
            {[-24, -8, 8, 24].map((x, i) => (
              <circle
                key={x}
                cx={x}
                cy="5.5"
                r="1.9"
                fill="#a3e635"
                className="gb-lights"
                style={{ animationDelay: `${i * 0.35}s` }}
              />
            ))}
          </g>
        </g>
      </svg>

      {/* vignette so the console pops */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(2,3,10,0.55)_100%)]" />
    </div>
  );
}
