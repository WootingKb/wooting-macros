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
      p="4px"
      rounded="md"
      textAlign="left"
      onClick={() => setFocus(index)}
      cursor="pointer"
    >
      <Text>{setting.displayString}</Text>
    </Box>
  )
}
