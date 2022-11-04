// import { MacroType } from "./enums"

export interface Keypress {
    keypress: number
    press_duration: number
}

export type TriggerEventType = 
| {type: "KeyPressEvent", data: Keypress[]}

export type ActionEventType =
| {type: "KeyPressEvent", data: Keypress}
| {type: "Delay", value: number}

export type MacroType =
| {type: "Single"}
| {type: "Repeating"}
| {type: "OnHold"}
| {type: "MultiLevel"}

export interface MacroData {
    data: Collection[]
}

export interface Macro {
    name: string,
    active: boolean,
    macro_type: MacroType,
    trigger: TriggerEventType,
    sequence: ActionEventType[],
}

export interface Collection {
    name: string,
    active: boolean,
    macros: Macro[],
    icon: string,
}
