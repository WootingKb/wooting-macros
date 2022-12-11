import type { StyleFunctionProps } from '@chakra-ui/styled-system'
import { defineStyleConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

export const Divider = defineStyleConfig({
    baseStyle: (props: StyleFunctionProps) => ({
        borderColor: mode('gray.400', 'gray.600')(props)
    })
})