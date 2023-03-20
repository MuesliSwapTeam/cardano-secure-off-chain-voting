import { createGlobalStyle } from 'styled-components'

import GILROY_SET from './assets/fonts/gilroy'

export default createGlobalStyle`
  * {
    // This disables overscrolling, as on mobile it makes the website extremely slow
    overscroll-behavior: none;
    margin: 0;
    padding: 0;
  }

  button {
    border: none;
    padding: 8px;

    background-color: transparent;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
  }

  body {
     background-color: ${({ theme }) => theme.colors.background};
    background-image:
            radial-gradient(65vw 63vw at 96vw 222vw, rgba(77, 88, 243, 0.15), transparent 50%),
            radial-gradient(65vw 63vw at 0vw 152vw, rgba(212, 77, 243, 0.16), transparent 50%),
            radial-gradient(33vw 32vw at 96vw 95vw, rgba(77, 88, 243, 0.09), transparent 50%),
            radial-gradient(61vw 59vw at -5vw 64vw, rgba(212, 77, 243, 0.16), transparent 50%),
            radial-gradient(76vw 73vw at 5vw 186vw, rgba(77, 88, 243, 0.14), transparent 50%),
            radial-gradient(54vw 52vw at 93vw 333vw, rgba(243, 141, 77, 0.16), transparent 50%),
            radial-gradient(65vw 63vw at 87vw 128vw, rgba(243, 77, 77, 0.16), transparent 50%),
            radial-gradient(54vw 56vw at 33vw 291vw, rgba(77, 88, 243, 0.14), transparent 50%),
            radial-gradient(36vw 38vw at 79vw 28vw, rgba(243, 77, 77, 0.16), transparent 50%),
            radial-gradient(45vw 47vw at 26vw -6vw, rgba(243, 77, 77, 0.16), transparent 50%),
            radial-gradient(45vw 47vw at 26vw 358vw, rgba(243, 77, 77, 0.16), transparent 50%),
            radial-gradient(108vw 104vw at 5vw 298vw, rgba(212, 77, 243, 0.16), transparent 50%),
            radial-gradient(78vw 73vw at -16vw 0vw, rgba(77, 88, 243, 0.09), transparent 50%),
            radial-gradient(78vw 73vw at -16vw 364vw, rgba(77, 88, 243, 0.09), transparent 50%),
            radial-gradient(74vw 71vw at 88vw 250vw, rgba(243, 77, 77, 0.16), transparent 50%),
            radial-gradient(71vw 63vw at 93vw 52vw, rgba(243, 141, 77, 0.16), transparent 50%);
    background-repeat: repeat-y;
    background-size: 100% 364vw;
  }
  
  // this only applies to <Text as="p"> where variant is not set
  p {
    font-family: ${({ theme }) => theme.fonts.inter};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.defaultFontSize};
    // line height set by default to 1.5 for better readability
    line-height: 1.5;
    // letter spacing set by default by user agent
  }
  
  ${GILROY_SET}
`
