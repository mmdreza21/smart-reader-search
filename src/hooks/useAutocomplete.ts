import { useCallback, useMemo, useState } from 'react'
import { applySuggestion, getSuggestions, moveHighlight, type Suggestion } from '../core/autocomplete'
import { SEARCH_INDEX } from '../data/sample-text'

const NO_SUGGESTIONS: Suggestion[] = []

interface UseAutocompleteResult {
    suggestions: Suggestion[]
    isOpen: boolean
    highlightedIndex: number | null
    select: (suggestion: Suggestion) => void
    handleKey: (key: string) => boolean
}

export function useAutocomplete(
    query: string,
    onQueryChange: (query: string) => void,
): UseAutocompleteResult {
    const [dismissedFor, setDismissedFor] = useState<string | null>(null)
    const [highlight, setHighlight] = useState<{ query: string; index: number } | null>(null)

    const candidates = useMemo(() => getSuggestions(SEARCH_INDEX, query), [query])

    const isOpen = candidates.length > 0 && dismissedFor !== query
    const suggestions = isOpen ? candidates : NO_SUGGESTIONS
    const highlightedIndex = isOpen && highlight?.query === query ? highlight.index : null

    const select = useCallback(
        (suggestion: Suggestion) => {
            const next = applySuggestion(query, suggestion.word)
            setDismissedFor(next)
            onQueryChange(next)
        },
        [query, onQueryChange],
    )

    const handleKey = useCallback(
        (key: string): boolean => {
            if (!isOpen) return false

            switch (key) {
                case 'ArrowDown':
                case 'ArrowUp': {
                    const delta = key === 'ArrowDown' ? 1 : -1
                    setHighlight({ query, index: moveHighlight(highlightedIndex, delta, suggestions.length) })
                    return true
                }
                case 'Escape':
                    setDismissedFor(query)
                    return true
                case 'Enter': {
                    const chosen = highlightedIndex === null ? undefined : suggestions[highlightedIndex]
                    if (!chosen) return false
                    select(chosen)
                    return true
                }
                default:
                    return false
            }
        },
        [isOpen, query, highlightedIndex, suggestions, select],
    )

    return { suggestions, isOpen, highlightedIndex, select, handleKey }
}
