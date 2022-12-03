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
  isRenamingCollection: boolean
  changeViewState: (newState: ViewState) => void
  onCollectionAdd: (newCollection: Collection) => void
  onSelectedCollectionDelete: () => void
  onCollectionUpdate: (
    updatedCollection: Collection,
    collectionIndex: number
  ) => void
  changeSelectedCollectionIndex: (index: number) => void
  changeSelectedMacroIndex: (index: number | undefined) => void
  updateIsRenamingCollection: (newVal: boolean) => void
}

export type MacroState = {
  macro: Macro
  sequence: ActionEventType[]
  ids: number[]
  selectedElementId: number | undefined
  updateMacroName: (newName: string) => void
  updateMacroType: (newType: MacroType) => void
  updateTrigger: (newElement: TriggerEventType) => void
  updateAllowWhileOtherKeys: (value: boolean) => void
  onElementAdd: (newElement: ActionEventType) => void
  updateElement: (newElement: ActionEventType, index: number) => void
  onElementDelete: (index: number) => void
  overwriteSequence: (newSequence: ActionEventType[]) => void
  onIdAdd: (newId: number) => void
  onIdDelete: (IdToRemove: number) => void
  overwriteIds: (newArray: number[]) => void
  updateSelectedElementId: (newIndex: number | undefined) => void
  updateMacro: () => void
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
  | { type: 'Open'; path: string }
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
  | { type: 'Set'; level: number }
  | { type: 'Increase' }
  | { type: 'Decrease' }

// Input Event Types
export type TriggerEventType =
  | {
      type: 'KeyPressEvent'
      data: Keypress[]
      allow_while_other_keys: boolean
    }
  | { type: 'MouseEvent'; data: MouseButton }

export type TriggerTypes = Keypress[] | MouseButton[]

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

export interface Macro {
  name: string
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
