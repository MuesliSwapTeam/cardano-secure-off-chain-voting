import ConnectWallet from 'components/Header/ConnectWallet'
import LINKS from 'components/Header/links'
import MobileHome from 'components/Header/MobileBar/MobileHome'
import MobileSidebar from 'components/Header/MobileBar/MobileSidebar'
import ThemeSwitcher from 'components/Header/ThemeSwitcher'
import useBoundingClientRect from 'hooks/useBoundingClientRect'
import React, { useLayoutEffect, useState } from 'react'
import { useMedia, useToggle } from 'react-use'
import { Box, Flex } from 'rebass/styled-components'
import { useTheme } from 'styled-components'

import DesktopBar from './DesktopBar'
import MobileBar from './MobileBar'

export const HEADER_PADDING = 16
export const HEADER_HEIGHT = 56

const MARGIN = ['10px', '10px 16px']

function Header({ setHideSideMenu }: { setHideSideMenu: React.Dispatch<React.SetStateAction<boolean>> }) {
  // use some default value which is certain to be smaller than the required display width,
  // but not too small, as it will flash otherwise
  const [desktopBarWidth, setDesktopBarWidth] = useState(900)
  const desktopBarRef = React.createRef<HTMLDivElement | undefined>()
  const isWide = useMedia(`(min-width: ${desktopBarWidth}px)`)

  const [measureRef, { height, top }] = useBoundingClientRect<HTMLElement>()
  const [active, toggleActive] = useToggle(false)
  const { isDark } = useTheme()

  useLayoutEffect(() => {
    toggleActive(isWide)
  }, [isWide, toggleActive])

  useLayoutEffect(() => {
    if (desktopBarRef.current) {
      // 390 is derived from the widht of the right element and some gap
      setDesktopBarWidth(desktopBarRef.current.offsetWidth + 390)
    }
  }, [desktopBarRef])

  useLayoutEffect(() => {
    if (!isWide) {
      setHideSideMenu(active)
    }
  }, [isWide, active, setHideSideMenu])

  return (
    <>
      <Flex
        opacity={active && !isWide ? 0 : 1}
        ref={measureRef}
        flexDirection="row"
        m={MARGIN}
        p={`${HEADER_PADDING}px`}
        justifyContent={isWide ? 'space-between' : 'end'}
        backgroundColor={isDark ? '#0C1629dd' : '#ffffffdd'}
        sx={{
          position: 'fixed',
          backdropFilter: 'blur(10px)',
          top: 0,
          left: 0,
          right: 0,
          height: `${HEADER_HEIGHT}px`, // Note (Matus): originally 64px but that's too big on small screens
          transition: '200ms',
          borderRadius: '16px',
          boxShadow: 'tooltip',
          zIndex: 5,
        }}
      >
        {isWide && <DesktopBar ref={desktopBarRef} links={LINKS} />}
        {!isWide && <MobileHome />}

        <Flex alignItems="center" justifyContent="flex-end" m="-8px">
          <ConnectWallet isWide={isWide} />
          {isWide && <ThemeSwitcher />}
        </Flex>
        {!isWide && <MobileBar toggleActive={toggleActive} />}
      </Flex>

      {!isWide && <MobileSidebar top={top} active={active} toggleActive={toggleActive} />}

      <Box height={height} m={MARGIN} />
    </>
  )
}

export default React.memo(Header)
