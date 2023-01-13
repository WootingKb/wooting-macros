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
        bg: mode('primary-light.50', 'primary-dark.800')(props),
        _focus: {
          outline: '1px solid',
          outlineColor: mode('primary-light.500', 'primary-dark.500')(props)
        },
        _invalid: { outlineColor: 'red.500' }
      },
      element: {}
    }),
    brandAccent: (props: StyleFunctionProps) => ({
      addon: {},
      field: {
        bg: mode('blue.50', 'gray.800')(props),
        border: '1px solid',
        borderColor: mode('primary-light.100', 'primary-dark.800')(props),
        shadow: 'inner',
        _focus: {
          outline: '1px solid',
          outlineColor: mode('primary-light.100', 'primary-dark.700')(props)
        },
        _invalid: { outlineColor: 'red.500' }
      },
      element: {}
    })
  }
})
