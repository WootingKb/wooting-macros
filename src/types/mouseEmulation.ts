// Mouse Emulation Configuration Types

export enum CurveType {
  Power = 'Power',
  Log = 'Log',
  SCurve = 'S-Curve',
  Linear = 'Linear'
}

export interface MouseEmulationConfig {
  // General Settings
  sensitivity_movement: number
  y_sensitivity_adjustment: number
  sensitivity_scroll: number
  curve_factor: number
  activation_point: number
  maximum_actuation: number
  
  // Keymapping
  key_mapping: {
    up: number | null
    down: number | null
    left: number | null
    right: number | null
    scroll_up: number | null
    scroll_down: number | null
    scroll_left: number | null
    scroll_right: number | null
  }
  
  // Curve Settings
  curve_type: CurveType
  
  // Activation Settings
  use_activation_key: boolean
  activation_key: number | null
}

export const defaultMouseEmulationConfig: MouseEmulationConfig = {
  sensitivity_movement: 17.0,
  y_sensitivity_adjustment: 0.4,
  sensitivity_scroll: 3,
  curve_factor: 1.5,
  activation_point: 0.1,
  maximum_actuation: 1.0,
  
  key_mapping: {
    up: null,
    down: null,
    left: null,
    right: null,
    scroll_up: null,
    scroll_down: null,
    scroll_left: null,
    scroll_right: null
  },
  
  curve_type: CurveType.Power,
  use_activation_key: false,
  activation_key: null
}

export const keyMappingDirections = [
  { id: 'up', label: 'Up', icon: '↑' },
  { id: 'down', label: 'Down', icon: '↓' },
  { id: 'left', label: 'Left', icon: '←' },
  { id: 'right', label: 'Right', icon: '→' },
  { id: 'scroll_up', label: 'Scroll Up', icon: '↑' },
  { id: 'scroll_down', label: 'Scroll Down', icon: '↓' },
  { id: 'scroll_left', label: 'Scroll Left', icon: '←' },
  { id: 'scroll_right', label: 'Scroll Right', icon: '→' }
] as const
