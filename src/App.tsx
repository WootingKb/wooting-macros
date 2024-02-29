import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react'
import Overview from './views/Overview'
import { ViewState } from './constants/enums'
import { useApplicationContext } from './contexts/applicationContext'
import Macroview from './views/Macroview'
import { useEffect } from 'react'
import data from '@emoji-mart/data'
import { init } from 'emoji-mart'
import './App.css'
import { MacroProvider } from './contexts/macroContext'
import MacroSettingsModal from './views/MacroSettingsModal'
import SettingsModal from './views/SettingsModal'

function App() {
  const { viewState, initComplete, appDebugMode } = useApplicationContext()
  const {
    isOpen: isOpenSettings,
    onOpen: onOpenSettings,
    onClose: onCloseSettings
  } = useDisclosure()
  const {
    isOpen: isOpenMacroSettings,
    onOpen: onOpenMacroSettings,
    onClose: onCloseMacroSettings
  } = useDisclosure()

  useEffect(() => {
    if (appDebugMode !== null && !appDebugMode) {
      // Disables Tauri right click context menu
      const handleContextMenuBlock = (event: MouseEvent): void => {
        event.preventDefault()
      }
      document.addEventListener('contextmenu', handleContextMenuBlock)

      // Ctrl + f is disabled with this event listener to whether the debug mode is on
      const handleKeyDownBlock = (event: KeyboardEvent): void => {
        if (event.ctrlKey && event.key.toLowerCase() === 'f') {
          event.preventDefault()
        }
        if (event.ctrlKey && event.key.toLowerCase() === 'r') {
          event.preventDefault()
        }
        if (event.key.toLowerCase() === 'f5') {
          event.preventDefault()
        }
      }
      document.addEventListener('keydown', handleKeyDownBlock)

      // Disable selectStart
      const handleSelectStartBlock = (event: Event): void => {
        event.preventDefault()
      }
      document.addEventListener('selectstart', handleSelectStartBlock)

      return () => {
        // Remove the listeners
        document.removeEventListener('contextmenu', handleContextMenuBlock)
        document.removeEventListener('keydown', handleKeyDownBlock)
        document.removeEventListener('selectstart', handleSelectStartBlock)
      }
    }
  }, [appDebugMode])

  useEffect(() => {
    init({ data })
  }, [])

  if (!initComplete) {
    return (
      <Flex h="100vh" justifyContent="center" alignItems="center">
        <Box zIndex={-1} pos="absolute" w="full" h="full" opacity={0.15} />
        <Text fontSize="4xl" fontWeight="bold">
          Loading...
        </Text>
      </Flex>
    )
  }

  return (
    <Flex h="100vh" pos="relative" direction="column">
      <Box zIndex={-1} pos="absolute" w="full" h="full" opacity={0.15} />
      {viewState === ViewState.Overview && (
        <Overview onOpenSettingsModal={onOpenSettings} />
      )}
      {viewState === ViewState.Addview && (
        <MacroProvider>
          <Macroview
            isEditing={false}
            onOpenMacroSettingsModal={onOpenMacroSettings}
          />
        </MacroProvider>
      )}
      {viewState === ViewState.Editview && (
        <MacroProvider>
          <Macroview
            isEditing={true}
            onOpenMacroSettingsModal={onOpenMacroSettings}
          />
        </MacroProvider>
      )}
      <SettingsModal isOpen={isOpenSettings} onClose={onCloseSettings} />
      <MacroSettingsModal
        isOpen={isOpenMacroSettings}
        onClose={onCloseMacroSettings}
      />
    </Flex>
  )
}

export default App
