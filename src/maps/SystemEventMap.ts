import { SystemAction } from '../types'

export interface SystemEventInfo {
  type: string
  displayString: string
  defaultData: SystemAction
}

export class SystemEvent {
  static get OpenApplication(): SystemEventInfo {
    return {
      type: 'Open',
      displayString: 'Open Application',
      defaultData: { type: 'Open', path: '' }
    }
  }
  static get Clipboard(): SystemEventInfo {
    return {
      type: 'Clipboard',
      displayString: 'Paste Text',
      defaultData: {
        type: 'Clipboard',
        action: { type: 'SetClipboard', data: 'string' }
      }
    }
  }
  static get IncreaseVolume(): SystemEventInfo {
    return {
      type: 'Volume',
      displayString: 'Increase Volume',
      defaultData: { type: 'Volume', action: { type: 'IncreaseVolume' } }
    }
  }
  static get DecreaseVolume(): SystemEventInfo {
    return {
      type: 'Volume',
      displayString: 'Decrease Volume',
      defaultData: { type: 'Volume', action: { type: 'LowerVolume' } }
    }
  }
  static get ToggleMuteVolume(): SystemEventInfo {
    return {
      type: 'Volume',
      displayString: 'Toggle Mute Volume',
      defaultData: { type: 'Volume', action: { type: 'ToggleMute' } }
    }
  }
  static get AdjustBrightness(): SystemEventInfo {
    return {
      type: 'Brightness',
      displayString: 'Adjust Brightness',
      defaultData: { type: 'Brightness', action: { type: 'Set', level: 75 } }
    }
  }

  static readonly all: SystemEventInfo[] = [
    SystemEvent.OpenApplication,
    SystemEvent.Clipboard,
    SystemEvent.IncreaseVolume,
    SystemEvent.DecreaseVolume,
    SystemEvent.ToggleMuteVolume,
    SystemEvent.AdjustBrightness
  ]
}

export const sysEventLookup = new Map<string, SystemEventInfo>(
  SystemEvent.all
    .filter((event) => event.type !== undefined)
    .map((event) => [event.type!, event])
)
