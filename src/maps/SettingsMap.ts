import { useMemo } from "react"
import { SettingsCategory } from "../enums"

export interface SettingInfo {
  pageIndex: number
  category: SettingsCategory
  displayString: string
}

export class Setting {
  static get WindowSettings(): SettingInfo {
    return {
      pageIndex: 0,
      category: SettingsCategory.General,
      displayString: 'Window Settings'
    }
  }
  static get AppearanceSettings(): SettingInfo {
    return {
      pageIndex: 1,
      category: SettingsCategory.General,
      displayString: 'Appearance'
    }
  }
  static get AccessibilitySettings(): SettingInfo {
    return {
      pageIndex: 2,
      category: SettingsCategory.General,
      displayString: 'Accessibility'
    }
  }
  static get LanguageSettings(): SettingInfo {
    return {
      pageIndex: 3,
      category: SettingsCategory.General,
      displayString: 'Language'
    }
  }
  static get IntegrationSettings(): SettingInfo {
    return {
      pageIndex: 4,
      category: SettingsCategory.General,
      displayString: 'Integrations'
    }
  }
  static get Updates(): SettingInfo {
    return {
      pageIndex: 5,
      category: SettingsCategory.Other,
      displayString: 'Patch Notes'
    }
  }
  static get Support(): SettingInfo {
    return {
      pageIndex: 6,
      category: SettingsCategory.Other,
      displayString: 'Help & Guides'
    }
  }
  static get Feedback(): SettingInfo {
    return {
      pageIndex: 7,
      category: SettingsCategory.Other,
      displayString: 'Feedback'
    }
  }

  static readonly all: SettingInfo[] = [
    Setting.WindowSettings,
    Setting.AppearanceSettings,
    Setting.AccessibilitySettings,
    Setting.LanguageSettings,
    Setting.IntegrationSettings,
    Setting.Updates,
    Setting.Support,
    Setting.Feedback
  ]
}

export const settingInfoLookup = new Map<number, SettingInfo>(
  Setting.all
    .filter((setting) => setting.pageIndex !== undefined)
    .map((setting) => [setting.pageIndex!, setting])
)
