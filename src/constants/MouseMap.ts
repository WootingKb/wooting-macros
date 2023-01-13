import { MouseButton } from './enums'

export interface MouseInputInfo {
  webButtonVal: number
  enumVal: MouseButton
  displayString: string
}

export class MouseInput {
  static get Left(): MouseInputInfo {
    return {
      webButtonVal: 0,
      enumVal: MouseButton.Left,
      displayString: 'Left Click'
    }
  }
  static get Middle(): MouseInputInfo {
    return {
      webButtonVal: 1,
      enumVal: MouseButton.Middle,
      displayString: 'Middle Click'
    }
  }
  static get Right(): MouseInputInfo {
    return {
      webButtonVal: 2,
      enumVal: MouseButton.Right,
      displayString: 'Right Click'
    }
  }
  static get Mouse4(): MouseInputInfo {
    return {
      webButtonVal: 3,
      enumVal: MouseButton.Mouse4,
      displayString: 'Mouse 4'
    }
  }
  static get Mouse5(): MouseInputInfo {
    return {
      webButtonVal: 4,
      enumVal: MouseButton.Mouse5,
      displayString: 'Mouse 5'
    }
  }

  static readonly all: MouseInputInfo[] = [
    MouseInput.Left,
    MouseInput.Middle,
    MouseInput.Right,
    MouseInput.Mouse4,
    MouseInput.Mouse5
  ]
}

export const webButtonLookup = new Map<number, MouseInputInfo>(
  MouseInput.all
    .filter((button) => button.webButtonVal !== undefined)
    .map((button) => [button.webButtonVal!, button])
)

export const mouseEnumLookup = new Map<MouseButton, MouseInputInfo>(
  MouseInput.all
    .filter((button) => button.enumVal !== undefined)
    .map((button) => [button.enumVal!, button])
)
