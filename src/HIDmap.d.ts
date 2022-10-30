export interface HidInfo {
  byte: number
  id: string
  category: HidCategory
  icon?: string
  shortId?: string
  tooltip?: I18N_HidTooltip | I18N_KeyBindings
  vkCode?: number
  webKeyId?: string
}

export const webCodeHIDLookup = new Map<string, HidInfo>(
  Hid.all
    .filter(hid => hid.webKeyId !== undefined)
    .map(hid => [hid.webKeyId!, hid])
)