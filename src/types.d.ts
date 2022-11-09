export interface Keypress {
    keypress: number
    press_duration: number
}

export type TriggerEventType = 
| {type: "KeyPressEvent", data: Keypress[]}

export type ActionEventType =
| {type: "KeyPressEvent", data: Keypress}
| {type: "Delay", data: number}

export interface MacroData {
    data: Collection[]
}

export interface Macro {
    name: string,
    active: boolean,
    macro_type: string,
    trigger: TriggerEventType,
    sequence: ActionEventType[],
}

export interface Collection {
    name: string,
    active: boolean,
    macros: Macro[],
    icon: string,
}
