#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]
#![allow(warnings, unused)]

extern crate core;

use std::{fs, thread, time};
use std::fs::{File, read_to_string};
use std::io::{ErrorKind, Read, Write};
use std::process::Command;

use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use serde_json;
use tauri::{App, Manager, SystemTrayEvent, SystemTrayMenuItem};
use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu};
use tauri::async_runtime::RwLock;
use tokio::*;
use tokio::io::{AsyncWriteExt, stdin};

use plugin::delay;

use crate::wooting_macros_library::*;

//use std::sync::RwLock;

pub mod plugin;

mod hid_table;
mod wooting_macros_library;

#[derive(Debug, serde::Serialize, serde::Deserialize, Clone)]
#[serde(rename_all = "PascalCase")]
pub struct ApplicationConfig {
    pub use_input_grab: bool,
    pub startup_delay: u64,
}

trait StateManagement {
    fn read_data_config() -> ApplicationConfig {
        unimplemented!("Implement locally.")
    }
    fn write_to_file(&self) {
        unimplemented!("Implement locally.")
    }
    fn read_data_macro() -> MacroData {
        unimplemented!("Implement locally.")
    }
}

impl StateManagement for ApplicationConfig {
    fn read_data_config() -> ApplicationConfig {
        let default: ApplicationConfig = ApplicationConfig {
            use_input_grab: false,
            startup_delay: 0,
        };
        return match File::open("../config.json") {
            Ok(T) => {
                let data: ApplicationConfig = serde_json::from_reader(&T).unwrap();
                data
            }

            Err(E) => {
                eprintln!("Error opening file, using default config {}", E);
                default.write_to_file();
                default
            }
        };
    }

    fn write_to_file(&self) {
        match std::fs::write(
            "../config.json",
            serde_json::to_string_pretty(&self).unwrap(),
        ) {
            Ok(_) => {
                println!("Success writing a new file");
            }
            Err(E) => {
                eprintln!(
                    "Error writing a new file, using only read only defaults. {}",
                    E
                );
            }
        };
    }
}

lazy_static! {
    pub static ref APPLICATION_STATE: MacroDataState = { MacroDataState::new() };
}

lazy_static! {
    pub static ref TRIGGERS_LIST: Triggers = { Triggers::new() };
}

// lazy_static! {
//     pub static ref KEYS_PRESSED: M = { MacroDataState::new() };
// }

//#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
#[tokio::main]
async fn main() {
    /// Spawn the backend thread.
    /// Note: this doesn't work on macOS since we cannot give the thread the proper permissions
    /// (will crash on key grab/listen)
    task::spawn(async move {
        run_backend().await;
    })
        .await;

    /// Begin the main event loop. This loop cannot run on another thread on MacOS.
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");

    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        // This is where you pass in your commands
        .manage(MacroDataState::new())
        .invoke_handler(tauri::generate_handler![
            get_macros, set_macros, get_config, set_config
        ])
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => {
                // get a handle to the clicked menu item
                // note that `tray_handle` can be called anywhere,
                // just get a `AppHandle` instance with `app.handle()` on the setup hook
                // and move it to another function or thread
                let item_handle = app.tray_handle().get_item(&id);
                match id.as_str() {
                    "hide" => {
                        let window = app.get_window("main").unwrap();
                        window.hide().unwrap();
                        // you can also `set_selected`, `set_enabled` and `set_native_image` (macOS only).
                        item_handle.set_title("Show").unwrap();
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    "show" => {
                        let window = app.get_window("main").unwrap();
                        window.show().unwrap();
                        // you can also `set_selected`, `set_enabled` and `set_native_image` (macOS only).
                    }
                    _ => {}
                }
            }
            SystemTrayEvent::LeftClick {
                tray_id,
                position,
                size,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
            }
            _ => {}
        })
        //.any_thread()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
