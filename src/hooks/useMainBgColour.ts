import { useColorModeValue } from '@chakra-ui/react'

export default function useMainBgColour() {
  const bg = useColorModeValue('bg-light', 'primary-dark.900')
  return bg
}
