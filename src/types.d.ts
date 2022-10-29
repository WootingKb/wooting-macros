export interface Macro {
    name: string,
    isActive: boolean,
    trigger: string[]
    sequence: any,
}

// need to unify with backend on types
// need easy way to get trigger keys
// currently backend has TriggerEventType as a single keypress event, but we need up to 4 keys

export interface Collection {
    name: string,
    isActive: boolean,
    macros: Macro[],
    icon: string,
}

export interface Keypress {
    keypress: number
    press_duration: number
}

export interface KeyPressEvent {
    data: Keypress
}

export type TriggerEventType = KeyPressEvent | undefined

export type ActionEventType = KeyPressEvent | undefined
