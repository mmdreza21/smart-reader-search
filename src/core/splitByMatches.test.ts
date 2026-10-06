import { describe, expect, it } from 'vitest'
import { splitByMatches, type MarkRange } from './splitByMatches'

describe('splitByMatches', () => {
    it('returns no segments for empty text', () => {
        expect(splitByMatches('', [])).toEqual([])
        expect(splitByMatches('', [{ id: 0, start: 0, end: 3 }])).toEqual([])
    })

    it('returns one plain segment when there are no ranges', () => {
        expect(splitByMatches('hello', [])).toEqual([{ text: 'hello', markId: null }])
    })

    it('splits around a range in the middle', () => {
        expect(splitByMatches('say hello now', [{ id: 7, start: 4, end: 9 }])).toEqual([
            { text: 'say ', markId: null },
            { text: 'hello', markId: 7 },
            { text: ' now', markId: null },
        ])
    })

    it('handles ranges at the very start and very end', () => {
        expect(
            splitByMatches('abcdef', [
                { id: 0, start: 0, end: 2 },
                { id: 1, start: 4, end: 6 },
            ]),
        ).toEqual([
            { text: 'ab', markId: 0 },
            { text: 'cd', markId: null },
            { text: 'ef', markId: 1 },
        ])
    })

    it('handles a range covering the whole text', () => {
        expect(splitByMatches('abc', [{ id: 3, start: 0, end: 3 }])).toEqual([
            { text: 'abc', markId: 3 },
        ])
    })

    it('does not insert empty plain segments between adjacent ranges', () => {
        expect(
            splitByMatches('abcd', [
                { id: 0, start: 0, end: 2 },
                { id: 1, start: 2, end: 4 },
            ]),
        ).toEqual([
            { text: 'ab', markId: 0 },
            { text: 'cd', markId: 1 },
        ])
    })

    describe('paragraph-boundary matches', () => {
        it('clips a range that starts before the paragraph', () => {
            expect(splitByMatches('world is big', [{ id: 5, start: -4, end: 5 }])).toEqual([
                { text: 'world', markId: 5 },
                { text: ' is big', markId: null },
            ])
        })

        it('clips a range that ends after the paragraph', () => {
            expect(splitByMatches('the end', [{ id: 5, start: 4, end: 12 }])).toEqual([
                { text: 'the ', markId: null },
                { text: 'end', markId: 5 },
            ])
        })

        it('skips ranges that fall completely outside the text', () => {
            const ranges: MarkRange[] = [
                { id: 0, start: -5, end: 0 },
                { id: 1, start: 3, end: 9 },
            ]
            expect(splitByMatches('abc', ranges)).toEqual([{ text: 'abc', markId: null }])
        })
    })

    it('gives the shared part of overlapping ranges to the earlier one', () => {
        expect(
            splitByMatches('abcdef', [
                { id: 0, start: 1, end: 4 },
                { id: 1, start: 3, end: 5 },
            ]),
        ).toEqual([
            { text: 'a', markId: null },
            { text: 'bcd', markId: 0 },
            { text: 'e', markId: 1 },
            { text: 'f', markId: null },
        ])
    })

    it('always reassembles into the original text', () => {
        const text = 'Persian کتاب‌ها and English، mixed.'
        const ranges: MarkRange[] = [
            { id: 0, start: -3, end: 4 },
            { id: 1, start: 8, end: 14 },
            { id: 2, start: 13, end: 20 },
            { id: 3, start: 30, end: 99 },
        ]
        const joined = splitByMatches(text, ranges)
            .map((segment) => segment.text)
            .join('')
        expect(joined).toBe(text)
    })
})