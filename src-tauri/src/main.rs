#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![allow(warnings, unused)]

extern crate core;

use std::{fs, thread, time};
use std::fs::File;
use std::io::Read;
use std::sync::RwLock;

use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use serde_json;
use tauri::App;

use crate::wooting_macros_library::*;

//use crate::wooting_macros_library;

mod hid_table;
mod wooting_macros_library;

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct ApplicationConfig {
    pub use_input_grab: bool,
    pub startup_delay: u64,
}

impl ApplicationConfig {
    pub fn read_data() -> ApplicationConfig {
        let path = "../config.json";

        let default_config: ApplicationConfig = ApplicationConfig {
            use_input_grab: false,
            startup_delay: 0,
        };

        //TODO: Make this create a new file when needed.
        let data = {
            match fs::read_to_string(path) {
                Ok(T) => T,
                Err(E) => {
                    eprintln!("{}", E);
                    std::fs::write(
                        "../config.json",
                        serde_json::to_string_pretty(&default_config).unwrap(),
                    )
                        .unwrap();

                    let output = fs::read_to_string(path).unwrap();
                    println!("{}", output);

                    output
                }
            }
        };

        let deserialized: ApplicationConfig = match serde_json::from_str(&data) {
            Ok(T) => T,
            Err(E) => {
                println!("{}", E);
                std::fs::write(
                    "../config.json",
                    serde_json::to_string_pretty(&default_config).unwrap(),
                )
                    .unwrap();
                thread::sleep(time::Duration::from_secs(2));
                serde_json::from_str(&data).unwrap()
            }
        };
        deserialized
    }
}

lazy_static! {
    pub static ref APPLICATION_STATE: MacroDataState = { MacroDataState::new() };
}

fn main() {
    //TODO: Async run the backend.

    tauri::Builder::default()
        // This is where you pass in your commands
        .manage(MacroDataState::new())
        .invoke_handler(tauri::generate_handler![
            get_macros,
            set_macros
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");


    run_this();
}

pub fn get_config() -> ApplicationConfig {
    let mut config: ApplicationConfig = ApplicationConfig {
        use_input_grab: false,
        startup_delay: 3,
    };

    let mut file = match File::open("../../config.json") {
        Ok(T) => T,
        Err(E) => {
            eprintln!("Error parsing the file {}", E);
            println!("Error finding the config.json file.\nPlease place one in the root directory. Using default configuration (safe).\nCreating an empty file.\n");
            File::create("../../config.json").unwrap()
        }
    };
    config
}
