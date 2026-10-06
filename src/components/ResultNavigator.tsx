import { HintTooltip } from "./HintTooltip";

interface ResultNavigatorProps {
  activeIndex: number | null;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}

export function ResultNavigator({
  activeIndex,
  total,
  onNext,
  onPrev,
}: ResultNavigatorProps) {
  const hasResults = total > 0;

  return (
    <div className="result-navigator">
      <span
        className={`result-navigator__count${hasResults ? "" : " result-navigator__count--empty"}`}
        dir="ltr"
      >
        {hasResults && activeIndex !== null
          ? `${activeIndex + 1} / ${total}`
          : "No results"}
      </span>
      <HintTooltip label="Previous result" shortcut="Shift+Enter">
        <button
          type="button"
          className="result-navigator__button"
          onClick={onPrev}
          disabled={!hasResults}
          aria-label="Previous result"
        >
          ▲
        </button>
      </HintTooltip>
      <HintTooltip label="Next result" shortcut="Enter">
        <button
          type="button"
          className="result-navigator__button"
          onClick={onNext}
          disabled={!hasResults}
          aria-label="Next result"
        >
          ▼
        </button>
      </HintTooltip>
    </div>
  );
}
