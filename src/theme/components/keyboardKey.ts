import type { StyleFunctionProps } from '@chakra-ui/styled-system'
import { defineStyleConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

export const Kbd = defineStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      bg: mode('bg-light', 'primary-dark.800')(props),
      color: mode('bg-dark', 'bg-light')(props),
      borderColor: mode('primary-light.300', 'primary-dark.700')(props)
    })
  }
})
