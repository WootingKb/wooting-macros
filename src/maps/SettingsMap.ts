import { SettingsCategory } from '../enums'

export interface SettingInfo {
  pageIndex: number
  category: SettingsCategory
  displayString: string
}

export class SettingsGroup {
  static get Application(): SettingInfo {
    return {
      pageIndex: 0,
      category: SettingsCategory.General,
      displayString: 'Application',
    }
  }
  static get Appearance(): SettingInfo {
    return {
      pageIndex: 1,
      category: SettingsCategory.General,
      displayString: 'Appearance',
    }
  }
  static get Accessibility(): SettingInfo {
    return {
      pageIndex: 2,
      category: SettingsCategory.General,
      displayString: 'Accessibility',
    }
  }
  static get Language(): SettingInfo {
    return {
      pageIndex: 3,
      category: SettingsCategory.General,
      displayString: 'Language',
    }
  }
  static get Integration(): SettingInfo {
    return {
      pageIndex: 4,
      category: SettingsCategory.General,
      displayString: 'Integrations',
    }
  }
  static get Updates(): SettingInfo {
    return {
      pageIndex: 5,
      category: SettingsCategory.Other,
      displayString: 'Patch Notes',
    }
  }
  static get Support(): SettingInfo {
    return {
      pageIndex: 6,
      category: SettingsCategory.Other,
      displayString: 'Help & Guides',
    }
  }

  static readonly all: SettingInfo[] = [
    SettingsGroup.Application,
    SettingsGroup.Appearance,
    // SettingsGroup.Accessibility,
    // SettingsGroup.Language,
    // SettingsGroup.Integration,
    SettingsGroup.Updates,
    SettingsGroup.Support
  ]
}

export const settingInfoLookup = new Map<number, SettingInfo>(
  SettingsGroup.all
    .filter((setting) => setting.pageIndex !== undefined)
    .map((setting) => [setting.pageIndex!, setting])
)
