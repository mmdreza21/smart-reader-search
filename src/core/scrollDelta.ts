

export function scrollDeltaToCenter(
    elementTop: number,
    elementHeight: number,
    viewportHeight: number,
    topInset: number,
): number {
    const elementCenter = elementTop + elementHeight / 2
    const visibleCenter = topInset + (viewportHeight - topInset) / 2
    return elementCenter - visibleCenter
}