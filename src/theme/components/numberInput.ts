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
        color: mode('darkGray', 'offWhite')(props),
        border: '1px solid',
        borderColor: mode('stone.500', 'zinc.500')(props),
        background: mode('stone.100', 'zinc.900')(props)
      },
      stepperGroup: {},
      stepper: { borderColor: mode('stone.500', 'zinc.500')(props) }
    })
  }
})
