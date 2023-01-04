import { StyleFunctionProps } from '@chakra-ui/styled-system'
import { mode } from '@chakra-ui/theme-tools'

export const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg: mode('primary-light.50', 'bg-dark')(props),
      color: mode('primary-light.900', 'primary-dark.100')(props)
    }
  })
}
