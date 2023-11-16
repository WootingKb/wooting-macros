import { MacroType, MouseButton, ViewState } from './constants/enums'
import { HidInfo } from './constants/HIDmap'
import { PluginEventInfo } from './constants/PluginsEventMap'

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
  changeViewState: (newState: ViewState) => void
  onCollectionAdd: (newCollection: Collection) => void
  onSelectedCollectionDelete: () => void
  onCollectionUpdate: (
    updatedCollection: Collection,
    collectionIndex: number
  ) => void
  changeSelectedCollectionIndex: (index: number) => void
  changeSelectedMacroIndex: (index: number | undefined) => void
  isMacroOutputEnabled: boolean
  changeMacroOutputEnabled: (value: boolean) => void
  appDebugMode: boolean | null
}

export type MacroState = {
  macro: Macro
  sequence: ActionEventType[]
  ids: number[]
  selectedElementId: number | undefined
  isUpdatingMacro: boolean
  canSaveMacro: boolean
  willCauseTriggerLooping: boolean
  updateMacroName: (newName: string) => void
  updateMacroIcon: (newIcon: string) => void
  updateMacroType: (newType: MacroType) => void
  updateMacroRepeatAmount: (newAmount: number) => void
  updateTrigger: (newElement: TriggerEventType) => void
  updateAllowWhileOtherKeys: (value: boolean) => void
  onElementAdd: (newElement: ActionEventType) => void
  onElementsAdd: (elements: ActionEventType[]) => void
  updateElement: (newElement: ActionEventType, index: number) => void
  onElementDelete: (index: number) => void
  overwriteSequence: (newSequence: ActionEventType[]) => void
  onIdAdd: (newId: number) => void
  onIdsAdd: (newIds: number[]) => void
  onIdDelete: (IdToRemove: number) => void
  overwriteIds: (newArray: number[]) => void
  updateSelectedElementId: (newIndex: number | undefined) => void
  updateMacro: () => void
  changeIsUpdatingMacro: (newVal: boolean) => void
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

// Input Event Types
export type TriggerEventType =
  | {
  type: 'KeyPressEvent'
  data: number[]
  allow_while_other_keys: boolean
}
  | { type: 'MouseEvent'; data: MouseButton }

export type KeyPressEventAction = {
  type: 'KeyPressEventAction'
  data: Keypress
}
export type DelayEventAction = { type: 'DelayEventAction'; data: number }
export type SystemEventAction = {
  type: 'SystemEventAction'
  data: SystemAction
}
export type MouseEventAction = { type: 'MouseEventAction'; data: MouseAction }

/** To be Extended */
export type ActionEventType =
  | KeyPressEventAction
  | DelayEventAction
  | SystemEventAction
  | MouseEventAction

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
  enabled: boolean
  macro_type: string
  trigger: TriggerEventType
  sequence: ActionEventType[]
  repeat_amount: number
}

export interface Collection {
  name: string
  enabled: boolean
  macros: Macro[]
  icon: string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'em-emoji': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        id?: string
        shortcodes?: string
        native?: string
        size?: string | number
        fallback?: string
        set?: 'native' | 'apple' | 'facebook' | 'google' | 'twitter'
        skin?: string | number
      }
    }
  }
}

// Action Event Structs - To be Extended
export interface Keypress {
  keypress: number
  press_duration: number
  keytype: string
}

export interface Monitor {
  device_id: string
  brightness: number
  display_name: string
}

export type MousePressAction =
  | { type: 'Down'; button: MouseButton }
  | { type: 'Up'; button: MouseButton }
  | { type: 'DownUp'; button: MouseButton; duration: number }

export type MouseAction = { type: 'Press'; data: MousePressAction }

export type SystemAction =
  | { type: 'Open'; action: DirectoryAction }
  | { type: 'Volume'; action: VolumeAction }
  | { type: 'Clipboard'; action: ClipboardAction }
// | { type: 'Brightness'; action: MonitorBrightnessAction }

export type DirectoryAction =
  | { type: 'Directory'; data: string }
  | { type: 'File'; data: string }
  | { type: 'Website'; data: string }

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
  | { type: 'SetAll'; level: number }
  | { type: 'SetSpecific'; level: number; name: string }
  | { type: 'ChangeSpecific'; by_how_much: number; name: string }
  | { type: 'ChangeAll'; by_how_much: number }

/** Misc */
export interface KeyboardKeyCategory {
  name: string
  elements: HidInfo[]
}

export interface PluginCategory {
  name: string
  elements: PluginEventInfo[]
}
