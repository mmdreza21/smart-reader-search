import { normalizeWord } from './normalize'

export interface Token {
    raw: string
    norm: string
    start: number
    end: number
}

const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' })

export function tokenize(text: string): Token[] {
    const tokens: Token[] = []

    for (const part of segmenter.segment(text)) {
        if (!part.isWordLike) continue

        for (const match of part.segment.matchAll(/[^'’]+/gu)) {
            const raw = match[0]
            const norm = normalizeWord(raw)
            if (norm === '') continue

            const start = part.index + match.index
            tokens.push({ raw, norm, start, end: start + raw.length })
        }
    }

    return tokens
}
