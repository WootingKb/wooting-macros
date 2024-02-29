import { Flex, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import useScrollbarStyles from '../../hooks/useScrollbarStyles'
import useBorderColour from '../../hooks/useBorderColour'
import SettingsButton from '../settings/SettingsButton'
import { SettingTabs } from '../../views/MacroSettingsModal'
import { SettingInfo } from '../../constants/SettingsMap'
import { SettingsCategory } from '../../constants/enums'

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
          {SettingTabs.map((item, index) => {
            const settingItem: SettingInfo = {
              displayString: item.title,
              pageIndex: index,
              category: SettingsCategory.Macro
            }

            return (
              <SettingsButton
                setting={settingItem}
                index={index}
                key={item.title}
                setFocus={onSettingsButtonPress}
                isFocused={pageIndex == index}
              />
            )
          })}
        </VStack>
      </VStack>
    </Flex>
  )
}
