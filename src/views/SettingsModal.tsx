import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  HStack,
  VStack,
  Text,
  useColorModeValue,
  Flex
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { settingInfoLookup } from '../constants/SettingsMap'
import AccessibilitySettingsPanel from '../components/settings/AccessibilitySettingsPanel'
import AppearanceSettingsPanel from '../components/settings/AppearanceSettingsPanel'
import IntegrationSettingsPanel from '../components/settings/IntegrationSettingsPanel'
import LanguageSettingsPanel from '../components/settings/LanguageSettingsPanel'
import ApplicationSettingsPanel from '../components/settings/ApplicationSettingsPanel'
import PatchNotesPanel from '../components/settings/PatchNotesPanel'
import SettingsLeftPanel from '../components/settings/SettingsLeftPanel'
import useScrollbarStyles from '../hooks/useScrollbarStyles'
import useMainBgColour from '../hooks/useMainBgColour'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const [pageIndex, setPageIndex] = useState(0)
  const rightPanelBg = useMainBgColour()
  const leftPanelBg = useColorModeValue('primary-light.50', 'bg-dark')

  useEffect(() => {
    setPageIndex(0)
  }, [isOpen])

  const SelectedPageComponent = useMemo(() => {
    switch (pageIndex) {
      case 0:
        return <ApplicationSettingsPanel />
      case 1:
        return <AppearanceSettingsPanel />
      case 2:
        return <AccessibilitySettingsPanel />
      case 3:
        return <LanguageSettingsPanel />
      case 4:
        return <IntegrationSettingsPanel />
      case 5:
        return <PatchNotesPanel />
      default:
        return <></>
    }
  }, [pageIndex])

  return (
    <Modal
      isOpen={isOpen}
      size={'full'}
      variant="brand"
      onClose={onClose}
      scrollBehavior="inside"
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent>
        <HStack
          w="full"
          minH="100vh"
          spacing="0"
          gap={0}
          overflow="hidden"
          justifyContent="center"
          bgGradient={`linear(to-r, ${leftPanelBg}, ${leftPanelBg}, ${rightPanelBg}, ${rightPanelBg})`}
        >
          <SettingsLeftPanel
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
              <VStack w="600px" justifyContent="left" spacing={4}>
                <Text w="full" fontWeight="bold" fontSize="large">
                  {settingInfoLookup.get(pageIndex)?.displayString}
                </Text>
                {SelectedPageComponent}
              </VStack>
            </ModalBody>
          </Flex>
          <ModalCloseButton />
        </HStack>
      </ModalContent>
    </Modal>
  )
}
