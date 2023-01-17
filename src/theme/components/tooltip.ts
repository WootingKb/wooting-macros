import type { StyleFunctionProps } from '@chakra-ui/styled-system'
import { cssVar, defineStyleConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const $arrowBg = cssVar('popper-arrow-bg')

export const Tooltip = defineStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      bg: mode('primary-light.800', 'primary-dark.700')(props),
      color: mode('bg-light', 'bg-light')(props),
      py: '1',
      [$arrowBg.variable]: mode(
        'colors.primary-light.800',
        'colors.primary-dark.700'
      )(props),
      borderRadius: 'md',
    }),
    brandSecondary: (props: StyleFunctionProps) => ({
      bg: mode('primary-light.800', 'primary-dark.900')(props),
      color: mode('bg-light', 'bg-light')(props),
      py: '1',
      [$arrowBg.variable]: mode(
        'colors.primary-light.800',
        'colors.primary-dark.900'
      )(props),
      border: '1px solid',
      borderColor: mode('primary-light.500', 'primary-dark.600')(props),
      borderRadius: 'md',
    }),
  }
})
