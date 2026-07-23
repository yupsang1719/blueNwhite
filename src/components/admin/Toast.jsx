import { createContext, useContext, useState, useCallback } from 'react'
import { LuCircleCheck, LuCircleX, LuInfo, LuX } from 'react-icons/lu'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const add = useCallback((type, message) => {
    const id = Date.now()
    setToasts(t => [...t, { id, type, message }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])

  const remove = (id) => setToasts(t => t.filter(x => x.id !== id))

  const toast = {
    success: (msg) => add('success', msg),
    error: (msg) => add('error', msg),
    info: (msg) => add('info', msg),
  }

  const icons = {
    success: <LuCircleCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />,
    error: <LuCircleX className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />,
    info: <LuInfo className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />,
  }

  const borders = { success: 'border-green-200 bg-green-50', error: 'border-red-200 bg-red-50', info: 'border-blue-200 bg-blue-50' }

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 min-w-72 max-w-sm">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-start gap-3 border rounded-lg px-4 py-3 shadow-lg animate-in ${borders[t.type]}`}>
            {icons[t.type]}
            <p className="text-sm text-gray-800 flex-1 leading-snug">{t.message}</p>
            <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
              <LuX className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}
