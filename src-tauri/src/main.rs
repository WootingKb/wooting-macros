#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

extern crate core;

use std::env::current_exe;
use std::sync::atomic::Ordering;

use auto_launch;
use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, UpdaterEvent,
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
async fn get_monitor_data(
    state: tauri::State<'_, MacroBackend>,
) -> Result<Vec<wooting_macro_backend::plugin::system_event::Monitor>, ()> {
    state.get_monitor_data().await;
    Ok(state.display_list.read().await.clone())
}

#[tauri::command]
/// Returns the monitors connected in the system to the frontend.
async fn get_brightness_devices(
    state: tauri::State<'_, MacroBackend>,
) -> Result<Vec<BrightnessDevice>, ()> {
    Ok(state.get_brightness_devices().await)
}

#[tauri::command]
/// Allows the frontend to disable the macro execution scanning completely.
async fn control_grabbing(
    state: tauri::State<'_, MacroBackend>,
    frontend_bool: bool,
) -> Result<(), ()> {
    state.is_listening.store(frontend_bool, Ordering::Relaxed);
    Ok(())
}

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
/// Spawn the backend thread.
/// Note: this doesn't work on macOS since we cannot give the thread the proper permissions
/// (will crash on key grab/listen)
async fn main() {
    #[cfg(not(debug_assertions))]
    wooting_macro_backend::MacroBackend::generate_directories();

    let backend = MacroBackend::new();

    println!("Running the macro backend");

    backend.init().await;

    let set_autolaunch: bool = backend.config.read().await.auto_start;
    let set_launch_minimized: bool = backend.config.read().await.minimize_at_launch;

    let set_launch_minimized = false;

    // Begin the main event loop. This loop cannot run on another thread on MacOS.
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let show = CustomMenuItem::new("show".to_string(), "Show");

    let tray_menu = SystemTrayMenu::new()
        .add_item(hide)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit)
        .add_item(show);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    let app = tauri::Builder::default()
        // This is where you pass in your commands
        .manage(backend)
        .invoke_handler(tauri::generate_handler![
            get_macros,
            set_macros,
            get_config,
            set_config,
            get_brightness_devices,
            control_grabbing,
            get_monitor_data
        ])
        .setup(move |app| {
            let app_name = &app.package_info().name;
            let current_exe = current_exe().unwrap();

            let auto_start = auto_launch::AutoLaunchBuilder::new()
                .set_app_name(&app_name)
                .set_app_path(&current_exe.as_path().to_str().unwrap())
                .set_use_launch_agent(true)
                .build()
                .unwrap();
            //println!("Autolaunch is set to {:#?}", auto_start);


            //auto_start.enable().unwrap();

            //println!("Setting autolaunch to {}", set_autolaunch);
            match set_autolaunch {
                true => auto_start.enable().unwrap(),
                false => match auto_start.disable() {
                    Ok(x) => x,
                    Err(_) => (),
                },
            }

            //println!("is autostart {}", auto_start.is_enabled().unwrap());

            Ok(())
        })
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
        .on_page_load(move |window, _| {
            if set_launch_minimized {
                window.hide().unwrap();
            }
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application");


    app.run(|_app_handle, event| match event {
        tauri::RunEvent::Updater(updater_event) => {
            match updater_event {
                UpdaterEvent::UpdateAvailable { body, date, version } => {
                    println!("update available {} {:?} {}", body, date, version);
                }
                // Emitted when the download is about to be started.
                UpdaterEvent::Pending => {
                    println!("update is pending!");
                }
                UpdaterEvent::DownloadProgress { chunk_length, content_length } => {
                    println!("downloaded {} of {:?}", chunk_length, content_length);
                }
                // Emitted when the download has finished and the update is about to be installed.
                UpdaterEvent::Downloaded => {
                    println!("update has been downloaded!");
                }
                // Emitted when the update was installed. You can then ask to restart the app.
                UpdaterEvent::Updated => {
                    println!("app has been updated");
                }
                // Emitted when the app already has the latest version installed and an update is not needed.
                UpdaterEvent::AlreadyUpToDate => {
                    println!("app is already up to date");
                }
                // Emitted when there is an error with the updater. We suggest to listen to this event even if the default dialog is enabled.
                UpdaterEvent::Error(error) => {
                    println!("failed to update: {}", error);
                }
                _ => (),
            }
        }
        _ => {}
    });
}
