import {
  createMultiStyleConfigHelpers,
  StyleFunctionProps
} from '@chakra-ui/styled-system'
import { mode } from '@chakra-ui/theme-tools'

const helpers = createMultiStyleConfigHelpers([
  'root',
  'field',
  'stepperGroup',
  'stepper'
])

export const NumberInput = helpers.defineMultiStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      root: {},
      field: {
        border: '1px solid',
        borderColor: mode('primary-light.500', 'primary-dark.500')(props),
        background: mode('primary-light.50', 'primary-dark.800')(props)
      },
      stepperGroup: {},
      stepper: {
        borderColor: mode('primary-light.500', 'primary-dark.500')(props)
      }
    })
  }
})
