export enum ViewState {
  Overview,
  Addview,
  Editview
}

/** Currently unused */
export enum MacroType {
  Single,
  Toggle,
  OnHold, // TODO: need to add space later when displaying the macro type name text
  RepeatX,
}



/** Currently unused */
export const MacroTypeDefinitions: string[] = [
  'SINGLE:\nThe macro will play once after the trigger key(s) is pressed.',
  'TOGGLE (BETA):\nThe macro will continuously repeat until the trigger key(s) is pressed again.',
  'ON HOLD (BETA):\nThe macro will only play while the trigger key(s) is pressed.',
  'REPEAT:\nThe macro will play X amount of times after the trigger key(s) is pressed.',
]

export enum KeyType {
  Down,
  Up,
  DownUp
}

export enum MouseButton {
  Left = 257,
  Right = 258,
  Middle = 259,
  Mouse4 = 260,
  Mouse5 = 261
}

export enum SettingsCategory {
  General,
  Macro,
  Other
}

export enum HIDCategory {
  Alphanumeric,
  Numpad,
  Function, // F1-24
  Modifier,
  Navigation, // arrow keys and pg up, pg down, etc
}

/** To be Expanded */
export enum PluginGroup {
  // e.g. PhillipsHue, or OBS
}