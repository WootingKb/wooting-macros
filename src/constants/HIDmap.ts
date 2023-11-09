import { HIDCategory } from './enums'

export interface HidInfo {
  HIDcode: number
  category: HIDCategory
  displayString: string
  webKeyId: string
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
    }
  }

  static get B(): HidInfo {
    return {
      HIDcode: 5,
      category: HIDCategory.Alphanumeric,
      displayString: 'B',
      webKeyId: 'KeyB',
    }
  }

  static get C(): HidInfo {
    return {
      HIDcode: 6,
      category: HIDCategory.Alphanumeric,
      displayString: 'C',
      webKeyId: 'KeyC',
    }
  }

  static get D(): HidInfo {
    return {
      HIDcode: 7,
      category: HIDCategory.Alphanumeric,
      displayString: 'D',
      webKeyId: 'KeyD',
    }
  }

  static get E(): HidInfo {
    return {
      HIDcode: 8,
      category: HIDCategory.Alphanumeric,
      displayString: 'E',
      webKeyId: 'KeyE',
    }
  }

  static get F(): HidInfo {
    return {
      HIDcode: 9,
      category: HIDCategory.Alphanumeric,
      displayString: 'F',
      webKeyId: 'KeyF',
    }
  }

  static get G(): HidInfo {
    return {
      HIDcode: 10,
      category: HIDCategory.Alphanumeric,
      displayString: 'G',
      webKeyId: 'KeyG',
    }
  }

  static get H(): HidInfo {
    return {
      HIDcode: 11,
      category: HIDCategory.Alphanumeric,
      displayString: 'H',
      webKeyId: 'KeyH',
    }
  }

  static get I(): HidInfo {
    return {
      HIDcode: 12,
      category: HIDCategory.Alphanumeric,
      displayString: 'I',
      webKeyId: 'KeyI',
    }
  }

  static get J(): HidInfo {
    return {
      HIDcode: 13,
      category: HIDCategory.Alphanumeric,
      displayString: 'J',
      webKeyId: 'KeyJ',
    }
  }

  static get K(): HidInfo {
    return {
      HIDcode: 14,
      category: HIDCategory.Alphanumeric,
      displayString: 'K',
      webKeyId: 'KeyK',
    }
  }

  static get L(): HidInfo {
    return {
      HIDcode: 15,
      category: HIDCategory.Alphanumeric,
      displayString: 'L',
      webKeyId: 'KeyL',
    }
  }

  static get M(): HidInfo {
    return {
      HIDcode: 16,
      category: HIDCategory.Alphanumeric,
      displayString: 'M',
      webKeyId: 'KeyM',
    }
  }

  static get N(): HidInfo {
    return {
      HIDcode: 17,
      category: HIDCategory.Alphanumeric,
      displayString: 'N',
      webKeyId: 'KeyN',
    }
  }

  static get O(): HidInfo {
    return {
      HIDcode: 18,
      category: HIDCategory.Alphanumeric,
      displayString: 'O',
      webKeyId: 'KeyO'
    }
  }

  static get P(): HidInfo {
    return {
      HIDcode: 19,
      category: HIDCategory.Alphanumeric,
      displayString: 'P',
      webKeyId: 'KeyP'
    }
  }

  static get Q(): HidInfo {
    return {
      HIDcode: 20,
      category: HIDCategory.Alphanumeric,
      displayString: 'Q',
      webKeyId: 'KeyQ'
    }
  }

  static get R(): HidInfo {
    return {
      HIDcode: 21,
      category: HIDCategory.Alphanumeric,
      displayString: 'R',
      webKeyId: 'KeyR'
    }
  }

  static get S(): HidInfo {
    return {
      HIDcode: 22,
      category: HIDCategory.Alphanumeric,
      displayString: 'S',
      webKeyId: 'KeyS'
    }
  }

  static get T(): HidInfo {
    return {
      HIDcode: 23,
      category: HIDCategory.Alphanumeric,
      displayString: 'T',
      webKeyId: 'KeyT'
    }
  }

  static get U(): HidInfo {
    return {
      HIDcode: 24,
      category: HIDCategory.Alphanumeric,
      displayString: 'U',
      webKeyId: 'KeyU'
    }
  }

  static get V(): HidInfo {
    return {
      HIDcode: 25,
      category: HIDCategory.Alphanumeric,
      displayString: 'V',
      webKeyId: 'KeyV'
    }
  }

  static get W(): HidInfo {
    return {
      HIDcode: 26,
      category: HIDCategory.Alphanumeric,
      displayString: 'W',
      webKeyId: 'KeyW'
    }
  }

  static get X(): HidInfo {
    return {
      HIDcode: 27,
      category: HIDCategory.Alphanumeric,
      displayString: 'X',
      webKeyId: 'KeyX'
    }
  }

  static get Y(): HidInfo {
    return {
      HIDcode: 28,
      category: HIDCategory.Alphanumeric,
      displayString: 'Y',
      webKeyId: 'KeyY'
    }
  }

  static get Z(): HidInfo {
    return {
      HIDcode: 29,
      category: HIDCategory.Alphanumeric,
      displayString: 'Z',
      webKeyId: 'KeyZ'
    }
  }

  static get N1(): HidInfo {
    return {
      HIDcode: 30,
      category: HIDCategory.Alphanumeric,
      displayString: '1',
      webKeyId: 'Digit1'
    }
  }

  static get N2(): HidInfo {
    return {
      HIDcode: 31,
      category: HIDCategory.Alphanumeric,
      displayString: '2',
      webKeyId: 'Digit2'
    }
  }

  static get N3(): HidInfo {
    return {
      HIDcode: 32,
      category: HIDCategory.Alphanumeric,
      displayString: '3',
      webKeyId: 'Digit3'
    }
  }

  static get N4(): HidInfo {
    return {
      HIDcode: 33,
      category: HIDCategory.Alphanumeric,
      displayString: '4',
      webKeyId: 'Digit4'
    }
  }

  static get N5(): HidInfo {
    return {
      HIDcode: 34,
      category: HIDCategory.Alphanumeric,
      displayString: '5',
      webKeyId: 'Digit5'
    }
  }

  static get N6(): HidInfo {
    return {
      HIDcode: 35,
      category: HIDCategory.Alphanumeric,
      displayString: '6',
      webKeyId: 'Digit6'
    }
  }

  static get N7(): HidInfo {
    return {
      HIDcode: 36,
      category: HIDCategory.Alphanumeric,
      displayString: '7',
      webKeyId: 'Digit7'
    }
  }

  static get N8(): HidInfo {
    return {
      HIDcode: 37,
      category: HIDCategory.Alphanumeric,
      displayString: '8',
      webKeyId: 'Digit8'
    }
  }

  static get N9(): HidInfo {
    return {
      HIDcode: 38,
      category: HIDCategory.Alphanumeric,
      displayString: '9',
      webKeyId: 'Digit9'
    }
  }

  static get N0(): HidInfo {
    return {
      HIDcode: 39,
      category: HIDCategory.Alphanumeric,
      displayString: '0',
      webKeyId: 'Digit0'
    }
  }

  static get ENTER(): HidInfo {
    return {
      HIDcode: 40,
      category: HIDCategory.Alphanumeric,
      displayString: 'Enter',
      webKeyId: 'Enter',
      colSpan: 2
    }
  }

  static get ESCAPE(): HidInfo {
    return {
      HIDcode: 41,
      category: HIDCategory.Alphanumeric,
      displayString: 'Escape',
      webKeyId: 'Escape',
      colSpan: 2
    }
  }

  static get BACKSPACE(): HidInfo {
    return {
      HIDcode: 42,
      category: HIDCategory.Alphanumeric,
      displayString: 'Backspace',
      webKeyId: 'Backspace',
      colSpan: 2
    }
  }

  static get TAB(): HidInfo {
    return {
      HIDcode: 43,
      category: HIDCategory.Alphanumeric,
      displayString: 'Tab',
      webKeyId: 'Tab'
    }
  }

  static get SPACE(): HidInfo {
    return {
      HIDcode: 44,
      category: HIDCategory.Alphanumeric,
      displayString: 'Space',
      webKeyId: 'Space',
      colSpan: 2
    }
  }

  static get MINUS(): HidInfo {
    return {
      HIDcode: 45,
      category: HIDCategory.Alphanumeric,
      displayString: '-',
      webKeyId: 'Minus'
    }
  }

  static get EQUAL(): HidInfo {
    return {
      HIDcode: 46,
      category: HIDCategory.Alphanumeric,
      displayString: '=',
      webKeyId: 'Equal'
    }
  }

  static get BRACKETL(): HidInfo {
    return {
      HIDcode: 47,
      category: HIDCategory.Alphanumeric,
      displayString: '[',
      webKeyId: 'BracketLeft'
    }
  }

  static get BRACKETR(): HidInfo {
    return {
      HIDcode: 48,
      category: HIDCategory.Alphanumeric,
      displayString: ']',
      webKeyId: 'BracketRight'
    }
  }

  static get BACKSLASH(): HidInfo {
    return {
      HIDcode: 49,
      category: HIDCategory.Alphanumeric,
      displayString: '\\',
      webKeyId: 'Backslash'
    }
  }

  static get SEMICOLON(): HidInfo {
    return {
      HIDcode: 51,
      category: HIDCategory.Alphanumeric,
      displayString: ';',
      webKeyId: 'Semicolon'
    }
  }

  static get QUOTE(): HidInfo {
    return {
      HIDcode: 52,
      category: HIDCategory.Alphanumeric,
      displayString: '"',
      webKeyId: 'Quote'
    }
  }

  static get BACKQUOTE(): HidInfo {
    return {
      HIDcode: 53,
      category: HIDCategory.Alphanumeric,
      displayString: '`',
      webKeyId: 'Backquote'
    }
  }

  static get COMMA(): HidInfo {
    return {
      HIDcode: 54,
      category: HIDCategory.Alphanumeric,
      displayString: ',',
      webKeyId: 'Comma'
    }
  }

  static get PERIOD(): HidInfo {
    return {
      HIDcode: 55,
      category: HIDCategory.Alphanumeric,
      displayString: '.',
      webKeyId: 'Period'
    }
  }

  static get SLASH(): HidInfo {
    return {
      HIDcode: 56,
      category: HIDCategory.Alphanumeric,
      displayString: '/',
      webKeyId: 'Slash'
    }
  }

  static get CAPSLOCK(): HidInfo {
    return {
      HIDcode: 57,
      category: HIDCategory.Alphanumeric,
      displayString: 'Caps Lock',
      webKeyId: 'CapsLock',
      colSpan: 2,
      allowAtStartOfTrigger: true
    }
  }

  static get F1(): HidInfo {
    return {
      HIDcode: 58,
      category: HIDCategory.Function,
      displayString: 'F1',
      webKeyId: 'F1'
    }
  }

  static get F2(): HidInfo {
    return {
      HIDcode: 59,
      category: HIDCategory.Function,
      displayString: 'F2',
      webKeyId: 'F2'
    }
  }

  static get F3(): HidInfo {
    return {
      HIDcode: 60,
      category: HIDCategory.Function,
      displayString: 'F3',
      webKeyId: 'F3'
    }
  }

  static get F4(): HidInfo {
    return {
      HIDcode: 61,
      category: HIDCategory.Function,
      displayString: 'F4',
      webKeyId: 'F4'
    }
  }

  static get F5(): HidInfo {
    return {
      HIDcode: 62,
      category: HIDCategory.Function,
      displayString: 'F5',
      webKeyId: 'F5'
    }
  }

  static get F6(): HidInfo {
    return {
      HIDcode: 63,
      category: HIDCategory.Function,
      displayString: 'F6',
      webKeyId: 'F6'
    }
  }

  static get F7(): HidInfo {
    return {
      HIDcode: 64,
      category: HIDCategory.Function,
      displayString: 'F7',
      webKeyId: 'F7'
    }
  }

  static get F8(): HidInfo {
    return {
      HIDcode: 65,
      category: HIDCategory.Function,
      displayString: 'F8',
      webKeyId: 'F8'
    }
  }

  static get F9(): HidInfo {
    return {
      HIDcode: 66,
      category: HIDCategory.Function,
      displayString: 'F9',
      webKeyId: 'F9'
    }
  }

  static get F10(): HidInfo {
    return {
      HIDcode: 67,
      category: HIDCategory.Function,
      displayString: 'F10',
      webKeyId: 'F10'
    }
  }

  static get F11(): HidInfo {
    return {
      HIDcode: 68,
      category: HIDCategory.Function,
      displayString: 'F11',
      webKeyId: 'F11'
    }
  }

  static get F12(): HidInfo {
    return {
      HIDcode: 69,
      category: HIDCategory.Function,
      displayString: 'F12',
      webKeyId: 'F12'
    }
  }

  static get F13(): HidInfo {
    return {
      HIDcode: 104,
      category: HIDCategory.Function,
      displayString: 'F13',
      webKeyId: 'F13'
    }
  }

  static get F14(): HidInfo {
    return {
      HIDcode: 105,
      category: HIDCategory.Function,
      displayString: 'F14',
      webKeyId: 'F14'
    }
  }

  static get F15(): HidInfo {
    return {
      HIDcode: 106,
      category: HIDCategory.Function,
      displayString: 'F15',
      webKeyId: 'F15'
    }
  }

  static get F16(): HidInfo {
    return {
      HIDcode: 107,
      category: HIDCategory.Function,
      displayString: 'F16',
      webKeyId: 'F16'
    }
  }

  static get F17(): HidInfo {
    return {
      HIDcode: 108,
      category: HIDCategory.Function,
      displayString: 'F17',
      webKeyId: 'F17'
    }
  }

  static get F18(): HidInfo {
    return {
      HIDcode: 109,
      category: HIDCategory.Function,
      displayString: 'F18',
      webKeyId: 'F18'
    }
  }

  static get F19(): HidInfo {
    return {
      HIDcode: 110,
      category: HIDCategory.Function,
      displayString: 'F19',
      webKeyId: 'F19'
    }
  }

  static get F20(): HidInfo {
    return {
      HIDcode: 111,
      category: HIDCategory.Function,
      displayString: 'F20',
      webKeyId: 'F20'
    }
  }

  static get F21(): HidInfo {
    return {
      HIDcode: 112,
      category: HIDCategory.Function,
      displayString: 'F21',
      webKeyId: 'F21'
    }
  }

  static get F22(): HidInfo {
    return {
      HIDcode: 113,
      category: HIDCategory.Function,
      displayString: 'F22',
      webKeyId: 'F22'
    }
  }

  static get F23(): HidInfo {
    return {
      HIDcode: 114,
      category: HIDCategory.Function,
      displayString: 'F23',
      webKeyId: 'F23'
    }
  }

  static get F24(): HidInfo {
    return {
      HIDcode: 115,
      category: HIDCategory.Function,
      displayString: 'F24',
      webKeyId: 'F24'
    }
  }

  static get PRINTSCREEN(): HidInfo {
    return {
      HIDcode: 70,
      category: HIDCategory.Modifier,
      displayString: 'Print Screen',
      webKeyId: 'PrintScreen',
      colSpan: 2
    }
  }

  static get SCROLLLOCK(): HidInfo {
    return {
      HIDcode: 71,
      category: HIDCategory.Modifier,
      displayString: 'Scroll Lock',
      webKeyId: 'ScrollLock',
      colSpan: 2
    }
  }

  static get PAUSE(): HidInfo {
    return {
      HIDcode: 72,
      category: HIDCategory.Modifier,
      displayString: 'Pause',
      webKeyId: 'Pause',
      colSpan: 2
    }
  }

  static get INSERT(): HidInfo {
    return {
      HIDcode: 73,
      category: HIDCategory.Navigation,
      displayString: 'Insert',
      webKeyId: 'Insert',
      colSpan: 2
    }
  }

  static get HOME(): HidInfo {
    return {
      HIDcode: 74,
      category: HIDCategory.Navigation,
      displayString: 'Home',
      webKeyId: 'Home',
      colSpan: 2
    }
  }

  static get PAGEUP(): HidInfo {
    return {
      HIDcode: 75,
      category: HIDCategory.Navigation,
      displayString: 'Page Up',
      webKeyId: 'PageUp',
      colSpan: 2
    }
  }

  static get DELETE(): HidInfo {
    return {
      HIDcode: 76,
      category: HIDCategory.Navigation,
      displayString: 'Delete',
      webKeyId: 'Delete',
      colSpan: 2
    }
  }

  static get END(): HidInfo {
    return {
      HIDcode: 77,
      category: HIDCategory.Navigation,
      displayString: 'End',
      webKeyId: 'End',
      colSpan: 2
    }
  }

  static get PAGEDOWN(): HidInfo {
    return {
      HIDcode: 78,
      category: HIDCategory.Navigation,
      displayString: 'Page Down',
      webKeyId: 'PageDown',
      colSpan: 2
    }
  }

  static get ARROWR(): HidInfo {
    return {
      HIDcode: 79,
      category: HIDCategory.Navigation,
      displayString: 'Right Arrow',
      webKeyId: 'ArrowRight',
      colSpan: 2
    }
  }

  static get ARROWL(): HidInfo {
    return {
      HIDcode: 80,
      category: HIDCategory.Navigation,
      displayString: 'Left Arrow',
      webKeyId: 'ArrowLeft',
      colSpan: 2
    }
  }

  static get ARROWD(): HidInfo {
    return {
      HIDcode: 81,
      category: HIDCategory.Navigation,
      displayString: 'Down Arrow',
      webKeyId: 'ArrowDown',
      colSpan: 2
    }
  }

  static get ARROWU(): HidInfo {
    return {
      HIDcode: 82,
      category: HIDCategory.Navigation,
      displayString: 'Up Arrow',
      webKeyId: 'ArrowUp',
      colSpan: 2
    }
  }

  static get NUMLOCK(): HidInfo {
    return {
      HIDcode: 83,
      category: HIDCategory.Numpad,
      displayString: 'Num Lock',
      webKeyId: 'NumLock',
      colSpan: 2
    }
  }

  static get NUMDIVIDE(): HidInfo {
    return {
      HIDcode: 84,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Divide',
      webKeyId: 'NumpadDivide',
      colSpan: 2
    }
  }

  static get NUMMULTIPLY(): HidInfo {
    return {
      HIDcode: 85,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Multiply',
      webKeyId: 'NumpadMultiply',
      colSpan: 2
    }
  }

  static get NUMSUBTRACT(): HidInfo {
    return {
      HIDcode: 86,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Subtract',
      webKeyId: 'NumpadSubtract',
      colSpan: 2
    }
  }

  static get NUMADD(): HidInfo {
    return {
      HIDcode: 87,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Add',
      webKeyId: 'NumpadAdd',
      colSpan: 2
    }
  }

  static get NUMENTER(): HidInfo {
    return {
      HIDcode: 88,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Enter',
      webKeyId: 'NumpadEnter',
      colSpan: 2
    }
  }

  static get NP1(): HidInfo {
    return {
      HIDcode: 89,
      category: HIDCategory.Numpad,
      displayString: 'NP1',
      webKeyId: 'Numpad1'
    }
  }

  static get NP2(): HidInfo {
    return {
      HIDcode: 90,
      category: HIDCategory.Numpad,
      displayString: 'NP2',
      webKeyId: 'Numpad2'
    }
  }

  static get NP3(): HidInfo {
    return {
      HIDcode: 91,
      category: HIDCategory.Numpad,
      displayString: 'NP3',
      webKeyId: 'Numpad3'
    }
  }

  static get NP4(): HidInfo {
    return {
      HIDcode: 92,
      category: HIDCategory.Numpad,
      displayString: 'NP4',
      webKeyId: 'Numpad4'
    }
  }

  static get NP5(): HidInfo {
    return {
      HIDcode: 93,
      category: HIDCategory.Numpad,
      displayString: 'NP5',
      webKeyId: 'Numpad5'
    }
  }

  static get NP6(): HidInfo {
    return {
      HIDcode: 94,
      category: HIDCategory.Numpad,
      displayString: 'NP6',
      webKeyId: 'Numpad6'
    }
  }

  static get NP7(): HidInfo {
    return {
      HIDcode: 95,
      category: HIDCategory.Numpad,
      displayString: 'NP7',
      webKeyId: 'Numpad7'
    }
  }

  static get NP8(): HidInfo {
    return {
      HIDcode: 96,
      category: HIDCategory.Numpad,
      displayString: 'NP8',
      webKeyId: 'Numpad8'
    }
  }

  static get NP9(): HidInfo {
    return {
      HIDcode: 97,
      category: HIDCategory.Numpad,
      displayString: 'NP9',
      webKeyId: 'Numpad9'
    }
  }

  static get NP0(): HidInfo {
    return {
      HIDcode: 98,
      category: HIDCategory.Numpad,
      displayString: 'NP0',
      webKeyId: 'Numpad0'
    }
  }

  static get NUMDECIMAL(): HidInfo {
    return {
      HIDcode: 133,
      category: HIDCategory.Numpad,
      displayString: 'Numpad Decimal',
      webKeyId: 'NumpadDecimal',
      colSpan: 2
    }
  }


  static get CONTROLL(): HidInfo {
    return {
      HIDcode: 224,
      category: HIDCategory.Modifier,
      displayString: 'L-CTRL',
      webKeyId: 'ControlLeft',
      colSpan: 2
    }
  }

  static get SHIFTL(): HidInfo {
    return {
      HIDcode: 225,
      category: HIDCategory.Modifier,
      displayString: 'L-SHIFT',
      webKeyId: 'ShiftLeft',
      colSpan: 2
    }
  }

  static get ALTL(): HidInfo {
    return {
      HIDcode: 226,
      category: HIDCategory.Modifier,
      displayString: 'L-ALT',
      webKeyId: 'AltLeft',
      colSpan: 2
    }
  }

  static get METAL(): HidInfo {
    return {
      HIDcode: 227,
      category: HIDCategory.Modifier,
      displayString: 'L-Win/Super/Command',
      webKeyId: 'MetaLeft',
      colSpan: 4
    }
  }

  static get CONTROLR(): HidInfo {
    return {
      HIDcode: 228,
      category: HIDCategory.Modifier,
      displayString: 'R-CTRL',
      webKeyId: 'ControlRight',
      colSpan: 2
    }
  }

  static get SHIFTR(): HidInfo {
    return {
      HIDcode: 229,
      category: HIDCategory.Modifier,
      displayString: 'R-SHIFT',
      webKeyId: 'ShiftRight',
      colSpan: 2
    }
  }

  static get ALTR(): HidInfo {
    return {
      HIDcode: 230,
      category: HIDCategory.Modifier,
      displayString: 'R-ALT',
      webKeyId: 'AltRight',
      colSpan: 2
    }
  }

  static get METAR(): HidInfo {
    return {
      HIDcode: 231,
      category: HIDCategory.Modifier,
      displayString: 'R-Win/Super/Command',
      webKeyId: 'MetaRight',
      colSpan: 4
    }
  }

  static readonly all: number[] = [
    6510,//Hid.A,
    6610,//Hid.B,
    6710,//Hid.C,
    6810,//Hid.D,
    6910,//Hid.E,
    7010,//Hid.F,
    7110,//Hid.G,
    7210,//Hid.H,
    7310,//Hid.I,
    7410,//Hid.J,
    7510,//Hid.K,
    7610,//Hid.L,
    7710,//Hid.M,
    7810,//Hid.N,
    7910,//Hid.O,
    8010,//Hid.P,
    8110,//Hid.Q,
    8210,//Hid.R,
    8310,//Hid.S,
    8410,//Hid.T,
    8510,//Hid.U,
    8610,//Hid.V,
    8710,//Hid.W,
    8810,//Hid.X,
    8910,//Hid.Y,
    9010,//Hid.Z,
    4810,//Hid.N0,
    4910,//Hid.N1,
    5010,//Hid.N2,
    5110,//Hid.N3,
    5210,//Hid.N4,
    5310,//Hid.N5,
    5410,//Hid.N6,
    5510,//Hid.N7,
    5610,//Hid.N8,
    5710,//Hid.N9,
    9610,//Hid.NP0,
    9710,//Hid.NP1,
    9810,//Hid.NP2,
    9910,//Hid.NP3,
    10010,//Hid.NP4,
    10110,//Hid.NP5,
    10210,//Hid.NP6,
    10310,//Hid.NP7,
    10410,//Hid.NP8,
    10510,//Hid.NP9,
    1310,//Hid.ENTER,
    2710,//Hid.ESCAPE,
    810,//Hid.BACKSPACE,
    910,//Hid.TAB,
    3210,//Hid.SPACE,
    18910,//Hid.MINUS,
    18710,//Hid.EQUAL,
    21910,//Hid.BRACKETL,
    22110,//Hid.BRACKETR,
    22010,//Hid.BACKSLASH,
    18610,//Hid.SEMICOLON,
    22210,//Hid.QUOTE,
    19210,//Hid.BACKQUOTE,
    7710,//Hid.COMMA,
    18810,//Hid.PERIOD,
    2010,//Hid.CAPSLOCK,
    19110,//Hid.SLASH,
    11210,//Hid.F1,
    11310,//Hid.F2,
    11410,//Hid.F3,
    11510,//Hid.F4,
    11610,//Hid.F5,
    11710,//Hid.F6,
    11810,//Hid.F7,
    11910,//Hid.F8,
    12010,//Hid.F9,
    12110,//Hid.F10,
    12210,//Hid.F11,
    12310,//Hid.F12,
    12410,//Hid.F13,
    12510,//Hid.F14,
    12610,//Hid.F15,
    12710,//Hid.F16,
    12810,//Hid.F17,
    12910,//Hid.F18,
    13010,//Hid.F19,
    13110,//Hid.F20,
    13210,//Hid.F21,
    13310,//Hid.F22,
    13410,//Hid.F23,
    13510,//Hid.F24,
    4410,//Hid.PRINTSCREEN,
    14510,//Hid.SCROLLLOCK,
    1910,//Hid.PAUSE,
    4510,//Hid.INSERT,
    3610,//Hid.HOME,
    3310,//Hid.PAGEUP,
    4610,//Hid.DELETE,
    3510,//Hid.END,
    3410,//Hid.PAGEDOWN,
    3910,//Hid.ARROWR,
    3710,//Hid.ARROWL,
    4010,//Hid.ARROWD,
    3810,//Hid.ARROWU,
    14410,//Hid.NUMLOCK,
    11110,//Hid.NUMDIVIDE,
    10610,//Hid.NUMMULTIPLY,
    10910,//Hid.NUMSUBTRACT,
    10710,//Hid.NUMADD,
    1310,//Hid.NUMENTER,
    11010,//Hid.NUMDECIMAL,

    1611,//Hid.SHIFTL,
    1711,//Hid.CONTROLL,
    1811,//Hid.ALTL,
    9111,//Hid.METAL,
    1612,//Hid.SHIFTR,
    1712,//Hid.CONTROLR,
    9212,//Hid.METAR,
    1812,//Hid.ALTR
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
