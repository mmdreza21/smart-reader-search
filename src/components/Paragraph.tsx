import { memo } from "react";
import { splitByMatches, type MarkRange } from "../core/splitByMatches";
import type { Paragraph as ParagraphData } from "../data/sample-text";

interface ParagraphProps {
  paragraph: ParagraphData;
  ranges: readonly MarkRange[];
  activeId: number | null;
}

export const Paragraph = memo(function Paragraph({
  paragraph,
  ranges,
  activeId,
}: ParagraphProps) {
  const segments = splitByMatches(paragraph.text, ranges);

  return (
    <p id={paragraph.id} className="reader__paragraph" dir="auto">
      {segments.map((segment, i) =>
        segment.markId === null ? (
          segment.text
        ) : (
          <mark
            key={i}
            data-active={segment.markId === activeId ? "" : undefined}
          >
            {segment.text}
          </mark>
        ),
      )}
    </p>
  );
});
