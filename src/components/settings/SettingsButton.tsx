import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import { SettingInfo } from '../../maps/SettingsMap'

type Props = {
  setting: SettingInfo
  index: number
  isFocused: boolean
  setFocus: (index: number) => void
}

export default function SettingsButton({
  setting,
  index,
  isFocused,
  setFocus
}: Props) {
  const buttonBg = useColorModeValue('gray.300', 'gray.700')

  return (
    <Box
      pos="relative"
      w="100%"
      bg={isFocused ? buttonBg : ''}
      _hover={{ bg: buttonBg }}
      px="2"
      py="1"
      rounded="md"
      onClick={() => setFocus(index)}
      cursor="pointer"
    >
      <Text fontWeight="semibold">{setting.displayString}</Text>
    </Box>
  )
}
