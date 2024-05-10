import { invoke } from '@tauri-apps/api/tauri'
import { HIDCategory, MouseButton } from './enums'
import {
  ActionEventType,
  ApplicationConfig,
  Collection,
  Keypress,
  MacroData, MacroIndividualCommand,
  MousePressAction
} from '../types'
import { HIDLookup } from './HIDmap'
import { mouseEnumLookup } from './MouseMap'
import { sysEventLookup } from './SystemEventMap'
import { MacroDataInterface } from "../components/macroview/topArea/MacroStateButtons";

export const updateBackendConfig = (
  collections: Collection[]
): Promise<void> => {
  const macroData: MacroData = { data: collections }
  return invoke<void>('set_macros', { frontendData: macroData })
}

export const updateSettings = (newConfig: ApplicationConfig): Promise<void> => {
  return invoke<void>('set_config', { config: newConfig })
}

export const updateMacroOutput = (value: boolean): Promise<void> => {
  return invoke<void>('control_grabbing', {
    frontendBool: !value
  })
}
export const executeMacro = ({ macro_data }: MacroDataInterface, action: MacroIndividualCommand): Promise<void> => {
  return invoke<void>('execute_macro', {
    macroName: macro_data.name,
    actionType: action,
  })
}
export const isDebug = (): Promise<boolean> => {
  return invoke<boolean>('is_debug', {})
}

export const checkIfMouseButtonArray = (
  items: number[] | MouseButton[]
): items is MouseButton[] => {
  return Object.keys(MouseButton).includes(
    (items as MouseButton[])[0].toString()
  )
}

export const checkIfKeypress = (
  e: Keypress | MousePressAction | undefined
): e is Keypress => {
  return (e as Keypress).keypress !== undefined
}

export const checkIfMouseButton = (
  e: Keypress | MousePressAction | undefined
): e is MousePressAction => {
  return (e as MousePressAction).button !== undefined
}

/** Currently unused, if Macro types are added back this can probably be refactored elsewhere */
export const checkIfStringIsNonNumeric = (value: string): boolean => {
  return !(isNaN(Number(value)) === false)
}

export const checkIfModifierKey = (hid: number): boolean => {
  return HIDLookup.get(hid)?.category === HIDCategory.Modifier
}

export function checkIfKeyShouldContinueTriggerRecording(hid: number): boolean {
  const hidEntry = HIDLookup.get(hid)
  if (!hidEntry) return false
  return (
    hidEntry.category === HIDCategory.Modifier ||
    hidEntry.allowAtStartOfTrigger === true
  )
}

export const checkIfElementIsEditable = (element: ActionEventType): boolean => {
  if (element.type === 'SystemEventAction') {
    switch (element.data.type) {
      case 'Open':
        return true
      case 'Clipboard':
        if (element.data.action.type === 'PasteUserDefinedString') {
          return true
        }
        return false
      default:
        return false
    }
  } else {
    return true
  }
}

export const getElementDisplayString = (element: ActionEventType): string => {
  switch (element.type) {
    case 'KeyPressEventAction':
      return HIDLookup.get(element.data.keypress)?.displayString || 'error'
    case 'DelayEventAction':
      return element.data.toString() + ' ms'
    case 'MouseEventAction':
      return (
        mouseEnumLookup.get(element.data.data.button)?.displayString || 'error'
      )
    case 'SystemEventAction':
      switch (element.data.type) {
        case 'Open':
          if (element.data.action.data !== '') {
            return `Open ${element.data.action.type.toString()}: ${
              element.data.action.data
            }`
          }
          return (
            sysEventLookup.get(element.data.action.type)?.displayString ||
            'error'
          )
        case 'Volume':
          return (
            sysEventLookup.get(element.data.action.type)?.displayString ||
            'error'
          )
        case 'Clipboard':
          if (
            element.data.action.type === 'PasteUserDefinedString' &&
            element.data.action.data !== ''
          ) {
            return 'Paste Text: ' + element.data.action.data
          }
          return (
            sysEventLookup.get(element.data.action.type)?.displayString ||
            'error'
          )
        default:
          return 'error'
      }
  }
}

export const scrollbarStylesLight = {
  '&::-webkit-scrollbar': {
    width: '8px'
  },
  '&::-webkit-scrollbar-track': {
    background: '#D5DAE2',
    borderRadius: 'lg'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#9EAABD',
    borderRadius: 'lg'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#8392AA',
    borderRadius: 'lg'
  }
}

export const scrollbarsStylesDark = {
  '&::-webkit-scrollbar': {
    width: '8px'
  },
  '&::-webkit-scrollbar-track': {
    background: '#27272a',
    borderRadius: 'lg'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#3f3f46',
    borderRadius: 'lg'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#52525b',
    borderRadius: 'lg'
  }
}



