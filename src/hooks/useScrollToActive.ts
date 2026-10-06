import { useEffect, type RefObject } from 'react'
import type { Match } from '../core/search'
import { scrollDeltaToCenter } from '../core/scrollDelta'

const MAX_SCROLL_WAIT_MS = 1000

const ACTIVE_MARKS = 'mark[data-active]'

function onScrollEnd(callback: () => void): () => void {
    const cancel = () => {
        window.clearTimeout(timer)
        window.removeEventListener('scrollend', finish)
    }
    const finish = () => {
        cancel()
        callback()
    }
    const timer = window.setTimeout(finish, MAX_SCROLL_WAIT_MS)
    window.addEventListener('scrollend', finish, { once: true })
    return cancel
}


export function useScrollToActive(
    activeIndex: number | null,
    matches: readonly Match[],
    headerRef: RefObject<HTMLElement | null>,
): void {
    useEffect(() => {
        for (const mark of document.querySelectorAll('mark[data-pulse]')) {
            mark.removeAttribute('data-pulse')
        }
        if (activeIndex === null) return

        const marks = [...document.querySelectorAll<HTMLElement>(ACTIVE_MARKS)]
        const target = marks[0]
        if (!target) return

        const pulse = () => marks.forEach((mark) => mark.setAttribute('data-pulse', ''))

        const rect = target.getBoundingClientRect()
        const delta = scrollDeltaToCenter(
            rect.top,
            rect.height,
            window.innerHeight,
            headerRef.current?.getBoundingClientRect().height ?? 0,
        )

        if (Math.abs(delta) < 1) {
            pulse()
            return
        }

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollBy({ top: delta, behavior: reduceMotion ? 'instant' : 'smooth' })
        return onScrollEnd(pulse)
    }, [activeIndex, matches, headerRef])
}
