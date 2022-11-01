enum HidCategory {
  General,
  LeftModifier,
  RightModifier,
  Numpad,
  Misc,
}

export interface HidInfo {
  byte: number
  id: string
  category: HidCategory
  icon?: string
  vkCode: number
  webKeyId: string
}

export class Hid {
  static get A(): HidInfo { return {byte: 1, id: 'A', category: HidCategory.General, vkCode: 65, webKeyId: "KeyA" } }
  static get B(): HidInfo { return {byte: 2, id: 'B', category: HidCategory.General, vkCode: 66, webKeyId: "KeyB" } }
  static get C(): HidInfo { return {byte: 3, id: 'C', category: HidCategory.General, vkCode: 67, webKeyId: "KeyC" } }
  static get D(): HidInfo { return {byte: 4, id: 'D', category: HidCategory.General, vkCode: 68, webKeyId: "KeyD" } }
  static get E(): HidInfo { return {byte: 5, id: 'E', category: HidCategory.General, vkCode: 69, webKeyId: "KeyE" } }
  static get F(): HidInfo { return {byte: 6, id: 'F', category: HidCategory.General, vkCode: 70, webKeyId: "KeyF" } }
  static get G(): HidInfo { return {byte: 7, id: 'G', category: HidCategory.General, vkCode: 71, webKeyId: "KeyG" } }
  static get H(): HidInfo { return {byte: 8, id: 'H', category: HidCategory.General, vkCode: 72, webKeyId: "KeyH" } }
  static get I(): HidInfo { return {byte: 9, id: 'I', category: HidCategory.General, vkCode: 73, webKeyId: "KeyI" } }
  static get J(): HidInfo { return {byte: 10, id: 'J', category: HidCategory.General, vkCode: 74, webKeyId: "KeyJ" } }
  static get K(): HidInfo { return {byte: 11, id: 'K', category: HidCategory.General, vkCode: 75, webKeyId: "KeyK" } }
  static get L(): HidInfo { return {byte: 12, id: 'L', category: HidCategory.General, vkCode: 76, webKeyId: "KeyL" } }
  static get M(): HidInfo { return {byte: 13, id: 'M', category: HidCategory.General, vkCode: 77, webKeyId: "KeyM" } }
  static get N(): HidInfo { return {byte: 14, id: 'N', category: HidCategory.General, vkCode: 78, webKeyId: "KeyN" } }
  static get O(): HidInfo { return {byte: 15, id: 'O', category: HidCategory.General, vkCode: 79, webKeyId: "KeyO" } }
  static get P(): HidInfo { return {byte: 16, id: 'P', category: HidCategory.General, vkCode: 80, webKeyId: "KeyP" } }
  static get Q(): HidInfo { return {byte: 17, id: 'Q', category: HidCategory.General, vkCode: 81, webKeyId: "KeyQ" } }
  static get R(): HidInfo { return {byte: 18, id: 'R', category: HidCategory.General, vkCode: 82, webKeyId: "KeyR" } }
  static get S(): HidInfo { return {byte: 19, id: 'S', category: HidCategory.General, vkCode: 83, webKeyId: "KeyS" } }
  static get T(): HidInfo { return {byte: 20, id: 'T', category: HidCategory.General, vkCode: 84, webKeyId: "KeyT" } }
  static get U(): HidInfo { return {byte: 21, id: 'U', category: HidCategory.General, vkCode: 85, webKeyId: "KeyU" } }
  static get V(): HidInfo { return {byte: 22, id: 'V', category: HidCategory.General, vkCode: 86, webKeyId: "KeyV" } }
  static get W(): HidInfo { return {byte: 23, id: 'W', category: HidCategory.General, vkCode: 87, webKeyId: "KeyW" } }
  static get X(): HidInfo { return {byte: 24, id: 'X', category: HidCategory.General, vkCode: 88, webKeyId: "KeyX" } }
  static get Y(): HidInfo { return {byte: 25, id: 'Y', category: HidCategory.General, vkCode: 89, webKeyId: "KeyY" } }
  static get Z(): HidInfo { return {byte: 26, id: 'Z', category: HidCategory.General, vkCode: 90, webKeyId: "KeyZ" } }
  
  static get N0(): HidInfo { return {byte: 27, id: '0', category: HidCategory.General, vkCode: 48, webKeyId: "Digit0" } }
  static get N1(): HidInfo { return {byte: 28, id: '1', category: HidCategory.General, vkCode: 49, webKeyId: "Digit1" } }
  static get N2(): HidInfo { return {byte: 29, id: '2', category: HidCategory.General, vkCode: 50, webKeyId: "Digit2" } }
  static get N3(): HidInfo { return {byte: 30, id: '3', category: HidCategory.General, vkCode: 51, webKeyId: "Digit3" } }
  static get N4(): HidInfo { return {byte: 31, id: '4', category: HidCategory.General, vkCode: 52, webKeyId: "Digit4" } }
  static get N5(): HidInfo { return {byte: 32, id: '5', category: HidCategory.General, vkCode: 53, webKeyId: "Digit5" } }
  static get N6(): HidInfo { return {byte: 33, id: '6', category: HidCategory.General, vkCode: 54, webKeyId: "Digit6" } }
  static get N7(): HidInfo { return {byte: 34, id: '7', category: HidCategory.General, vkCode: 55, webKeyId: "Digit7" } }
  static get N8(): HidInfo { return {byte: 35, id: '8', category: HidCategory.General, vkCode: 56, webKeyId: "Digit8" } }
  static get N9(): HidInfo { return {byte: 36, id: '9', category: HidCategory.General, vkCode: 57, webKeyId: "Digit9" } }

  static get NP0(): HidInfo { return {byte: 37, id: '0', category: HidCategory.Numpad, vkCode: 96, webKeyId: "Numpad0" } }
  static get NP1(): HidInfo { return {byte: 38, id: '1', category: HidCategory.Numpad, vkCode: 97, webKeyId: "Numpad1" } }
  static get NP2(): HidInfo { return {byte: 39, id: '2', category: HidCategory.Numpad, vkCode: 98, webKeyId: "Numpad2" } }
  static get NP3(): HidInfo { return {byte: 40, id: '3', category: HidCategory.Numpad, vkCode: 99, webKeyId: "Numpad3" } }
  static get NP4(): HidInfo { return {byte: 41, id: '4', category: HidCategory.Numpad, vkCode: 100, webKeyId: "Numpad4" } }
  static get NP5(): HidInfo { return {byte: 42, id: '5', category: HidCategory.Numpad, vkCode: 101, webKeyId: "Numpad5" } }
  static get NP6(): HidInfo { return {byte: 43, id: '6', category: HidCategory.Numpad, vkCode: 102, webKeyId: "Numpad6" } }
  static get NP7(): HidInfo { return {byte: 44, id: '7', category: HidCategory.Numpad, vkCode: 103, webKeyId: "Numpad7" } }
  static get NP8(): HidInfo { return {byte: 45, id: '8', category: HidCategory.Numpad, vkCode: 104, webKeyId: "Numpad8" } }
  static get NP9(): HidInfo { return {byte: 46, id: '9', category: HidCategory.Numpad, vkCode: 105, webKeyId: "Numpad9" } }

  static get ENTER(): HidInfo { return {byte: 47, id: 'Enter', category: HidCategory.General, vkCode: 13, webKeyId: "Enter" } }
  static get ESCAPE(): HidInfo { return {byte: 48, id: 'Escape', category: HidCategory.General, vkCode: 27, webKeyId: "Escape" } }
  static get BACKSPACE(): HidInfo { return {byte: 49, id: 'Backspace', category: HidCategory.General, vkCode: 8, webKeyId: "Backspace" } }
  static get TAB(): HidInfo { return {byte: 50, id: 'Tab', category: HidCategory.General, vkCode: 9, webKeyId: "Tab" } }
  static get SPACE(): HidInfo { return {byte: 51, id: 'Space', category: HidCategory.General, vkCode: 32, webKeyId: "Space" } }
  static get MINUS(): HidInfo { return {byte: 52, id: '-', category: HidCategory.General, vkCode: 189, webKeyId: "Minus" } }
  static get EQUAL(): HidInfo { return {byte: 53, id: '=', category: HidCategory.General, vkCode: 187, webKeyId: "Equal" } }
  static get BRACKETL(): HidInfo { return {byte: 54, id: '[', category: HidCategory.General, vkCode: 219, webKeyId: "BracketLeft" } }
  static get BRACKETR(): HidInfo { return {byte: 55, id: ']', category: HidCategory.General, vkCode: 221, webKeyId: "BracketRight" } }
  static get BACKSLASH(): HidInfo { return {byte: 56, id: '\\', category: HidCategory.General, vkCode: 220, webKeyId: "Backslash" } }
  static get SEMICOLON(): HidInfo { return {byte: 57, id: ';', category: HidCategory.General, vkCode: 186, webKeyId: "Semicolon" } }
  static get QUOTE(): HidInfo { return {byte: 58, id: '"', category: HidCategory.General, vkCode: 222, webKeyId: "Quote" } }
  static get BACKQUOTE(): HidInfo { return {byte: 59, id: '`', category: HidCategory.General, vkCode: 192, webKeyId: "Backquote" } }
  static get COMMA(): HidInfo { return {byte: 60, id: ',', category: HidCategory.General, vkCode: 188, webKeyId: "Comma" } }
  static get PERIOD(): HidInfo { return {byte: 61, id: '.', category: HidCategory.General, vkCode: 190, webKeyId: "Period" } }
  static get SLASH(): HidInfo { return {byte: 62, id: '/', category: HidCategory.General, vkCode: 191, webKeyId: "Slash" } }
  static get CAPSLOCK(): HidInfo { return {byte: 63, id: 'Caps Lock', category: HidCategory.General, vkCode: 20, webKeyId: "CapsLock" } }

  static get F1(): HidInfo { return {byte: 64, id: 'F1', category: HidCategory.General, vkCode: 112, webKeyId: "F1" } }
  static get F2(): HidInfo { return {byte: 65, id: 'F2', category: HidCategory.General, vkCode: 113, webKeyId: "F2" } }
  static get F3(): HidInfo { return {byte: 66, id: 'F3', category: HidCategory.General, vkCode: 114, webKeyId: "F3" } }
  static get F4(): HidInfo { return {byte: 67, id: 'F4', category: HidCategory.General, vkCode: 115, webKeyId: "F4" } }
  static get F5(): HidInfo { return {byte: 68, id: 'F5', category: HidCategory.General, vkCode: 116, webKeyId: "F5" } }
  static get F6(): HidInfo { return {byte: 69, id: 'F6', category: HidCategory.General, vkCode: 117, webKeyId: "F6" } }
  static get F7(): HidInfo { return {byte: 70, id: 'F7', category: HidCategory.General, vkCode: 118, webKeyId: "F7" } }
  static get F8(): HidInfo { return {byte: 71, id: 'F8', category: HidCategory.General, vkCode: 119, webKeyId: "F8" } }
  static get F9(): HidInfo { return {byte: 72, id: 'F9', category: HidCategory.General, vkCode: 120, webKeyId: "F9" } }
  static get F10(): HidInfo { return {byte: 73, id: 'F10', category: HidCategory.General, vkCode: 121, webKeyId: "F10" } }
  static get F11(): HidInfo { return {byte: 74, id: 'F11', category: HidCategory.General, vkCode: 122, webKeyId: "F11" } }
  static get F12(): HidInfo { return {byte: 75, id: 'F12', category: HidCategory.General, vkCode: 123, webKeyId: "F12" } }

  static get PRINTSCREEN(): HidInfo { return {byte: 76, id: 'Print Screen', category: HidCategory.General, vkCode: 44, webKeyId: "PrintScreen" } }
  static get SCROLLLOCK(): HidInfo { return {byte: 77, id: 'Scroll Lock', category: HidCategory.General, vkCode: 145, webKeyId: "ScrollLock" } }
  static get PAUSE(): HidInfo { return {byte: 78, id: 'Pause', category: HidCategory.General, vkCode: 19, webKeyId: "Pause" } }
  static get INSERT(): HidInfo { return {byte: 79, id: 'Insert', category: HidCategory.General, vkCode: 45, webKeyId: "Insert" } }
  static get HOME(): HidInfo { return {byte: 80, id: 'Home', category: HidCategory.General, vkCode: 36, webKeyId: "Home" } }
  static get PAGEUP(): HidInfo { return {byte: 81, id: 'Page Up', category: HidCategory.General, vkCode: 33, webKeyId: "PageUp" } }
  static get DELETE(): HidInfo { return {byte: 82, id: 'Delete', category: HidCategory.General, vkCode: 46, webKeyId: "Delete" } }
  static get END(): HidInfo { return {byte: 83, id: 'End', category: HidCategory.General, vkCode: 35, webKeyId: "End" } }
  static get PAGEDOWN(): HidInfo { return {byte: 84, id: 'Page Down', category: HidCategory.General, vkCode: 34, webKeyId: "PageDown" } }

  static get ARROWR(): HidInfo { return {byte: 85, id: 'Right Arrow', category: HidCategory.General, vkCode: 39, webKeyId: "ArrowRight" } }
  static get ARROWL(): HidInfo { return {byte: 86, id: 'Left Arrow', category: HidCategory.General, vkCode: 37, webKeyId: "ArrowLeft" } }
  static get ARROWD(): HidInfo { return {byte: 87, id: 'Down Arrow', category: HidCategory.General, vkCode: 40, webKeyId: "ArrowDown" } }
  static get ARROWU(): HidInfo { return {byte: 88, id: 'Up Arrow', category: HidCategory.General, vkCode: 38, webKeyId: "ArrowUp" } }
  
  static get NUMLOCK(): HidInfo { return {byte: 89, id: 'Num Lock', category: HidCategory.Numpad, vkCode: 44, webKeyId: "NumLock" } }
  static get NUMDIVIDE(): HidInfo { return {byte: 90, id: 'Numpad Divide', category: HidCategory.Numpad, vkCode: 111, webKeyId: "NumpadDivide" } }
  static get NUMMULTIPLY(): HidInfo { return {byte: 91, id: 'Numpad Multiply', category: HidCategory.Numpad, vkCode: 106, webKeyId: "NumpadMultiply" } }
  static get NUMSUBTRACT(): HidInfo { return {byte: 92, id: 'Numpad Subtract', category: HidCategory.Numpad, vkCode: 109, webKeyId: "NumpadSubtract" } }
  static get NUMADD(): HidInfo { return {byte: 93, id: 'Numpad Add', category: HidCategory.Numpad, vkCode: 107, webKeyId: "NumpadAdd" } }
  static get NUMENTER(): HidInfo { return {byte: 94, id: 'Numpad Enter', category: HidCategory.Numpad, vkCode: 13, webKeyId: "NumpadEnter" } }
  static get NUMDECIMAL(): HidInfo { return {byte: 95, id: 'Numpad Decimal', category: HidCategory.Numpad, vkCode: 110, webKeyId: "NumpadDecimal" } }

  static get SHIFTL(): HidInfo { return {byte: 96, id: 'Left Shift', category: HidCategory.LeftModifier, vkCode: 16, webKeyId: "ShiftLeft" } }
  static get CONTROLL(): HidInfo { return {byte: 97, id: 'Left Control', category: HidCategory.LeftModifier, vkCode: 17, webKeyId: "ControlLeft" } }
  static get ALTL(): HidInfo { return {byte: 98, id: 'Left Alt', category: HidCategory.LeftModifier, vkCode: 18, webKeyId: "AltLeft" } }
  static get METAL(): HidInfo { return {byte: 99, id: 'Left Meta', category: HidCategory.LeftModifier, vkCode: 91, webKeyId: "MetaLeft" } }

  static get SHIFTR(): HidInfo { return {byte: 100, id: 'Right Shift', category: HidCategory.RightModifier, vkCode: 16, webKeyId: "ShiftRight" } }
  static get CONTROLR(): HidInfo { return {byte: 101, id: 'Right Control', category: HidCategory.RightModifier, vkCode: 17, webKeyId: "ControlRight" } }
  static get ALTR(): HidInfo { return {byte: 102, id: 'Right Alt', category: HidCategory.RightModifier, vkCode: 18, webKeyId: "AltRight" } }
  static get METAR(): HidInfo { return {byte: 103, id: 'Right Meta', category: HidCategory.RightModifier, vkCode: 92, webKeyId: "MetaRight" } }

  static readonly all: HidInfo[] = [
    Hid.A,
    Hid.B,
    Hid.C,
    Hid.D,
    Hid.E,
    Hid.F,
    Hid.G,
    Hid.H,
    Hid.I,
    Hid.J,
    Hid.K,
    Hid.L,
    Hid.M,
    Hid.N,
    Hid.O,
    Hid.P,
    Hid.Q,
    Hid.R,
    Hid.S,
    Hid.T,
    Hid.U,
    Hid.V,
    Hid.W,
    Hid.X,
    Hid.Y,
    Hid.Z,
    Hid.N0,
    Hid.N1,
    Hid.N2,
    Hid.N3,
    Hid.N4,
    Hid.N5,
    Hid.N6,
    Hid.N7,
    Hid.N8,
    Hid.N9,
    Hid.NP0,
    Hid.NP1,
    Hid.NP2,
    Hid.NP3,
    Hid.NP4,
    Hid.NP5,
    Hid.NP6,
    Hid.NP7,
    Hid.NP8,
    Hid.NP9,
    Hid.ENTER,
    Hid.ESCAPE,
    Hid.BACKSPACE,
    Hid.TAB,
    Hid.SPACE,
    Hid.MINUS,
    Hid.EQUAL,
    Hid.BRACKETL,
    Hid.BRACKETR,
    Hid.BACKSLASH,
    Hid.SEMICOLON,
    Hid.QUOTE,
    Hid.BACKQUOTE,
    Hid.COMMA,
    Hid.PERIOD,
    Hid.SLASH,
    Hid.CAPSLOCK,
    Hid.F1,
    Hid.F2,
    Hid.F3,
    Hid.F4,
    Hid.F5,
    Hid.F6,
    Hid.F7,
    Hid.F8,
    Hid.F9,
    Hid.F10,
    Hid.F11,
    Hid.F12,
    Hid.PRINTSCREEN,
    Hid.SCROLLLOCK,
    Hid.PAUSE,
    Hid.INSERT,
    Hid.HOME,
    Hid.PAGEUP,
    Hid.DELETE,
    Hid.END,
    Hid.PAGEDOWN,
    Hid.ARROWR,
    Hid.ARROWL,
    Hid.ARROWD,
    Hid.ARROWU,
    Hid.NUMLOCK,
    Hid.NUMDIVIDE,
    Hid.NUMMULTIPLY,
    Hid.NUMSUBTRACT,
    Hid.NUMADD,
    Hid.NUMENTER,
    Hid.NUMDECIMAL,
    Hid.SHIFTL,
    Hid.CONTROLL,
    Hid.ALTL,
    Hid.METAL,
    Hid.SHIFTR,
    Hid.CONTROLR,
    Hid.ALTR,
    Hid.METAR,
  ]
}

export const webCodeHIDLookup = new Map<string, HidInfo>(
  Hid.all
    .filter(hid => hid.webKeyId !== undefined)
    .map(hid => [hid.webKeyId!, hid])
)
export const HIDLookup = new Map<number, HidInfo>(
  Hid.all
    .filter(hid => hid.vkCode !== undefined)
    .map(hid => [hid.vkCode!, hid])
)