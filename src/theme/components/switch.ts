import {
  createMultiStyleConfigHelpers,
  StyleFunctionProps
} from '@chakra-ui/styled-system'
import { mode } from '@chakra-ui/theme-tools'

const helpers = createMultiStyleConfigHelpers(['container', 'thumb', 'track'])

export const Switch = helpers.defineMultiStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      container: {},
      thumb: {},
      track: {
        bg: mode('primary-light.500', 'primary-dark.500')(props),
        _checked: {
          bg: mode('primary-accent.600', 'primary-accent.500')(props)
        }
      }
    })
  }
})
