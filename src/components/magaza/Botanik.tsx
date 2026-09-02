/**
 * Elle çizilmiş botanik çizgi grafikleri — inline SVG.
 * Dış görsel gerektirmez (~0 KB ağ maliyeti), her ekranda keskin,
 * renk token'ıyla uyumlu. Hero'nun derinlik katmanlarında kullanılır.
 */

export function ZeytinDali({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 106C40 96 74 78 104 54c22-18 42-34 68-42"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {[
        [32, 92, -28],
        [58, 78, -22],
        [84, 62, -18],
        [110, 46, -14],
        [136, 30, -10],
      ].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <ellipse
            cx="0"
            cy="-11"
            rx="6.5"
            ry="12"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path d="M0 -22V0" stroke="currentColor" strokeWidth="1" />
        </g>
      ))}
      {[
        [46, 96],
        [72, 80],
        [98, 64],
      ].map(([x, y], i) => (
        <g key={`b${i}`} transform={`translate(${x} ${y}) rotate(150)`}>
          <ellipse
            cx="0"
            cy="-9"
            rx="5.5"
            ry="10"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path d="M0 -18V0" stroke="currentColor" strokeWidth="1" />
        </g>
      ))}
      <circle cx="120" cy="50" r="5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="150" cy="28" r="4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Adacayi({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 180"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M70 178V26"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 150 - i * 28;
        return (
          <g key={i}>
            <path
              d={`M70 ${y}c-22-4-36-14-42-28 16-6 32-2 42 12`}
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path
              d={`M70 ${y - 10}c22-4 36-14 42-28-16-6-32-2-42 12`}
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </g>
        );
      })}
      <circle cx="70" cy="22" r="6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Damla({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 110"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M40 6c16 26 28 42 28 58a28 28 0 1 1-56 0c0-16 12-32 28-58Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M28 68a12 12 0 0 0 12 12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Papatya({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <ellipse
          key={i}
          cx="60"
          cy="28"
          rx="7"
          ry="20"
          stroke="currentColor"
          strokeWidth="1.3"
          transform={`rotate(${i * 30} 60 60)`}
        />
      ))}
      <circle cx="60" cy="60" r="11" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
