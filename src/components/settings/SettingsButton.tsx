import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import { SettingInfo } from '../../constants/SettingsMap'
import { borderRadiusStandard } from "../../theme/config";

interface Props {
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
  const buttonBg = useColorModeValue('primary-light.100', 'primary-dark.800')

  return (
    <Box
      pos="relative"
      w="full"
      bg={isFocused ? buttonBg : ''}
      _hover={{ bg: buttonBg }}
      px="2"
      py="1"
      rounded={borderRadiusStandard}
      onClick={() => setFocus(index)}
      cursor="pointer"
      transition="ease-out 150ms"
    >
      <Text fontWeight="semibold">{setting.displayString}</Text>
    </Box>
  )
}
