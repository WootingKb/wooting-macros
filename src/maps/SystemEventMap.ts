import { SystemAction } from '../types'

export interface SystemEventInfo {
  type: string
  subtype: string
  displayString: string
  defaultData: SystemAction
}

export class SystemEvent {
  static get OpenApplication(): SystemEventInfo {
    return {
      type: 'Open',
      subtype: 'Open',
      displayString: 'Open Application',
      defaultData: { type: 'Open', action : '' }
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
      }
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
      }
    }
  }
  static get IncreaseVolume(): SystemEventInfo {
    return {
      type: 'Volume',
      subtype: 'IncreaseVolume',
      displayString: 'Increase Volume',
      defaultData: { type: 'Volume', action: { type: 'IncreaseVolume' } }
    }
  }
  static get DecreaseVolume(): SystemEventInfo {
    return {
      type: 'Volume',
      subtype: 'LowerVolume',
      displayString: 'Decrease Volume',
      defaultData: { type: 'Volume', action: { type: 'LowerVolume' } }
    }
  }
  static get ToggleMuteVolume(): SystemEventInfo {
    return {
      type: 'Volume',
      subtype: 'ToggleMute',
      displayString: 'Toggle Mute Volume',
      defaultData: { type: 'Volume', action: { type: 'ToggleMute' } }
    }
  }
  static get SetBrightness(): SystemEventInfo {
    return {
      type: 'Brightness',
      subtype: 'Set',
      displayString: 'Set Brightness',
      defaultData: { type: 'Brightness', action: { type: 'Set', level: 75 } }
    }
  }
  static get IncreaseBrightness(): SystemEventInfo {
    return {
      type: 'Brightness',
      subtype: 'Increase',
      displayString: 'Increase Brightness',
      defaultData: { type: 'Brightness', action: { type: 'Increase' } }
    }
  }
  static get DecreaseBrightness(): SystemEventInfo {
    return {
      type: 'Brightness',
      subtype: 'Decrease',
      displayString: 'Decrease Brightness',
      defaultData: { type: 'Brightness', action: { type: 'Decrease' } }
    }
  }

  static readonly all: SystemEventInfo[] = [
    SystemEvent.OpenApplication,
    SystemEvent.Clipboard,
    SystemEvent.Sarcasm,
    SystemEvent.IncreaseVolume,
    SystemEvent.DecreaseVolume,
    SystemEvent.ToggleMuteVolume,
    SystemEvent.SetBrightness,
    SystemEvent.IncreaseBrightness,
    SystemEvent.DecreaseBrightness
  ]
}

export const sysEventLookup = new Map<string, SystemEventInfo>(
  SystemEvent.all
    .filter((event) => event.subtype !== undefined)
    .map((event) => [event.subtype!, event])
)
