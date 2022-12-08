import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  HStack,
  VStack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { settingInfoLookup } from '../../maps/SettingsMap'
import AccessibilitySettings from './generalPages/AccessibilitySettings'
import AppearanceSettings from './generalPages/AppearanceSettings'
import IntegrationSettings from './generalPages/IntegrationSettings'
import LanguageSettings from './generalPages/LanguageSettings'
import ApplicationSettings from './generalPages/ApplicationSettings'
import Support from './otherPages/Support'
import Updates from './otherPages/Updates'
import SettingsLeftPanel from '../../components/settings/SettingsLeftPanel'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const [pageIndex, setPageIndex] = useState(0)
  const rightPanelBg = useColorModeValue('white', 'gray.800')
  const leftPanelBg = useColorModeValue('gray.100', 'gray.900')

  useEffect(() => {
    setPageIndex(0)
  }, [isOpen])

  const SelectedPageComponent = useMemo(() => {
    switch (pageIndex) {
      case 0:
        return <ApplicationSettings />
      case 1:
        return <AppearanceSettings />
      case 2:
        return <AccessibilitySettings />
      case 3:
        return <LanguageSettings />
      case 4:
        return <IntegrationSettings />
      case 5:
        return <Updates />
      case 6:
        return <Support />
      default:
        return <></>
    }
  }, [pageIndex])

  return (
    <Modal
      isOpen={isOpen}
      size={'full'}
      onClose={onClose}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <HStack
          justifyContent="center"
          bgGradient={`linear(to-r, ${leftPanelBg}, ${leftPanelBg}, ${rightPanelBg}, ${rightPanelBg})`}
        >
          <HStack
            w={['100%', '95%', '75%', '65%', '50%']}
            minH="100vh"
            spacing="0"
            overflow="hidden"
          >
            <SettingsLeftPanel
              pageIndex={pageIndex}
              onSettingsButtonPress={setPageIndex}
            />
              <ModalBody h="100vh" bg={rightPanelBg}>
                <VStack w="95%" justifyContent="left" py="8" spacing={4}>
                  <Text w="100%" fontWeight="bold" fontSize="large">
                    {settingInfoLookup.get(pageIndex)?.displayString}
                  </Text>
                  {SelectedPageComponent}
                </VStack>
              </ModalBody>
            <ModalCloseButton />
          </HStack>
        </HStack>
      </ModalContent>
    </Modal>
  )
}
