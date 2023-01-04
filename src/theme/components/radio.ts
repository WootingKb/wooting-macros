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
        borderColor: mode('primary-light.400', 'primary-dark.500')(props),
        _checked: {
          borderColor: mode('primary-accent.500', 'primary-accent.400')(props),
          bg: mode('primary-accent.500', 'primary-accent.400')(props)
        }
      },
      icon: {},
      container: {},
      label: { }
    })
  }
})
