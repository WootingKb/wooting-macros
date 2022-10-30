#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![allow(warnings, unused)]

extern crate core;

use std::fs::File;
use std::io::Read;

use serde::{Deserialize, Serialize};
use serde_json;
use tauri::App;

use crate::wooting_macros_library::*;

//use crate::wooting_macros_library;

mod hid_table;
mod wooting_macros_library;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct ApplicationConfig {
    pub use_input_grab: bool,
    pub startup_delay: u64,
}

fn main() {
    // tauri::Builder::default()
    //     // This is where you pass in your commands
    //     .invoke_handler(tauri::generate_handler![
    //         export_frontend,
    //         import_frontend,
    //         push_frontend_first
    //     ])
    //     .run(tauri::generate_context!())
    //     .expect("error while running tauri application");

    let mut config: ApplicationConfig = ApplicationConfig {
        use_input_grab: false,
        startup_delay: 3,
    };

    let mut file = match File::open("config.json") {
        Ok(T) => T,
        Err(E) => {
            eprintln!("Error parsing the file {}", E);
            println!("Error finding the config.json file.\nPlease place one in the root directory. Using default configuration (safe).\nCreating an empty file.\n");
            File::create("config.json").unwrap()
        }
    };
    // let mut data = String::new();
    //
    // match file.read_to_string(&mut data) {
    //     Ok(T) => {
    //         println!("Loaded the file");
    //         let config: ApplicationConfig =
    //             //TODO: rewrite this
    //             serde_json::from_str(&data).expect("JSON was not well-formatted");
    //         println!("{:#?}", config);
    //     }
    //     Err(E) => {}
    // }

    run_this(&config)
}
