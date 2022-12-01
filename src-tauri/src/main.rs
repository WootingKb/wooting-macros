#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

extern crate core;

use std::sync::atomic::Ordering;

use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
};

use wooting_macro_backend::*;

#[tauri::command]
/// Gets the application config from the current state and sends to frontend.
/// The state gets it from the config file at bootup.
async fn get_config(state: tauri::State<'_, MacroBackend>) -> Result<ApplicationConfig, ()> {
    Ok(state.config.read().await.clone())
}

#[tauri::command]
/// Gets the application config from the current state and sends to frontend.
/// The state gets it from the config file at bootup.
async fn set_config(
    state: tauri::State<'_, MacroBackend>,
    config: ApplicationConfig,
) -> Result<(), ()> {
    state.set_config(config).await;
    Ok(())
}

#[tauri::command]
/// Gets the macro data from current state and sends to frontend.
/// The state gets it from the config file at bootup.
async fn get_macros(state: tauri::State<'_, MacroBackend>) -> Result<MacroData, ()> {
    Ok(state.data.read().await.clone())
}

#[tauri::command]
/// Sets the configuration from frontend and updates the state for everything on backend.
async fn set_macros(
    state: tauri::State<'_, MacroBackend>,
    frontend_data: MacroData,
) -> Result<(), ()> {
    state.set_macros(frontend_data).await;
    Ok(())
}

#[tauri::command]
async fn get_brightness_devices(
    state: tauri::State<'_, MacroBackend>,
) -> Result<Vec<BrightnessDevice>, ()> {
    Ok(state.get_brightness_devices().await)
}

#[tauri::command]
async fn control_grabbing(
    state: tauri::State<'_, MacroBackend>,
    frontend_bool: bool,
) -> Result<(), ()> {
    state.is_listening.store(frontend_bool, Ordering::Relaxed);
    Ok(())
}

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
async fn main() {
    // Spawn the backend thread.
    // Note: this doesn't work on macOS since we cannot give the thread the proper permissions
    // (will crash on key grab/listen)

    let backend = MacroBackend::new();

    println!("Running the macro backend");
    backend.init().await;

    // Begin the main event loop. This loop cannot run on another thread on MacOS.
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");

    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        // This is where you pass in your commands
        .manage(backend)
        .invoke_handler(tauri::generate_handler![
            get_macros,
            set_macros,
            get_config,
            set_config,
            get_brightness_devices,
            control_grabbing
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
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
            }
            _ => {}
        })
        //.any_thread()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
