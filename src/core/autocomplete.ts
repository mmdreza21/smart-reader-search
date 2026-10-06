import type { SearchIndex } from './index'
import { tokenize } from './tokenize'
import { wrapIndex } from './wrapIndex'

export const MAX_SUGGESTIONS = 8

export interface Suggestion {
    word: string
    count: number
}

export interface WordInProgress {
    prefix: string
    start: number
    end: number
}

export function wordInProgress(query: string): WordInProgress | null {
    const last = tokenize(query).at(-1)
    if (!last || last.end !== query.length) return null
    return { prefix: last.norm, start: last.start, end: last.end }
}

export function getSuggestions(
    index: SearchIndex,
    query: string,
    limit: number = MAX_SUGGESTIONS,
): Suggestion[] {
    const word = wordInProgress(query)
    if (!word) return []

    const suggestions = [...index.frequencies]
        .filter(([candidate]) => candidate.startsWith(word.prefix))
        .map(([candidate, count]) => ({ word: candidate, count }))
        .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
        .slice(0, limit)
    if (suggestions.length === 1 && suggestions[0]?.word === word.prefix) return []
    return suggestions
}

export function applySuggestion(query: string, word: string): string {
    const current = wordInProgress(query)
    if (!current) return query
    return query.slice(0, current.start) + word + query.slice(current.end)
}


export function moveHighlight(current: number | null, delta: 1 | -1, length: number): number {
    if (length <= 0) return 0
    if (current === null) return delta === 1 ? 0 : length - 1
    return wrapIndex(current, delta, length)
}
