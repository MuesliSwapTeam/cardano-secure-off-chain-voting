import { css } from 'styled-components'

import bold from './Gilroy-Bold.woff2'
import boldItalic from './Gilroy-BoldItalic.woff2'
import semiBold from './Gilroy-SemiBold.woff2'
import semiBoldItalic from './Gilroy-SemiBoldItalic.woff2'
import medium from './Gilroy-Medium.woff2'
import mediumItalic from './Gilroy-MediumItalic.woff2'
import regular from './Gilroy-Regular.woff2'
import regularItalic from './Gilroy-RegularItalic.woff2'

// For backwards compatibility
import boldLegacy from './Gilroy-Bold.woff'
import boldItalicLegacy from './Gilroy-BoldItalic.woff'
import semiBoldLegacy from './Gilroy-SemiBold.woff'
import semiBoldItalicLegacy from './Gilroy-SemiBoldItalic.woff'
import mediumLegacy from './Gilroy-Medium.woff'
import mediumItalicLegacy from './Gilroy-MediumItalic.woff'
import regularLegacy from './Gilroy-Regular.woff'
import regularItalicLegacy from './Gilroy-RegularItalic.woff'

export default css`
  @font-face {
    font-family: 'Gilroy';
    src: local('Gilroy Bold'), local('Gilroy-Bold'), url(${bold}) format('woff2'), url(${boldLegacy}) format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Gilroy';
    src: local('Gilroy BoldItalic'), local('Gilroy-BoldItalic'), url(${boldItalic}) format('woff2'),
      url(${boldItalicLegacy}) format('woff');
    font-weight: 700;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Gilroy';
    src: local('Gilroy SemiBold'), local('Gilroy-SemiBold'), url(${semiBold}) format('woff2'),
      url(${semiBoldLegacy}) format('woff');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Gilroy';
    src: local('Gilroy SemiBoldItalic'), local('Gilroy-SemiBoldItalic'), url(${semiBoldItalic}) format('woff2'),
      url(${semiBoldItalicLegacy}) format('woff');
    font-weight: 600;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Gilroy';
    src: local('Gilroy Medium'), local('Gilroy-Medium'), url(${medium}) format('woff2'),
      url(${mediumLegacy}) format('woff');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Gilroy';
    src: local('Gilroy MediumItalic'), local('Gilroy-MediumItalic'), url(${mediumItalic}) format('woff2'),
      url(${mediumItalicLegacy}) format('woff');
    font-weight: 500;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Gilroy';
    src: local('Gilroy Regular'), local('Gilroy-Regular'), url(${regular}) format('woff2'),
      url(${regularLegacy}) format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Gilroy';
    src: local('Gilroy RegularItalic'), local('Gilroy-RegularItalic'), url(${regularItalic}) format('woff2'),
      url(${regularItalicLegacy}) format('woff');
    font-weight: 400;
    font-style: italic;
    font-display: swap;
  }
`
