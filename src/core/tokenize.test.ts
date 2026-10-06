import { describe, expect, it } from 'vitest'
import { tokenize } from './tokenize'

describe('tokenize', () => {
    it('returns an empty array for empty or punctuation-only text', () => {
        expect(tokenize('')).toEqual([])
        expect(tokenize('  ...،؟! ')).toEqual([])
    })

    it('splits English words and records offsets', () => {
        expect(tokenize('Hello, world!')).toEqual([
            { raw: 'Hello', norm: 'hello', start: 0, end: 5 },
            { raw: 'world', norm: 'world', start: 7, end: 12 },
        ])
    })

    it('splits Persian words on spaces and Persian punctuation', () => {
        const tokens = tokenize('سلام، دنیا؟')
        expect(tokens.map((t) => t.raw)).toEqual(['سلام', 'دنیا'])
    })

    it('keeps ZWNJ inside a word', () => {
        const tokens = tokenize('من می\u200Cخواهم')
        expect(tokens).toHaveLength(2)
        expect(tokens[1]?.raw).toBe('می\u200Cخواهم')
        expect(tokens[1]?.norm).toBe('میخواهم')
    })

    it('keeps tatweel and diacritics inside a word', () => {
        const tokens = tokenize('سل\u0640\u0640ام مُحَمَّد')
        expect(tokens.map((t) => t.norm)).toEqual(['سلام', 'محمد'])
    })

    it('normalizes Arabic variants and digits into norm only', () => {
        const [token] = tokenize('كتاب۱۲')
        expect(token?.raw).toBe('كتاب۱۲')
        expect(token?.norm).toBe('کتاب12')
    })

    it('skips runs that normalize to an empty string', () => {
        expect(tokenize('a \u200C\u200C b')).toHaveLength(2)
        expect(tokenize('\u0640\u0640')).toEqual([])
    })

    it('splits on hyphens and apostrophes', () => {
        expect(tokenize("state-of-the-art don't they’re").map((t) => t.raw)).toEqual([
            'state', 'of', 'the', 'art', 'don', 't', 'they', 're',
        ])
    })

    it('handles mixed Persian and English text', () => {
        const tokens = tokenize('من React را دوست دارم 19')
        expect(tokens.map((t) => t.norm)).toEqual(['من', 'react', 'را', 'دوست', 'دارم', '19'])
    })

    it('keeps offsets valid for the original text (slice === raw)', () => {
        const samples = [
            'Hello, world!',
            'سلام، دنیا؟ می\u200Cخواهم كتاب۱۲ را',
            'مُحَمَّد سل\u0640\u0640ام — React 19 is great.',
            'line one\nخط دوم\n\nthird',
            ' emoji then text',
        ]

        for (const text of samples) {
            for (const token of tokenize(text)) {
                expect(text.slice(token.start, token.end)).toBe(token.raw)
            }
        }
    })

    it('returns tokens in increasing, non-overlapping order', () => {
        const tokens = tokenize('یک دو سه four five six')
        for (let i = 1; i < tokens.length; i++) {
            expect(tokens[i]!.start).toBeGreaterThanOrEqual(tokens[i - 1]!.end)
        }
    })
})
