import { useMemo } from "react";
import { groupRangesByBlock } from "../core/groupRanges";
import type { Match } from "../core/search";
import { PARAGRAPHS } from "../data/sample-text";
import { Paragraph } from "./Paragraph";

interface ReaderProps {
  matches: readonly Match[];
  activeIndex: number | null;
}

export function Reader({ matches, activeIndex }: ReaderProps) {
  const rangesByParagraph = useMemo(
    () => groupRangesByBlock(matches, PARAGRAPHS),
    [matches],
  );

  return (
    <article className="reader">
      {PARAGRAPHS.map((paragraph, i) => {
        const ranges = rangesByParagraph[i] ?? [];
        const hasActive =
          activeIndex !== null &&
          ranges.some((range) => range.id === activeIndex);
        return (
          <Paragraph
            key={paragraph.id}
            paragraph={paragraph}
            ranges={ranges}
            activeId={hasActive ? activeIndex : null}
          />
        );
      })}
    </article>
  );
}
