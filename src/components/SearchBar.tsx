import { useId, useRef, useState, type KeyboardEvent } from "react";
import { wordInProgress } from "../core/autocomplete";
import { useAutocomplete } from "../hooks/useAutocomplete";
import { optionId } from "./optionId";
import { Suggestions } from "./Suggestions";
import { HintTooltip } from "./HintTooltip";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function SearchBar({ value, onChange, onNext, onPrev }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const [isFocused, setIsFocused] = useState(false);
  const autocomplete = useAutocomplete(value, onChange);

  const isExpanded = isFocused && autocomplete.isOpen;
  const { highlightedIndex } = autocomplete;

  function clear() {
    onChange("");
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;

    if (isExpanded && autocomplete.handleKey(event.key)) {
      event.preventDefault();
      return;
    }

    if (event.key !== "Enter") return;
    event.preventDefault();
    if (event.shiftKey) onPrev();
    else onNext();
  }

  return (
    <div className="search-bar">
      <input
        ref={inputRef}
        className="search-bar__input"
        type="text"
        dir="auto"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isExpanded}
        aria-controls={isExpanded ? listboxId : undefined}
        aria-activedescendant={
          isExpanded && highlightedIndex !== null
            ? optionId(listboxId, highlightedIndex)
            : undefined
        }
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search…  جستجو"
        aria-label="Search in text"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      {value !== "" && (
        <HintTooltip label="Clear">
          <button
            type="button"
            className="search-bar__clear"
            onClick={clear}
            aria-label="Clear search"
          >
            ×
          </button>
        </HintTooltip>
      )}
      {isExpanded && (
        <Suggestions
          id={listboxId}
          suggestions={autocomplete.suggestions}
          prefix={wordInProgress(value)?.prefix ?? ""}
          highlightedIndex={highlightedIndex}
          onSelect={autocomplete.select}
        />
      )}
    </div>
  );
}
