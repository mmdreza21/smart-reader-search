import { describe, expect, it } from 'vitest'
import { FULL_TEXT, SEARCH_INDEX } from '../data/sample-text'
import { buildIndex } from './index'
import { search, type Match } from './search'

/** Runs a search and returns the matched text, which is easier to read than offsets. */
function found(text: string, query: string, wholeWord = false): string[] {
    const matches = search(buildIndex(text), query, { wholeWord })
    return matches.map((m) => text.slice(m.start, m.end))
}

describe('search: empty queries', () => {
    const index = buildIndex('hello world')

    it('returns nothing for empty, whitespace or punctuation-only queries', () => {
        expect(search(index, '')).toEqual([])
        expect(search(index, '   ')).toEqual([])
        expect(search(index, '...،؟')).toEqual([])
    })
})

describe('search: single word', () => {
    it('finds exact words with offsets and token indexes', () => {
        const text = 'the cat sat on the mat'
        expect(search(buildIndex(text), 'the')).toEqual([
            { start: 0, end: 3, tokenIndex: 0 },
            { start: 15, end: 18, tokenIndex: 4 },
        ])
    })

    it('matches by prefix', () => {
        expect(found('cat category catalog dog', 'cat')).toEqual(['cat', 'category', 'catalog'])
    })

    it('does not match in the middle of a word', () => {
        expect(found('concatenate', 'cat')).toEqual([])
    })

    it('ignores case in text and query', () => {
        expect(found('Apple apple APPLE', 'aPpLe')).toEqual(['Apple', 'apple', 'APPLE'])
    })

    it('treats Persian/Arabic spelling variants as equal', () => {
        expect(found('كتاب کتابخانه', 'کتاب')).toEqual(['كتاب', 'کتابخانه'])
    })

    it('returns nothing when no word matches', () => {
        expect(found('the cat', 'dog')).toEqual([])
    })

    it('sorts matches by position even when prefixes match different words', () => {
        const text = 'apple apricot apple apex'
        const matches = search(buildIndex(text), 'ap')
        expect(matches.map((m) => text.slice(m.start, m.end))).toEqual([
            'apple', 'apricot', 'apple', 'apex',
        ])
    })

    describe('wholeWord', () => {
        it('only matches complete words', () => {
            expect(found('cat category', 'cat', true)).toEqual(['cat'])
        })

        it('returns nothing when only longer words exist', () => {
            expect(found('category', 'cat', true)).toEqual([])
        })
    })
})

describe('search: phrase', () => {
    it('matches adjacent words across paragraph documents', () => {
        const matches = search(buildIndex(['new', 'york']), 'new york')

        expect(matches).toEqual([{ start: 0, end: 9, tokenIndex: 0 }])
    })

    it('matches consecutive words, with the last word as a prefix', () => {
        const text = 'new york and New Yorker visit new jersey'
        expect(found(text, 'new york')).toEqual(['new york', 'New Yorker'])
    })

    it('requires the last word to be whole with wholeWord', () => {
        const text = 'new york and New Yorker visit new jersey'
        expect(found(text, 'new york', true)).toEqual(['new york'])
    })

    it('requires earlier words to match exactly', () => {
        expect(found('newer york', 'new york')).toEqual([])
        expect(found('new yorker', 'ne yorker')).toEqual([])
    })

    it('spans punctuation and whitespace between words', () => {
        expect(found('Say hello,   world!', '  hello world ')).toEqual(['hello,   world'])
    })

    it('supports phrases of three or more words', () => {
        const text = 'to be or not to be'
        expect(found(text, 'to be or')).toEqual(['to be or'])
        expect(search(buildIndex(text), 'to be').map((m) => m.tokenIndex)).toEqual([0, 4])
    })

    it('returns nothing when the phrase runs past the end of the text', () => {
        expect(found('the end', 'end of')).toEqual([])
        expect(found('a b', 'b c')).toEqual([])
    })

    it('returns nothing when words exist but are not adjacent', () => {
        expect(found('new big york', 'new york')).toEqual([])
    })

    it('works across scripts', () => {
        expect(found('من React را دوست دارم', 'react را')).toEqual(['React را'])
    })
})

describe('search: overlapping phrase matches', () => {
    it('keeps the first of overlapping matches', () => {
        const text = 'a a a a a'
        const matches = search(buildIndex(text), 'a a')
        expect(matches.map((m) => m.tokenIndex)).toEqual([0, 2])
    })

    it('handles a run that is shorter than two matches', () => {
        expect(search(buildIndex('ab ab ab'), 'ab ab')).toHaveLength(1)
    })
})

describe('search: sample data result invariants', () => {
    const queries = [
        'solar',
        'solar panel',
        'photovoltaic system',
        'پنل خورشیدی',
        'فتوولتائيك',
        'میتواند',
        'energy storage',
    ]

    it.each(queries)('"%s" gives sorted, non-overlapping, in-bounds matches', (query) => {
        const matches: Match[] = search(SEARCH_INDEX, query)

        for (const match of matches) {
            expect(match.start).toBeGreaterThanOrEqual(0)
            expect(match.end).toBeGreaterThan(match.start)
            expect(match.end).toBeLessThanOrEqual(FULL_TEXT.length)
            expect(FULL_TEXT.slice(match.start, match.end)).not.toBe('')
        }
        for (let i = 1; i < matches.length; i++) {
            expect(matches[i]!.start).toBeGreaterThanOrEqual(matches[i - 1]!.end)
        }
    })
})
