import { describe, expect, it } from 'vitest'
import { groupRangesByBlock } from './groupRanges'

const blocks = [
    { start: 0, end: 5 },
    { start: 7, end: 12 },
    { start: 14, end: 20 },
]

describe('groupRangesByBlock', () => {
    it('returns one empty array per block when there are no matches', () => {
        expect(groupRangesByBlock([], blocks)).toEqual([[], [], []])
    })

    it('returns an empty result when there are no blocks', () => {
        expect(groupRangesByBlock([{ start: 0, end: 3 }], [])).toEqual([])
    })

    it('converts offsets to block-local ones and keeps global ids', () => {
        const matches = [
            { start: 1, end: 3 },
            { start: 8, end: 10 },
            { start: 16, end: 19 },
        ]
        expect(groupRangesByBlock(matches, blocks)).toEqual([
            [{ id: 0, start: 1, end: 3 }],
            [{ id: 1, start: 1, end: 3 }],
            [{ id: 2, start: 2, end: 5 }],
        ])
    })

    it('puts several matches into the same block', () => {
        const matches = [
            { start: 0, end: 2 },
            { start: 3, end: 5 },
        ]
        expect(groupRangesByBlock(matches, blocks)[0]).toEqual([
            { id: 0, start: 0, end: 2 },
            { id: 1, start: 3, end: 5 },
        ])
    })

    it('gives a match that crosses a block boundary to both blocks, with the same id', () => {
        const [a, b, c] = groupRangesByBlock([{ start: 3, end: 9 }], blocks)
        expect(a).toEqual([{ id: 0, start: 3, end: 9 }])
        expect(b).toEqual([{ id: 0, start: -4, end: 2 }])
        expect(c).toEqual([])
    })

    it('does not hand a match to a block it only touches at the edge', () => {
        const touching = [
            { start: 0, end: 5 },
            { start: 5, end: 10 },
        ]
        const result = groupRangesByBlock([{ start: 1, end: 5 }], touching)
        expect(result).toEqual([[{ id: 0, start: 1, end: 5 }], []])
    })
})