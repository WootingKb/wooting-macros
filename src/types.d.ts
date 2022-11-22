import { ViewState } from './enums'

// Contexts
export interface CurrentSelection {
  collectionIndex: number
  macroIndex: number
}

export type AppState = {
  viewState: ViewState
  collections: Collection[]
  initComplete: boolean
  selection: CurrentSelection
  changeViewState: (newState: ViewState) => void
  onCollectionAdd: (newCollection: Collection) => void
  onSelectedCollectionDelete: () => void
  onCollectionUpdate: (updatedCollection: Collection) => void
  changeSelectedCollectionIndex: (index: number) => void
  changeSelectedMacroIndex: (index: number) => void
}

export type SequenceState = {
  sequence: ActionEventType[]
  ids: number[]
  selectedElementId: number
  onElementAdd: (element: ActionEventType) => void
  onSelectedElementDelete: () => void
  overwriteSequence: (newSequence: ActionEventType[]) => void
  onIdAdd: (elementToAdd: number) => void
  onIdDelete: (elementToRemove: number) => void
  overwriteIds: (newArray: number[]) => void
  updateSelectedElementId: (newIndex: number) => void
}

// Action Event Structs
export interface Keypress {
  keypress: number
  press_duration: number
  keytype: string
}

export type SystemAction =
  | { type: 'Open'; data: string }
  | { type: 'Volume'; data: SystemVolumeAction }
  | { type: 'Brightness'; data: undefined }

export type SystemVolumeAction =
  | { type: 'Mute'; data: boolean }
  | { type: 'SetVolume'; data: number }

// Input Event Types
export type TriggerEventType = {
  type: 'KeyPressEvent'
  data: Keypress[]
  allow_while_other_keys: boolean
}

export type ActionEventType =
  | { type: 'KeyPressEvent'; data: Keypress }
  | { type: 'Delay'; data: number }
  | { type: 'SystemEvent'; data: SystemAction }

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
  name: string // unique key
  active: boolean
  macros: Macro[]
  icon: string
}
