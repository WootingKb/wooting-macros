import type { StyleFunctionProps } from '@chakra-ui/styled-system'
import { defineStyleConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

export const Kbd = defineStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      bg: mode('stone.200', 'zinc.800')(props),
      color: mode('darkGray', 'offWhite')(props),
      borderColor: mode('stone.300', 'zinc.700')(props),
    })
  }
})
