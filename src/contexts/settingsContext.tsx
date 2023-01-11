import { useColorMode, useToast } from '@chakra-ui/react'
import { invoke } from '@tauri-apps/api'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { ApplicationConfig, SettingsState } from '../types'
import { updateSettings } from '../constants/utils'

type SettingsProviderProps = { children: ReactNode }

const SettingsContext = createContext<SettingsState | undefined>(undefined)

function useSettingsContext() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider')
  }
  return context
}

function SettingsProvider({ children }: SettingsProviderProps) {
  const [config, setConfig] = useState<ApplicationConfig>({
    AutoStart: false,
    DefaultDelayValue: 20,
    AutoAddDelay: false,
    AutoSelectElement: true,
    MinimizeAtLaunch: false,
    Theme: 'light',
    MinimizeToTray: true
  })
  const toast = useToast()

  const { setColorMode } = useColorMode()

  useEffect(() => {
    invoke<ApplicationConfig>('get_config')
      .then((res) => {
        setConfig(res)
      })
      .catch((e) => {
        console.error(e)
        toast({
          title: 'Error loading settings',
          description: 'Unable to load settings, please re-open the app.',
          status: 'error',
          duration: 2000,
          isClosable: true
        })
      })
  }, [toast])

  useEffect(() => {
    updateSettings(config)
  }, [config])

  const updateLaunchOnStartup = useCallback((value: boolean) => {
    setConfig((config) => {
      return { ...config, AutoStart: value }
    })
  }, [])
  const updateMinimizeOnStartup = useCallback((value: boolean) => {
    setConfig((config) => {
      return { ...config, MinimizeAtLaunch: value }
    })
  }, [])
  const updateMinimizeOnClose = useCallback((value: boolean) => {
    setConfig((config) => {
      return { ...config, MinimizeToTray: value }
    })
  }, [])
  const updateAutoAddDelay = useCallback((value: boolean) => {
    setConfig((config) => {
      return { ...config, AutoAddDelay: value }
    })
  }, [])
  const updateDefaultDelayVal = useCallback((value: string) => {
    setConfig((config) => {
      return { ...config, DefaultDelayValue: Number(value) }
    })
  }, [])
  const updateAutoSelectElement = useCallback((value: boolean) => {
    setConfig((config) => {
      return { ...config, AutoSelectElement: value }
    })
  }, [])
  const updateTheme = useCallback(
    (value: string) => {
      setConfig((config) => {
        return { ...config, Theme: value }
      })
      setColorMode(value)
    },
    [setColorMode]
  )

  const value = useMemo<SettingsState>(
    () => ({
      config,
      updateLaunchOnStartup,
      updateMinimizeOnStartup,
      updateMinimizeOnClose,
      updateAutoAddDelay,
      updateDefaultDelayVal,
      updateAutoSelectElement,
      updateTheme
    }),
    [
      config,
      updateLaunchOnStartup,
      updateMinimizeOnStartup,
      updateMinimizeOnClose,
      updateAutoAddDelay,
      updateDefaultDelayVal,
      updateAutoSelectElement,
      updateTheme
    ]
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export { SettingsProvider, useSettingsContext }
