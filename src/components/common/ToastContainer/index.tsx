import 'react-toastify/dist/ReactToastify.css'

import { HEADER_HEIGHT, HEADER_PADDING } from 'components/Header'
import { useMemo } from 'react'
import { ToastContainer as Container } from 'react-toastify'
import { useTheme } from 'styled-components'

export default function ToastContainer() {
  /* TODO pjordan: Add toast position to settings */
  const {
    isDark,
    colors: { primary: backgroundColor },
    fonts: { inter: font },
  } = useTheme()
  const theme = useMemo(() => (isDark ? 'dark' : 'light'), [isDark])

  return (
    <Container
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      style={{
        marginTop: `${HEADER_HEIGHT + HEADER_PADDING}px`,
      }}
      toastStyle={{
        borderRadius: '16px',
        backgroundColor,
        fontFamily: font,
      }}
      theme={theme}
    />
  )
}
