import Image from "next/image";

const ASPECT = 897 / 1024;

/**
 * The shift culture star mark. Pure black source asset — never recolored or
 * reshaped, only ever resized and (via LogoBadge) given a light backdrop so
 * it stays visible on dark sections.
 */
export function LogoMark({
  width = 28,
  className = "",
  priority = false,
}: {
  width?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/shift-culture-logo-transparent.png"
      alt="shift culture"
      width={1024}
      height={897}
      style={{ width, height: width * ASPECT }}
      className={className}
      priority={priority}
    />
  );
}

export function LogoBadge({
  width = 20,
  padding = 9,
  className = "",
}: {
  width?: number;
  padding?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-paper ${className}`}
      style={{ padding }}
    >
      <LogoMark width={width} />
    </span>
  );
}
