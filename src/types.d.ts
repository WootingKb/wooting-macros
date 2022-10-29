export interface Macro {
    name: string,
    isActive: boolean,
    trigger: any, // Change later
    sequence: any,
}

export interface Collection {
    name: string,
    isActive: boolean,
    macros: Macro[],
}

