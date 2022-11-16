#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#![allow(warnings, unused)]

extern crate core;

use std::{fs, thread, time};
use std::fs::File;
use std::process::Command;

use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use serde_json;
use tauri::{App, Manager, SystemTrayEvent, SystemTrayMenuItem};
use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu};
//use std::sync::RwLock;
use tauri::async_runtime::RwLock;
use tokio::*;
use tokio::io::{AsyncWriteExt, stdin};

use plugin::delay;

use crate::wooting_macros_library::*;

pub mod plugin;

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

    /// This exports data for the frontend to process it.
    /// Basically sends the entire struct to the frontend
    pub fn export_data(&self) {
        std::fs::write(
            "../config.json",
            serde_json::to_string_pretty(&self).unwrap(),
        )
            .unwrap();
    }
}

lazy_static! {
    pub static ref APPLICATION_STATE: MacroDataState = { MacroDataState::new() };
}

// lazy_static! {
//     pub static ref KEYS_PRESSED: M = { MacroDataState::new() };
// }

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
async fn main() {
    /// Spawn the backend thread.
    /// Note: this doesn't work on macOS since we cannot give the thread the proper permissions
    /// (will crash on key grab/listen)
    task::spawn(async move {
        run_backend().await;
    }).await;


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


