import { useColorModeValue } from '@chakra-ui/react'

export default function useBorderColour() {
  const borderColour = useColorModeValue(
    'primary-light.100',
    'primary-dark.700'
  )

  return borderColour
}
