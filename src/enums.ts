export enum ViewState {
  Overview,
  Addview,
  Editview
}

export enum RecordingType {
  Trigger,
  Sequence
}

export enum MacroType {
  Single,
  Toggle,
  OnHold // need to add space later when displaying the macro type name text
}

export const MacroTypeDefinitions: string[] = [
  'The macro will play once after the trigger key(s) is pressed.',
  'The macro will continuously repeat until the trigger key(s) is pressed again.',
  'The macro will only play while the trigger key(s) is pressed.'
]

export enum KeyType {
  Down,
  Up,
  DownUp
}

export enum MouseButton {
  Left = 1,
  Right = 2,
  Middle = 3,
  Mouse4 = 4,
  Mouse5 = 5
}

export enum VolumeAction {
  LowerVolume,
  IncreaseVolume,
  ToggleMute
}
