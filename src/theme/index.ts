import { extendTheme } from '@chakra-ui/react'
import { config } from './config'
import { breakpoints } from './breakpoints'
import { Divider } from './components/divider'
import { textStyles } from './textStyles'
import { colors } from './colors'
import { styles } from './styles'
import { Button } from './components/button'
import { Tooltip } from './components/tooltip'
import { Kbd } from './components/keyboardKey'
import { Modal } from './components/modal'
import { Menu } from './components/menu'
import { Radio } from './components/radio'
import { NumberInput } from './components/numberInput'
import { Input } from './components/input'
import { Switch } from './components/switch'
import { Textarea } from './components/textArea'

const overrides = {
  config,
  styles,
  breakpoints,
  colors,
  components: {
    Divider,
    Button,
    Tooltip,
    Kbd,
    Modal,
    Menu,
    Radio,
    NumberInput,
    Input,
    Switch,
    Textarea
  },
  textStyles
}

export const theme = extendTheme(overrides)
