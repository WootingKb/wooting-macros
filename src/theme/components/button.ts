import type { StyleFunctionProps } from '@chakra-ui/styled-system'
import { defineStyleConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

export const Button = defineStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      bg: mode('stone.300', 'zinc.800')(props),
      color: mode('darkGray', 'offWhite')(props),
      _hover: { bg: mode('stone.400', 'zinc.700')(props) },
      _active: { bg: mode('stone.400', 'zinc.700')(props) },
    }),
    brand2: (props: StyleFunctionProps) => ({
      bg: mode('stone.400', 'zinc.700')(props),
      color: mode('darkGray', 'offWhite')(props),
      _hover: { bg: mode('stone.500', 'zinc.600')(props) }
    }),
    brandSelected: (props: StyleFunctionProps) => ({
      bg: mode('yellow.400', 'yellow.400')(props),
      color: mode('darkGray', 'offWhite')(props),
      _hover: { bg: mode('yellow.500', 'yellow.300')(props) },
      _disabled: { bg: mode('yellow.400', 'yellow.400')(props), opacity: 0.5 }
    }),
    yellowGradient: (props: StyleFunctionProps) => ({
      bgGradient: mode(
        'linear(to-b, #FFD45C, #FFBC00)',
        'linear(to-b, yellow.400, yellow.500)'
      )(props),
      color: 'darkGray',
      _hover: {
        bgGradient: mode(
          'linear(to-b, yellow.400, yellow.500)',
          'linear(to-b, #FFD45C, #FFBC00)'
        )(props),
        _disabled: {
          opacity: 0.5,
          bgGradient: mode(
            'linear(to-b, #FFD45C, #FFBC00)',
            'linear(to-b, yellow.400, yellow.500)'
          )(props)
        }
      },
      _disabled: {
        opacity: 0.5,
        bgGradient: mode(
          'linear(to-b, #FFD45C, #FFBC00)',
          'linear(to-b, yellow.400, yellow.500)'
        )(props)
      }
    }),
    brandGhost: (props: StyleFunctionProps) => ({
      color: mode('darkGray', 'offWhite')(props),
      _hover: { bg: mode('stone.200', 'zinc.800')(props) }
    })
  }
})
