import { VolumeAction } from "../enums"
import { SystemAction } from "../types"

export interface SystemEventInfo {
  type: string
  displayString: string
  defaultData: SystemAction
}

export class SystemEvent {
  static get OpenApplication(): SystemEventInfo {
    return { type: 'Open', displayString: 'Open Application', defaultData: { type: "Open", path: "" } }
  }
  static get Clipboard(): SystemEventInfo {
    return { type: 'Clipboard', displayString: 'Paste Text', defaultData: { type: "Clipboard", action: { type: 'SetClipboard', data: "string"} } }
  }
  static get IncreaseVolume(): SystemEventInfo {
    return { type: 'Volume', displayString: 'Increase Volume', defaultData: { type: "Volume", action: VolumeAction.IncreaseVolume } }
  }
  static get DecreaseVolume(): SystemEventInfo {
    return { type: 'Volume', displayString: 'Decrease Volume', defaultData: { type: "Volume", action: VolumeAction.LowerVolume } }
  }
  static get ToggleMuteVolume(): SystemEventInfo {
    return { type: 'Volume', displayString: 'Toggle Mute Volume', defaultData: { type: "Volume", action: VolumeAction.ToggleMute } }
  }
  static get AdjustBrightness(): SystemEventInfo {
    return { type: 'Brightness', displayString: 'Adjust Brightness', defaultData: { type: "Brightness", action: undefined } }
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
