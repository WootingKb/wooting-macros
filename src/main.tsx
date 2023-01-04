import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { theme } from './theme/index'
import { ApplicationProvider } from './contexts/applicationContext'
import { SettingsProvider } from './contexts/settingsContext'
import '@fontsource/montserrat/800.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ApplicationProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </ApplicationProvider>
  </ChakraProvider>
)
