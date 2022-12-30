#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

extern crate core;

use log::*;

use std::env::current_exe;

use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
    WindowEvent,
};

use wooting_macro_backend::config::*;
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
async fn get_monitor_data() -> Result<Vec<plugin::system_event::Monitor>, ()> {
    #[cfg(any(target_os = "windows", target_os = "linux"))]
    return Ok(plugin::system_event::backend_load_monitors().await);

    #[cfg(target_os = "macos")]
    return Ok(vec![]);
}

// ------OBS part starts here-------
#[tauri::command]
/// Gets the names of all present scene names in OBS
async fn get_obs_scene_names(state: tauri::State<'_, MacroBackend>) -> Result<Vec<String>, ()> {
    Ok(state.obs_state.read().await.get_scene_names().await)
}

#[tauri::command]
/// Gets the names of all present input devices available on OBS
async fn get_obs_input_device_names(
    state: tauri::State<'_, MacroBackend>,
) -> Result<Vec<String>, anyhow::Error> {
    let result = state.obs_state.read().await.get_inputs().await?;
    Ok(result)
}

#[tauri::command]
/// Allows the frontend to disable the macro execution scanning completely.
async fn control_grabbing(
    state: tauri::State<'_, MacroBackend>,
    frontend_bool: bool,
) -> Result<(), ()> {
    set_macro_listening(state, frontend_bool);
    Ok(())
}

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
/// Spawn the backend thread.
/// Note: this doesn't work on macOS since we cannot give the thread the proper permissions
/// (will crash on key grab/listen)
async fn main() {
    env_logger::init();

    #[cfg(not(debug_assertions))]
    wooting_macro_backend::MacroBackend::generate_directories();

    let backend = MacroBackend::default();

    info!("Running the macro backend");

    #[cfg(any(target_os = "windows", target_os = "linux"))]
    backend.init().await;

    let set_autolaunch: bool = backend.config.read().await.auto_start;
    let set_launch_minimized: bool = backend.config.read().await.minimize_at_launch;

    // Begin the main event loop. This loop cannot run on another thread on MacOS.
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let show = CustomMenuItem::new("show".to_string(), "Show");

    let tray_menu = SystemTrayMenu::new()
        .add_item(hide)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    // .add_item(show);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    // let app =
    tauri::Builder::default()
        // This is where you pass in your commands
        .manage(backend)
        .invoke_handler(tauri::generate_handler![
            get_macros,
            set_macros,
            get_config,
            set_config,
            control_grabbing,
            get_monitor_data,
            get_obs_scene_names
        ])
        .setup(move |app| {
            let app_name = &app.package_info().name;
            let current_exe = current_exe().unwrap();

            let auto_start = auto_launch::AutoLaunchBuilder::new()
                .set_app_name(app_name)
                .set_app_path(current_exe.as_path().to_str().unwrap())
                .set_use_launch_agent(true)
                .build()
                .unwrap();

            match set_autolaunch {
                true => auto_start.enable().unwrap(),
                false => {
                    if let Err(e) = auto_start.disable() {
                        match e {
                            auto_launch::Error::Io(err) => match err.kind() {
                                std::io::ErrorKind::NotFound => {
                                    info!("Autostart is already removed, finished checking.")
                                }
                                _ => error!("{}", err),
                            },
                            _ => error!("{}", e),
                        }
                    }
                }
            }

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
        .on_window_event(move |event| {
            if let WindowEvent::CloseRequested { api, .. } = event.event() {
                if wooting_macro_backend::config::ApplicationConfig::read_data().minimize_to_tray {
                    event.window().hide().unwrap();
                    api.prevent_close();
                }
            }
        })
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            info!("{}, {argv:?}, {cwd}", app.package_info().name);
        }))
        .run(tauri::generate_context!())
        // .build(tauri::generate_context!())
        .expect("error while running tauri application");

    // app.run(|_app_handle, event| match event {
    //     tauri::RunEvent::Updater(updater_event) => {
    //         match updater_event {
    //             UpdaterEvent::UpdateAvailable { body, date, version } => {
    //                 info!("update available {} {:?} {}", body, date, version);
    //             }
    //             // Emitted when the download is about to be started.
    //             UpdaterEvent::Pending => {
    //                 info!("update is pending!");
    //             }
    //             UpdaterEvent::DownloadProgress { chunk_length, content_length } => {
    //                 info!("downloaded {} of {:?}", chunk_length, content_length);
    //             }
    //             // Emitted when the download has finished and the update is about to be installed.
    //             UpdaterEvent::Downloaded => {
    //                 info!("update has been downloaded!");
    //             }
    //             // Emitted when the update was installed. You can then ask to restart the app.
    //             UpdaterEvent::Updated => {
    //                 info!("app has been updated");
    //             }
    //             // Emitted when the app already has the latest version installed and an update is not needed.
    //             UpdaterEvent::AlreadyUpToDate => {
    //                 info!("app is already up to date");
    //             }
    //             // Emitted when there is an error with the updater. We suggest to listen to this event even if the default dialog is enabled.
    //             UpdaterEvent::Error(error) => {
    //                 error!("failed to update: {}", error);
    //             }
    //             _ => (),
    //         }
    //     }
    //     _ => {}
    // });
}
