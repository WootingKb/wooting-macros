import {
  createMultiStyleConfigHelpers,
  StyleFunctionProps
} from '@chakra-ui/styled-system'
import { mode } from '@chakra-ui/theme-tools'

const helpers = createMultiStyleConfigHelpers([
  'button',
  'overlay',
  'dialogContainer',
  'dialog',
  'closeButton',
  'body',
  'footer'
])

export const Modal = helpers.defineMultiStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      header: { color: mode('darkGray', 'offWhite')(props) },
      overlay: { bg: 'blackAlpha.900' },
      dialogContainer: {},
      dialog: {
        bg: mode('offWhite', 'darkGray')(props),
        color: mode('darkGray', 'offWhite')(props)
      },
      closeButton: {},
      body: { color: mode('darkGray', 'offWhite')(props) },
      footer: {}
    })
  }
})
