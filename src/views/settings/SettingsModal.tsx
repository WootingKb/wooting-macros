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
  useColorMode,
  Flex
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { settingInfoLookup } from '../../constants/SettingsMap'
import AccessibilitySettings from './generalPages/AccessibilitySettings'
import AppearanceSettings from './generalPages/AppearanceSettings'
import IntegrationSettings from './generalPages/IntegrationSettings'
import LanguageSettings from './generalPages/LanguageSettings'
import ApplicationSettings from './generalPages/ApplicationSettings'
import Support from './otherPages/Support'
import Updates from './otherPages/Updates'
import SettingsLeftPanel from '../../components/settings/SettingsLeftPanel'
import {
  scrollbarStylesLight,
  scrollbarsStylesDark
} from '../../constants/utils'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const [pageIndex, setPageIndex] = useState(0)
  const { colorMode } = useColorMode()
  const rightPanelBg = useColorModeValue('bg-light', 'primary-dark.900')
  const leftPanelBg = useColorModeValue('primary-light.50', 'bg-dark')

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
      variant="brand"
      onClose={onClose}
      scrollBehavior="inside"
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
            sx={
              colorMode === 'light'
                ? scrollbarStylesLight
                : scrollbarsStylesDark
            }
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
