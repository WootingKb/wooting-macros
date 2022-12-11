import { extendTheme } from '@chakra-ui/react'
import { config } from './config'
import { breakpoints } from './breakpoints'
import { Divider } from './components/divider'
import { miniHeader } from './typography/miniHeader'

const overrides = {
  config,
  breakpoints,
  components: {
    Divider
  },
  textStyles: {
    miniHeader,
  }
}

export const theme = extendTheme(overrides)
