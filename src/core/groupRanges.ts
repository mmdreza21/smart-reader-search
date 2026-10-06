import type { MarkRange } from './splitByMatches'

interface Span {
    start: number
    end: number
}


export function groupRangesByBlock(
    matches: readonly Span[],
    blocks: readonly Span[],
): MarkRange[][] {
    let first = 0

    return blocks.map((block) => {
        while (first < matches.length && matches[first]!.end <= block.start) first++

        const ranges: MarkRange[] = []
        for (let id = first; id < matches.length && matches[id]!.start < block.end; id++) {
            const match = matches[id]!
            ranges.push({ id, start: match.start - block.start, end: match.end - block.start })
        }
        return ranges
    })
}