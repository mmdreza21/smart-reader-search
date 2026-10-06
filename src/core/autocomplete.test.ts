import { describe, expect, it } from 'vitest'
import {
    applySuggestion,
    getSuggestions,
    moveHighlight,
    wordInProgress,
} from './autocomplete'
import { buildIndex } from './index'

const index = buildIndex('search search search seat seat sea the')

describe('wordInProgress', () => {
    it('returns null for an empty query', () => {
        expect(wordInProgress('')).toBeNull()
    })

    it('returns the last word with its original offsets', () => {
        expect(wordInProgress('new yo')).toEqual({ prefix: 'yo', start: 4, end: 6 })
    })

    it('normalizes the prefix but keeps original offsets', () => {
        expect(wordInProgress('Hello')).toEqual({ prefix: 'hello', start: 0, end: 5 })

        const query = 'من می\u200Cخ'
        const word = wordInProgress(query)
        expect(word?.prefix).toBe('میخ')
        expect(word?.start).toBe(3)
        expect(word?.end).toBe(query.length)
    })

    it('returns null once the word is finished by a space or punctuation', () => {
        expect(wordInProgress('hello ')).toBeNull()
        expect(wordInProgress('hello,')).toBeNull()
        expect(wordInProgress('سلام ')).toBeNull()
    })
})

describe('getSuggestions', () => {
    it('suggests words for the last word, most frequent first', () => {
        expect(getSuggestions(index, 'sea')).toEqual([
            { word: 'search', count: 3 },
            { word: 'seat', count: 2 },
            { word: 'sea', count: 1 },
        ])
    })

    it('ignores earlier words in the query', () => {
        expect(getSuggestions(index, 'the sea')).toEqual(getSuggestions(index, 'sea'))
    })

    it('ignores case', () => {
        expect(getSuggestions(index, 'SEA')).toEqual(getSuggestions(index, 'sea'))
    })

    it('respects the limit', () => {
        expect(getSuggestions(index, 'sea', 2)).toHaveLength(2)
    })

    it('returns nothing for an empty query, a finished word, or an unknown prefix', () => {
        expect(getSuggestions(index, '')).toEqual([])
        expect(getSuggestions(index, 'sea ')).toEqual([])
        expect(getSuggestions(index, 'xyz')).toEqual([])
    })

    it('hides a lone suggestion that equals what is typed', () => {
        expect(getSuggestions(buildIndex('sea'), 'sea')).toEqual([])
        expect(getSuggestions(buildIndex('seat'), 'sea')).toEqual([{ word: 'seat', count: 1 }])
    })
})

describe('applySuggestion', () => {
    it('replaces the word in progress', () => {
        expect(applySuggestion('sea', 'search')).toBe('search')
    })

    it('keeps the earlier part of the query exactly as typed', () => {
        expect(applySuggestion('Hello  Wor', 'world')).toBe('Hello  world')
    })

    it('leaves the query alone when no word is in progress', () => {
        expect(applySuggestion('hello ', 'world')).toBe('hello ')
        expect(applySuggestion('', 'world')).toBe('')
    })
})

describe('moveHighlight', () => {
    it('starts at the first item on Down and the last on Up', () => {
        expect(moveHighlight(null, 1, 5)).toBe(0)
        expect(moveHighlight(null, -1, 5)).toBe(4)
    })

    it('moves and wraps in both directions', () => {
        expect(moveHighlight(1, 1, 5)).toBe(2)
        expect(moveHighlight(4, 1, 5)).toBe(0)
        expect(moveHighlight(0, -1, 5)).toBe(4)
    })

    it('returns 0 for an empty list', () => {
        expect(moveHighlight(null, 1, 0)).toBe(0)
    })
})
