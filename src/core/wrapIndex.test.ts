import { describe, expect, it } from 'vitest'
import { wrapIndex } from './wrapIndex'

describe('wrapIndex', () => {
    it('moves forward and backward inside the list', () => {
        expect(wrapIndex(2, 1, 5)).toBe(3)
        expect(wrapIndex(2, -1, 5)).toBe(1)
    })

    it('wraps from the last item to the first', () => {
        expect(wrapIndex(4, 1, 5)).toBe(0)
    })

    it('wraps from the first item to the last', () => {
        expect(wrapIndex(0, -1, 5)).toBe(4)
    })

    it('stays on the only item in a one-item list', () => {
        expect(wrapIndex(0, 1, 1)).toBe(0)
        expect(wrapIndex(0, -1, 1)).toBe(0)
    })

    it('returns 0 for an empty list', () => {
        expect(wrapIndex(0, 1, 0)).toBe(0)
        expect(wrapIndex(3, -1, 0)).toBe(0)
    })

    it('still lands inside the list when the index is stale', () => {
        expect(wrapIndex(20, 1, 12)).toBe(9)
    })
})