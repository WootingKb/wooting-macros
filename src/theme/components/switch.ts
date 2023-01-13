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
        bg: mode('primary-light.600', 'primary-dark.700')(props),
        _checked: {
          bg: 'primary-accent.500'
        },
        _disabled: {
          bg: mode('primary-light.600', 'primary-dark.700')(props),
          opacity: 0.5,
          _checked: {
            bg: mode('primary-light.600', 'primary-dark.700')(props),
          }
        }
      }
    })
  }
})
