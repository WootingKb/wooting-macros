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
        bg: mode('stone.500', 'zinc.500')(props),
        _checked: {
          bg: mode('yellow.500', 'yellow.400')(props)
        }
      }
    })
  }
})
