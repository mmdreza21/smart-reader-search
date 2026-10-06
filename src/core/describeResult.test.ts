import { describe, expect, it } from 'vitest'
import { describeResult } from './describeResult'

describe('describeResult', () => {
    it('announces nothing without a query', () => {
        expect(describeResult(null, 0, false)).toBe('')
        expect(describeResult(0, 5, false)).toBe('')
    })

    it('announces "No results" for a query without matches', () => {
        expect(describeResult(null, 0, true)).toBe('No results')
    })

    it('announces a 1-based position and the total', () => {
        expect(describeResult(0, 12, true)).toBe('Result 1 of 12')
        expect(describeResult(2, 12, true)).toBe('Result 3 of 12')
    })
})