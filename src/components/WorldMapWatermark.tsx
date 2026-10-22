import { cx } from "@/lib/utils";

/**
 * Compact Trinidad → St Lucia watermark.
 * One SVG so island positions and the flight path stay aligned.
 */
export function WorldMapWatermark({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden text-lilac-deep",
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 320 170"
        className="h-[52%] w-[88%] max-h-[9.5rem] opacity-[0.32]"
        fill="none"
      >
        {/* Trinidad (SW) */}
        <image
          href="/images/trinidad.png"
          x="8"
          y="78"
          width="118"
          height="74"
          preserveAspectRatio="xMidYMid meet"
          className="mix-blend-multiply"
        />
        <text
          x="67"
          y="164"
          textAnchor="middle"
          fill="currentColor"
          fontSize="7"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.14em"
          opacity="0.85"
        >
          TRINIDAD
        </text>

        {/*
          St Lucia asset has the tip at the top; rotate 180° so tip = south.
          Pivot = center of the image box (252 + 28, 18 + 48) = (280, 66)
        */}
        <g transform="rotate(180 280 66)">
          <image
            href="/images/st-lucia.jpg"
            x="252"
            y="18"
            width="56"
            height="96"
            preserveAspectRatio="xMidYMid meet"
            className="mix-blend-multiply"
          />
        </g>
        <text
          x="280"
          y="14"
          textAnchor="middle"
          fill="currentColor"
          fontSize="7"
          fontFamily="system-ui, sans-serif"
          letterSpacing="0.14em"
          opacity="0.85"
        >
          ST LUCIA
        </text>

        {/* Path from Trinidad NE → St Lucia SW */}
        <path
          d="M 122 100 C 168 62, 218 48, 252 70"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeDasharray="3.5 3"
          opacity="0.9"
        />
        <circle cx="122" cy="100" r="2.2" fill="currentColor" />
        <circle cx="252" cy="70" r="2.2" fill="currentColor" />

        <g transform="translate(188 68) rotate(-28)" opacity="0.95">
          <path d="M-1.5 0 L11 0 L8.5 -2.2 L11 0 L8.5 2.2 Z" fill="currentColor" />
          <path
            d="M4 0 L7 -4.2 M4 0 L7 4.2"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
