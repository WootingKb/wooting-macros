import type { StyleFunctionProps } from '@chakra-ui/styled-system'
import { cssVar, defineStyleConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const $arrowBg = cssVar('popper-arrow-bg')

export const Tooltip = defineStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      bg: mode('primary-light.600', 'primary-dark.300')(props),
      color: mode('bg-light', 'bg-dark')(props),
      [$arrowBg.variable]: mode(
        'colors.primary-light.600',
        'colors.primary-dark.300'
      )(props)
    })
  }
})
