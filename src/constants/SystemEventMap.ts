import { SystemAction } from '../types'

export interface SystemEventInfo {
  type: string
  subtype: string
  displayString: string
  defaultData: SystemAction
  description: string
}

export class SystemEvent {
  static get OpenFile(): SystemEventInfo {
    return {
      type: 'Open',
      subtype: 'File',
      displayString: 'Open File',
      defaultData: { type: 'Open', action: { type: 'File', data: '' } },
      description: "Opens any file on your computer."
    }
  }
  static get OpenFolder(): SystemEventInfo {
    return {
      type: 'Open',
      subtype: 'Directory',
      displayString: 'Open Folder',
      defaultData: { type: 'Open', action: { type: 'Directory', data: '' } },
      description: "Opens up a file explorer window to the specified folder."
    }
  }
  static get OpenWebsite(): SystemEventInfo {
    return {
      type: 'Open',
      subtype: 'Website',
      displayString: 'Open Website',
      defaultData: { type: 'Open', action: { type: 'Website', data: '' } },
      description: "Opens up a website in your default browser."
    }
  }

  static get Clipboard(): SystemEventInfo {
    return {
      type: 'Clipboard',
      subtype: 'PasteUserDefinedString',
      displayString: 'Paste Text',
      defaultData: {
        type: 'Clipboard',
        action: { type: 'PasteUserDefinedString', data: '' }
      },
      description: "Pastes the specified text into a currently selected text input area."
    }
  }
  static get Sarcasm(): SystemEventInfo {
    return {
      type: 'Clipboard',
      subtype: 'Sarcasm',
      displayString: 'Sarcastify Text',
      defaultData: {
        type: 'Clipboard',
        action: { type: 'Sarcasm' }
      },
      description: "Randomly capitalizes some letters in the currently highlighted text."
    }
  }
  static get IncreaseVolume(): SystemEventInfo {
    return {
      type: 'Volume',
      subtype: 'IncreaseVolume',
      displayString: 'Increase Volume',
      defaultData: { type: 'Volume', action: { type: 'IncreaseVolume' } },
      description: "Increases volume by an OS-specific amount."
    }
  }
  static get DecreaseVolume(): SystemEventInfo {
    return {
      type: 'Volume',
      subtype: 'LowerVolume',
      displayString: 'Decrease Volume',
      defaultData: { type: 'Volume', action: { type: 'LowerVolume' } },
      description: "Decreases volume by an OS-specific amount."
    }
  }
  static get ToggleMuteVolume(): SystemEventInfo {
    return {
      type: 'Volume',
      subtype: 'ToggleMute',
      displayString: 'Toggle Mute Volume',
      defaultData: { type: 'Volume', action: { type: 'ToggleMute' } },
      description: "Mutes or unmutes the system audio output."
    }
  }
  // static get SetBrightness(): SystemEventInfo {
  //   return {
  //     type: 'Brightness',
  //     subtype: 'SetAll',
  //     displayString: 'Set Brightness',
  //     defaultData: {
  //       type: 'Brightness',
  //       action: { type: 'SetAll', level: 75, }
  //     }
  //   }
  // }
  // static get IncreaseBrightness(): SystemEventInfo {
  //   return {
  //     type: 'Brightness',
  //     subtype: 'Increase',
  //     displayString: 'Increase Brightness',
  //     defaultData: { type: 'Brightness', action: { type: 'Increase' } }
  //   }
  // }
  // static get DecreaseBrightness(): SystemEventInfo {
  //   return {
  //     type: 'Brightness',
  //     subtype: 'Decrease',
  //     displayString: 'Decrease Brightness',
  //     defaultData: { type: 'Brightness', action: { type: 'Decrease' } }
  //   }
  // }

  static readonly all: SystemEventInfo[] = [
    SystemEvent.OpenFile,
    SystemEvent.OpenFolder,
    SystemEvent.OpenWebsite,
    SystemEvent.Clipboard,
    SystemEvent.Sarcasm,
    SystemEvent.IncreaseVolume,
    SystemEvent.DecreaseVolume,
    SystemEvent.ToggleMuteVolume,
    // SystemEvent.SetBrightness,
    // SystemEvent.IncreaseBrightness,
    // SystemEvent.DecreaseBrightness
  ]
}

export const sysEventLookup = new Map<string, SystemEventInfo>(
  SystemEvent.all
    .filter((event) => event.subtype !== undefined)
    .map((event) => [event.subtype!, event])
)
