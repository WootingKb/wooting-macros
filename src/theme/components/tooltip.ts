import type { StyleFunctionProps } from '@chakra-ui/styled-system'
import { cssVar, defineStyleConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const $arrowBg = cssVar('popper-arrow-bg')

export const Tooltip = defineStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      bg: mode('primary-light.800', 'primary-dark.700')(props),
      color: mode('bg-light', 'bg-light')(props),
      [$arrowBg.variable]: mode(
        'colors.primary-light.800',
        'colors.primary-dark.700'
      )(props),
      borderRadius: 'md',
    })
  }
})
