import { PluginGroup } from "../enums"

export interface PluginEventInfo {
  pluginGroup: PluginGroup
  type: string
  subtype: string
  displayString: string
  defaultData: string
}
