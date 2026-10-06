import { describe, expect, it } from 'vitest'
import { getSuggestions } from '../core/autocomplete'
import { search } from '../core/search'
import { FULL_TEXT, PARAGRAPHS, SEARCH_INDEX } from './sample-text'

function foundTexts(query: string, options = {}): string[] {
    return search(SEARCH_INDEX, query, options).map((m) => FULL_TEXT.slice(m.start, m.end))
}

describe('sample text layout', () => {
    it('has unique paragraph ids', () => {
        expect(new Set(PARAGRAPHS.map((p) => p.id)).size).toBe(PARAGRAPHS.length)
    })

    it('alternates English and Persian paragraphs', () => {
        PARAGRAPHS.forEach((p, i) => {
            expect(/[\u0600-\u06FF]/.test(p.text)).toBe(i % 2 === 1)
        })
    })

    it('places every paragraph at its offset in the full text', () => {
        for (const paragraph of PARAGRAPHS) {
            expect(FULL_TEXT.slice(paragraph.start, paragraph.end)).toBe(paragraph.text)
        }
    })

    it('keeps paragraphs in order without overlap', () => {
        for (let i = 1; i < PARAGRAPHS.length; i++) {
            expect(PARAGRAPHS[i]!.start).toBeGreaterThan(PARAGRAPHS[i - 1]!.end)
        }
    })
})

describe('sample text search', () => {
    it('finds a repeated English word', () => {
        expect(foundTexts('solar')).toHaveLength(42)
    })

    it('is case-insensitive', () => {
        expect(foundTexts('SOLAR')).toEqual(foundTexts('solar'))
    })

    it('finds Persian words', () => {
        expect(foundTexts('اینورتر').length).toBeGreaterThan(0)
    })

    it('treats Arabic ي/ك like Persian ی/ک', () => {
        expect(foundTexts('فتوولتائيك')).toEqual(foundTexts('فتوولتائیک'))
        expect(foundTexts('فتوولتائیک')).toHaveLength(6)
    })

    it('finds a word with ZWNJ typed without it', () => {
        const results = foundTexts('میتواند')
        expect(results.length).toBeGreaterThan(0)
        expect(results.every((text) => text === 'می\u200Cتواند')).toBe(true)
    })

    it('finds English and Persian phrases', () => {
        expect(foundTexts('solar panel')).toHaveLength(10)
        expect(foundTexts('پنل خورشیدی')).toHaveLength(2)
    })

    it('whole-word mode is stricter than prefix mode', () => {
        expect(foundTexts('خورشید')).toHaveLength(49)
        expect(foundTexts('خورشید', { wholeWord: true })).toHaveLength(10)
    })

    it('gives autocomplete suggestions with frequencies', () => {
        const [first] = getSuggestions(SEARCH_INDEX, 'so', 4)
        expect(first).toEqual({ word: 'solar', count: 42 })
    })

    it('reports a frequency equal to the number of exact matches', () => {
        expect(SEARCH_INDEX.frequencies.get('solar')).toBe(
            foundTexts('solar', { wholeWord: true }).length,
        )
    })
})
