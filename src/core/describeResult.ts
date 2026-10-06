export function describeResult(
    activeIndex: number | null,
    total: number,
    hasQuery: boolean,
): string {
    if (!hasQuery) return ''
    if (activeIndex === null || total === 0) return 'No results'
    return `Result ${activeIndex + 1} of ${total}`
}
