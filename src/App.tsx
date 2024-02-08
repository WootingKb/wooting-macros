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
      document.addEventListener('contextmenu', (event) =>
        event.preventDefault()
      )
      // Ctrl + f is disabled with this event listener to whether the debug mode is on
      document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key.toLowerCase() === 'f') {
          event.preventDefault()
        }
        if (event.ctrlKey && event.key.toLowerCase() === 'r') {
          event.preventDefault()
        }
        if (event.key.toLowerCase() === 'f5') {
          event.preventDefault()
        }
      })
      document.addEventListener('selectstart', (event) =>
        event.preventDefault()
      )

      return () => {
        document.removeEventListener('contextmenu', (event) =>
          event.preventDefault()
        )
        document.removeEventListener('keydown', (event) => {
          if (event.ctrlKey && event.key.toLowerCase() === 'f') {
            event.preventDefault()
          }
          if (event.ctrlKey && event.key.toLowerCase() === 'r') {
            event.preventDefault()
          }
          if (event.key.toLowerCase() === 'f5') {
            event.preventDefault()
          }
        })
        document.removeEventListener('selectstart', (event) =>
          event.preventDefault()
        )
      }
    }
  }, [appDebugMode])

  useEffect(() => {
    init({ data })
  })

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
