import { useRegisterSW } from 'virtual:pwa-register/react'

function ReloadPrompt() {
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

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className="fixed bottom-0 right-0 m-4 z-50">
      {(offlineReady || needRefresh) && (
        <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 max-w-sm text-slate-900 animate-in slide-in-from-bottom-5">
          <div className="mb-4">
            {offlineReady ? (
              <span>App ready to work offline</span>
            ) : (
              <span>New content available, click on reload button to update.</span>
            )}
          </div>
          <div className="flex gap-2 justify-end">
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
              onClick={() => close()}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReloadPrompt
