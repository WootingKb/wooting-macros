import type { StyleFunctionProps } from '@chakra-ui/styled-system'
import { defineStyleConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

export const Button = defineStyleConfig({
  variants: {
    brand: (props: StyleFunctionProps) => ({
      bg: mode('primary-light.100', 'primary-dark.800')(props),
      transition: "ease-out 150ms",
      _hover: {
        bg: mode('primary-light.200', 'primary-dark.700')(props),
        _disabled: {
          bg: mode('primary-light.100', 'primary-dark.800')(props),
          opacity: 0.5
        }
      },
      _active: { bg: mode('primary-light.200', 'primary-dark.700')(props) },
      _disabled: {
        bg: mode('primary-light.200', 'primary-dark.800')(props),
        opacity: 0.5
      }
    }),
    brandSecondary: (props: StyleFunctionProps) => ({
      bg: mode('primary-light.50', 'primary-dark.800')(props),
      transition: "ease-out 150ms",
      _hover: {
        bg: mode('primary-light.100', 'primary-dark.700')(props),
        _disabled: {
          bg: mode('primary-light.50', 'primary-dark.800')(props),
          opacity: 0.5
        }
      },
      _active: { bg: mode('primary-light.100', 'primary-dark.700')(props) },
      _disabled: {
        bg: mode('primary-light.50', 'primary-dark.800')(props),
        opacity: 0.5
      }
    }),
    brandAccent: (props: StyleFunctionProps) => ({
      bg: mode('primary-accent.300', 'primary-accent.500')(props),
      color: 'bg-dark',
      transition: "ease-out 150ms",
      _hover: {
        bg: mode('primary-accent.400', 'primary-accent.400')(props),
        _disabled: {
          bg: mode('primary-accent.300', 'primary-accent.500')(props),
          opacity: 0.5
        }
      },
      _active: { bg: mode('primary-accent.400', 'primary-accent.400')(props) },
      _disabled: {
        bg: mode('primary-accent.300', 'primary-accent.500')(props),
        opacity: 0.5
      }
    }),
    brandAccentLight: (props: StyleFunctionProps) => ({
      bg: mode('primary-accent.50', 'primary-accent.200')(props),
      color: 'bg-dark',
      transition: "ease-out 150ms",
      _hover: {
        bg: mode('primary-accent.400', 'primary-accent.400')(props),
        _disabled: {
          bg: mode('primary-accent.50', 'primary-accent.200')(props),
          opacity: 0.5
        }
      },
      _active: { bg: mode('primary-accent.400', 'primary-accent.400')(props) },
      _disabled: {
        bg: mode('primary-accent.50', 'primary-accent.200')(props),
        opacity: 0.5
      }
    }),
    yellowGradient: () => ({
      bgGradient: 'linear(to-b, primary-accent.300, primary-accent.500)',
      color: 'bg-dark',
      _hover: {
        bgGradient: 'linear(to-b, primary-accent.300, primary-accent.500)',
        _disabled: {
          opacity: 0.5,
          bgGradient: 'linear(to-b, primary-accent.300, primary-accent.500)'
        }
      },
      _disabled: {
        opacity: 0.5,
        bgGradient: 'linear(to-b, primary-accent.300, primary-accent.500)'
      }
    }),
    brandGhost: (props: StyleFunctionProps) => ({
      _hover: { bg: mode('primary-light.200', 'primary-dark.800')(props) }
    }),
    brandRecord: (props: StyleFunctionProps) => ({
      bg: mode('primary-light.100', 'primary-dark.800')(props),
      _hover: { bg: mode('primary-light.200', 'primary-dark.700')(props) },
      _active: { bg: mode('red.300', 'red.700')(props) }
    }),
    brandWarning: (props: StyleFunctionProps) => ({
      bg: mode('red.300', 'red.400')(props),
      color: 'bg-dark',
      _hover: {
        bg: mode('red.400', 'red.300')(props),
        _disabled: {
          bg: mode('red.300', 'red.400')(props),
          opacity: 0.5
        }
      },
      _disabled: {
        bg: mode('red.300', 'red.400')(props),
        opacity: 0.5
      }
    })
  }
})
