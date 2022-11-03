import { invoke } from "@tauri-apps/api/tauri";
import { Collection } from "./types";

export const updateBackendConfig = (collections:Collection[]) => {
        invoke("set_configuration", { frontendData: collections }).then((res) => {
            console.log(res)
        }).catch(e => {
        console.error(e)
        })
    }