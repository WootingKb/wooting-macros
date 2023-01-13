import {
  createMultiStyleConfigHelpers,
  StyleFunctionProps
} from '@chakra-ui/styled-system'
import { mode } from '@chakra-ui/theme-tools'

const helpers = createMultiStyleConfigHelpers([
  'root',
  'container',
  'button',
  'panel',
  'icon'
])

export const Accordion = helpers.defineMultiStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      root: {},
      container: {},
      button: { paddingX: '6'},
      panel: {
        bg: mode('primary-light.50', 'primary-dark.800')(props),
        shadow: 'inner',
        paddingX: '0',
        paddingBottom: '4',
      },
      icon: {}
    })
  }
})
