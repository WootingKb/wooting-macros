export interface SystemEventInfo {
    type: string
    displayString: string
}

export class SystemEvent {
static get OpenApplication(): SystemEventInfo {
    return { type: 'Open', displayString: 'Open Application'}
  }
static get PasteText(): SystemEventInfo {
    return { type: 'Paste', displayString: 'Paste Text'}
  }
static get AdjustVolume(): SystemEventInfo {
    return { type: 'Volume', displayString: 'Adjust Volume'}
  }

  static readonly all: SystemEventInfo[] = [
    SystemEvent.OpenApplication,
    SystemEvent.PasteText,
    SystemEvent.AdjustVolume,
  ]
}