import type { StyleFunctionProps } from '@chakra-ui/styled-system'
import { defineStyleConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

export const Textarea = defineStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      bg: mode('primary-light.200', 'primary-dark.800')(props),
      color: mode('bg-dark', 'bg-light')(props),
      border: '1px solid',
      borderColor: mode('primary-light.500', 'primary-dark.500')(props)
    })
  }
})
