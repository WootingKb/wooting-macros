// theme.ts

// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const breakpoints = {
  sm: '1024px',
  md: '1280px',
  lg: '1536px',
  xl: '1700px',
  '2xl': '1920px',
}

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({ config, breakpoints })

export default theme