import type { ElementType } from "react";

type Props = {
  children: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  splitBy?: "line" | "word" | "char";
};

/**
 * Wraps text so it can reveal upward from a clipped mask when scrolled into
 * view (powered by the page-wide GlobalReveal observer). `splitBy="char"`
 * cascades letter by letter, `"word"` staggers each word, and `"line"`
 * (default) reveals the whole block as one line — pick a different one per
 * section so the motion doesn't feel identical everywhere.
 */
export default function RevealText({
  children,
  as: Tag = "span",
  className,
  delay = 0,
  splitBy = "line",
}: Props) {
  const TagEl = Tag as unknown as "div";

  if (splitBy === "line") {
    return (
      <TagEl className={className}>
        <span className="reveal-line" data-reveal data-reveal-delay={delay}>
          <span>{children}</span>
        </span>
      </TagEl>
    );
  }

  if (splitBy === "char") {
    return (
      <TagEl className={className}>
        {children.split("").map((char, i) => (
          <span
            key={i}
            className="reveal-line"
            data-reveal
            data-reveal-delay={delay + i * 22}
          >
            <span>{char === " " ? " " : char}</span>
          </span>
        ))}
      </TagEl>
    );
  }

  return (
    <TagEl className={className}>
      {children.split(" ").map((word, i) => (
        <span
          key={i}
          className="reveal-line"
          data-reveal
          data-reveal-delay={delay + i * 40}
          style={{ marginRight: "0.28em" }}
        >
          <span>{word}</span>
        </span>
      ))}
    </TagEl>
  );
}
