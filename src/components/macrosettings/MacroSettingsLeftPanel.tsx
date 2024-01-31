import { Flex, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import useScrollbarStyles from '../../hooks/useScrollbarStyles'
import useBorderColour from '../../hooks/useBorderColour'
import SettingsButton from "../settings/SettingsButton";
import { MacroSettingsGroup } from "../../constants/MacroSettingsMap";
import { SettingsCategory } from "../../constants/enums";

interface Props {
  pageIndex: number
  onSettingsButtonPress: (index: number) => void
}

export default function MacroSettingsLeftPanel({
  pageIndex,
  onSettingsButtonPress
}: Props) {
  const panelBg = useColorModeValue('primary-light.50', 'bg-dark')

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
