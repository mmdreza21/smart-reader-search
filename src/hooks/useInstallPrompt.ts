import { useCallback, useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface UseInstallPromptResult {
    canInstall: boolean
    install: () => Promise<void>
}

export function useInstallPrompt(): UseInstallPromptResult {
    const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

    useEffect(() => {
        function handleBeforeInstallPrompt(event: Event) {
            event.preventDefault()
            setDeferred(event as BeforeInstallPromptEvent)
        }
        function handleInstalled() {
            setDeferred(null)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleInstalled)
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleInstalled)
        }
    }, [])

    const install = useCallback(async () => {
        if (!deferred) return
        await deferred.prompt()
        await deferred.userChoice
        setDeferred(null)
    }, [deferred])

    return { canInstall: deferred !== null, install }
}
