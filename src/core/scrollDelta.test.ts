import { describe, expect, it } from 'vitest'
import { scrollDeltaToCenter } from './scrollDelta'

describe('scrollDeltaToCenter', () => {
    it('is 0 when the element is already centered', () => {
        expect(scrollDeltaToCenter(440, 20, 800, 100)).toBe(0)
    })

    it('is positive (scroll down) for an element below the center', () => {
        expect(scrollDeltaToCenter(600, 20, 800, 100)).toBe(160)
    })

    it('is negative (scroll up) for an element above the center', () => {
        expect(scrollDeltaToCenter(0, 20, 800, 100)).toBe(-440)
    })

    it('centers in the whole viewport when there is no header', () => {
        expect(scrollDeltaToCenter(440, 20, 800, 0)).toBe(50)
    })

    it('accounts for the element height', () => {
        expect(scrollDeltaToCenter(400, 100, 800, 0)).toBe(50)
    })
})