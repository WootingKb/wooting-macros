import {
  Divider,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import useScrollbarStyles from '../hooks/useScrollbarStyles'
import useMainBgColour from '../hooks/useMainBgColour'
import NotificationMacroSettingsPanel from '../components/macrosettings/NotificationMacroSettingsPanel'
import DefaultMacroSettings from '../components/macrosettings/DefaultMacroSettings'
import MacroSettingsLeftPanel from '../components/macrosettings/MacroSettingsLeftPanel'

type Props = {
  isOpen: boolean
  onClose: () => void
}

interface SettingsTabDefinition {
  title: string
  component: () => React.ReactNode
}

export const SettingTabs: SettingsTabDefinition[] = [
  {
    title: 'Macro Defaults',
    component: () => <DefaultMacroSettings />
  },
  {
    title: 'Notifications',
    component: () => <NotificationMacroSettingsPanel />
  }
]
export default function MacroSettingsModal({ isOpen, onClose }: Props) {
  const [pageIndex, setPageIndex] = useState(0)
  const rightPanelBg = useMainBgColour()
  const leftPanelBg = useColorModeValue('primary-light.50', 'bg-dark')

  useEffect(() => {
    setPageIndex(0)
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      size="2xl"
      variant="brand"
      onClose={onClose}
      scrollBehavior="inside"
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent>
        <HStack
          w="full"
          minW="100px"
          minH="100px"
          spacing="0"
          gap={0}
          overflow="hidden"
          justifyContent="center"
          bgGradient={`linear(to-r, ${leftPanelBg}, ${leftPanelBg}, ${rightPanelBg}, ${rightPanelBg})`}
        >
          <MacroSettingsLeftPanel
            pageIndex={pageIndex}
            onSettingsButtonPress={setPageIndex}
          />
          <Flex
            w="full"
            h="100vh"
            bg={rightPanelBg}
            py={16}
            pl={10}
            gap={0}
            flexGrow={1}
            flexShrink={1}
            flexBasis="800px"
            alignItems="flex-start"
            overflow="auto"
            sx={useScrollbarStyles()}
          >
            <ModalBody w="full" p={0}>
              <VStack w="full" justifyContent="center" spacing={2} p={2}>
                <Text
                  w="full"
                  align="center"
                  fontWeight="bold"
                  fontSize="large"
                >
                  {SettingTabs[pageIndex].title + ' Settings'}
                </Text>
                <Divider></Divider>
                {SettingTabs[pageIndex].component()}
              </VStack>
            </ModalBody>
          </Flex>
          <ModalCloseButton />
        </HStack>
      </ModalContent>
    </Modal>
  )
}
