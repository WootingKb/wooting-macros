import {
  createMultiStyleConfigHelpers,
  StyleFunctionProps
} from '@chakra-ui/styled-system'
import { mode } from '@chakra-ui/theme-tools'

const helpers = createMultiStyleConfigHelpers([
  'control',
  'icon',
  'container',
  'label'
])

export const Radio = helpers.defineMultiStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      control: {
        borderColor: mode('stone.400', 'zinc.500')(props),
        color: mode('darkGray', 'offWhite')(props),
        _checked: {
          borderColor: mode('yellow.500', 'yellow.400')(props),
          bg: mode('yellow.500', 'yellow.400')(props)
        }
      },
      icon: {},
      container: {},
      label: { color: mode('darkGray', 'offWhite')(props) }
    })
  }
})
