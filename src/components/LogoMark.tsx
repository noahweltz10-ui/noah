import Image from "next/image";

const ASPECT = 574 / 648;

/**
 * The shift culture star mark, pre-composited with a white outline (a
 * dilated-alpha halo baked into the PNG, not a filled circle) so it reads
 * on both dark and light sections. The source shape and color are never
 * altered — only resized.
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
      src="/brand/shift-culture-logo-outlined.png"
      alt="shift culture"
      width={648}
      height={574}
      style={{ width, height: width * ASPECT }}
      className={className}
      priority={priority}
    />
  );
}
