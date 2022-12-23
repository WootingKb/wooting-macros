import { StyleFunctionProps } from '@chakra-ui/styled-system'
import { mode } from '@chakra-ui/theme-tools'

export const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg: mode('bg-light', 'bg-dark')(props),
      color: mode('bg-dark', 'bg-light')(props)
    }
  })
}
