import { describe, expect, it } from 'vitest'
import { buildIndex } from './index'

describe('buildIndex', () => {
    it('keeps tokens in reading order and counts normalized terms', () => {
        const index = buildIndex('the cat and The dog and the bird')

        expect(index.tokens.map((token) => token.norm)).toEqual([
            'the', 'cat', 'and', 'the', 'dog', 'and', 'the', 'bird',
        ])
        expect(index.frequencies.get('the')).toBe(3)
        expect(index.frequencies.get('and')).toBe(2)
        expect(index.frequencies.has('fish')).toBe(false)
    })

    it('indexes one document per paragraph', () => {
        const index = buildIndex(['solar panel', 'پنل خورشیدی'])

        expect(index.engine.documentCount).toBe(2)
        expect(index.paragraphs.map((paragraph) => paragraph.start)).toEqual([0, 13])
    })

    it('treats spelling variants as the same term', () => {
        const index = buildIndex('كتاب کتاب')

        expect(index.frequencies.get('کتاب')).toBe(2)
    })

    it('returns an empty index for empty text', () => {
        const index = buildIndex('')

        expect(index.tokens).toEqual([])
        expect(index.frequencies.size).toBe(0)
        expect(index.engine.termCount).toBe(0)
    })
})
