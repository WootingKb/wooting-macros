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
        color: mode('bg-dark', 'bg-light')(props),
        border: '1px solid',
        borderColor: mode('primary-light.500', 'primary-dark.500')(props),
        background: mode('primary-light.100', 'primary-dark.900')(props)
      },
      stepperGroup: {},
      stepper: {
        borderColor: mode('primary-light.500', 'primary-dark.500')(props)
      }
    })
  }
})
