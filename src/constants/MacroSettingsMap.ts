import { SettingsCategory } from './enums'

export interface MacroSettingInfo {
  pageIndex: number
  category: SettingsCategory
  displayString: string
}

export class MacroSettingsGroup {
  static get Notifications(): MacroSettingInfo {
    return {
      pageIndex: 0,
      category: SettingsCategory.Macro,
      displayString: 'Notifications'
    }
  }
  static get SequenceDefaults(): MacroSettingInfo {
    return {
      pageIndex: 1,
      category: SettingsCategory.Macro,
      displayString: 'Sequence'
    }
  }


  static readonly all: MacroSettingInfo[] = [
    MacroSettingsGroup.Notifications,
    MacroSettingsGroup.SequenceDefaults,
  ]
}

export const macroSettingInfoLookup = new Map<number, MacroSettingInfo>(
  MacroSettingsGroup.all
    .filter((setting) => setting.pageIndex !== undefined)
    .map((setting) => [setting.pageIndex!, setting])
)
