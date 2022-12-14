import { StyleFunctionProps } from "@chakra-ui/styled-system";
import { mode } from '@chakra-ui/theme-tools'

export const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg: mode('offWhite', 'darkGray')(props)
    }
  }),
}