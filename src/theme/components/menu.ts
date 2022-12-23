import {
  createMultiStyleConfigHelpers,
  StyleFunctionProps
} from '@chakra-ui/styled-system'
import { mode } from '@chakra-ui/theme-tools'

const helpers = createMultiStyleConfigHelpers([
  'button',
  'list',
  'item',
  'groupTitle',
  'command',
  'divider'
])

export const Menu = helpers.defineMultiStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      button: {},
      list: {
        bg: mode('primary-light.200', 'primary-dark.900')(props),
        borderColor: mode('primary-light.300', 'primary-dark.800')(props)
      },
      item: {
        bg: mode('primary-light.200', 'primary-dark.900')(props),
        color: mode('bg-dark', 'bg-light')(props),
        fontWeight: 'semibold',
        _hover: { bg: mode('primary-light.300', 'primary-dark.800')(props) }
      },
      groupTitle: { color: mode('bg-dark', 'bg-light')(props) },
      command: {},
      divider: { bg: mode('primary-light.300', 'primary-dark.800')(props) }
    })
  }
})
