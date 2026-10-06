export interface MarkRange {
    id: number
    start: number
    end: number
}

export interface Segment {
    text: string
    markId: number | null
}


export function splitByMatches(text: string, ranges: readonly MarkRange[]): Segment[] {
    const segments: Segment[] = []
    let cursor = 0

    for (const range of ranges) {
        const start = Math.max(range.start, cursor)
        const end = Math.min(range.end, text.length)
        if (end <= start) continue

        if (start > cursor) {
            segments.push({ text: text.slice(cursor, start), markId: null })
        }
        segments.push({ text: text.slice(start, end), markId: range.id })
        cursor = end
    }

    if (cursor < text.length) {
        segments.push({ text: text.slice(cursor), markId: null })
    }
    return segments
}