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
      header: { },
      overlay: { bg: 'blackAlpha.700' },
      dialogContainer: {},
      dialog: {
        bg: mode('bg-light', 'bg-dark')(props),
      },
      closeButton: {},
      body: { },
      footer: {}
    })
  }
})
