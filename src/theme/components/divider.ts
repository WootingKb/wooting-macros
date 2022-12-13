import type { StyleFunctionProps } from '@chakra-ui/styled-system'
import { defineStyleConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

export const Divider = defineStyleConfig({
  baseStyle: (props: StyleFunctionProps) => ({
    borderColor: mode('stone.500', 'zinc.500')(props)
  })
})