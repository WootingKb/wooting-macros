import { extendTheme } from '@chakra-ui/react'
import { config } from './config'
import { breakpoints } from './breakpoints'
import { Divider } from './components/divider'
import { textStyles } from './textStyles'
import { colors } from './colors'

const overrides = {
  config,
  breakpoints,
  colors,
  components: {
    Divider
  },
  textStyles
}

export const theme = extendTheme(overrides)
