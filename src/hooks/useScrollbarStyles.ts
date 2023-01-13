import { useColorModeValue } from '@chakra-ui/react'
import { scrollbarStylesLight, scrollbarsStylesDark } from '../constants/utils'

export default function useScrollbarStyles() {
  const scrollbarStyle = useColorModeValue(
    scrollbarStylesLight,
    scrollbarsStylesDark
  )

  return scrollbarStyle
}
