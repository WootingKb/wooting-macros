#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

extern crate core;

use std::str::FromStr;
use std::time;

use anyhow::{Context, Error, Result};
use byte_unit::{Byte, Unit};
use log::*;
use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
    WindowEvent,
};
use tauri_plugin_log::fern::colors::{Color, ColoredLevelConfig};

use wooting_macro_backend::*;
use wooting_macro_backend::config::*;

// This is the debug envvar you may wish to set if you want advanced access to debug info from Wootomation.
const DEBUG_ENVVAR: &str = "MACRO_LOG_LEVEL";

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
) -> Result<(), String> {
    state
        .set_config(config)
        .await
        .map_err(|err| err.to_string())
}

#[tauri::command]
/// Gets the macro data from current state and sends to frontend.
/// The state gets it from the config file at bootup.
async fn get_macros(state: tauri::State<'_, MacroBackend>) -> Result<MacroData, ()> {
    Ok(state.macro_data.read().await.clone())
}

#[tauri::command]
/// Sets the configuration from frontend and updates the state for everything on backend.
async fn set_macros(
    state: tauri::State<'_, MacroBackend>,
    frontend_data: MacroData,
) -> Result<(), String> {
    state
        .set_macros(frontend_data)
        .await
        .map_err(|err| err.to_string())
}

#[tauri::command]
async fn is_debug() -> Result<bool, String> {
    if let Ok(result) = std::env::var(DEBUG_ENVVAR) {
        return Ok(
            log::LevelFilter::from_str(result.as_str()).map_err(|err| err.to_string())?
                >= log::LevelFilter::Debug,
        );
    } else {
        Ok(false)
    }
}

#[tauri::command]
/// Allows the frontend to disable the macro execution scanning completely.
async fn control_grabbing(
    state: tauri::State<'_, MacroBackend>,
    frontend_bool: bool,
) -> Result<(), ()> {
    state.set_is_listening(frontend_bool);
    Ok(())
}

/// Enables or disables the automatic startup of Wootomation at system start.
fn init_autostart(app_name: &str, set_autolaunch: bool) -> Result<(), Error> {
    let current_exe = std::env::current_exe().context("current EXE not found")?;

    let auto_start = auto_launch::AutoLaunchBuilder::new()
        .set_app_name(app_name)
        .set_app_path(current_exe.as_path().to_str().unwrap())
        .set_use_launch_agent(true)
        .build()
        .context("App name is empty, or unsupported OS is used.")?;

    match set_autolaunch {
        true => auto_start.enable()?,
        false => {
            if let Err(e) = auto_start.disable() {
                match e {
                    auto_launch::Error::Io(err) => match err.kind() {
                        std::io::ErrorKind::NotFound => {
                            trace!("Autostart is already removed, finished checking.");
                        }
                        _ => return Err(err.into()),
                    },
                    _ => return Err(e.into()),
                }
            }
        }
    }
    Ok(())
}

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
/// Spawn the backend thread.
/// Note: this doesn't work on macOS since we cannot give the thread the proper permissions
/// (will crash on key grab/listen)
async fn main() -> Result<(), Error> {
    // The optionENV only takes a string literal and can't be forced to take a const of any type.
    let log_level = std::env::var(DEBUG_ENVVAR)
        .ok()
        .and_then(|s| str::parse::<log::LevelFilter>(&s).ok())
        .unwrap_or(log::LevelFilter::Info);

    MacroBackend::generate_directories().context("unable to generate config directories")?;

    let backend = MacroBackend::default();

    #[cfg(any(target_os = "windows", target_os = "linux"))]
    // The backend is run only on Windows and Linux, on macOS it won't work.
    info!("Running the macro backend");
    if let Err(e) = backend.init().await {
        error!("Initialization error: {}", e);
    };

    // Read the options from the config.
    let set_autolaunch: bool = backend.config.read().await.auto_start;
    let set_launch_minimized: bool = backend.config.read().await.minimize_at_launch;

    // Set the window behaviors (add buttons to the right click tray menu).
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide_show = CustomMenuItem::new("hide_show".to_string(), "Hide");
    let tray_menu = SystemTrayMenu::new()
        .add_item(hide_show)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    let system_tray = SystemTray::new().with_menu(tray_menu);

    // Initialize the main application
    tauri::Builder::default()
        // State management is initialized
        .manage(backend)
        // This is where commands shared with frontend are passed
        .invoke_handler(tauri::generate_handler![
            get_macros,
            set_macros,
            get_config,
            set_config,
            control_grabbing,
            is_debug
        ])
        .setup(move |app| {
            let app_name = &app.package_info().name;
            init_autostart(&app_name, set_autolaunch).unwrap_or_else(|err| {
                error!("error changing the autostart options: {}", err.to_string())
            });

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
                    "hide_show" => {
                        let window = app.get_window("main").expect("Couldn't fetch window");

                        // you can also `set_selected`, `set_enabled` and `set_native_image` (macOS only).
                        match window.is_visible().expect("Couldn't get window visibility") {
                            true => {
                                window.hide().expect("Couldn't hide window");
                                item_handle
                                    .set_title("Show")
                                    .expect("Couldn't change system tray item to show")
                            }
                            false => {
                                window.show().expect("Couldn't show window");
                                item_handle
                                    .set_title("Hide")
                                    .expect("Couldn't change system tray item to hide")
                            }
                        }

                        window.clone().on_window_event(move |window_event| {
                            if let WindowEvent::CloseRequested { .. } = window_event {
                                window.hide().expect("Couldn't hide window");
                                item_handle
                                    .set_title("Show")
                                    .expect("Couldn't change system tray item to show");
                            }
                        })
                    }
                    "quit" => {
                        app.exit(0);
                    }

                    _ => {}
                }
            }
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").expect("Couldn't fetch window");
                window.show().expect("Couldn't show window");
                app.tray_handle()
                    .get_item("hide_show")
                    .set_title("Hide")
                    .expect("Couldn't hide window");
            }
            _ => {}
        })
        .on_page_load(move |window, _| {
            if set_launch_minimized {
                window.hide().expect("Couldn't hide window");
            }
        })
        .on_window_event(move |event| {
            if let WindowEvent::CloseRequested { api, .. } = event.event() {
                if ApplicationConfig::read_data()
                    .expect("error reading config data, can't determine if app is to be terminated or hidden")
                    .minimize_to_tray
                {
                    event.window().hide().expect("Couldn't hide window");
                    api.prevent_close();
                }
            }
        })
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            info!("{}, {argv:?}, {cwd}", app.package_info().name);

            let window = app.get_window("main").expect("Couldn't fetch window");

            window.show().expect("Couldn't show window");
            window.set_focus().expect("Couldn't focus window");

            app.emit_all("single-instance", ())
                .expect("Couldn't re-focus opened instance.");
        }))
        .plugin(
            tauri_plugin_log::Builder::default()
                .level(log_level)
                .format(|out, message, record| {
                    out.finish(format_args!(
                        "{:?} [{}] [{}] | {}",
                        time::SystemTime::now(),
                        record.target(),
                        record.level(),
                        message
                    ))
                })
                .with_colors(
                    ColoredLevelConfig::new()
                        .error(Color::Red)
                        .warn(Color::Yellow)
                        .info(Color::Green)
                        .debug(Color::Magenta)
                        .trace(Color::White),
                )
                .max_file_size(Byte::from_f64_with_unit(16_f64, Unit::KiB).unwrap().into())
                .targets([
                    tauri_plugin_log::LogTarget::Folder(
                        LogDirPath::file_name().expect("error getting log folder name"),
                    ),
                    tauri_plugin_log::LogTarget::Stdout,
                    tauri_plugin_log::LogTarget::Webview,
                ])
                .build(),
        )
        .run(tauri::generate_context!())
        .context("error while running tauri application")?;

    Ok(())
}
