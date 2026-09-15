export default function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[150] opacity-[0.05] mix-blend-overlay"
      aria-hidden="true"
    >
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
