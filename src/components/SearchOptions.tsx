import * as ToggleGroup from "@radix-ui/react-toggle-group";

interface SearchOptionsProps {
  wholeWord: boolean;
  onWholeWordChange: (value: boolean) => void;
}

const WHOLE_WORD = "wholeWord";

export function SearchOptions({
  wholeWord,
  onWholeWordChange,
}: SearchOptionsProps) {
  return (
    <ToggleGroup.Root
      type="multiple"
      className="search-options"
      aria-label="Search options"
      value={wholeWord ? [WHOLE_WORD] : []}
      onValueChange={(values) => onWholeWordChange(values.includes(WHOLE_WORD))}
    >
      <ToggleGroup.Item value={WHOLE_WORD} className="search-options__item">
        Whole word
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}
