import MiniSearch from 'minisearch'
import { normalizeWord } from './normalize'
import { tokenize, type Token } from './tokenize'

export interface SearchDocument {
    id: number
    text: string
}

export interface IndexedParagraph extends SearchDocument {
    start: number
    tokenStart: number
    tokens: Token[]
}

export interface SearchIndex {
    engine: MiniSearch<SearchDocument>
    paragraphs: IndexedParagraph[]
    tokens: Token[]
    frequencies: Map<string, number>
}

export function buildIndex(content: string | readonly string[]): SearchIndex {
    const texts = typeof content === 'string' ? [content] : content
    const tokens: Token[] = []
    const frequencies = new Map<string, number>()
    let offset = 0

    const paragraphs = texts.map((text, id) => {
        const tokenStart = tokens.length
        const paragraphTokens = tokenize(text).map((token) => ({
            ...token,
            start: token.start + offset,
            end: token.end + offset,
        }))
        tokens.push(...paragraphTokens)

        for (const token of paragraphTokens) {
            frequencies.set(token.norm, (frequencies.get(token.norm) ?? 0) + 1)
        }

        const paragraph = { id, text, start: offset, tokenStart, tokens: paragraphTokens }
        offset += text.length + 2
        return paragraph
    })

    const engine = new MiniSearch<SearchDocument>({
        idField: 'id',
        fields: ['text'],
        tokenize: (text) => tokenize(text).map((token) => token.raw),
        processTerm: normalizeWord,
        searchOptions: { fuzzy: false },
    })
    engine.addAll(paragraphs.map(({ id, text }) => ({ id, text })))

    return { engine, paragraphs, tokens, frequencies }
}
