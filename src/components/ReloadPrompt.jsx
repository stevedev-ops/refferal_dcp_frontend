import { useState, useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

function ReloadPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  // Show if there is an update OR if it's installable
  if (!offlineReady && !needRefresh && !isInstallable) return null;

  return (
    <div className="fixed bottom-0 right-0 m-4 z-[100]">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-5 max-w-sm text-slate-900 animate-in slide-in-from-bottom-5">
        <div className="mb-4">
          {isInstallable && !needRefresh ? (
            <div>
              <p className="font-black text-sm uppercase tracking-wide">Get the DCP App</p>
              <p className="text-xs text-slate-500 mt-1">Install this application to your home screen for fast, easy access.</p>
            </div>
          ) : offlineReady ? (
            <span>App ready to work offline</span>
          ) : (
            <span>New content available, click on reload button to update.</span>
          )}
        </div>
        <div className="flex gap-2 justify-end mt-2">
          {isInstallable && !needRefresh && (
            <button
              className="px-4 py-2 bg-dcp-green text-slate-950 font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-opacity-90 transition"
              onClick={handleInstallClick}
            >
              Install App
            </button>
          )}
          {needRefresh && (
            <button
              className="px-4 py-2 bg-dcp-green text-slate-950 font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-opacity-90 transition"
              onClick={() => updateServiceWorker(true)}
            >
              Reload
            </button>
          )}
          <button
            className="px-4 py-2 bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-slate-200 transition"
            onClick={() => {
              if (isInstallable) setIsInstallable(false);
              else close();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReloadPrompt
