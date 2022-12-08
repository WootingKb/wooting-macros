import { MacroType, ViewState, MouseButton } from './enums'

// Contexts
export interface CurrentSelection {
  collectionIndex: number
  macroIndex: number | undefined
}

export type AppState = {
  viewState: ViewState
  collections: Collection[]
  initComplete: boolean
  selection: CurrentSelection
  isUpdatingCollection: boolean
  changeViewState: (newState: ViewState) => void
  onCollectionAdd: (newCollection: Collection) => void
  onSelectedCollectionDelete: () => void
  onCollectionUpdate: (
    updatedCollection: Collection,
    collectionIndex: number
  ) => void
  changeSelectedCollectionIndex: (index: number) => void
  changeSelectedMacroIndex: (index: number | undefined) => void
  changeIsUpdatingCollection: (newVal: boolean) => void
}

export type MacroState = {
  macro: Macro
  sequence: ActionEventType[]
  ids: number[]
  selectedElementId: number | undefined
  updateMacroName: (newName: string) => void
  updateMacroIcon: (newIcon: string) => void
  updateMacroType: (newType: MacroType) => void
  updateTrigger: (newElement: TriggerEventType) => void
  updateAllowWhileOtherKeys: (value: boolean) => void
  onElementAdd: (newElement: ActionEventType) => void
  onElementsAdd: (elements: ActionEventType[]) => void
  updateElement: (newElement: ActionEventType, index: number) => void
  onElementDelete: (index: number) => void
  overwriteSequence: (newSequence: ActionEventType[]) => void
  onIdAdd: (newId: number) => void
  onIdDelete: (IdToRemove: number) => void
  overwriteIds: (newArray: number[]) => void
  updateSelectedElementId: (newIndex: number | undefined) => void
  updateMacro: () => void
}

export type SettingsState = {
  config: ApplicationConfig
  updateLaunchOnStartup: (value: boolean) => void
  updateMinimizeOnStartup: (value: boolean) => void
  updateMinimizeOnClose: (value: boolean) => void
  updateAutoAddDelay: (value: boolean) => void
  updateDefaultDelayVal: (value: string) => void
  updateAutoSelectElement: (value: boolean) => void
  updateTheme: (value: string) => void
}

// Action Event Structs
export interface Keypress {
  keypress: number
  press_duration: number
  keytype: string
}

export interface Monitor {
  name: string
  current_brightness: number
  description: string
  registery_key: string
}

export type MousePressAction =
  | { type: 'Down'; button: MouseButton }
  | { type: 'Up'; button: MouseButton }
  | { type: 'DownUp'; button: MouseButton; duration: number }

export type MouseAction = { type: 'Press'; data: MousePressAction }

export type SystemAction =
  | { type: 'Open'; action: string }
  | { type: 'Volume'; action: VolumeAction }
  | { type: 'Clipboard'; action: ClipboardAction }
  | { type: 'Brightness'; action: MonitorBrightnessAction }

export type ClipboardAction =
  | { type: 'SetClipboard'; data: string }
  | { type: 'Copy' }
  | { type: 'GetClipboard' }
  | { type: 'Paste' }
  | { type: 'PasteUserDefinedString'; data: string }
  | { type: 'Sarcasm' }

export type VolumeAction =
  | { type: 'LowerVolume' }
  | { type: 'IncreaseVolume' }
  | { type: 'ToggleMute' }

export type MonitorBrightnessAction =
  | { type: 'Get' }
  | { type: 'Set'; level: number; name: string }
  | { type: 'SetAll'; level: number }
  | { type: 'Increase' }
  | { type: 'Decrease' }

// Input Event Types
export type TriggerEventType =
  | {
      type: 'KeyPressEvent'
      data: number[]
      allow_while_other_keys: boolean
    }
  | { type: 'MouseEvent'; data: MouseButton }

export type ActionEventType =
  | { type: 'KeyPressEventAction'; data: Keypress }
  | { type: 'DelayEventAction'; data: number }
  | { type: 'SystemEventAction'; data: SystemAction }
  | { type: 'MouseEventAction'; data: MouseAction }
  | { type: 'PhillipsHueEventAction'; data: undefined }

// Main Data Structures
export interface MacroData {
  data: Collection[]
}

export interface ApplicationConfig {
  AutoStart: boolean
  DefaultDelayValue: number
  AutoAddDelay: boolean
  AutoSelectElement: boolean
  MinimizeAtLaunch: boolean
  Theme: string
  MinimizeToTray: boolean
}

export interface Macro {
  name: string
  icon: string
  active: boolean
  macro_type: string
  trigger: TriggerEventType
  sequence: ActionEventType[]
}

export interface Collection {
  name: string
  active: boolean
  macros: Macro[]
  icon: string
}

// Misc
export interface ApplicationSetting {
  name: string
  desc: string
  type: 'numberInput' | 'toggle'
}

export interface ApplicationSettingsSubCategory {
  name: string
  settings: ApplicationSetting[]
}
