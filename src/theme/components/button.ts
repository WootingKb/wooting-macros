import type { StyleFunctionProps } from '@chakra-ui/styled-system'
import { defineStyleConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

export const Button = defineStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      bg: mode('primary-light.300', 'primary-dark.800')(props),
      color: mode('bg-dark', 'bg-light')(props),
      _hover: { bg: mode('primary-light.400', 'primary-dark.700')(props) },
      _active: { bg: mode('primary-light.400', 'primary-dark.700')(props) }
    }),
    brand2: (props: StyleFunctionProps) => ({
      bg: mode('primary-light.300', 'primary-dark.700')(props),
      color: mode('bg-dark', 'bg-light')(props),
      _hover: { bg: mode('primary-light.400', 'primary-dark.600')(props) }
    }),
    brandSelected: (props: StyleFunctionProps) => ({
      bg: mode('primary-accent.400', 'primary-accent.400')(props),
      color: mode('bg-dark', 'bg-light')(props),
      _hover: { bg: mode('primary-accent.500', 'primary-accent.300')(props) },
      _disabled: {
        bg: mode('primary-accent.400', 'primary-accent.400')(props),
        opacity: 0.5
      }
    }),
    yellowGradient: (props: StyleFunctionProps) => ({
      bgGradient: mode(
        'linear(to-b, primary-accent.300, primary-accent.400)',
        'linear(to-b, primary-accent.400, primary-accent.500)'
      )(props),
      color: 'bg-dark',
      _hover: {
        bgGradient: mode(
          'linear(to-b, primary-accent.400, primary-accent.500)',
          'linear(to-b, primary-accent.300, primary-accent.400)'
        )(props),
        _disabled: {
          opacity: 0.5,
          bgGradient: mode(
            'linear(to-b, primary-accent.300, primary-accent.400)',
            'linear(to-b, primary-accent.400, primary-accent.500)'
          )(props)
        }
      },
      _disabled: {
        opacity: 0.5,
        bgGradient: mode(
          'linear(to-b, primary-accent.300, primary-accent.400)',
          'linear(to-b, primary-accent.400, primary-accent.500)'
        )(props)
      }
    }),
    brandGhost: (props: StyleFunctionProps) => ({
      color: mode('bg-dark', 'bg-light')(props),
      _hover: { bg: mode('primary-light.200', 'primary-dark.800')(props) }
    }),
    brandRecord: (props: StyleFunctionProps) => ({
      bg: mode('primary-light.300', 'primary-dark.800')(props),
      color: mode('bg-dark', 'bg-light')(props),
      _hover: { bg: mode('primary-light.400', 'primary-dark.700')(props) },
      _active: { bg: mode('red.400', 'red.700')(props) }
    })
  }
})
