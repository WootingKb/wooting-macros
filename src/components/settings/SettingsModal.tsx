import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  HStack,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import AccessibilitySettings from './generalPages/AccessibilitySettings'
import AppearanceSettings from './generalPages/AppearanceSettings'
import IntegrationSettings from './generalPages/IntegrationSettings'
import LanguageSettings from './generalPages/LanguageSettings'
import WindowSettings from './generalPages/WindowSettings'
import Feedback from './otherPages/Feedback'
import Support from './otherPages/Support'
import Updates from './otherPages/Updates'
import SettingsLeftPanel from './SettingsLeftPanel'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const [pageIndex, setPageIndex] = useState(0)

  const SelectedPageComponent = useMemo(() => {
    switch (pageIndex) {
      case 0:
        return <WindowSettings />
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
      case 7:
        return <Feedback />
      default:
        return <></>
    }
  }, [pageIndex])

  return (
    <Modal isOpen={isOpen} size={'full'} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <HStack minH="100vh" spacing="0" overflow="hidden">
          <SettingsLeftPanel pageIndex={pageIndex} onSettingsButtonPress={setPageIndex}/>
          <ModalBody>{SelectedPageComponent}</ModalBody>
          <ModalCloseButton />
        </HStack>
      </ModalContent>
    </Modal>
  )
}
