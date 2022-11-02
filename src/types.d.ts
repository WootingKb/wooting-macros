export interface Keypress {
    keypress: number
    press_duration: number
}

export type TriggerEventType = 
| {type: "KeyPressEvent", data: Keypress[]}

export type ActionEventType =
| {type: "KeyPressEvent", data: Keypress}
| {type: "Delay", value: number}

export interface Macro {
    name: string,
    active: boolean,
    trigger: TriggerEventType,
    sequence: ActionEventType[],
}

export interface Collection {
    name: string,
    active: boolean,
    macros: Macro[],
    icon: string,
}
