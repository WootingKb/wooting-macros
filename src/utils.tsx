import { invoke } from "@tauri-apps/api/tauri";
import { Collection, MacroData } from "./types";

export const updateBackendConfig = (collections: Collection[]) => {
    let macroData:MacroData = { data:collections }
    console.log(macroData)
    invoke<void>("set_macros", { frontendData: macroData })
    .catch(e => {
        console.error(e)
    })
}