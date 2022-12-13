import type { StyleFunctionProps } from '@chakra-ui/styled-system'
import { cssVar, defineStyleConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const $arrowBg = cssVar('popper-arrow-bg')

export const Tooltip = defineStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      bg: mode('stone.600', 'zinc.300')(props),
      color: mode('offWhite', 'darkGray')(props),
      [$arrowBg.variable]: mode('colors.stone.600', 'colors.zinc.300')(props)
    })
  }
})
