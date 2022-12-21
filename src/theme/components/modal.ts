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
      header: { color: mode('bg-dark', 'bg-light')(props) },
      overlay: { bg: 'blackAlpha.900' },
      dialogContainer: {},
      dialog: {
        bg: mode('bg-light', 'bg-dark')(props),
        color: mode('bg-dark', 'bg-light')(props)
      },
      closeButton: {},
      body: { color: mode('bg-dark', 'bg-light')(props) },
      footer: {}
    })
  }
})
