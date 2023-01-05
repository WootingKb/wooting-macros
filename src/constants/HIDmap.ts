import { HIDCategory } from './enums'

export interface HidInfo {
  HIDcode: number
  category: HIDCategory
  displayString: string
  webKeyId: string
  requiresLongDisplay: boolean
}

export class Hid {
  static get A(): HidInfo {
    return {
      HIDcode: 4,
      category: HIDCategory.Alphanumeric,
      displayString: 'A',
      webKeyId: 'KeyA',
      requiresLongDisplay: false
    }
  }
  static get B(): HidInfo {
    return {
      HIDcode: 5,
      category: HIDCategory.Alphanumeric,
      displayString: 'B',
      webKeyId: 'KeyB',
      requiresLongDisplay: false
    }
  }
  static get C(): HidInfo {
    return {
      HIDcode: 6,
      category: HIDCategory.Alphanumeric,
      displayString: 'C',
      webKeyId: 'KeyC',
      requiresLongDisplay: false
    }
  }
  static get D(): HidInfo {
    return {
      HIDcode: 7,
      category: HIDCategory.Alphanumeric,
      displayString: 'D',
      webKeyId: 'KeyD',
      requiresLongDisplay: false
    }
  }
  static get E(): HidInfo {
    return {
      HIDcode: 8,
      category: HIDCategory.Alphanumeric,
      displayString: 'E',
      webKeyId: 'KeyE',
      requiresLongDisplay: false
    }
  }
  static get F(): HidInfo {
    return {
      HIDcode: 9,
      category: HIDCategory.Alphanumeric,
      displayString: 'F',
      webKeyId: 'KeyF',
      requiresLongDisplay: false
    }
  }

  static get G(): HidInfo {
    return {
      HIDcode: 10,
      category: HIDCategory.Alphanumeric,
      displayString: 'G',
      webKeyId: 'KeyG',
      requiresLongDisplay: false
    }
  }
  static get H(): HidInfo {
    return {
      HIDcode: 11,
      category: HIDCategory.Alphanumeric,
      displayString: 'H',
      webKeyId: 'KeyH',
      requiresLongDisplay: false
    }
  }
  static get I(): HidInfo {
    return {
      HIDcode: 12,
      category: HIDCategory.Alphanumeric,
      displayString: 'I',
      webKeyId: 'KeyI',
      requiresLongDisplay: false
    }
  }
  static get J(): HidInfo {
    return {
      HIDcode: 13,
      category: HIDCategory.Alphanumeric,
      displayString: 'J',
      webKeyId: 'KeyJ',
      requiresLongDisplay: false
    }
  }
  static get K(): HidInfo {
    return {
      HIDcode: 14,
      category: HIDCategory.Alphanumeric,
      displayString: 'K',
      webKeyId: 'KeyK',
      requiresLongDisplay: false
    }
  }
  static get L(): HidInfo {
    return {
      HIDcode: 15,
      category: HIDCategory.Alphanumeric,
      displayString: 'L',
      webKeyId: 'KeyL',
      requiresLongDisplay: false
    }
  }
  static get M(): HidInfo {
    return {
      HIDcode: 16,
      category: HIDCategory.Alphanumeric,
      displayString: 'M',
      webKeyId: 'KeyM',
      requiresLongDisplay: false
    }
  }
  static get N(): HidInfo {
    return {
      HIDcode: 17,
      category: HIDCategory.Alphanumeric,
      displayString: 'N',
      webKeyId: 'KeyN',
      requiresLongDisplay: false
    }
  }
  static get O(): HidInfo {
    return {
      HIDcode: 18,
      category: HIDCategory.Alphanumeric,
      displayString: 'O',
      webKeyId: 'KeyO',
      requiresLongDisplay: false
    }
  }
  static get P(): HidInfo {
    return {
      HIDcode: 19,
      category: HIDCategory.Alphanumeric,
      displayString: 'P',
      webKeyId: 'KeyP',
      requiresLongDisplay: false
    }
  }

  static get Q(): HidInfo {
    return {
      HIDcode: 20,
      category: HIDCategory.Alphanumeric,
      displayString: 'Q',
      webKeyId: 'KeyQ',
      requiresLongDisplay: false
    }
  }
  static get R(): HidInfo {
    return {
      HIDcode: 21,
      category: HIDCategory.Alphanumeric,
      displayString: 'R',
      webKeyId: 'KeyR',
      requiresLongDisplay: false
    }
  }
  static get S(): HidInfo {
    return {
      HIDcode: 22,
      category: HIDCategory.Alphanumeric,
      displayString: 'S',
      webKeyId: 'KeyS',
      requiresLongDisplay: false
    }
  }
  static get T(): HidInfo {
    return {
      HIDcode: 23,
      category: HIDCategory.Alphanumeric,
      displayString: 'T',
      webKeyId: 'KeyT',
      requiresLongDisplay: false
    }
  }
  static get U(): HidInfo {
    return {
      HIDcode: 24,
      category: HIDCategory.Alphanumeric,
      displayString: 'U',
      webKeyId: 'KeyU',
      requiresLongDisplay: false
    }
  }
  static get V(): HidInfo {
    return {
      HIDcode: 25,
      category: HIDCategory.Alphanumeric,
      displayString: 'V',
      webKeyId: 'KeyV',
      requiresLongDisplay: false
    }
  }
  static get W(): HidInfo {
    return {
      HIDcode: 26,
      category: HIDCategory.Alphanumeric,
      displayString: 'W',
      webKeyId: 'KeyW',
      requiresLongDisplay: false
    }
  }
  static get X(): HidInfo {
    return {
      HIDcode: 27,
      category: HIDCategory.Alphanumeric,
      displayString: 'X',
      webKeyId: 'KeyX',
      requiresLongDisplay: false
    }
  }
  static get Y(): HidInfo {
    return {
      HIDcode: 28,
      category: HIDCategory.Alphanumeric,
      displayString: 'Y',
      webKeyId: 'KeyY',
      requiresLongDisplay: false
    }
  }
  static get Z(): HidInfo {
    return {
      HIDcode: 29,
      category: HIDCategory.Alphanumeric,
      displayString: 'Z',
      webKeyId: 'KeyZ',
      requiresLongDisplay: false
    }
  }

  static get N1(): HidInfo {
    return {
      HIDcode: 30,
      category: HIDCategory.Alphanumeric,
      displayString: '1',
      webKeyId: 'Digit1',
      requiresLongDisplay: false
    }
  }
  static get N2(): HidInfo {
    return {
      HIDcode: 31,
      category: HIDCategory.Alphanumeric,
      displayString: '2',
      webKeyId: 'Digit2',
      requiresLongDisplay: false
    }
  }
  static get N3(): HidInfo {
    return {
      HIDcode: 32,
      category: HIDCategory.Alphanumeric,
      displayString: '3',
      webKeyId: 'Digit3',
      requiresLongDisplay: false
    }
  }
  static get N4(): HidInfo {
    return {
      HIDcode: 33,
      category: HIDCategory.Alphanumeric,
      displayString: '4',
      webKeyId: 'Digit4',
      requiresLongDisplay: false
    }
  }
  static get N5(): HidInfo {
    return {
      HIDcode: 34,
      category: HIDCategory.Alphanumeric,
      displayString: '5',
      webKeyId: 'Digit5',
      requiresLongDisplay: false
    }
  }
  static get N6(): HidInfo {
    return {
      HIDcode: 35,
      category: HIDCategory.Alphanumeric,
      displayString: '6',
      webKeyId: 'Digit6',
      requiresLongDisplay: false
    }
  }
  static get N7(): HidInfo {
    return {
      HIDcode: 36,
      category: HIDCategory.Alphanumeric,
      displayString: '7',
      webKeyId: 'Digit7',
      requiresLongDisplay: false
    }
  }
  static get N8(): HidInfo {
    return {
      HIDcode: 37,
      category: HIDCategory.Alphanumeric,
      displayString: '8',
      webKeyId: 'Digit8',
      requiresLongDisplay: false
    }
  }
  static get N9(): HidInfo {
    return {
      HIDcode: 38,
      category: HIDCategory.Alphanumeric,
      displayString: '9',
      webKeyId: 'Digit9',
      requiresLongDisplay: false
    }
  }
  static get N0(): HidInfo {
    return {
      HIDcode: 39,
      category: HIDCategory.Alphanumeric,
      displayString: '0',
      webKeyId: 'Digit0',
      requiresLongDisplay: false
    }
  }

  static get ENTER(): HidInfo {
    return {
      HIDcode: 40,
      category: HIDCategory.Alphanumeric,
      displayString: 'Enter',
      webKeyId: 'Enter',
      requiresLongDisplay: false
    }
  }
  static get ESCAPE(): HidInfo {
    return {
      HIDcode: 41,
      category: HIDCategory.Alphanumeric,
      displayString: 'Escape',
      webKeyId: 'Escape',
      requiresLongDisplay: true
    }
  }
  static get BACKSPACE(): HidInfo {
    return {
      HIDcode: 42,
      category: HIDCategory.Alphanumeric,
      displayString: 'Backspace',
      webKeyId: 'Backspace',
      requiresLongDisplay: true
    }
  }
  static get TAB(): HidInfo {
    return {
      HIDcode: 43,
      category: HIDCategory.Alphanumeric,
      displayString: 'Tab',
      webKeyId: 'Tab',
      requiresLongDisplay: false
    }
  }
  static get SPACE(): HidInfo {
    return {
      HIDcode: 44,
      category: HIDCategory.Alphanumeric,
      displayString: 'Space',
      webKeyId: 'Space',
      requiresLongDisplay: true
    }
  }
  static get MINUS(): HidInfo {
    return {
      HIDcode: 45,
      category: HIDCategory.Alphanumeric,
      displayString: '-',
      webKeyId: 'Minus',
      requiresLongDisplay: false
    }
  }
  static get EQUAL(): HidInfo {
    return {
      HIDcode: 46,
      category: HIDCategory.Alphanumeric,
      displayString: '=',
      webKeyId: 'Equal',
      requiresLongDisplay: false
    }
  }
  static get BRACKETL(): HidInfo {
    return {
      HIDcode: 47,
      category: HIDCategory.Alphanumeric,
      displayString: '[',
      webKeyId: 'BracketLeft',
      requiresLongDisplay: false
    }
  }
  static get BRACKETR(): HidInfo {
    return {
      HIDcode: 48,
      category: HIDCategory.Alphanumeric,
      displayString: ']',
      webKeyId: 'BracketRight',
      requiresLongDisplay: false
    }
  }
  static get BACKSLASH(): HidInfo {
    return {
      HIDcode: 49,
      category: HIDCategory.Alphanumeric,
      displayString: '\\',
      webKeyId: 'Backslash',
      requiresLongDisplay: false
    }
  }

  static get SEMICOLON(): HidInfo {
    return {
      HIDcode: 51,
      category: HIDCategory.Alphanumeric,
      displayString: ';',
      webKeyId: 'Semicolon',
      requiresLongDisplay: false
    }
  }
  static get QUOTE(): HidInfo {
    return {
      HIDcode: 52,
      category: HIDCategory.Alphanumeric,
      displayString: '"',
      webKeyId: 'Quote',
      requiresLongDisplay: false
    }
  }
  static get BACKQUOTE(): HidInfo {
    return {
      HIDcode: 53,
      category: HIDCategory.Alphanumeric,
      displayString: '`',
      webKeyId: 'Backquote',
      requiresLongDisplay: false
    }
  }
  static get COMMA(): HidInfo {
    return {
      HIDcode: 54,
      category: HIDCategory.Alphanumeric,
      displayString: ',',
      webKeyId: 'Comma',
      requiresLongDisplay: false
    }
  }
  static get PERIOD(): HidInfo {
    return {
      HIDcode: 55,
      category: HIDCategory.Alphanumeric,
      displayString: '.',
      webKeyId: 'Period',
      requiresLongDisplay: false
    }
  }
  static get SLASH(): HidInfo {
    return {
      HIDcode: 56,
      category: HIDCategory.Alphanumeric,
      displayString: '/',
      webKeyId: 'Slash',
      requiresLongDisplay: false
    }
  }
  static get CAPSLOCK(): HidInfo {
    return {
      HIDcode: 57,
      category: HIDCategory.Alphanumeric,
      displayString: 'Caps Lock',
      webKeyId: 'CapsLock',
      requiresLongDisplay: true
    }
  }
  static get F1(): HidInfo {
    return {
      HIDcode: 58,
      category: HIDCategory.Function,
      displayString: 'F1',
      webKeyId: 'F1',
      requiresLongDisplay: false
    }
  }
  static get F2(): HidInfo {
    return {
      HIDcode: 59,
      category: HIDCategory.Function,
      displayString: 'F2',
      webKeyId: 'F2',
      requiresLongDisplay: false
    }
  }

  static get F3(): HidInfo {
    return {
      HIDcode: 60,
      category: HIDCategory.Function,
      displayString: 'F3',
      webKeyId: 'F3',
      requiresLongDisplay: false
    }
  }
  static get F4(): HidInfo {
    return {
      HIDcode: 61,
      category: HIDCategory.Function,
      displayString: 'F4',
      webKeyId: 'F4',
      requiresLongDisplay: false
    }
  }
  static get F5(): HidInfo {
    return {
      HIDcode: 62,
      category: HIDCategory.Function,
      displayString: 'F5',
      webKeyId: 'F5',
      requiresLongDisplay: false
    }
  }
  static get F6(): HidInfo {
    return {
      HIDcode: 63,
      category: HIDCategory.Function,
      displayString: 'F6',
      webKeyId: 'F6',
      requiresLongDisplay: false
    }
  }
  static get F7(): HidInfo {
    return {
      HIDcode: 64,
      category: HIDCategory.Function,
      displayString: 'F7',
      webKeyId: 'F7',
      requiresLongDisplay: false
    }
  }
  static get F8(): HidInfo {
    return {
      HIDcode: 65,
      category: HIDCategory.Function,
      displayString: 'F8',
      webKeyId: 'F8',
      requiresLongDisplay: false
    }
  }
  static get F9(): HidInfo {
    return {
      HIDcode: 66,
      category: HIDCategory.Function,
      displayString: 'F9',
      webKeyId: 'F9',
      requiresLongDisplay: false
    }
  }
  static get F10(): HidInfo {
    return {
      HIDcode: 67,
      category: HIDCategory.Function,
      displayString: 'F10',
      webKeyId: 'F10',
      requiresLongDisplay: false
    }
  }
  static get F11(): HidInfo {
    return {
      HIDcode: 68,
      category: HIDCategory.Function,
      displayString: 'F11',
      webKeyId: 'F11',
      requiresLongDisplay: false
    }
  }
  static get F12(): HidInfo {
    return {
      HIDcode: 69,
      category: HIDCategory.Function,
      displayString: 'F12',
      webKeyId: 'F12',
      requiresLongDisplay: false
    }
  }

  static get PRINTSCREEN(): HidInfo {
    return {
      HIDcode: 70,
      category: HIDCategory.Modifier,
      displayString: 'Print Screen',
      webKeyId: 'PrintScreen',
      requiresLongDisplay: true
    }
  }
  static get SCROLLLOCK(): HidInfo {
    return {
      HIDcode: 71,
      category: HIDCategory.Modifier,
      displayString: 'Scroll Lock',
      webKeyId: 'ScrollLock',
      requiresLongDisplay: true
    }
  }
  static get PAUSE(): HidInfo {
    return {
      HIDcode: 72,
      category: HIDCategory.Modifier,
      displayString: 'Pause',
      webKeyId: 'Pause',
      requiresLongDisplay: false
    }
  }
  static get INSERT(): HidInfo {
    return {
      HIDcode: 73,
      category: HIDCategory.Navigation,
      displayString: 'Insert',
      webKeyId: 'Insert',
      requiresLongDisplay: false
    }
  }
  static get HOME(): HidInfo {
    return {
      HIDcode: 74,
      category: HIDCategory.Navigation,
      displayString: 'Home',
      webKeyId: 'Home',
      requiresLongDisplay: false
    }
  }
  static get PAGEUP(): HidInfo {
    return {
      HIDcode: 75,
      category: HIDCategory.Navigation,
      displayString: 'Page Up',
      webKeyId: 'PageUp',
      requiresLongDisplay: true
    }
  }
  static get DELETE(): HidInfo {
    return {
      HIDcode: 76,
      category: HIDCategory.Navigation,
      displayString: 'Delete',
      webKeyId: 'Delete',
      requiresLongDisplay: false
    }
  }
  static get END(): HidInfo {
    return {
      HIDcode: 77,
      category: HIDCategory.Navigation,
      displayString: 'End',
      webKeyId: 'End',
      requiresLongDisplay: false
    }
  }
  static get PAGEDOWN(): HidInfo {
    return {
      HIDcode: 78,
      category: HIDCategory.Navigation,
      displayString: 'Page Down',
      webKeyId: 'PageDown',
      requiresLongDisplay: true
    }
  }
  static get ARROWR(): HidInfo {
    return {
      HIDcode: 79,
      category: HIDCategory.Navigation,
      displayString: 'Right Arrow',
      webKeyId: 'ArrowRight',
      requiresLongDisplay: true
    }
  }

  static get ARROWL(): HidInfo {
    return {
      HIDcode: 80,
      category: HIDCategory.Navigation,
      displayString: 'Left Arrow',
      webKeyId: 'ArrowLeft',
      requiresLongDisplay: true
    }
  }
  static get ARROWD(): HidInfo {
    return {
      HIDcode: 81,
      category: HIDCategory.Navigation,
      displayString: 'Down Arrow',
      webKeyId: 'ArrowDown',
      requiresLongDisplay: true
    }
  }
  static get ARROWU(): HidInfo {
    return {
      HIDcode: 82,
      category: HIDCategory.Navigation,
      displayString: 'Up Arrow',
      webKeyId: 'ArrowUp',
      requiresLongDisplay: true
    }
  }
  static get NUMLOCK(): HidInfo {
    return {
      HIDcode: 83,
      category: HIDCategory.Numpad,
      displayString: 'Num Lock',
      webKeyId: 'NumLock',
      requiresLongDisplay: true
    }
  }
  static get NUMDIVIDE(): HidInfo {
    return {
      HIDcode: 84,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Divide',
      webKeyId: 'NumpadDivide',
      requiresLongDisplay: true
    }
  }
  static get NUMMULTIPLY(): HidInfo {
    return {
      HIDcode: 85,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Multiply',
      webKeyId: 'NumpadMultiply',
      requiresLongDisplay: true
    }
  }
  static get NUMSUBTRACT(): HidInfo {
    return {
      HIDcode: 86,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Subtract',
      webKeyId: 'NumpadSubtract',
      requiresLongDisplay: true
    }
  }
  static get NUMADD(): HidInfo {
    return {
      HIDcode: 87,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Add',
      webKeyId: 'NumpadAdd',
      requiresLongDisplay: true
    }
  }
  static get NUMENTER(): HidInfo {
    return {
      HIDcode: 88,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Enter',
      webKeyId: 'NumpadEnter',
      requiresLongDisplay: true
    }
  }
  static get NP1(): HidInfo {
    return {
      HIDcode: 89,
      category: HIDCategory.Numpad,
      displayString: 'NP1',
      webKeyId: 'Numpad1',
      requiresLongDisplay: false
    }
  }

  static get NP2(): HidInfo {
    return {
      HIDcode: 90,
      category: HIDCategory.Numpad,
      displayString: 'NP2',
      webKeyId: 'Numpad2',
      requiresLongDisplay: false
    }
  }
  static get NP3(): HidInfo {
    return {
      HIDcode: 91,
      category: HIDCategory.Numpad,
      displayString: 'NP3',
      webKeyId: 'Numpad3',
      requiresLongDisplay: false
    }
  }
  static get NP4(): HidInfo {
    return {
      HIDcode: 92,
      category: HIDCategory.Numpad,
      displayString: 'NP4',
      webKeyId: 'Numpad4',
      requiresLongDisplay: false
    }
  }
  static get NP5(): HidInfo {
    return {
      HIDcode: 93,
      category: HIDCategory.Numpad,
      displayString: 'NP5',
      webKeyId: 'Numpad5',
      requiresLongDisplay: false
    }
  }
  static get NP6(): HidInfo {
    return {
      HIDcode: 94,
      category: HIDCategory.Numpad,
      displayString: 'NP6',
      webKeyId: 'Numpad6',
      requiresLongDisplay: false
    }
  }
  static get NP7(): HidInfo {
    return {
      HIDcode: 95,
      category: HIDCategory.Numpad,
      displayString: 'NP7',
      webKeyId: 'Numpad7',
      requiresLongDisplay: false
    }
  }
  static get NP8(): HidInfo {
    return {
      HIDcode: 96,
      category: HIDCategory.Numpad,
      displayString: 'NP8',
      webKeyId: 'Numpad8',
      requiresLongDisplay: false
    }
  }
  static get NP9(): HidInfo {
    return {
      HIDcode: 97,
      category: HIDCategory.Numpad,
      displayString: 'NP9',
      webKeyId: 'Numpad9',
      requiresLongDisplay: false
    }
  }
  static get NP0(): HidInfo {
    return {
      HIDcode: 98,
      category: HIDCategory.Numpad,
      displayString: 'NP0',
      webKeyId: 'Numpad0',
      requiresLongDisplay: false
    }
  }
  static get NUMDECIMAL(): HidInfo {
    return {
      HIDcode: 99,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Decimal',
      webKeyId: 'NumpadDecimal',
      requiresLongDisplay: true
    }
  }

  static get F13(): HidInfo {
    return {
      HIDcode: 104,
      category: HIDCategory.Function,
      displayString: 'F13',
      webKeyId: 'F13',
      requiresLongDisplay: false
    }
  }
  static get F14(): HidInfo {
    return {
      HIDcode: 105,
      category: HIDCategory.Function,
      displayString: 'F14',
      webKeyId: 'F14',
      requiresLongDisplay: false
    }
  }
  static get F15(): HidInfo {
    return {
      HIDcode: 106,
      category: HIDCategory.Function,
      displayString: 'F15',
      webKeyId: 'F15',
      requiresLongDisplay: false
    }
  }
  static get F16(): HidInfo {
    return {
      HIDcode: 107,
      category: HIDCategory.Function,
      displayString: 'F16',
      webKeyId: 'F16',
      requiresLongDisplay: false
    }
  }
  static get F17(): HidInfo {
    return {
      HIDcode: 108,
      category: HIDCategory.Function,
      displayString: 'F17',
      webKeyId: 'F17',
      requiresLongDisplay: false
    }
  }
  static get F18(): HidInfo {
    return {
      HIDcode: 109,
      category: HIDCategory.Function,
      displayString: 'F18',
      webKeyId: 'F18',
      requiresLongDisplay: false
    }
  }
  static get F19(): HidInfo {
    return {
      HIDcode: 110,
      category: HIDCategory.Function,
      displayString: 'F19',
      webKeyId: 'F19',
      requiresLongDisplay: false
    }
  }
  static get F20(): HidInfo {
    return {
      HIDcode: 111,
      category: HIDCategory.Function,
      displayString: 'F20',
      webKeyId: 'F20',
      requiresLongDisplay: false
    }
  }
  static get F21(): HidInfo {
    return {
      HIDcode: 112,
      category: HIDCategory.Function,
      displayString: 'F21',
      webKeyId: 'F21',
      requiresLongDisplay: false
    }
  }
  static get F22(): HidInfo {
    return {
      HIDcode: 113,
      category: HIDCategory.Function,
      displayString: 'F22',
      webKeyId: 'F22',
      requiresLongDisplay: false
    }
  }
  static get F23(): HidInfo {
    return {
      HIDcode: 114,
      category: HIDCategory.Function,
      displayString: 'F23',
      webKeyId: 'F23',
      requiresLongDisplay: false
    }
  }
  static get F24(): HidInfo {
    return {
      HIDcode: 115,
      category: HIDCategory.Function,
      displayString: 'F24',
      webKeyId: 'F24',
      requiresLongDisplay: false
    }
  }

  static get CONTROLL(): HidInfo {
    return {
      HIDcode: 224,
      category: HIDCategory.Modifier,
      displayString: 'L-CTRL',
      webKeyId: 'ControlLeft',
      requiresLongDisplay: false
    }
  }
  static get SHIFTL(): HidInfo {
    return {
      HIDcode: 225,
      category: HIDCategory.Modifier,
      displayString: 'L-SHIFT',
      webKeyId: 'ShiftLeft',
      requiresLongDisplay: false
    }
  }
  static get ALTL(): HidInfo {
    return {
      HIDcode: 226,
      category: HIDCategory.Modifier,
      displayString: 'L-ALT',
      webKeyId: 'AltLeft',
      requiresLongDisplay: false
    }
  }
  static get METAL(): HidInfo {
    return {
      HIDcode: 227,
      category: HIDCategory.Modifier,
      displayString: 'L-Win/Super/Command',
      webKeyId: 'MetaLeft',
      requiresLongDisplay: true
    }
  }
  static get CONTROLR(): HidInfo {
    return {
      HIDcode: 228,
      category: HIDCategory.Modifier,
      displayString: 'R-CTRL',
      webKeyId: 'ControlRight',
      requiresLongDisplay: false
    }
  }
  static get SHIFTR(): HidInfo {
    return {
      HIDcode: 229,
      category: HIDCategory.Modifier,
      displayString: 'R-SHIFT',
      webKeyId: 'ShiftRight',
      requiresLongDisplay: false
    }
  }
  static get ALTR(): HidInfo {
    return {
      HIDcode: 230,
      category: HIDCategory.Modifier,
      displayString: 'R-ALT',
      webKeyId: 'AltRight',
      requiresLongDisplay: false
    }
  }
  static get METAR(): HidInfo {
    return {
      HIDcode: 231,
      category: HIDCategory.Modifier,
      displayString: 'R-Win/Super/Command',
      webKeyId: 'MetaRight',
      requiresLongDisplay: true
    }
  }

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
    Hid.TAB,
    Hid.BACKSPACE,
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
    Hid.CAPSLOCK,
    Hid.SLASH,
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
    Hid.F13,
    Hid.F14,
    Hid.F15,
    Hid.F16,
    Hid.F17,
    Hid.F18,
    Hid.F19,
    Hid.F20,
    Hid.F21,
    Hid.F22,
    Hid.F23,
    Hid.F24,
    Hid.SHIFTL,
    Hid.CONTROLL,
    Hid.ALTL,
    Hid.METAL,
    Hid.SHIFTR,
    Hid.CONTROLR,
    Hid.ALTR,
    Hid.METAR
  ]
}

export const webCodeHIDLookup = new Map<string, HidInfo>(
  Hid.all
    .filter((hid) => hid.webKeyId !== undefined)
    .map((hid) => [hid.webKeyId!, hid])
)
export const HIDLookup = new Map<number, HidInfo>(
  Hid.all
    .filter((hid) => hid.HIDcode !== undefined)
    .map((hid) => [hid.HIDcode!, hid])
)
