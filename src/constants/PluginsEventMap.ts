import { PluginGroup } from './enums'

export interface PluginEventInfo {
  pluginGroup: PluginGroup
  subtype: string
  displayString: string
  defaultData: string
}

export class Plugin {
  /**
   * E.g. 
   * 
   * static get ActionName(): PluginEventInfo {
      return {
        pluginGroup: PluginGroup.PluginName,
        subtype: 'Action Name',
        displayString: 'Action Name',
        defaultData: { type: {PluginGroup.PluginName as string}, action: { type: {subtype is copied here}, data: '...' } }
      }
    }
   * 
   */

  // Insert Plugin Events Here

  static readonly all: PluginEventInfo[] = [
    // Add the static get() here, e.g. Plugin.ActionName
  ]
}

export const pluginEventLookup = new Map<string, PluginEventInfo>(
  Plugin.all
    .filter((event) => event.subtype !== undefined)
    .map((event) => [event.subtype!, event])
)
