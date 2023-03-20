import { useCallback, useMemo } from 'react'
import { toast, ToastContent, ToastOptions } from 'react-toastify'
import { useTheme } from 'styled-components'

export default function useToasts() {
  const {
    colors: { main: mainColor },
  } = useTheme()

  const notify = useCallback(
    (content: ToastContent, options?: ToastOptions) => {
      toast(content, { progressStyle: { background: mainColor }, ...options })
    },
    [mainColor],
  )

  const info = useCallback((content: ToastContent, options?: ToastOptions) => {
    toast(content, { type: 'info', ...options })
  }, [])

  const warning = useCallback((content: ToastContent, options?: ToastOptions) => {
    toast(content, { type: 'warning', ...options })
  }, [])

  const success = useCallback((content: ToastContent, options?: ToastOptions) => {
    toast(content, { type: 'success', ...options })
  }, [])

  const error = useCallback((content: ToastContent, options?: ToastOptions) => {
    toast(content, { type: 'error', ...options })
  }, [])

  return useMemo(() => ({ notify, info, warning, success, error }), [notify, info, warning, success, error])
}
