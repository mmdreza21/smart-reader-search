import type { Suggestion } from "../core/autocomplete";
import { optionId } from "./optionId";

interface SuggestionsProps {
  id: string;
  suggestions: readonly Suggestion[];
  prefix: string;
  highlightedIndex: number | null;
  onSelect: (suggestion: Suggestion) => void;
}

export function Suggestions({
  id,
  suggestions,
  prefix,
  highlightedIndex,
  onSelect,
}: SuggestionsProps) {
  return (
    <ul
      id={id}
      className="suggestions"
      role="listbox"
      aria-label="Suggestions"
      onMouseDown={(event) => event.preventDefault()}
    >
      {suggestions.map((suggestion, i) => (
        <li
          key={suggestion.word}
          id={optionId(id, i)}
          className="suggestions__option"
          role="option"
          dir="auto"
          aria-selected={i === highlightedIndex}
          aria-label={`${suggestion.word}, ${suggestion.count} occurrences`}
          onClick={() => onSelect(suggestion)}
        >
          <span className="suggestions__word" dir="auto">
            <strong>{suggestion.word.slice(0, prefix.length)}</strong>
            {suggestion.word.slice(prefix.length)}
          </span>
          <span className="suggestions__count" dir="ltr" aria-hidden="true">
            {suggestion.count}
          </span>
        </li>
      ))}
    </ul>
  );
}
