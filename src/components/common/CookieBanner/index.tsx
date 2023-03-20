import './klaro.min.css'

import * as Klaro from 'klaro/dist/klaro-no-css'
import { useEffect, useMemo } from 'react'
import { useEffectOnce } from 'react-use'
import { useTheme } from 'styled-components'

export default function CookieBanner() {
  const { fonts, colors } = useTheme()
  const config = useMemo(
    () => ({
      autoTranslate: false,
      styling: {
        'title-font-family': fonts.gilroy,
        'font-family': fonts.gilroy,
        'font-size': '14px', // anything else is too big for the popup
        'border-style': 'none',
        'border-width': '1px',
        'border-radius': '10px',
        'button-text-color': '#fff', // button text color
        'button-text-color-inverse': colors.text,
        'modal-bg': colors.primary,
        light1: colors.text, // main text color
        green1: colors.main, // Toggle background, Let me Choose text color & That's ok bg color
        dark1: colors.primary64, // background of popover and modal
        dark2: colors.primary, // background of I decline button & separator lines in modal
        blue1: colors.main, // Accept selected Background color
        light2: colors.text, // unused
        light3: colors.text, // unused
        green2: colors.text, // unused
        green3: colors.text, // unused
        red1: colors.text, // unused
        red2: colors.text, // unused
        red3: colors.text, // unused
        dark3: colors.text, // unused
        blue2: colors.text, // unused
        blue3: colors.text, // unused
        'notice-position': 'fixed',
        'notice-right': '20px',
        'notice-left': 'auto',
        'notice-bottom': '20px',
        'notice-max-width': '350px',
      },
      translations: {
        en: {
          consentNotice: {
            description:
              'We care about your data, and we would love to use cookies to make your experience better. Please, accept these sweeties to continue enjoying our site!',
          },
          googletagmanager: {
            title: 'Google Analytics',
            description: 'The analytics service ran by a most definitely non-evil company.',
          },
          purposes: {
            analytics: 'Analytics',
            styling: 'Styling',
          },
        },
      },
      services: [
        {
          name: 'googletagmanager',
          purposes: ['analytics'],
          default: true,
        },
      ],
    }),
    [colors.primary64, colors.main, colors.primary, colors.text, fonts.gilroy],
  )

  useEffectOnce(() => {
    Klaro.setup(config)
  })

  useEffect(() => {
    // we set up Klaro with the config
    Klaro.render(config)
  }, [config])

  return undefined
}
