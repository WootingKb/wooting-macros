import {
  createMultiStyleConfigHelpers,
  StyleFunctionProps
} from '@chakra-ui/styled-system'
import { mode } from '@chakra-ui/theme-tools'

const helpers = createMultiStyleConfigHelpers(['addon', 'field', 'element'])

export const Input = helpers.defineMultiStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      addon: {},
      field: {
        bg: mode('primary-light.200', 'primary-dark.800')(props),
        color: mode('bg-dark', 'bg-light')(props),
        _focus: {
          outline: '1px solid',
          outlineColor: mode('primary-light.500', 'primary-dark.500')(props)
        },
        _invalid: { outlineColor: 'red.500' }
      },
      element: {}
    })
  }
})
