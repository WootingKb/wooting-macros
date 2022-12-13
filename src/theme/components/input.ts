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
        bg: mode('stone.200', 'zinc.800')(props),
        color: mode('darkGray', 'offWhite')(props),
        _focus: {
          outline: '1px solid',
          outlineColor: mode('stone.500', 'zinc.500')(props)
        },
        _invalid: { outlineColor: "red.500" }
      },
      element: {}
    })
  }
})
