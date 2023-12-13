import { Flex, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import { SettingsCategory } from '../../constants/enums'
import useScrollbarStyles from '../../hooks/useScrollbarStyles'
import useBorderColour from '../../hooks/useBorderColour'
import SettingsButton from '../settings/SettingsButton'
import { MacroSettingsGroup } from "../../constants/MacroSettingsMap";

interface Props {
  pageIndex: number
  onSettingsButtonPress: (index: number) => void
}

export default function MacroSettingsLeftPanel({
  pageIndex,
  onSettingsButtonPress
}: Props) {
  const panelBg = useColorModeValue('primary-light.50', 'bg-dark')
  // const applicationTextColour = useColorModeValue(
  //   'primary-light.500',
  //   'primary-dark.400'
  // )
  // const strokeColour = useColorModeValue('bg-dark', 'bg-light')
  // const strokeHoverColour = useColorModeValue(
  //   'primary-accent.600',
  //   'primary-accent.400'
  // )

  return (
    <Flex
      bg={panelBg}
      borderRight="1px"
      borderColor={useBorderColour()}
      h="100vh"
      px={2}
      py={16}
      minWidth="200px"
      flexGrow={1}
      flexBasis="auto"
      justifyContent="flex-end"
      overflowY="auto"
      sx={useScrollbarStyles()}
    >
      <VStack w="200px" spacing={1}>
        <VStack w="full" spacing={1}>
          <Text w="full" textStyle="miniHeader" ml={4}>
            Macro Specific Settings
          </Text>
          {MacroSettingsGroup.all
            .filter((setting) => setting.category === SettingsCategory.Macro)
            .map((setting) => (
              <SettingsButton
                setting={setting}
                index={setting.pageIndex}
                key={setting.displayString}
                isFocused={pageIndex == setting.pageIndex}
                setFocus={onSettingsButtonPress}
              />
            ))}
        </VStack>
      </VStack>
    </Flex>
  )
}
