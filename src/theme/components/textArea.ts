import type { StyleFunctionProps } from '@chakra-ui/styled-system'
import { defineStyleConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

export const Textarea = defineStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      bg: mode('stone.200', 'zinc.800')(props),
      color: mode('darkGray', 'offWhite')(props),
      border: '1px solid',
      borderColor: mode('stone.500', 'zinc.500')(props),
    })
  }
})
