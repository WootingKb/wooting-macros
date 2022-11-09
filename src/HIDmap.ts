export interface HidInfo {
  HIDcode: number
  displayString: string
  webKeyId: string
}

export class Hid {
  static get A(): HidInfo {
    return { HIDcode: 4, displayString: 'A', webKeyId: 'KeyA' }
  }
  static get B(): HidInfo {
    return { HIDcode: 5, displayString: 'B', webKeyId: 'KeyB' }
  }
  static get C(): HidInfo {
    return { HIDcode: 6, displayString: 'C', webKeyId: 'KeyC' }
  }
  static get D(): HidInfo {
    return { HIDcode: 7, displayString: 'D', webKeyId: 'KeyD' }
  }
  static get E(): HidInfo {
    return { HIDcode: 8, displayString: 'E', webKeyId: 'KeyE' }
  }
  static get F(): HidInfo {
    return { HIDcode: 9, displayString: 'F', webKeyId: 'KeyF' }
  }

  static get G(): HidInfo {
    return { HIDcode: 10, displayString: 'G', webKeyId: 'KeyG' }
  }
  static get H(): HidInfo {
    return { HIDcode: 11, displayString: 'H', webKeyId: 'KeyH' }
  }
  static get I(): HidInfo {
    return { HIDcode: 12, displayString: 'I', webKeyId: 'KeyI' }
  }
  static get J(): HidInfo {
    return { HIDcode: 13, displayString: 'J', webKeyId: 'KeyJ' }
  }
  static get K(): HidInfo {
    return { HIDcode: 14, displayString: 'K', webKeyId: 'KeyK' }
  }
  static get L(): HidInfo {
    return { HIDcode: 15, displayString: 'L', webKeyId: 'KeyL' }
  }
  static get M(): HidInfo {
    return { HIDcode: 16, displayString: 'M', webKeyId: 'KeyM' }
  }
  static get N(): HidInfo {
    return { HIDcode: 17, displayString: 'N', webKeyId: 'KeyN' }
  }
  static get O(): HidInfo {
    return { HIDcode: 18, displayString: 'O', webKeyId: 'KeyO' }
  }
  static get P(): HidInfo {
    return { HIDcode: 19, displayString: 'P', webKeyId: 'KeyP' }
  }

  static get Q(): HidInfo {
    return { HIDcode: 20, displayString: 'Q', webKeyId: 'KeyQ' }
  }
  static get R(): HidInfo {
    return { HIDcode: 21, displayString: 'R', webKeyId: 'KeyR' }
  }
  static get S(): HidInfo {
    return { HIDcode: 22, displayString: 'S', webKeyId: 'KeyS' }
  }
  static get T(): HidInfo {
    return { HIDcode: 23, displayString: 'T', webKeyId: 'KeyT' }
  }
  static get U(): HidInfo {
    return { HIDcode: 24, displayString: 'U', webKeyId: 'KeyU' }
  }
  static get V(): HidInfo {
    return { HIDcode: 25, displayString: 'V', webKeyId: 'KeyV' }
  }
  static get W(): HidInfo {
    return { HIDcode: 26, displayString: 'W', webKeyId: 'KeyW' }
  }
  static get X(): HidInfo {
    return { HIDcode: 27, displayString: 'X', webKeyId: 'KeyX' }
  }
  static get Y(): HidInfo {
    return { HIDcode: 28, displayString: 'Y', webKeyId: 'KeyY' }
  }
  static get Z(): HidInfo {
    return { HIDcode: 29, displayString: 'Z', webKeyId: 'KeyZ' }
  }

  static get N1(): HidInfo {
    return { HIDcode: 30, displayString: '1', webKeyId: 'Digit1' }
  }
  static get N2(): HidInfo {
    return { HIDcode: 31, displayString: '2', webKeyId: 'Digit2' }
  }
  static get N3(): HidInfo {
    return { HIDcode: 32, displayString: '3', webKeyId: 'Digit3' }
  }
  static get N4(): HidInfo {
    return { HIDcode: 33, displayString: '4', webKeyId: 'Digit4' }
  }
  static get N5(): HidInfo {
    return { HIDcode: 34, displayString: '5', webKeyId: 'Digit5' }
  }
  static get N6(): HidInfo {
    return { HIDcode: 35, displayString: '6', webKeyId: 'Digit6' }
  }
  static get N7(): HidInfo {
    return { HIDcode: 36, displayString: '7', webKeyId: 'Digit7' }
  }
  static get N8(): HidInfo {
    return { HIDcode: 37, displayString: '8', webKeyId: 'Digit8' }
  }
  static get N9(): HidInfo {
    return { HIDcode: 38, displayString: '9', webKeyId: 'Digit9' }
  }
  static get N0(): HidInfo {
    return { HIDcode: 39, displayString: '0', webKeyId: 'Digit0' }
  }

  static get ENTER(): HidInfo {
    return { HIDcode: 40, displayString: 'Enter', webKeyId: 'Enter' }
  }
  static get ESCAPE(): HidInfo {
    return { HIDcode: 41, displayString: 'Escape', webKeyId: 'Escape' }
  }
  static get BACKSPACE(): HidInfo {
    return {
      HIDcode: 42,
      displayString: 'Backspace',
      webKeyId: 'Backspace'
    }
  }
  static get TAB(): HidInfo {
    return { HIDcode: 43, displayString: 'Tab', webKeyId: 'Tab' }
  }
  static get SPACE(): HidInfo {
    return { HIDcode: 44, displayString: 'Space', webKeyId: 'Space' }
  }
  static get MINUS(): HidInfo {
    return { HIDcode: 45, displayString: '-', webKeyId: 'Minus' }
  }
  static get EQUAL(): HidInfo {
    return { HIDcode: 46, displayString: '=', webKeyId: 'Equal' }
  }
  static get BRACKETL(): HidInfo {
    return { HIDcode: 47, displayString: '[', webKeyId: 'BracketLeft' }
  }
  static get BRACKETR(): HidInfo {
    return { HIDcode: 48, displayString: ']', webKeyId: 'BracketRight' }
  }
  static get BACKSLASH(): HidInfo {
    return { HIDcode: 49, displayString: '\\', webKeyId: 'Backslash' }
  }

  static get SEMICOLON(): HidInfo {
    return { HIDcode: 51, displayString: ';', webKeyId: 'Semicolon' }
  }
  static get QUOTE(): HidInfo {
    return { HIDcode: 52, displayString: '"', webKeyId: 'Quote' }
  }
  static get BACKQUOTE(): HidInfo {
    return { HIDcode: 53, displayString: '`', webKeyId: 'Backquote' }
  }
  static get COMMA(): HidInfo {
    return { HIDcode: 54, displayString: ',', webKeyId: 'Comma' }
  }
  static get PERIOD(): HidInfo {
    return { HIDcode: 55, displayString: '.', webKeyId: 'Period' }
  }
  static get SLASH(): HidInfo {
    return { HIDcode: 56, displayString: '/', webKeyId: 'Slash' }
  }
  static get CAPSLOCK(): HidInfo {
    return { HIDcode: 57, displayString: 'Caps Lock', webKeyId: 'CapsLock' }
  }
  static get F1(): HidInfo {
    return { HIDcode: 58, displayString: 'F1', webKeyId: 'F1' }
  }
  static get F2(): HidInfo {
    return { HIDcode: 59, displayString: 'F2', webKeyId: 'F2' }
  }

  static get F3(): HidInfo {
    return { HIDcode: 60, displayString: 'F3', webKeyId: 'F3' }
  }
  static get F4(): HidInfo {
    return { HIDcode: 61, displayString: 'F4', webKeyId: 'F4' }
  }
  static get F5(): HidInfo {
    return { HIDcode: 62, displayString: 'F5', webKeyId: 'F5' }
  }
  static get F6(): HidInfo {
    return { HIDcode: 63, displayString: 'F6', webKeyId: 'F6' }
  }
  static get F7(): HidInfo {
    return { HIDcode: 64, displayString: 'F7', webKeyId: 'F7' }
  }
  static get F8(): HidInfo {
    return { HIDcode: 65, displayString: 'F8', webKeyId: 'F8' }
  }
  static get F9(): HidInfo {
    return { HIDcode: 66, displayString: 'F9', webKeyId: 'F9' }
  }
  static get F10(): HidInfo {
    return { HIDcode: 67, displayString: 'F10', webKeyId: 'F10' }
  }
  static get F11(): HidInfo {
    return { HIDcode: 68, displayString: 'F11', webKeyId: 'F11' }
  }
  static get F12(): HidInfo {
    return { HIDcode: 69, displayString: 'F12', webKeyId: 'F12' }
  }

  static get PRINTSCREEN(): HidInfo {
    return {
      HIDcode: 70,
      displayString: 'Print Screen',
      webKeyId: 'PrintScreen'
    }
  }
  static get SCROLLLOCK(): HidInfo {
    return {
      HIDcode: 71,
      displayString: 'Scroll Lock',
      webKeyId: 'ScrollLock'
    }
  }
  static get PAUSE(): HidInfo {
    return { HIDcode: 72, displayString: 'Pause', webKeyId: 'Pause' }
  }
  static get INSERT(): HidInfo {
    return { HIDcode: 73, displayString: 'Insert', webKeyId: 'Insert' }
  }
  static get HOME(): HidInfo {
    return { HIDcode: 74, displayString: 'Home', webKeyId: 'Home' }
  }
  static get PAGEUP(): HidInfo {
    return { HIDcode: 75, displayString: 'Page Up', webKeyId: 'PageUp' }
  }
  static get DELETE(): HidInfo {
    return { HIDcode: 76, displayString: 'Delete', webKeyId: 'Delete' }
  }
  static get END(): HidInfo {
    return { HIDcode: 77, displayString: 'End', webKeyId: 'End' }
  }
  static get PAGEDOWN(): HidInfo {
    return { HIDcode: 78, displayString: 'Page Down', webKeyId: 'PageDown' }
  }
  static get ARROWR(): HidInfo {
    return {
      HIDcode: 79,
      displayString: 'Right Arrow',
      webKeyId: 'ArrowRight'
    }
  }

  static get ARROWL(): HidInfo {
    return {
      HIDcode: 80,
      displayString: 'Left Arrow',
      webKeyId: 'ArrowLeft'
    }
  }
  static get ARROWD(): HidInfo {
    return {
      HIDcode: 81,
      displayString: 'Down Arrow',
      webKeyId: 'ArrowDown'
    }
  }
  static get ARROWU(): HidInfo {
    return { HIDcode: 82, displayString: 'Up Arrow', webKeyId: 'ArrowUp' }
  }
  static get NUMLOCK(): HidInfo {
    return { HIDcode: 83, displayString: 'Num Lock', webKeyId: 'NumLock' }
  }
  static get NUMDIVIDE(): HidInfo {
    return {
      HIDcode: 84,
      displayString: 'Numpad Divide',
      webKeyId: 'NumpadDivide'
    }
  }
  static get NUMMULTIPLY(): HidInfo {
    return {
      HIDcode: 85,
      displayString: 'Numpad Multiply',
      webKeyId: 'NumpadMultiply'
    }
  }
  static get NUMSUBTRACT(): HidInfo {
    return {
      HIDcode: 86,
      displayString: 'Numpad Subtract',
      webKeyId: 'NumpadSubtract'
    }
  }
  static get NUMADD(): HidInfo {
    return {
      HIDcode: 87,
      displayString: 'Numpad Add',
      webKeyId: 'NumpadAdd'
    }
  }
  static get NUMENTER(): HidInfo {
    return {
      HIDcode: 88,
      displayString: 'Numpad Enter',
      webKeyId: 'NumpadEnter'
    }
  }
  static get NP1(): HidInfo {
    return { HIDcode: 89, displayString: '1', webKeyId: 'Numpad1' }
  }

  static get NP2(): HidInfo {
    return { HIDcode: 90, displayString: '2', webKeyId: 'Numpad2' }
  }
  static get NP3(): HidInfo {
    return { HIDcode: 91, displayString: '3', webKeyId: 'Numpad3' }
  }
  static get NP4(): HidInfo {
    return { HIDcode: 92, displayString: '4', webKeyId: 'Numpad4' }
  }
  static get NP5(): HidInfo {
    return { HIDcode: 93, displayString: '5', webKeyId: 'Numpad5' }
  }
  static get NP6(): HidInfo {
    return { HIDcode: 94, displayString: '6', webKeyId: 'Numpad6' }
  }
  static get NP7(): HidInfo {
    return { HIDcode: 95, displayString: '7', webKeyId: 'Numpad7' }
  }
  static get NP8(): HidInfo {
    return { HIDcode: 96, displayString: '8', webKeyId: 'Numpad8' }
  }
  static get NP9(): HidInfo {
    return { HIDcode: 97, displayString: '9', webKeyId: 'Numpad9' }
  }
  static get NP0(): HidInfo {
    return { HIDcode: 98, displayString: '0', webKeyId: 'Numpad0' }
  }
  static get NUMDECIMAL(): HidInfo {
    return {
      HIDcode: 99,
      displayString: 'Numpad Decimal',
      webKeyId: 'NumpadDecimal'
    }
  }

  /** KEYS TO ADD
   * Internation Backslash
   * Context Menu
   * Power
   * Numpad Equal
   * F13 - 24
   * Open
   * Help
   * Again
   * Undo
   * Cut
   * Copy
   * Paste
   * Find
   * Volume Mute
   * Volume Up
   * Volume Down
   * Numpad Comma
   * International RO
   * Kana Mode
   * International Yen
   * Convert
   * NonConvert
   * Lang1 - 4
   */

  static get CONTROLL(): HidInfo {
    return {
      HIDcode: 224,
      displayString: 'Left Control',
      webKeyId: 'ControlLeft'
    }
  }
  static get SHIFTL(): HidInfo {
    return {
      HIDcode: 225,
      displayString: 'Left Shift',
      webKeyId: 'ShiftLeft'
    }
  }
  static get ALTL(): HidInfo {
    return { HIDcode: 226, displayString: 'Left Alt', webKeyId: 'AltLeft' }
  }
  static get METAL(): HidInfo {
    return {
      HIDcode: 227,
      displayString: 'Left Meta',
      webKeyId: 'MetaLeft'
    }
  }
  static get CONTROLR(): HidInfo {
    return {
      HIDcode: 228,
      displayString: 'Right Control',
      webKeyId: 'ControlRight'
    }
  }
  static get SHIFTR(): HidInfo {
    return {
      HIDcode: 229,
      displayString: 'Right Shift',
      webKeyId: 'ShiftRight'
    }
  }
  static get ALTR(): HidInfo {
    return {
      HIDcode: 230,
      displayString: 'Right Alt',
      webKeyId: 'AltRight'
    }
  }
  static get METAR(): HidInfo {
    return {
      HIDcode: 231,
      displayString: 'Right Meta',
      webKeyId: 'MetaRight'
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
