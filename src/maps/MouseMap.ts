export interface MouseInputInfo {
  button: number
  displayString: string
}

export class MouseInput {
  static get Left(): MouseInputInfo {
    return { button: 0, displayString: 'Left Click' }
  }
  static get Middle(): MouseInputInfo {
    return { button: 1, displayString: 'Middle Click' }
  }
  static get Right(): MouseInputInfo {
    return { button: 2, displayString: 'Right Click' }
  }
  static get X1(): MouseInputInfo {
    return { button: 3, displayString: 'Mouse 4' }
  }
  static get X2(): MouseInputInfo {
    return { button: 4, displayString: 'Mouse 5' }
  }
}
