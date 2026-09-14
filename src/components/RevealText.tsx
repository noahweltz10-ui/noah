import type { ElementType } from "react";

type Props = {
  children: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  splitBy?: "line" | "word";
};

/**
 * Wraps text so it can reveal upward from a clipped mask when scrolled into
 * view (powered by the page-wide GlobalReveal observer). `splitBy="word"`
 * staggers each word; `splitBy="line"` (default) reveals the whole block as
 * one line.
 */
export default function RevealText({
  children,
  as: Tag = "span",
  className,
  delay = 0,
  splitBy = "line",
}: Props) {
  const words = children.split(" ");
  const TagEl = Tag as unknown as "div";

  return (
    <TagEl className={className}>
      {splitBy === "word" ? (
        words.map((word, i) => (
          <span
            key={i}
            className="reveal-line"
            data-reveal
            data-reveal-delay={delay + i * 40}
            style={{ marginRight: "0.28em" }}
          >
            <span>{word}</span>
          </span>
        ))
      ) : (
        <span className="reveal-line" data-reveal data-reveal-delay={delay}>
          <span>{children}</span>
        </span>
      )}
    </TagEl>
  );
}
