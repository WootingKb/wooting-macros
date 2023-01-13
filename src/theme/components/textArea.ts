import type { StyleFunctionProps } from '@chakra-ui/styled-system'
import { defineStyleConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

export const Textarea = defineStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      bg: mode('primary-light.200', 'primary-dark.800')(props),
      border: '1px solid',
      borderColor: mode('primary-light.100', 'primary-dark.700')(props),
      shadow: 'inner'
    }),
    brandAccent: (props: StyleFunctionProps) => ({
      bg: mode('blue.50', 'gray.800')(props),
      border: '1px solid',
      borderColor: mode('primary-light.100', 'primary-dark.700')(props),
      shadow: 'inner'
    })
  }
})
