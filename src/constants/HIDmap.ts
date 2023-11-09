import { HIDCategory } from './enums'

export interface HidInfo {
  HIDcode: number
  category: HIDCategory
  displayString: string
  webKeyId: string
  whichID: number
  colSpan?: number
  allowAtStartOfTrigger?: boolean
}

export class Hid {
  static get A(): HidInfo {
    return {
      HIDcode: 4,
      category: HIDCategory.Alphanumeric,
      displayString: 'A',
      webKeyId: 'KeyA',
      whichID: 6510,
    }
  }

  static get B(): HidInfo {
    return {
      HIDcode: 5,
      category: HIDCategory.Alphanumeric,
      displayString: 'B',
      webKeyId: 'KeyB',
      whichID: 6610,
    }
  }

  static get C(): HidInfo {
    return {
      HIDcode: 6,
      category: HIDCategory.Alphanumeric,
      displayString: 'C',
      webKeyId: 'KeyC',
      whichID: 6710,

    }
  }

  static get D(): HidInfo {
    return {
      HIDcode: 7,
      category: HIDCategory.Alphanumeric,
      displayString: 'D',
      webKeyId: 'KeyD',
      whichID: 6810,

    }
  }

  static get E(): HidInfo {
    return {
      HIDcode: 8,
      category: HIDCategory.Alphanumeric,
      displayString: 'E',
      webKeyId: 'KeyE',
      whichID: 6910,
    }
  }

  static get F(): HidInfo {
    return {
      HIDcode: 9,
      category: HIDCategory.Alphanumeric,
      displayString: 'F',
      webKeyId: 'KeyF',
      whichID: 7010
    }
  }

  static get G(): HidInfo {
    return {
      HIDcode: 10,
      category: HIDCategory.Alphanumeric,
      displayString: 'G',
      webKeyId: 'KeyG',
      whichID: 7110

    }
  }

  static get H(): HidInfo {
    return {
      HIDcode: 11,
      category: HIDCategory.Alphanumeric,
      displayString: 'H',
      webKeyId: 'KeyH',
      whichID: 7210
    }
  }

  static get I(): HidInfo {
    return {
      HIDcode: 12,
      category: HIDCategory.Alphanumeric,
      displayString: 'I',
      webKeyId: 'KeyI',
      whichID: 7310
    }
  }

  static get J(): HidInfo {
    return {
      HIDcode: 13,
      category: HIDCategory.Alphanumeric,
      displayString: 'J',
      webKeyId: 'KeyJ',
      whichID: 7410
    }
  }

  static get K(): HidInfo {
    return {
      HIDcode: 14,
      category: HIDCategory.Alphanumeric,
      displayString: 'K',
      webKeyId: 'KeyK',
      whichID: 7510
    }
  }

  static get L(): HidInfo {
    return {
      HIDcode: 15,
      category: HIDCategory.Alphanumeric,
      displayString: 'L',
      webKeyId: 'KeyL',
      whichID: 7610
    }
  }

  static get M(): HidInfo {
    return {
      HIDcode: 16,
      category: HIDCategory.Alphanumeric,
      displayString: 'M',
      webKeyId: 'KeyM',
      whichID: 7710
    }
  }

  static get N(): HidInfo {
    return {
      HIDcode: 17,
      category: HIDCategory.Alphanumeric,
      displayString: 'N',
      webKeyId: 'KeyN',
      whichID: 7810
    }
  }

  static get O(): HidInfo {
    return {
      HIDcode: 18,
      category: HIDCategory.Alphanumeric,
      displayString: 'O',
      webKeyId: 'KeyO',
      whichID: 7910
    }
  }

  static get P(): HidInfo {
    return {
      HIDcode: 19,
      category: HIDCategory.Alphanumeric,
      displayString: 'P',
      webKeyId: 'KeyP',
      whichID: 8010
    }
  }

  static get Q(): HidInfo {
    return {
      HIDcode: 20,
      category: HIDCategory.Alphanumeric,
      displayString: 'Q',
      webKeyId: 'KeyQ',
      whichID: 8110
    }
  }

  static get R(): HidInfo {
    return {
      HIDcode: 21,
      category: HIDCategory.Alphanumeric,
      displayString: 'R',
      webKeyId: 'KeyR',
      whichID: 8210
    }
  }

  static get S(): HidInfo {
    return {
      HIDcode: 22,
      category: HIDCategory.Alphanumeric,
      displayString: 'S',
      webKeyId: 'KeyS',
      whichID: 8310
    }
  }

  static get T(): HidInfo {
    return {
      HIDcode: 23,
      category: HIDCategory.Alphanumeric,
      displayString: 'T',
      webKeyId: 'KeyT',
      whichID: 8410
    }
  }

  static get U(): HidInfo {
    return {
      HIDcode: 24,
      category: HIDCategory.Alphanumeric,
      displayString: 'U',
      webKeyId: 'KeyU',
      whichID: 8510
    }
  }

  static get V(): HidInfo {
    return {
      HIDcode: 25,
      category: HIDCategory.Alphanumeric,
      displayString: 'V',
      webKeyId: 'KeyV',
      whichID: 8610
    }
  }

  static get W(): HidInfo {
    return {
      HIDcode: 26,
      category: HIDCategory.Alphanumeric,
      displayString: 'W',
      webKeyId: 'KeyW',
      whichID: 8710
    }
  }

  static get X(): HidInfo {
    return {
      HIDcode: 27,
      category: HIDCategory.Alphanumeric,
      displayString: 'X',
      webKeyId: 'KeyX',
      whichID: 8810
    }
  }

  static get Y(): HidInfo {
    return {
      HIDcode: 28,
      category: HIDCategory.Alphanumeric,
      displayString: 'Y',
      webKeyId: 'KeyY',
      whichID: 8910
    }
  }

  static get Z(): HidInfo {
    return {
      HIDcode: 29,
      category: HIDCategory.Alphanumeric,
      displayString: 'Z',
      webKeyId: 'KeyZ',
      whichID: 9010
    }
  }

  static get N1(): HidInfo {
    return {
      HIDcode: 30,
      category: HIDCategory.Alphanumeric,
      displayString: '1',
      webKeyId: 'Digit1',
      whichID: 4910,
    }
  }

  static get N2(): HidInfo {
    return {
      HIDcode: 31,
      category: HIDCategory.Alphanumeric,
      displayString: '2',
      webKeyId: 'Digit2',
      whichID: 5010,
    }
  }

  static get N3(): HidInfo {
    return {
      HIDcode: 32,
      category: HIDCategory.Alphanumeric,
      displayString: '3',
      webKeyId: 'Digit3',
      whichID: 5110,
    }
  }

  static get N4(): HidInfo {
    return {
      HIDcode: 33,
      category: HIDCategory.Alphanumeric,
      displayString: '4',
      webKeyId: 'Digit4',
      whichID: 5210,
    }
  }

  static get N5(): HidInfo {
    return {
      HIDcode: 34,
      category: HIDCategory.Alphanumeric,
      displayString: '5',
      webKeyId: 'Digit5',
      whichID: 5310,
    }
  }

  static get N6(): HidInfo {
    return {
      HIDcode: 35,
      category: HIDCategory.Alphanumeric,
      displayString: '6',
      webKeyId: 'Digit6',
      whichID: 5410,
    }
  }

  static get N7(): HidInfo {
    return {
      HIDcode: 36,
      category: HIDCategory.Alphanumeric,
      displayString: '7',
      webKeyId: 'Digit7',
      whichID: 5510,
    }
  }

  static get N8(): HidInfo {
    return {
      HIDcode: 37,
      category: HIDCategory.Alphanumeric,
      displayString: '8',
      webKeyId: 'Digit8',
      whichID: 5610,
    }
  }

  static get N9(): HidInfo {
    return {
      HIDcode: 38,
      category: HIDCategory.Alphanumeric,
      displayString: '9',
      webKeyId: 'Digit9',
      whichID: 5710,
    }
  }

  static get N0(): HidInfo {
    return {
      HIDcode: 39,
      category: HIDCategory.Alphanumeric,
      displayString: '0',
      webKeyId: 'Digit0',
      whichID: 4810,
    }
  }

  static get ENTER(): HidInfo {
    return {
      HIDcode: 40,
      category: HIDCategory.Alphanumeric,
      displayString: 'Enter',
      webKeyId: 'Enter',
      colSpan: 2,
      whichID: 1310,
    }
  }

  static get ESCAPE(): HidInfo {
    return {
      HIDcode: 41,
      category: HIDCategory.Alphanumeric,
      displayString: 'Escape',
      webKeyId: 'Escape',
      colSpan: 2,
      whichID: 2710,
    }
  }

  static get BACKSPACE(): HidInfo {
    return {
      HIDcode: 42,
      category: HIDCategory.Alphanumeric,
      displayString: 'Backspace',
      webKeyId: 'Backspace',
      colSpan: 2,
      whichID: 810,
    }
  }

  static get TAB(): HidInfo {
    return {
      HIDcode: 43,
      category: HIDCategory.Alphanumeric,
      displayString: 'Tab',
      webKeyId: 'Tab',
      whichID: 910,
    }
  }

  static get SPACE(): HidInfo {
    return {
      HIDcode: 44,
      category: HIDCategory.Alphanumeric,
      displayString: 'Space',
      webKeyId: 'Space',
      colSpan: 2,
      whichID: 3210
    }
  }

  static get MINUS(): HidInfo {
    return {
      HIDcode: 45,
      category: HIDCategory.Alphanumeric,
      displayString: '-',
      webKeyId: 'Minus',
      whichID: 18910,

    }
  }

  static get EQUAL(): HidInfo {
    return {
      HIDcode: 46,
      category: HIDCategory.Alphanumeric,
      displayString: '=',
      webKeyId: 'Equal',
      whichID: 18710,
    }
  }

  static get BRACKETL(): HidInfo {
    return {
      HIDcode: 47,
      category: HIDCategory.Alphanumeric,
      displayString: '[',
      webKeyId: 'BracketLeft',
      whichID: 21910,
    }
  }

  static get BRACKETR(): HidInfo {
    return {
      HIDcode: 48,
      category: HIDCategory.Alphanumeric,
      displayString: ']',
      webKeyId: 'BracketRight',
      whichID: 22110,
    }
  }

  static get BACKSLASH(): HidInfo {
    return {
      HIDcode: 49,
      category: HIDCategory.Alphanumeric,
      displayString: '\\',
      webKeyId: 'Backslash',
      whichID: 22010,
    }
  }

  static get SEMICOLON(): HidInfo {
    return {
      HIDcode: 51,
      category: HIDCategory.Alphanumeric,
      displayString: ';',
      webKeyId: 'Semicolon',
      whichID: 18610,
    }
  }

  static get QUOTE(): HidInfo {
    return {
      HIDcode: 52,
      category: HIDCategory.Alphanumeric,
      displayString: '"',
      webKeyId: 'Quote',
      whichID: 22210,
    }
  }

  static get BACKQUOTE(): HidInfo {
    return {
      HIDcode: 53,
      category: HIDCategory.Alphanumeric,
      displayString: '`',
      webKeyId: 'Backquote',
      whichID: 19210,
    }
  }

  static get COMMA(): HidInfo {
    return {
      HIDcode: 54,
      category: HIDCategory.Alphanumeric,
      displayString: ',',
      webKeyId: 'Comma',
      whichID: 7710,
    }
  }

  static get PERIOD(): HidInfo {
    return {
      HIDcode: 55,
      category: HIDCategory.Alphanumeric,
      displayString: '.',
      webKeyId: 'Period',
      whichID: 18810,
    }
  }

  static get SLASH(): HidInfo {
    return {
      HIDcode: 56,
      category: HIDCategory.Alphanumeric,
      displayString: '/',
      webKeyId: 'Slash',
      whichID: 19110,
    }
  }

  static get CAPSLOCK(): HidInfo {
    return {
      HIDcode: 57,
      category: HIDCategory.Alphanumeric,
      displayString: 'Caps Lock',
      webKeyId: 'CapsLock',
      colSpan: 2,
      allowAtStartOfTrigger: true,
      whichID: 2010,
    }
  }

  static get F1(): HidInfo {
    return {
      HIDcode: 58,
      category: HIDCategory.Function,
      displayString: 'F1',
      webKeyId: 'F1',
      whichID: 11210,
    }
  }

  static get F2(): HidInfo {
    return {
      HIDcode: 59,
      category: HIDCategory.Function,
      displayString: 'F2',
      webKeyId: 'F2',
      whichID: 11310,
    }
  }

  static get F3(): HidInfo {
    return {
      HIDcode: 60,
      category: HIDCategory.Function,
      displayString: 'F3',
      webKeyId: 'F3',
      whichID: 11410,
    }
  }

  static get F4(): HidInfo {
    return {
      HIDcode: 61,
      category: HIDCategory.Function,
      displayString: 'F4',
      webKeyId: 'F4',
      whichID: 11510,
    }
  }

  static get F5(): HidInfo {
    return {
      HIDcode: 62,
      category: HIDCategory.Function,
      displayString: 'F5',
      webKeyId: 'F5',
      whichID: 11610,
    }
  }

  static get F6(): HidInfo {
    return {
      HIDcode: 63,
      category: HIDCategory.Function,
      displayString: 'F6',
      webKeyId: 'F6',
      whichID: 11710,
    }
  }

  static get F7(): HidInfo {
    return {
      HIDcode: 64,
      category: HIDCategory.Function,
      displayString: 'F7',
      webKeyId: 'F7',
      whichID: 11810,
    }
  }

  static get F8(): HidInfo {
    return {
      HIDcode: 65,
      category: HIDCategory.Function,
      displayString: 'F8',
      webKeyId: 'F8',
      whichID: 11910,
    }
  }

  static get F9(): HidInfo {
    return {
      HIDcode: 66,
      category: HIDCategory.Function,
      displayString: 'F9',
      webKeyId: 'F9',
      whichID: 12010,
    }
  }

  static get F10(): HidInfo {
    return {
      HIDcode: 67,
      category: HIDCategory.Function,
      displayString: 'F10',
      webKeyId: 'F10',
      whichID: 12110,
    }
  }

  static get F11(): HidInfo {
    return {
      HIDcode: 68,
      category: HIDCategory.Function,
      displayString: 'F11',
      webKeyId: 'F11',
      whichID: 12210,
    }
  }

  static get F12(): HidInfo {
    return {
      HIDcode: 69,
      category: HIDCategory.Function,
      displayString: 'F12',
      webKeyId: 'F12',
      whichID: 12310,
    }
  }

  static get F13(): HidInfo {
    return {
      HIDcode: 104,
      category: HIDCategory.Function,
      displayString: 'F13',
      webKeyId: 'F13',
      whichID: 12410,
    }
  }

  static get F14(): HidInfo {
    return {
      HIDcode: 105,
      category: HIDCategory.Function,
      displayString: 'F14',
      webKeyId: 'F14',
      whichID: 12510,
    }
  }

  static get F15(): HidInfo {
    return {
      HIDcode: 106,
      category: HIDCategory.Function,
      displayString: 'F15',
      webKeyId: 'F15',
      whichID: 12610,
    }
  }

  static get F16(): HidInfo {
    return {
      HIDcode: 107,
      category: HIDCategory.Function,
      displayString: 'F16',
      webKeyId: 'F16',
      whichID: 12710,
    }
  }

  static get F17(): HidInfo {
    return {
      HIDcode: 108,
      category: HIDCategory.Function,
      displayString: 'F17',
      webKeyId: 'F17',
      whichID: 12810,
    }
  }

  static get F18(): HidInfo {
    return {
      HIDcode: 109,
      category: HIDCategory.Function,
      displayString: 'F18',
      webKeyId: 'F18',
      whichID: 12910,
    }
  }

  static get F19(): HidInfo {
    return {
      HIDcode: 110,
      category: HIDCategory.Function,
      displayString: 'F19',
      webKeyId: 'F19',
      whichID: 13010,
    }
  }

  static get F20(): HidInfo {
    return {
      HIDcode: 111,
      category: HIDCategory.Function,
      displayString: 'F20',
      webKeyId: 'F20',
      whichID: 13110,
    }
  }

  static get F21(): HidInfo {
    return {
      HIDcode: 112,
      category: HIDCategory.Function,
      displayString: 'F21',
      webKeyId: 'F21',
      whichID: 13210,
    }
  }

  static get F22(): HidInfo {
    return {
      HIDcode: 113,
      category: HIDCategory.Function,
      displayString: 'F22',
      webKeyId: 'F22',
      whichID: 13310,
    }
  }

  static get F23(): HidInfo {
    return {
      HIDcode: 114,
      category: HIDCategory.Function,
      displayString: 'F23',
      webKeyId: 'F23',
      whichID: 13410,
    }
  }

  static get F24(): HidInfo {
    return {
      HIDcode: 115,
      category: HIDCategory.Function,
      displayString: 'F24',
      webKeyId: 'F24',
      whichID: 13510,
    }
  }

  static get PRINTSCREEN(): HidInfo {
    return {
      HIDcode: 70,
      category: HIDCategory.Modifier,
      displayString: 'Print Screen',
      webKeyId: 'PrintScreen',
      colSpan: 2,
      whichID: 4410,
    }
  }

  static get SCROLLLOCK(): HidInfo {
    return {
      HIDcode: 71,
      category: HIDCategory.Modifier,
      displayString: 'Scroll Lock',
      webKeyId: 'ScrollLock',
      colSpan: 2,
      whichID: 14510,
    }
  }

  static get PAUSE(): HidInfo {
    return {
      HIDcode: 72,
      category: HIDCategory.Modifier,
      displayString: 'Pause',
      webKeyId: 'Pause',
      colSpan: 2,
      whichID: 1910,
    }
  }

  static get INSERT(): HidInfo {
    return {
      HIDcode: 73,
      category: HIDCategory.Navigation,
      displayString: 'Insert',
      webKeyId: 'Insert',
      colSpan: 2,
      whichID: 4510,
    }
  }

  static get HOME(): HidInfo {
    return {
      HIDcode: 74,
      category: HIDCategory.Navigation,
      displayString: 'Home',
      webKeyId: 'Home',
      colSpan: 2,
      whichID: 3610,
    }
  }

  static get PAGEUP(): HidInfo {
    return {
      HIDcode: 75,
      category: HIDCategory.Navigation,
      displayString: 'Page Up',
      webKeyId: 'PageUp',
      colSpan: 2,
      whichID: 3310,
    }
  }

  static get DELETE(): HidInfo {
    return {
      HIDcode: 76,
      category: HIDCategory.Navigation,
      displayString: 'Delete',
      webKeyId: 'Delete',
      colSpan: 2,
      whichID: 4610,
    }
  }

  static get END(): HidInfo {
    return {
      HIDcode: 77,
      category: HIDCategory.Navigation,
      displayString: 'End',
      webKeyId: 'End',
      colSpan: 2,
      whichID: 3510,
    }
  }

  static get PAGEDOWN(): HidInfo {
    return {
      HIDcode: 78,
      category: HIDCategory.Navigation,
      displayString: 'Page Down',
      webKeyId: 'PageDown',
      colSpan: 2,
      whichID: 3410,
    }
  }

  static get ARROWR(): HidInfo {
    return {
      HIDcode: 79,
      category: HIDCategory.Navigation,
      displayString: 'Right Arrow',
      webKeyId: 'ArrowRight',
      colSpan: 2,
      whichID: 3910,
    }
  }

  static get ARROWL(): HidInfo {
    return {
      HIDcode: 80,
      category: HIDCategory.Navigation,
      displayString: 'Left Arrow',
      webKeyId: 'ArrowLeft',
      colSpan: 2,
      whichID: 3710,
    }
  }

  static get ARROWD(): HidInfo {
    return {
      HIDcode: 81,
      category: HIDCategory.Navigation,
      displayString: 'Down Arrow',
      webKeyId: 'ArrowDown',
      colSpan: 2,
      whichID: 4010,
    }
  }

  static get ARROWU(): HidInfo {
    return {
      HIDcode: 82,
      category: HIDCategory.Navigation,
      displayString: 'Up Arrow',
      webKeyId: 'ArrowUp',
      colSpan: 2,
      whichID: 3810,
    }
  }

  static get NUMLOCK(): HidInfo {
    return {
      HIDcode: 83,
      category: HIDCategory.Numpad,
      displayString: 'Num Lock',
      webKeyId: 'NumLock',
      colSpan: 2,
      whichID: 14410,
    }
  }

  static get NUMDIVIDE(): HidInfo {
    return {
      HIDcode: 84,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Divide',
      webKeyId: 'NumpadDivide',
      colSpan: 2,
      whichID: 11110,
    }
  }

  static get NUMMULTIPLY(): HidInfo {
    return {
      HIDcode: 85,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Multiply',
      webKeyId: 'NumpadMultiply',
      colSpan: 2,
      whichID: 10610,
    }
  }

  static get NUMSUBTRACT(): HidInfo {
    return {
      HIDcode: 86,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Subtract',
      webKeyId: 'NumpadSubtract',
      colSpan: 2,
      whichID: 10910,
    }
  }

  static get NUMADD(): HidInfo {
    return {
      HIDcode: 87,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Add',
      webKeyId: 'NumpadAdd',
      colSpan: 2,
      whichID: 10710,
    }
  }

  static get NUMENTER(): HidInfo {
    return {
      HIDcode: 88,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Enter',
      webKeyId: 'NumpadEnter',
      colSpan: 2,
      whichID: 1310,
    }
  }

  static get NP1(): HidInfo {
    return {
      HIDcode: 89,
      category: HIDCategory.Numpad,
      displayString: 'NP1',
      webKeyId: 'Numpad1',
      whichID: 9710,
    }
  }

  static get NP2(): HidInfo {
    return {
      HIDcode: 90,
      category: HIDCategory.Numpad,
      displayString: 'NP2',
      webKeyId: 'Numpad2',
      whichID: 9810,
    }
  }

  static get NP3(): HidInfo {
    return {
      HIDcode: 91,
      category: HIDCategory.Numpad,
      displayString: 'NP3',
      webKeyId: 'Numpad3',
      whichID: 9910,
    }
  }

  static get NP4(): HidInfo {
    return {
      HIDcode: 92,
      category: HIDCategory.Numpad,
      displayString: 'NP4',
      webKeyId: 'Numpad4',
      whichID: 10010,
    }
  }

  static get NP5(): HidInfo {
    return {
      HIDcode: 93,
      category: HIDCategory.Numpad,
      displayString: 'NP5',
      webKeyId: 'Numpad5',
      whichID: 10110,
    }
  }

  static get NP6(): HidInfo {
    return {
      HIDcode: 94,
      category: HIDCategory.Numpad,
      displayString: 'NP6',
      webKeyId: 'Numpad6',
      whichID: 10210,
    }
  }

  static get NP7(): HidInfo {
    return {
      HIDcode: 95,
      category: HIDCategory.Numpad,
      displayString: 'NP7',
      webKeyId: 'Numpad7',
      whichID: 10310,
    }
  }

  static get NP8(): HidInfo {
    return {
      HIDcode: 96,
      category: HIDCategory.Numpad,
      displayString: 'NP8',
      webKeyId: 'Numpad8',
      whichID: 10410,
    }
  }

  static get NP9(): HidInfo {
    return {
      HIDcode: 97,
      category: HIDCategory.Numpad,
      displayString: 'NP9',
      webKeyId: 'Numpad9',
      whichID: 10510,
    }
  }

  static get NP0(): HidInfo {
    return {
      HIDcode: 98,
      category: HIDCategory.Numpad,
      displayString: 'NP0',
      webKeyId: 'Numpad0',
      whichID: 9610,
    }
  }

  static get NUMDECIMAL(): HidInfo {
    return {
      HIDcode: 133,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Decimal',
      webKeyId: 'NumpadDecimal',
      colSpan: 2,
      whichID: 11010,
    }
  }


  static get CONTROLL(): HidInfo {
    return {
      HIDcode: 224,
      category: HIDCategory.Modifier,
      displayString: 'L-CTRL',
      webKeyId: 'ControlLeft',
      colSpan: 2,
      whichID: 1711,
    }
  }

  static get SHIFTL(): HidInfo {
    return {
      HIDcode: 225,
      category: HIDCategory.Modifier,
      displayString: 'L-SHIFT',
      webKeyId: 'ShiftLeft',
      colSpan: 2,
      whichID: 1611,
    }
  }

  static get ALTL(): HidInfo {
    return {
      HIDcode: 226,
      category: HIDCategory.Modifier,
      displayString: 'L-ALT',
      webKeyId: 'AltLeft',
      colSpan: 2,
      whichID: 1811,
    }
  }

  static get METAL(): HidInfo {
    return {
      HIDcode: 227,
      category: HIDCategory.Modifier,
      displayString: 'L-Win/Super/Command',
      webKeyId: 'MetaLeft',
      colSpan: 4,
      whichID: 9111,
    }
  }

  static get CONTROLR(): HidInfo {
    return {
      HIDcode: 228,
      category: HIDCategory.Modifier,
      displayString: 'R-CTRL',
      webKeyId: 'ControlRight',
      colSpan: 2,
      whichID: 1712
    }
  }

  static get SHIFTR(): HidInfo {
    return {
      HIDcode: 229,
      category: HIDCategory.Modifier,
      displayString: 'R-SHIFT',
      webKeyId: 'ShiftRight',
      colSpan: 2,
      whichID: 1612
    }
  }

  static get ALTR(): HidInfo {
    return {
      HIDcode: 230,
      category: HIDCategory.Modifier,
      displayString: 'R-ALT',
      webKeyId: 'AltRight',
      colSpan: 2,
      whichID: 1812
    }
  }

  static get METAR(): HidInfo {
    return {
      HIDcode: 231,
      category: HIDCategory.Modifier,
      displayString: 'R-Win/Super/Command',
      webKeyId: 'MetaRight',
      colSpan: 4,
      whichID: 9212
    }
  }

  static readonly all: HidInfo[] = [
    Hid.A,//6510,
    Hid.B,//6610,
    Hid.C,//6710,
    Hid.D,//6810,
    Hid.E,//6910,
    Hid.F,//7010,
    Hid.G,//7110,
    Hid.H,//7210,
    Hid.I,//7310,
    Hid.J,//7410,
    Hid.K,//7510,
    Hid.L,//7610,
    Hid.M,//7710,
    Hid.N,//7810,
    Hid.O,//7910,
    Hid.P,//8010,
    Hid.Q,//8110,
    Hid.R,//8210,
    Hid.S,//8310,
    Hid.T,//8410,
    Hid.U,//8510,
    Hid.V,//8610,
    Hid.W,//8710,
    Hid.X,//8810,
    Hid.Y,//8910,
    Hid.Z,//9010,
    Hid.N0,//4810,
    Hid.N1,//4910,
    Hid.N2,//5010,
    Hid.N3,//5110,
    Hid.N4,//5210,
    Hid.N5,//5310,
    Hid.N6,//5410,
    Hid.N7,//5510,
    Hid.N8,//5610,
    Hid.N9,//5710,
    Hid.NP0,//9610,
    Hid.NP1,//9710,
    Hid.NP2,//9810,
    Hid.NP3,//9910,
    Hid.NP4,//10010,
    Hid.NP5,//10110,
    Hid.NP6,//10210,
    Hid.NP7,//10310,
    Hid.NP8,//10410,
    Hid.NP9,//10510,
    Hid.ENTER,//1310,
    Hid.ESCAPE,//2710,
    Hid.BACKSPACE,//810,
    Hid.TAB,//910,
    Hid.SPACE,//3210,
    Hid.MINUS,//18910,
    Hid.EQUAL,//18710,
    Hid.BRACKETL,//21910,
    Hid.BRACKETR,//22110,
    Hid.BACKSLASH,//22010,
    Hid.SEMICOLON,//18610,
    Hid.QUOTE,//22210,
    Hid.BACKQUOTE,//19210,
    Hid.COMMA,//7710,
    Hid.PERIOD,//18810,
    Hid.CAPSLOCK,//2010,
    Hid.SLASH,//19110,
    Hid.F1,//11210,
    Hid.F2,//11310,
    Hid.F3,//11410,
    Hid.F4,//11510,
    Hid.F5,//11610,
    Hid.F6,//11710,
    Hid.F7,//11810,
    Hid.F8,//11910,
    Hid.F9,//12010,
    Hid.F10,//12110,
    Hid.F11,//12210,
    Hid.F12,//12310,
    Hid.F13,//12410,
    Hid.F14,//12510,
    Hid.F15,//12610,
    Hid.F16,//12710,
    Hid.F17,//12810,
    Hid.F18,//12910,
    Hid.F19,//13010,
    Hid.F20,//13110,
    Hid.F21,//13210,
    Hid.F22,//13310,
    Hid.F23,//13410,
    Hid.F24,//13510,
    Hid.PRINTSCREEN,//4410,
    Hid.SCROLLLOCK,//14510,
    Hid.PAUSE,//1910,
    Hid.INSERT,//4510,
    Hid.HOME,//3610,
    Hid.PAGEUP,//3310,
    Hid.DELETE,//4610,
    Hid.END,//3510,
    Hid.PAGEDOWN,//3410,
    Hid.ARROWR,//3910,
    Hid.ARROWL,//3710,
    Hid.ARROWD,//4010,
    Hid.ARROWU,//3810,
    Hid.NUMLOCK,//14410,
    Hid.NUMDIVIDE,//11110,
    Hid.NUMMULTIPLY,//10610,
    Hid.NUMSUBTRACT,//10910,
    Hid.NUMADD,//10710,
    Hid.NUMENTER,//1310,
    Hid.NUMDECIMAL,//11010,
//
    Hid.SHIFTL,//1611,
    Hid.CONTROLL,//1711,
    Hid.ALTL,//1811,
    Hid.METAL,//9111,
    Hid.SHIFTR,//1612,
    Hid.CONTROLR,//1712,
    Hid.METAR,//9212,
    Hid.ALTR//1812,
  ]
}

export const webCodeHIDLookup = new Map<string, HidInfo>(
  Hid.all
    .filter((hid) => hid.whichID !== undefined)
    .map((hid) => [hid.whichID!.toString(), hid])
)
export const HIDLookup = new Map<number, HidInfo>(
  Hid.all
    .filter((hid) => hid.HIDcode !== undefined)
    .map((hid) => [hid.HIDcode!, hid])
)
