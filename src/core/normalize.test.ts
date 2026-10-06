import { describe, expect, it } from 'vitest'
import { normalizeWord } from './normalize'

describe('normalizeWord', () => {
    describe('Arabic letter variants', () => {
        it('maps Arabic yeh to Persian yeh', () => {
            expect(normalizeWord('\u0639\u0644\u064A')).toBe('\u0639\u0644\u06CC')
        })

        it('maps alef maksura to Persian yeh', () => {
            expect(normalizeWord('\u0645\u0648\u0633\u0649')).toBe('\u0645\u0648\u0633\u06CC')
        })

        it('maps Arabic kaf to Persian kaf', () => {
            expect(normalizeWord('\u0643\u062A\u0627\u0628')).toBe('\u06A9\u062A\u0627\u0628')
        })

        it('makes Arabic and Persian spellings equal', () => {
            expect(normalizeWord('كتاب')).toBe(normalizeWord('کتاب'))
            expect(normalizeWord('علي')).toBe(normalizeWord('علی'))
        })
    })

    describe('ignored characters', () => {
        it('removes diacritics', () => {
            expect(normalizeWord('\u0645\u064F\u062D\u064E\u0645\u0651\u064E\u062F')).toBe('محمد')
        })

        it('removes tatweel', () => {
            expect(normalizeWord('سل\u0640\u0640\u0640ام')).toBe('سلام')
        })

        it('removes zero-width non-joiner', () => {
            expect(normalizeWord('می\u200Cخواهم')).toBe('میخواهم')
        })
    })

    describe('digits', () => {
        it('converts Persian digits', () => {
            expect(normalizeWord('۱۲۳۴۵۶۷۸۹۰')).toBe('1234567890')
        })

        it('converts Arabic-Indic digits', () => {
            expect(normalizeWord('١٢٣٤٥٦٧٨٩٠')).toBe('1234567890')
        })

        it('keeps Latin digits and handles mixed digit styles', () => {
            expect(normalizeWord('12۳٤')).toBe('1234')
        })
    })

    describe('English', () => {
        it('lowercases', () => {
            expect(normalizeWord('Hello')).toBe('hello')
            expect(normalizeWord('TypeScript')).toBe('typescript')
        })
    })

    describe('edge cases', () => {
        it('returns an empty string for an empty string', () => {
            expect(normalizeWord('')).toBe('')
        })

        it('handles mixed scripts in one token', () => {
            expect(normalizeWord('React۱۹')).toBe('react19')
        })

        it('is idempotent', () => {
            const word = 'كِتـــاب۱'
            const once = normalizeWord(word)
            expect(normalizeWord(once)).toBe(once)
        })
    })
})