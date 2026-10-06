import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import { search, type Match } from '../core/search'
import { wrapIndex } from '../core/wrapIndex'
import { SEARCH_INDEX } from '../data/sample-text'

interface UseSearchResult {
    query: string
    setQuery: (query: string) => void
    wholeWord: boolean
    setWholeWord: (wholeWord: boolean) => void
    matches: Match[]
    hasQuery: boolean
    activeIndex: number | null
    next: () => void
    prev: () => void
}

export function useSearch(): UseSearchResult {
    const [query, setQueryState] = useState('')
    const [wholeWord, setWholeWordState] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    const deferredQuery = useDeferredValue(query)
    const matches = useMemo(
        () => search(SEARCH_INDEX, deferredQuery, { wholeWord }),
        [deferredQuery, wholeWord],
    )

    const setQuery = useCallback((next: string) => {
        setQueryState(next)
        setActiveIndex(0)
    }, [])

    const setWholeWord = useCallback((next: boolean) => {
        setWholeWordState(next)
        setActiveIndex(0)
    }, [])

    const total = matches.length
    const next = useCallback(() => setActiveIndex((i) => wrapIndex(i, 1, total)), [total])
    const prev = useCallback(() => setActiveIndex((i) => wrapIndex(i, -1, total)), [total])

    return {
        query,
        setQuery,
        wholeWord,
        setWholeWord,
        matches,
        hasQuery: deferredQuery.trim() !== '',
        activeIndex: total > 0 ? Math.min(activeIndex, total - 1) : null,
        next,
        prev,
    }
}
