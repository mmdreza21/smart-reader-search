import type { SearchIndex } from './index'
import { tokenize } from './tokenize'

export interface Match {
    start: number
    end: number
    tokenIndex: number
}

export interface SearchOptions {
    wholeWord?: boolean
}

export function search(
    index: SearchIndex,
    query: string,
    options: SearchOptions = {},
): Match[] {
    const queryTokens = tokenize(query)
    const words = queryTokens.map((token) => token.norm)
    if (words.length === 0) return []

    const wholeWord = options.wholeWord ?? false
    const candidates = new Set(
        index.engine
            .search(words.length === 1 ? query : queryTokens[0]!.raw, {
                prefix: words.length === 1 && !wholeWord,
                combineWith: 'AND',
            })
            .map((result) => Number(result.id)),
    )
    const matches: Match[] = []

    for (const paragraph of index.paragraphs) {
        if (!candidates.has(paragraph.id)) continue

        for (let offset = 0; offset < paragraph.tokens.length; offset++) {
            if (!matchesAt(index, paragraph.tokenStart + offset, words, wholeWord)) continue
            const first = index.tokens[paragraph.tokenStart + offset]!
            const last = index.tokens[paragraph.tokenStart + offset + words.length - 1]!
            matches.push({ start: first.start, end: last.end, tokenIndex: paragraph.tokenStart + offset })
        }
    }

    return dropOverlaps(matches)
}

function matchesAt(
    index: SearchIndex,
    start: number,
    words: string[],
    wholeWord: boolean,
): boolean {
    return words.every((word, offset) => {
        const norm = index.tokens[start + offset]?.norm
        if (norm === undefined) return false
        const isLastPrefix = offset === words.length - 1 && !wholeWord
        return isLastPrefix ? norm.startsWith(word) : norm === word
    })
}

function dropOverlaps(matches: Match[]): Match[] {
    const result: Match[] = []
    let lastEnd = 0

    for (const match of matches) {
        if (match.start >= lastEnd) {
            result.push(match)
            lastEnd = match.end
        }
    }
    return result
}
