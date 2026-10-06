const LETTER_MAP: Readonly<Record<string, string>> = {
    '\u064A': '\u06CC', // ي (Arabic yeh)      → ی (Persian yeh)
    '\u0649': '\u06CC', // ى (alef maksura)    → ی
    '\u0643': '\u06A9', // ك (Arabic kaf)      → ک (Persian kaf)
}

const IGNORED_CHARS = /[\u064B-\u065F\u0670\u0640\u200C]/g

const VARIANT_LETTERS = /[\u064A\u0649\u0643]/g

const NON_LATIN_DIGITS = /[\u06F0-\u06F9\u0660-\u0669]/g


export function normalizeWord(word: string): string {
    return word
        .replace(IGNORED_CHARS, '')
        .replace(VARIANT_LETTERS, (char) => LETTER_MAP[char] ?? char)
        .replace(NON_LATIN_DIGITS, (digit) => String(digit.charCodeAt(0) & 0xf))
        .toLowerCase()
}