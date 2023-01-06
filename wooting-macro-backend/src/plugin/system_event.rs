use super::util;
use copypasta::{ClipboardContext, ClipboardProvider};
use fastrand;

#[allow(unused_imports)]
use log::{error, info};
use rdev;
use std::vec;
use tokio::sync::mpsc::Sender;

use crate::hid_table::SCANCODE_TO_RDEV;

#[cfg(target_os = "windows")]
use brightness::{windows::BrightnessExt, Brightness, BrightnessDevice};
#[cfg(target_os = "linux")]
use brightness::{Brightness, BrightnessDevice};

#[cfg(any(target_os = "windows", target_os = "linux"))]
use futures::{StreamExt, TryFutureExt};

// Frequently used constants
const COPY_HOTKEY: [rdev::Key; 2] = [rdev::Key::ControlLeft, rdev::Key::KeyC];
const PASTE_HOTKEY: [rdev::Key; 2] =[rdev::Key::ControlLeft, rdev::Key::KeyV];

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
pub enum DirectoryAction {
    Directory { data: String },
    File { data: String },
    Website { data: String },
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
/// Types of actions related to the OS to perform.
pub enum SystemAction {
    Open { action: DirectoryAction },
    Volume { action: VolumeAction },
    Brightness { action: MonitorBrightnessAction },
    Clipboard { action: ClipboardAction },
}

impl SystemAction {
    /// Execute the keys themselves
    pub async fn execute(&self, send_channel: Sender<rdev::EventType>) {
        match &self {
            SystemAction::Open { action } => match action {
                DirectoryAction::Directory { data } => {
                    match opener::open(std::path::Path::new(data)) {
                        Ok(x) => x,
                        Err(e) => error!("Error: {}", e),
                    };
                }
                DirectoryAction::File { data } => {
                    match opener::open(std::path::Path::new(data)) {
                        Ok(x) => x,
                        Err(e) => error!("Error: {}", e),
                    };
                }
                DirectoryAction::Website { data } => {
                    match opener::open_browser(std::path::Path::new(data)) {
                        Ok(x) => x,
                        Err(e) => error!("Error: {}", e),
                    };
                }
            },
            SystemAction::Volume { action } => match action {
                VolumeAction::ToggleMute => {
                    util::send_key(&send_channel, vec![*SCANCODE_TO_RDEV.get(&0x7f).unwrap()])
                        .await;
                }
                VolumeAction::LowerVolume => {
                    util::send_key(&send_channel, vec![*SCANCODE_TO_RDEV.get(&0x81).unwrap()])
                        .await;
                }
                VolumeAction::IncreaseVolume => {
                    util::send_key(&send_channel, vec![*SCANCODE_TO_RDEV.get(&0x80).unwrap()])
                        .await;
                }
            },
            
            SystemAction::Brightness { action } => match action {
                MonitorBrightnessAction::SetAll { level } => {
                    #[cfg(any(target_os = "windows", target_os = "linux"))]
                    brightness_set_all_device(*level).await;
                    #[cfg(target_os = "macos")]
                    error!("Not supported on macOS, would set level to: {}", level);
                }
                MonitorBrightnessAction::SetSpecific { level, name } => {
                    #[cfg(any(target_os = "windows", target_os = "linux"))]
                    brightness_set_specific_device(*level, name).await;
                    #[cfg(target_os = "macos")]
                    error!(
                        "Not supported on macOS, would set level and name to {}, {}",
                        level, name
                    );
                }
                MonitorBrightnessAction::ChangeSpecific { by_how_much, name } => {
                    #[cfg(any(target_os = "windows", target_os = "linux"))]
                    brightness_change_specific(*by_how_much, name).await;
                    #[cfg(target_os = "macos")]
                    error!(
                        "Not supported on macOS, would change level by and name to {}, {}",
                        by_how_much, name
                    );
                }
                MonitorBrightnessAction::ChangeAll { by_how_much } => {
                    #[cfg(any(target_os = "windows", target_os = "linux"))]
                    brightness_change_all(*by_how_much).await;
                    #[cfg(target_os = "macos")]
                    error!(
                        "Not supported on macOS, would change level by: {}",
                        by_how_much
                    );
                }
            },
            SystemAction::Clipboard { action } => match action {
                ClipboardAction::SetClipboard { data } => {
                    ClipboardContext::new()
                        .unwrap()
                        .set_contents(data.to_owned())
                        .unwrap();
                }
                ClipboardAction::Copy => {
                    util::send_hotkey(&send_channel, COPY_HOTKEY.to_vec()).await;
                }
                ClipboardAction::GetClipboard => {
                    ClipboardContext::new().unwrap().get_contents().unwrap();
                }
                ClipboardAction::Paste => {
                    util::send_hotkey(&send_channel, PASTE_HOTKEY.to_vec()).await;
                }

                ClipboardAction::PasteUserDefinedString { data } => {
                    ClipboardContext::new()
                        .unwrap()
                        .set_contents(data.to_owned())
                        .unwrap();

                    util::send_hotkey(&send_channel, PASTE_HOTKEY.to_vec()).await;
                }

                ClipboardAction::Sarcasm => {
                    let mut ctx = ClipboardContext::new().unwrap();

                    util::send_hotkey(&send_channel, COPY_HOTKEY.to_vec()).await;

                    //Transform the text
                    let content = transform_text(ctx.get_contents().unwrap());
                    ctx.set_contents(content).unwrap();

                    //Paste the text again
                    util::send_hotkey(&send_channel, PASTE_HOTKEY.to_vec()).await;
                }
            },
        }
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
/// Monitor information.
pub struct Monitor {
    pub device_id: String,
    pub brightness: u32,
    pub display_name: String,
}
#[cfg(any(target_os = "windows", target_os = "linux"))]
/// Loads the monitors and sends them to the frontend
pub async fn backend_load_monitors() -> Vec<Monitor> {
    let mut monitors = Vec::new();

    if let Ok(i) = brightness::brightness_devices()
        .into_future()
        .await
        .0
        .unwrap()
    {
        monitors.push(Monitor {
            device_id: i.device_name().into_future().await.unwrap(),
            brightness: i.get().into_future().await.unwrap(),
            #[cfg(target_os = "windows")]
            display_name: i.device_description().unwrap(),
            #[cfg(target_os = "linux")]
            display_name: "Not supported on Linux".to_string(),
        });
    }

    monitors
}

#[cfg(any(target_os = "windows", target_os = "linux"))]
/// Sets brightness of all monitors to the given level.
async fn brightness_set_all_device(percentage_level: u32) {
    if let Ok(mut devices) = brightness::brightness_devices()
        .into_future()
        .await
        .0
        .unwrap()
    {
        set_brightness(&mut devices, percentage_level)
            .await
            .unwrap();
    }
}

#[cfg(any(target_os = "windows", target_os = "linux"))]
/// Sets brightness of a specific device (it's name) to the given level.
async fn brightness_set_specific_device(percentage_level: u32, name: &str) {
    if let Ok(mut devices) = brightness::brightness_devices()
        .into_future()
        .await
        .0
        .unwrap()
    {
        if devices.device_name().into_future().await.unwrap() == name {
            set_brightness(&mut devices, percentage_level)
                .await
                .unwrap();
        }
    }
}

#[cfg(any(target_os = "windows", target_os = "linux"))]
/// Decreases brightness of specific devices by 2%
async fn brightness_change_specific(by_how_much: i32, name: &str) {
    if let Ok(mut devices) = brightness::brightness_devices()
        .into_future()
        .await
        .0
        .unwrap()
    {
        if devices.device_name().into_future().await.unwrap() == name {
            let current_brightness: i32 = devices.get().await.unwrap() as i32;

            set_brightness(
                &mut devices,
                (current_brightness.checked_add(by_how_much).unwrap_or(0)) as u32,
            )
            .await
            .unwrap();
        }
    }
}

#[cfg(any(target_os = "windows", target_os = "linux"))]
/// Decrements brightness of all devices by 2%
async fn brightness_change_all(by_how_much: i32) {
    if let Ok(mut devices) = brightness::brightness_devices()
        .into_future()
        .await
        .0
        .unwrap()
    {
        let current_brightness: i32 = devices.get().await.unwrap() as i32;

        set_brightness(
            &mut devices,
            (current_brightness.checked_add(by_how_much).unwrap_or(0)) as u32,
        )
        .await
        .unwrap();
    }
}

#[cfg(any(target_os = "windows", target_os = "linux"))]
/// Sets brightness for a device
async fn set_brightness(
    dev: &mut BrightnessDevice,
    percentage_level: u32,
) -> Result<(), brightness::Error> {
    info!("Display {}", dev.device_name().await.unwrap());
    dev.set(percentage_level).await.unwrap();
    Ok(())
}

/// Transforms the text into a sarcastic version.
fn transform_text(text: String) -> String {
    let mut transformed_text = String::new();
    for c in text.chars() {
        if c.is_ascii_alphabetic() && fastrand::bool() {
            if c.is_ascii_lowercase() {
                transformed_text.push(c.to_ascii_uppercase());
            } else {
                transformed_text.push(c.to_ascii_lowercase());
            }
        } else {
            transformed_text.push(c);
        }
    }
    transformed_text
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
/// The type of action to perform. This is used to determine which action to perform.
pub enum ClipboardAction {
    SetClipboard { data: String },
    Copy,
    GetClipboard,
    Paste,
    PasteUserDefinedString { data: String },
    Sarcasm,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
/// Monitor get, set brightness (currently Get is unused).
pub enum MonitorBrightnessAction {
    SetAll { level: u32 },
    SetSpecific { level: u32, name: String },
    ChangeSpecific { by_how_much: i32, name: String },
    ChangeAll { by_how_much: i32 },
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Hash, Eq)]
#[serde(tag = "type")]
/// Key shortcut alias to mute/increase/decrease volume.
pub enum VolumeAction {
    LowerVolume,
    IncreaseVolume,
    ToggleMute,
}
